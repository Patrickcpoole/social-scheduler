"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGeneratorProps = {
  onSelectImage: (imageUrl: string) => void;
};

const ImageGenerator = ({ onSelectImage }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [ratio, setRatio] = useState("1:1");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Sample placeholder images for simulation
  const placeholderImages = [
    "https://images.unsplash.com/photo-1579547945413-497e1b99dac0",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d",
    "https://images.unsplash.com/photo-1572177812156-58036aae439c",
  ];

  // Placeholder function to simulate API call for generating images
  const generateImages = async () => {
    setIsLoading(true);
    setGeneratedImages([]);

    // In a real app, this would be an API call to an AI image generation service
    setTimeout(() => {
      // Randomly select 2-3 images from the placeholder set
      const numImages = Math.floor(Math.random() * 2) + 2; // 2-3 images
      const selectedImages = [];

      // Create a copy of the placeholder array to avoid modifying the original
      const availableImages = [...placeholderImages];

      for (let i = 0; i < numImages; i++) {
        if (availableImages.length === 0) break;

        const randomIndex = Math.floor(Math.random() * availableImages.length);
        // Add style/ratio parameters to the URL for simulation
        selectedImages.push(
          `${
            availableImages[randomIndex]
          }?style=${style}&ratio=${ratio}&prompt=${encodeURIComponent(prompt)}`
        );
        availableImages.splice(randomIndex, 1);
      }

      setGeneratedImages(selectedImages);
      setIsLoading(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateImages();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Image Generator</h2>
        <p className="mt-2 text-sm text-gray-600">
          Generate creative visual assets for your social media posts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-700">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium ">
            Image Description
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-[#7137ff] sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="style" className="block text-sm font-medium ">
              Style
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-[#7137ff] sm:text-sm"
            >
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="artistic">Artistic</option>
              <option value="minimalist">Minimalist</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ratio"
              className="block text-sm font-medium text-gray-700"
            >
              Aspect Ratio
            </label>
            <select
              id="ratio"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-[#7137ff] sm:text-sm"
            >
              <option value="1:1">Square (1:1)</option>
              <option value="4:5">Portrait (4:5)</option>
              <option value="16:9">Landscape (16:9)</option>
              <option value="9:16">Story (9:16)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !prompt}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              isLoading || !prompt
                ? "bg-[#7137ff]/30 cursor-not-allowed"
                : "bg-[#7137ff] hover:bg-[#7137ff]/80 focus:outline-none focus:ring-2 cursor-pointer focus:ring-offset-2 focus:ring-[#7137ff]"
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
                Generating...
              </>
            ) : generatedImages.length > 0 ? (
              "Generate New Images"
            ) : (
              "Generate Images"
            )}
          </button>
        </div>
      </form>

      {generatedImages.length > 0 && (
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Generated Images:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-md border border-gray-200 shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden rounded">
                  <Image
                    src={imageUrl}
                    alt={`Generated image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onSelectImage(imageUrl)}
                    className="text-sm text-[#7137ff] hover:text-[#7137ff]/80 font-medium cursor-pointer"
                  >
                    Use this image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
