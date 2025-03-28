"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useGetMonthDetails } from "../../hooks/useGetMonthDetails";
import PostStatusTabs from "./PostStatusTabs";
import CalendarNav from "./CalendarNav";
type CalendarViewProps = {
  posts: PostType[];
  onAddPost: (date: Date) => void;
  onEditPost: (post: PostType) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const CalendarView = ({
  posts = [],
  onAddPost,
  onEditPost,
  selectedTab,
  setSelectedTab,
}: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { startingDayOfWeek, totalDays } = useGetMonthDetails(currentMonth);

  // Get posts for a specific day
  const getPostsForDay = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return posts.filter((post) => {
      const postDate = new Date(post.date);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isPastDate = (date: Date) => {
    return date < new Date(Date.now() - 86400000);
  };

  const getPostStatusColor = (post: PostType) => {
    switch (post.status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "posted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null); // Empty cells for days before the 1st
  }

  for (let day = 1; day <= totalDays; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <PostStatusTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        <CalendarNav
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {dayNames.map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day || 1
          );
          const postsForDay = day ? getPostsForDay(day) : [];
          const hasEvents = postsForDay.length > 0;
          const isPast = day ? isPastDate(date) : false;

          return (
            <div
              key={index}
              className={`min-h-[100px] bg-white p-2 relative group ${
                isPast ? "text-gray-400" : "text-gray-700"
              } ${day ? "hover:bg-gray-50" : ""}`}
              onClick={() => day && !isPast && onAddPost(date)}
            >
              {day && (
                <>
                  <div
                    className={`font-semibold text-right ${
                      isPast ? "text-gray-400" : ""
                    }`}
                  >
                    {day}
                  </div>
                  <div className="mt-2 space-y-1 flex-1">
                    <div
                      className={`${
                        !hasEvents ? "group-hover:hidden" : ""
                      } min-h-[60px]`}
                    >
                      {hasEvents ? (
                        postsForDay.map((post) => (
                          <div
                            key={post.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditPost(post);
                            }}
                            className={`${getPostStatusColor(
                              post
                            )} p-1 rounded text-xs truncate cursor-pointer hover:opacity-90 transition-opacity`}
                          >
                            {post.referenceTitle}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400">No posts</div>
                      )}
                    </div>
                    {!hasEvents && (
                      <button
                        className="hidden cursor-pointer group-hover:flex w-full bg-purple-100 text-purple-800 text-xs 
                        py-1 px-2 rounded hover:bg-purple-200 transition-colors min-h-[60px] items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddPost(date);
                        }}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
