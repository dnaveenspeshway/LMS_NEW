import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlay, FaBookOpen, FaUser, FaRupeeSign, FaStar } from "react-icons/fa";

export default function CourseCard({ data }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/courses/description/", { state: { ...data } });
  };

  return (
    <motion.div
      className="group relative bg-white dark:bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-base-300 h-full flex flex-col"
      onClick={handleClick}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={data?.thumbnail?.secure_url || "/placeholder-course.jpg"}
          alt={data?.title || "Course thumbnail"}
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-base-100/90 backdrop-blur-sm p-3 rounded-full">
            <FaPlay className="text-primary-600 dark:text-primary-400 text-lg" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm">
            {data?.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center space-x-1 shadow-sm">
            <FaRupeeSign className="text-xs" />
            <span className="text-sm font-bold">{data?.price}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {data?.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
          {data?.description}
        </p>

        {/* Stats */}
        <div className="space-y-2 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <FaBookOpen className="text-blue-500 text-xs" />
              <span>{data?.numberOfLectures} lectures</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUser className="text-green-500 text-xs" />
              <span className="truncate max-w-20">{data?.createdBy}</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm mt-auto">
          View Details
        </button>
      </div>
    </motion.div>
  );
}
