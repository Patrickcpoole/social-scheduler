"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CaptionGenerator from "./CaptionGenerator";
import ImageGenerator from "./ImageGenerator";
import VideoGenerator from "./VideoGenerator";
import Image from "next/image";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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

  // Define Yup validation schema
  const postSchema = yup.object({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    content: yup
      .string()
      .required("Content is required")
      .min(5, "Content must be at least 5 characters"),
    date: yup
      .date()
      .required("Date is required")
      .min(new Date(Date.now() - 86400000), "Date cannot be in the past"),
    frequency: yup
      .string()
      .oneOf(
        ["once", "daily", "weekly", "biweekly", "monthly"],
        "Invalid frequency"
      )
      .required("Frequency is required"),
    imageUrl: yup.string().optional(),
    videoUrl: yup.string().optional(),
  });

  // Initialize React Hook Form with yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: formData.title,
      content: formData.content,
      date: formData.date,
      frequency: formData.frequency,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl,
    },
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

      // Update form values
      reset({
        title: post.title,
        content: post.content,
        date: post.date,
        frequency: post.frequency || "once",
        imageUrl: post.imageUrl || "",
        videoUrl: post.videoUrl || "",
      });
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
      setValue("date", selectedDate);
    }
  }, [post, selectedDate, reset, setValue]);

  // Update form data to keep UI state in sync with form values
  const handleFormChange = (
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
    setValue("date", newDate);
  };

  const onSubmitForm = (data: any) => {
    onSave({
      id: post?.id || `post-${Date.now()}`,
      ...data,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl,
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
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
            className={`py-2 px-4 font-medium text-sm cursor-pointer ${
              activeTab === "caption"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Generate Caption
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`py-2 px-4 font-medium text-sm cursor-pointer ${
              activeTab === "image"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Generate Image
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`py-2 px-4 font-medium text-sm cursor-pointer ${
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
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="p-6 space-y-4 text-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium ">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    {...register("date")}
                    value={formatDateForInput(formData.date)}
                    onChange={handleDateChange}
                    className={`mt-1 block w-full border ${
                      errors.date ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.date.message}
                    </p>
                  )}
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
                    {...register("title")}
                    value={formData.title}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>
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
                  {...register("content")}
                  rows={4}
                  value={formData.content}
                  onChange={handleFormChange}
                  className={`mt-1 block w-full border ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.content.message}
                  </p>
                )}
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
                  {...register("frequency")}
                  value={formData.frequency}
                  onChange={handleFormChange}
                  className={`mt-1 block w-full border ${
                    errors.frequency ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {errors.frequency && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.frequency.message}
                  </p>
                )}
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
