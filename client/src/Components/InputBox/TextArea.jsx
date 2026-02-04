import React from "react";

export default function TextArea({
  label,
  name,
  rows, 
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-semibold text-lg text-text-primary font-inter"
      >
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className="bg-white resize-none text-base font-inter px-4 py-3 border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors duration-200"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
