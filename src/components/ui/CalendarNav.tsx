import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
const CalendarNav = ({
  currentMonth,
  setCurrentMonth,
}: {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
}) => {
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };
  return (
    <div className="flex space-x-2  items-center justify-center">
      <button
        onClick={() => navigateMonth("prev")}
        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
      </button>
      <h3 className="text-gray-600">
        {new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          1
        ).toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        -{" "}
        {new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          0
        ).toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </h3>
      <button
        onClick={() => navigateMonth("next")}
        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
};

export default CalendarNav;
