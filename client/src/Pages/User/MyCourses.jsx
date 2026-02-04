import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaPlay, FaClock, FaCheckCircle, FaGraduationCap } from "react-icons/fa";
import Layout from "../../Layout/Layout";
import { getMyCourses } from "../../Helpers/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await getMyCourses();
                if (res?.data?.success) {
                    setCourses(res.data.courses);
                }
            } catch (error) {
                toast.error("Failed to load your courses");
            }
        })();
    }, []);

    return (
        <Layout>
            <section className="min-h-screen py-12 px-4 lg:px-8 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                        >
                            <FaGraduationCap className="text-white text-3xl" />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 pb-2">
                            My Learning Journey
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Continue your learning path with your enrolled courses
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center space-x-6 mt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {courses?.length || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {courses?.length > 0
                                        ? Math.min(100, Math.round(
                                            courses.reduce((acc, course) => {
                                                const progress = course.progress;
                                                const completedCount = progress?.lecturesCompleted?.length || 0;
                                                const totalLectures = course?.numberOfLectures || 1;
                                                const courseProgress = Math.min(100, Math.round((completedCount / totalLectures) * 100));
                                                return acc + courseProgress;
                                            }, 0) / courses.length
                                        ))
                                        : 0
                                    }%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {courses?.length > 0 ? (
                            courses.map((course, index) => {
                                const progress = course.progress;
                                const completedCount = progress?.lecturesCompleted?.length || 0;
                                const totalLectures = course?.numberOfLectures || 1;
                                const percent = Math.min(100, Math.round((completedCount / totalLectures) * 100));

                                return (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                        whileHover={{ y: -4 }}
                                        className="group"
                                    >
                                        <div className="bg-white dark:bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-base-300 h-full flex flex-col">
                                            {/* Image */}
                                            <div className="relative overflow-hidden h-48 flex-shrink-0">
                                                <img
                                                    src={course?.thumbnail?.secure_url || "/placeholder-course.jpg"}
                                                    alt="course thumbnail"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="bg-white/90 dark:bg-base-100/90 backdrop-blur-sm p-3 rounded-full">
                                                        <FaPlay className="text-primary-600 dark:text-primary-400 text-lg" />
                                                    </div>
                                                </div>

                                                {/* Progress Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <div className="bg-white/95 dark:bg-base-100/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                            {percent}%
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm">
                                                        {course?.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                    {course?.title}
                                                </h3>

                                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">
                                                    {course?.description}
                                                </p>

                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            {completedCount}/{totalLectures} lectures
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <motion.div
                                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percent}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                        ></motion.div>
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center space-x-1">
                                                        <FaBookOpen className="text-blue-500 text-xs" />
                                                        <span>{totalLectures} lectures</span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2 mt-auto"
                                                >
                                                    <FaPlay className="text-sm" />
                                                    <span>Continue Learning</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div
                                className="col-span-full flex flex-col justify-center items-center py-20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-8">
                                    <FaBookOpen className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-600 dark:text-gray-300 mb-4 text-center">
                                    No Courses Yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                                    You haven't enrolled in any courses yet. Browse our course catalog to start your learning journey!
                                </p>
                                <button
                                    onClick={() => navigate("/courses")}
                                    className="btn-primary"
                                >
                                    Browse Courses
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
