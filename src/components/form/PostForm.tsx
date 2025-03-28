"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  PlayIcon,
  PhotoIcon,
  VideoCameraIcon,
  InformationCircleIcon,
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

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const postSchema = yup.object({
    caption: yup
      .string()
      .required("Caption is required")
      .min(5, "Caption must be at least 5 characters"),
    referenceTitle: yup
      .string()
      .required("Reference title is required")
      .max(50, "Reference title must be less than 50 characters"),
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
    frequencyRange: yup.date().when("frequency", {
      is: (val: string) => val !== "once",
      then: (schema) =>
        schema
          .required("End date is required for recurring posts")
          .test(
            "date-validation",
            "End date must be after start date",
            function (value) {
              return value > this.parent.date;
            }
          ),
      otherwise: (schema) => schema.optional(),
    }),
    imageUrl: yup.string().optional(),
    videoUrl: yup.string().optional(),
    status: yup
      .string()
      .oneOf(["draft", "scheduled", "posted"], "Invalid status")
      .required("Status is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      caption: post?.caption || "",
      referenceTitle: post?.referenceTitle || "",
      date: post?.date
        ? formatDateForInput(new Date(post.date))
        : selectedDate
        ? formatDateForInput(selectedDate)
        : formatDateForInput(new Date()),
      frequency: post?.frequency || "once",
      frequencyRange: post?.frequencyRange
        ? formatDateForInput(new Date(post.frequencyRange))
        : post?.frequency !== "once" || selectedDate
        ? formatDateForInput(
            new Date(
              selectedDate?.getFullYear() || new Date().getFullYear(),
              (selectedDate?.getMonth() || new Date().getMonth()) + 1,
              selectedDate?.getDate() || new Date().getDate()
            )
          )
        : undefined,
      imageUrl: post?.imageUrl || "",
      videoUrl: post?.videoUrl || "",
      status: post?.status || "draft",
    },
  });

  // Watch the frequency value to conditionally show frequencyRange
  const frequency = watch("frequency");

  useEffect(() => {
    if (post) {
      // Ensure we have proper Date objects and format them for input
      const postDate = formatDateForInput(new Date(post.date));
      const frequencyRangeDate = post.frequencyRange
        ? formatDateForInput(new Date(post.frequencyRange))
        : undefined;

      reset({
        caption: post.caption,
        referenceTitle: post.referenceTitle,
        date: postDate,
        frequency: post.frequency || "once",
        frequencyRange: frequencyRangeDate,
        imageUrl: post.imageUrl || "",
        videoUrl: post.videoUrl || "",
        status: post.status || "draft",
      });
    } else if (selectedDate) {
      setValue("date", formatDateForInput(selectedDate));
    }
  }, [post, selectedDate, reset, setValue]);

  const onSubmitForm = (data: PostType) => {
    // Convert date strings back to Date objects
    const formData = {
      ...data,
      date: new Date(data.date),
      frequencyRange: data.frequencyRange
        ? new Date(data.frequencyRange)
        : undefined,
    };

    onSave({
      id: post?.id || `post-${Date.now()}`,
      ...formData,
    });
  };

  const handleSelectCaption = (caption: string) => {
    setValue("caption", caption);
    setActiveTab("basic");
  };

  const handleSelectImage = (imageUrl: string) => {
    setValue("imageUrl", imageUrl);
    setActiveTab("basic");
  };

  const handleSelectVideo = (videoUrl: string) => {
    setValue("videoUrl", videoUrl);
    setActiveTab("basic");
  };

  const isPastDate = (dateString: string) => {
    const date = new Date(dateString);
    return date < new Date(Date.now() - 86400000);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const currentDate = watch("date");

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
      setValue("date", formatDateForInput(today));
    }

    handleFormChange(e);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the file
      const imageUrl = URL.createObjectURL(file);
      setValue("imageUrl", imageUrl);
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
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab("caption")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "caption"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Generate Caption
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "image"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700 cursor-pointer"
                }`}
              >
                Generate Image
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "video"
                    ? "border-b-2 border-primary-500 text-primary-600"
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
                      <div className="space-y-4">
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
                            className={`mt-1 block w-full border ${
                              errors.frequency
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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

                        {frequency === "once" ? (
                          <div>
                            <label
                              htmlFor="date"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Post Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              {...register("date")}
                              className={`mt-1 block w-full border ${
                                errors.date
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                                isPastDate(watch("date")) ? "text-gray-500" : ""
                              }`}
                            />
                            {errors.date && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.date.message}
                              </p>
                            )}
                            {isPastDate(watch("date")) && (
                              <p className="mt-1 text-sm text-gray-500">
                                This is a past date
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="date"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Starts On
                                </label>
                                <input
                                  type="date"
                                  id="date"
                                  {...register("date")}
                                  className={`mt-1 block w-full border ${
                                    errors.date
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                                    isPastDate(watch("date"))
                                      ? "text-gray-500"
                                      : ""
                                  }`}
                                />
                                {errors.date && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.date.message}
                                  </p>
                                )}
                                {isPastDate(watch("date")) && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    This is a past date
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor="frequencyRange"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Ends On
                                </label>
                                <input
                                  type="date"
                                  id="frequencyRange"
                                  {...register("frequencyRange")}
                                  className={`mt-1 block w-full border ${
                                    errors.frequencyRange
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                />
                                {errors.frequencyRange && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.frequencyRange.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              This post will be published {frequency} between
                              these dates
                            </p>
                          </div>
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
                          value={watch("status")}
                          onChange={handleStatusChange}
                          className={`mt-1 block w-full border ${
                            errors.status ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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
                      <div className="flex items-center">
                        <label
                          htmlFor="referenceTitle"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reference Title
                        </label>
                        <Tooltip content="This title helps you identify your post in the calendar view (not included in the actual post)">
                          <InformationCircleIcon className="ml-1.5 h-4 w-4 text-gray-400" />
                        </Tooltip>
                      </div>
                      <input
                        type="text"
                        id="referenceTitle"
                        {...register("referenceTitle")}
                        value={watch("referenceTitle")}
                        onChange={(e) => {
                          handleFormChange(e);
                        }}
                        className={`mt-1 block w-full border ${
                          errors.referenceTitle
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        placeholder="e.g., 'Monday Coffee Post' or 'Product Launch Announcement'"
                      />
                      {errors.referenceTitle && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.referenceTitle.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        This helps you identify your post in the calendar view
                      </p>
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
                            <PlayIcon className="h-5 w-5 stroke-primary-600 fill-transparent hover:fill-primary-600 transition-all duration-200" />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="mt-1">
                        <textarea
                          id="caption"
                          {...register("caption")}
                          rows={4}
                          value={watch("caption")}
                          onChange={(e) => {
                            handleFormChange(e);
                          }}
                          className={`block w-full border ${
                            errors.caption
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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
                        {watch("imageUrl") ? (
                          <div className="space-y-1 text-center relative w-full">
                            <div className="relative h-40 w-full">
                              <Image
                                src={watch("imageUrl")}
                                alt="Selected media"
                                fill
                                className="object-contain rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  URL.revokeObjectURL(watch("imageUrl"));
                                  setValue("imageUrl", "");
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
                              <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
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
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <PlayIcon className="-ml-0.5 mr-2 h-4 w-4" />{" "}
                                Generate Image
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveTab("video")}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <VideoCameraIcon className="-ml-0.5 mr-2 h-4 w-4" />{" "}
                                Generate Video
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fixed bottom button group */}
                  <div className="border-t p-6 bg-white">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
