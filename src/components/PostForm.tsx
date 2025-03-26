"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CaptionGenerator from "./CaptionGenerator";
import ImageGenerator from "./ImageGenerator";
import VideoGenerator from "./VideoGenerator";
import Image from "next/image";

type PostType = {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  frequency?: "once" | "daily" | "weekly" | "biweekly" | "monthly";
};

type PostFormProps = {
  post?: PostType;
  onSave: (post: PostType) => void;
  onCancel: () => void;
  selectedDate?: Date;
};

type Tab = "basic" | "caption" | "image" | "video";

const PostForm = ({ post, onSave, onCancel, selectedDate }: PostFormProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [formData, setFormData] = useState<Omit<PostType, "id">>({
    date: post?.date || selectedDate || new Date(),
    title: post?.title || "",
    content: post?.content || "",
    imageUrl: post?.imageUrl || "",
    videoUrl: post?.videoUrl || "",
    frequency: post?.frequency || "once",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        date: post.date,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || "",
        videoUrl: post.videoUrl || "",
        frequency: post.frequency || "once",
      });
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [post, selectedDate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const [year, month, day] = dateValue.split("-").map(Number);
    const newDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
    setFormData((prev) => ({ ...prev, date: newDate }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: post?.id || `post-${Date.now()}`,
      ...formData,
    });
  };

  const handleSelectCaption = (caption: string) => {
    setFormData((prev) => ({ ...prev, content: caption }));
    setActiveTab("basic");
  };

  const handleSelectImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
    setActiveTab("basic");
  };

  const handleSelectVideo = (videoUrl: string) => {
    setFormData((prev) => ({ ...prev, videoUrl }));
    setActiveTab("basic");
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    // Month is 0-indexed in JS, so add 1 and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {post ? "Edit Post" : "Create New Post"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("basic")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "basic"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("caption")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "caption"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Generate Caption
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "image"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Generate Image
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "video"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Generate Video
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "basic" && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formatDateForInput(formData.date)}
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  value={formData.content}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {formData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Image
                  </label>
                  <div className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Selected image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {formData.videoUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Video
                  </label>
                  <div className="bg-black aspect-video rounded-md flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="text-sm">Video Preview</p>
                      <p className="text-xs text-gray-400">
                        Video URL: {formData.videoUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Posting Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {activeTab === "caption" && (
            <div className="p-6">
              <CaptionGenerator onSelectCaption={handleSelectCaption} />
            </div>
          )}

          {activeTab === "image" && (
            <div className="p-6">
              <ImageGenerator onSelectImage={handleSelectImage} />
            </div>
          )}

          {activeTab === "video" && (
            <div className="p-6">
              <VideoGenerator onSelectVideo={handleSelectVideo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
