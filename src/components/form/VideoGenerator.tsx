"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PlusIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

type MediaItem = {
  id: string;
  type: "image" | "audio";
  url: string;
  name: string;
  duration?: number; // in seconds (for images in slideshow)
};

type VideoGeneratorProps = {
  onSelectVideo: (videoUrl: string) => void;
};

const VideoGenerator = ({ onSelectVideo }: VideoGeneratorProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );

  // Placeholder function to simulate uploading a media item
  const handleAddMedia = (type: "image" | "audio") => {
    // In a real app, this would open a file picker and upload the file

    // For simulation, add placeholder items
    const newId = `media-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    if (type === "image") {
      // Randomly select a placeholder image
      const placeholderImages = [
        "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4",
        "https://images.unsplash.com/photo-1590845947670-c009801ffa74",
        "https://images.unsplash.com/photo-1472653816316-3ad6f10a6592",
        "https://images.unsplash.com/photo-1515549832467-8783363e19b6",
      ];
      const randomIndex = Math.floor(Math.random() * placeholderImages.length);

      setMediaItems([
        ...mediaItems,
        {
          id: newId,
          type: "image",
          url: placeholderImages[randomIndex],
          name: `Image ${
            mediaItems.filter((item) => item.type === "image").length + 1
          }`,
          duration: 3, // Default duration 3 seconds
        },
      ]);
    } else {
      // Add a placeholder audio
      setMediaItems([
        ...mediaItems,
        {
          id: newId,
          type: "audio",
          url: "https://example.com/placeholder-audio.mp3",
          name: `Audio ${
            mediaItems.filter((item) => item.type === "audio").length + 1
          }`,
        },
      ]);
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id));
  };

  const handleChangeDuration = (id: string, newDuration: number) => {
    setMediaItems(
      mediaItems.map((item) =>
        item.id === id ? { ...item, duration: newDuration } : item
      )
    );
  };

  const handleMoveItem = (id: string, direction: "up" | "down") => {
    const index = mediaItems.findIndex((item) => item.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === mediaItems.length - 1)
    ) {
      return; // Can't move further
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newMediaItems = [...mediaItems];
    const item = newMediaItems[index];
    newMediaItems.splice(index, 1);
    newMediaItems.splice(newIndex, 0, item);

    setMediaItems(newMediaItems);
  };

  // Placeholder function to simulate video generation
  const generateVideo = async () => {
    if (mediaItems.length === 0) return;

    setIsLoading(true);
    setGeneratedVideoUrl(null);

    // In a real app, this would call an API to generate the video
    setTimeout(() => {
      // Create a placeholder video URL
      const videoId = Math.random().toString(36).substr(2, 9);
      setGeneratedVideoUrl(
        `https://example.com/generated-videos/${videoId}.mp4`
      );
      setIsLoading(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateVideo();
  };

  const hasImages = mediaItems.some((item) => item.type === "image");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Video Generator</h2>
        <p className="mt-2 text-sm text-gray-600">
          Create videos by combining images and audio for your social media
          posts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Video Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your video"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7137ff] focus:border-[#7137ff] sm:text-sm"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Media Items</h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleAddMedia("image")}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Image
              </button>
              <button
                type="button"
                onClick={() => handleAddMedia("audio")}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Audio
              </button>
            </div>
          </div>

          {mediaItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">
                Add images and audio to create your video
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center p-4 border border-gray-200 rounded-md relative"
                >
                  {item.type === "image" ? (
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-[#7137ff]/10 flex items-center justify-center rounded mr-4">
                      <svg
                        className="h-8 w-8 text-[#7137ff]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.type}</p>

                    {item.type === "image" && (
                      <div className="flex items-center mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            item.duration &&
                            handleChangeDuration(
                              item.id,
                              Math.max(1, item.duration - 1)
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="mx-2 text-sm">
                          {item.duration} sec
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            item.duration &&
                            handleChangeDuration(item.id, item.duration + 1)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleMoveItem(item.id, "up")}
                      disabled={index === 0}
                      className={`p-1 ${
                        index === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveItem(item.id, "down")}
                      disabled={index === mediaItems.length - 1}
                      className={`p-1 ${
                        index === mediaItems.length - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !title || !hasImages}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              isLoading || !title || !hasImages
                ? "bg-[#7137ff]/30 cursor-not-allowed"
                : "bg-[#7137ff] hover:bg-[#7137ff]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7137ff]"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Video...
              </>
            ) : (
              "Generate Video"
            )}
          </button>
        </div>
      </form>

      {generatedVideoUrl && (
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Generated Video:
          </h3>
          <div className="bg-black aspect-video rounded-md flex items-center justify-center">
            <div className="text-white text-center">
              <p className="mb-2">Video Preview</p>
              <p className="text-sm text-gray-400">
                In a real application, the video would be displayed here
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onSelectVideo(generatedVideoUrl)}
              className="text-sm text-[#7137ff] hover:text-[#7137ff]/80 font-medium"
            >
              Use this video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
