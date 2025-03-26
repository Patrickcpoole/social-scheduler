"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Types for our posts
type PostType = {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  frequency?: "once" | "daily" | "weekly" | "biweekly" | "monthly";
};

type CalendarViewProps = {
  posts: PostType[];
  onAddPost: (date: Date) => void;
  onEditPost: (post: PostType) => void;
};

const CalendarView = ({
  posts = [],
  onAddPost,
  onEditPost,
}: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get current month details
  const getMonthDetails = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const startingDayOfWeek = firstDay.getDay();
    // Total days in the month
    const totalDays = lastDay.getDate();

    return { year, month, firstDay, lastDay, startingDayOfWeek, totalDays };
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

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

  const { month, year, startingDayOfWeek, totalDays } = getMonthDetails();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
        <h2 className="text-xl font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
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
          const postsForDay = day ? getPostsForDay(day) : [];
          const hasEvents = postsForDay.length > 0;

          return (
            <div
              key={index}
              className={`min-h-[100px] bg-white p-2 text-gray-700 ${
                day ? "hover:bg-gray-50 cursor-pointer" : ""
              }`}
              onClick={() => day && onAddPost(new Date(year, month, day))}
            >
              {day && (
                <>
                  <div className="font-semibold text-right">{day}</div>
                  <div className="mt-2 space-y-1">
                    {hasEvents ? (
                      postsForDay.map((post) => (
                        <div
                          key={post.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPost(post);
                          }}
                          className="bg-indigo-100 text-indigo-800 p-1 rounded text-xs truncate"
                        >
                          {post.title}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400">No posts</div>
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
