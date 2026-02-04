import React from "react";

export default function InputBox({
  label,
  name,
  type,
  placeholder,
  value,
  onChange = () => {},
  disabled = false,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={name}
        className={`font-semibold text-lg text-text-primary font-inter`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`bg-white text-base font-inter px-4 py-3 border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        onChange={onChange}
        value={value || ""}
        disabled={disabled}
      />
    </div>
  );
}
