import React from "react";

// Title component displays two text parts with a line separator
const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center mb-2 gap-2">
      {/* Display first text and second text with emphasis */}
      <p className="text-gray-500">
        {text1} <span className="text-gray-700 font-medium">{text2}</span>
      </p>

      {/* Horizontal separator line */}
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
    </div>
  );
};

export default Title;
