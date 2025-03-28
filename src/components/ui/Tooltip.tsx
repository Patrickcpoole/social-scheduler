import React, { useState } from "react";

type TooltipProps = {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
};

export const Tooltip = ({
  children,
  content,
  position = "top",
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-gray-700",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-gray-700",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-gray-700",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-gray-700",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="bg-gray-700 text-white text-sm rounded px-2 py-1 whitespace-nowrap">
            {content}
            <div
              className={`absolute w-2 h-2 transform rotate-45 bg-gray-700 ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
