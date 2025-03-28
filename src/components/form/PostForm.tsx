"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  PlayIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import CaptionGenerator from "./CaptionGenerator";
import ImageGenerator from "./ImageGenerator";
import VideoGenerator from "./VideoGenerator";
import Image from "next/image";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tooltip } from "../ui/Tooltip";
import Portal from "../Portal";
import { PostType } from "@/types/index";

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
    caption: post?.caption || "",
    imageUrl: post?.imageUrl || "",
    videoUrl: post?.videoUrl || "",
    frequency: post?.frequency || "once",
    status: post?.status || "draft",
  });

  const postSchema = yup.object({
    caption: yup
      .string()
      .required("Caption is required")
      .min(5, "Caption must be at least 5 characters"),
    date: yup
      .date()
      .required("Date is required")
      .test(
        "date-validation",
        "Date cannot be in the past for scheduled posts",
        function (value) {
          const status = this.parent.status;
          if (status === "scheduled") {
            return value >= new Date(Date.now() - 86400000);
          }
          return true;
        }
      ),
    frequency: yup
      .string()
      .oneOf(
        ["once", "daily", "weekly", "biweekly", "monthly"],
        "Invalid frequency"
      )
      .required("Frequency is required"),
    imageUrl: yup.string().optional(),
    videoUrl: yup.string().optional(),
    status: yup
      .string()
      .oneOf(["draft", "scheduled", "posted"], "Invalid status")
      .required("Status is required"),
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
      caption: formData.caption,
      date: formData.date,
      frequency: formData.frequency,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl,
      status: formData.status,
    },
  });

  useEffect(() => {
    if (post) {
      setFormData({
        date: post.date,
        caption: post.caption,
        imageUrl: post.imageUrl || "",
        videoUrl: post.videoUrl || "",
        frequency: post.frequency || "once",
        status: post.status || "draft",
      });

      reset({
        caption: post.caption,
        date: post.date,
        frequency: post.frequency || "once",
        imageUrl: post.imageUrl || "",
        videoUrl: post.videoUrl || "",
        status: post.status || "draft",
      });
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
      setValue("date", selectedDate);
    }
  }, [post, selectedDate, reset, setValue]);

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

  const onSubmitForm = (data: PostType) => {
    onSave({
      id: post?.id || `post-${Date.now()}`,
      ...data,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl,
    });
  };

  const handleSelectCaption = (caption: string) => {
    setFormData((prev) => ({ ...prev, caption }));
    setValue("caption", caption);
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

  const isPastDate = (date: Date) => {
    return date < new Date(Date.now() - 86400000);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const currentDate = formData.date;

    // If changing to scheduled and date is in past, show warning
    if (newStatus === "scheduled" && isPastDate(currentDate)) {
      if (
        !window.confirm(
          "Scheduled posts cannot be in the past. Would you like to set the date to today?"
        )
      ) {
        return;
      }
      const today = new Date();
      setFormData((prev) => ({ ...prev, date: today }));
      setValue("date", today);
    }

    handleFormChange(e);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the file
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50" onClick={onCancel}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[800px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b bg-white">
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

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("basic")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "basic"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab("caption")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "caption"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Generate Caption
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "image"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Generate Image
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "video"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Generate Video
              </button>
            </div>

            {/* Content area with flex layout */}
            <div className="flex-1 flex flex-col min-h-0">
              {activeTab === "basic" && (
                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="flex flex-col h-full"
                >
                  {/* Scrollable content area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium"
                        >
                          Post Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          {...register("date")}
                          value={formatDateForInput(formData.date)}
                          onChange={handleDateChange}
                          className={`mt-1 block w-full border ${
                            errors.date ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            isPastDate(formData.date) ? "text-gray-500" : ""
                          }`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.date.message}
                          </p>
                        )}
                        {isPastDate(formData.date) && (
                          <p className="mt-1 text-sm text-gray-500">
                            This is a past date
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          {...register("status")}
                          value={formData.status}
                          onChange={handleStatusChange}
                          className={`mt-1 block w-full border ${
                            errors.status ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="draft">Draft</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="posted">Posted</option>
                        </select>
                        {errors.status && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.status.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-start">
                        <label
                          htmlFor="caption"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Caption
                        </label>
                        <Tooltip content="Generate caption with AI">
                          <button
                            type="button"
                            onClick={() => setActiveTab("caption")}
                            className="ml-2 cursor-pointer"
                          >
                            <PlayIcon className="h-5 w-5 stroke-indigo-600 fill-transparent hover:fill-indigo-600 transition-all duration-200" />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="mt-1">
                        <textarea
                          id="caption"
                          {...register("caption")}
                          rows={4}
                          value={formData.caption}
                          onChange={(e) => {
                            handleFormChange(e);
                            setValue("caption", e.target.value);
                          }}
                          className={`block w-full border ${
                            errors.caption
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Write your post caption..."
                        />
                      </div>
                      {errors.caption && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.caption.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Media Content
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
                        {formData.imageUrl ? (
                          <div className="space-y-1 text-center relative w-full">
                            <div className="relative h-40 w-full">
                              <Image
                                src={formData.imageUrl}
                                alt="Selected media"
                                fill
                                className="object-contain rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  URL.revokeObjectURL(formData.imageUrl);
                                  setFormData((prev) => ({
                                    ...prev,
                                    imageUrl: "",
                                  }));
                                }}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 cursor-pointer"
                              >
                                <XMarkIcon className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileUpload}
                                  accept="image/*"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>

                            {/* Generate buttons */}
                            <div className="mt-4 flex justify-center space-x-3">
                              <button
                                type="button"
                                onClick={() => setActiveTab("image")}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <PlayIcon className="-ml-0.5 mr-2 h-4 w-4" />{" "}
                                Generate Image
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveTab("video")}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <VideoCameraIcon className="-ml-0.5 mr-2 h-4 w-4" />{" "}
                                Generate Video
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

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
                          errors.frequency
                            ? "border-red-500"
                            : "border-gray-300"
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
                  </div>

                  {/* Fixed bottom button group */}
                  <div className="border-t p-6 bg-white">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "caption" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-6">
                    <CaptionGenerator onSelectCaption={handleSelectCaption} />
                  </div>
                </div>
              )}

              {activeTab === "image" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-6">
                    <ImageGenerator onSelectImage={handleSelectImage} />
                  </div>
                </div>
              )}

              {activeTab === "video" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-6">
                    <VideoGenerator onSelectVideo={handleSelectVideo} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default PostForm;
