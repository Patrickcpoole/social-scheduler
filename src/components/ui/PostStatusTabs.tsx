import React from "react";

const PostStatusTabs = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) => {
  const tabs: Tab[] = [
    { label: "All Posts", value: "all" },
    { label: "Drafts", value: "draft" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Posted", value: "posted" },
  ];

  return (
    <div className="flex rounded-lg px-2 border-1 border-gray-200 shadow-md">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`bg-white px-4 py-2  transition-colors duration-200 ${
            selectedTab === tab.value
              ? "bg-white text-[#7137ff] border-b-2 border-[#7137ff] font-medium"
              : "border-gray-400 text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
          }`}
          onClick={() => setSelectedTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PostStatusTabs;
