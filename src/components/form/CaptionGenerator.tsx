"use client";

import { useState } from "react";

type CaptionGeneratorProps = {
  onSelectCaption: (caption: string) => void;
};

const CaptionGenerator = ({ onSelectCaption }: CaptionGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("friendly");
  const [length, setLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);

  // Placeholder function to simulate API call for generating captions
  const generateCaptions = async () => {
    setIsLoading(true);
    setCaptions([]);

    // In a real app, this would be an API call to an AI service
    setTimeout(() => {
      const toneAdjective = {
        professional: ["professional", "authoritative", "insightful"],
        friendly: ["warm", "inviting", "friendly"],
        casual: ["relaxed", "casual", "laid-back"],
        humorous: ["amusing", "entertaining", "funny"],
        inspirational: ["uplifting", "motivational", "inspiring"],
      }[tone] || ["engaging"];

      const lengthVariation = {
        short: [1, 2],
        medium: [2, 3],
        long: [3, 4],
      }[length] || [2, 3];

      const sampleCaptions = [
        `✨ ${toneAdjective[0]} thoughts on ${topic}. What's your take? #trending #socialmedia`,
        `${toneAdjective[1]} ${topic} moments that make a difference. Share yours below! #engagement #community`,
        `Exploring ${topic} in a ${toneAdjective[2]} way. Let me know what resonates with you! #conversation #connect`,
        `Today we're diving into ${topic}. The possibilities are endless! #inspiration #creativity`,
        `${topic} just got more interesting. Here's why it matters to everyone. #relevance #insights`,
      ];

      // Select random captions based on the chosen length
      const numCaptions = lengthVariation[Math.floor(Math.random() * 2)];
      const selectedCaptions = [];

      for (let i = 0; i < numCaptions; i++) {
        const randomIndex = Math.floor(Math.random() * sampleCaptions.length);
        selectedCaptions.push(sampleCaptions[randomIndex]);
        sampleCaptions.splice(randomIndex, 1);
      }

      setCaptions(selectedCaptions);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateCaptions();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Caption Generator
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Generate trend-relevant captions for your social media posts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700"
          >
            Topic or Theme
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., sustainability, fashion, tech trends"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="tone"
            className="block text-sm font-medium text-gray-700"
          >
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
            <option value="inspirational">Inspirational</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="length"
            className="block text-sm font-medium text-gray-700"
          >
            Caption Length
          </label>
          <select
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !topic}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              isLoading || !topic
                ? "bg-primary-300 cursor-not-allowed"
                : "bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 cursor-pointer focus:ring-offset-2 focus:ring-primary-500"
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
            ) : captions.length > 0 ? (
              "Generate New Captions"
            ) : (
              "Generate Captions"
            )}
          </button>
        </div>
      </form>

      {captions.length > 0 && (
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Suggested Captions:
          </h3>
          <div className="space-y-4">
            {captions.map((caption, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
              >
                <p className="text-gray-700">{caption}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onSelectCaption(caption)}
                    className="text-sm text-primary-600 hover:text-primary-900 font-medium cursor-pointer"
                  >
                    Use this caption
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

export default CaptionGenerator;
