import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaRupeeSign, FaPlay, FaStar, FaCheckCircle, FaCertificate, FaInfinity } from "react-icons/fa";
import Layout from "../../Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CourseDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, data } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!state) {
      navigate("/courses");
    }
  }, []);

  const isEnrolled = role === "ADMIN" || data?.courseProgress?.some((cp) => cp.courseId === state?._id);

  return (
    <Layout>
      {/* Wrapper to handle the footer positioning correctly */}
      <div className="min-h-screen bg-white dark:bg-gray-900">
        
        {/* HERO SECTION - Updated Colors */}
        <div className="bg-blue-600 dark:bg-blue-800 text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16 relative z-10">
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hero Content (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Breadcrumbs */}
                        <div className="flex items-center space-x-2 text-sm text-blue-100">
                            <button onClick={() => navigate("/courses")} className="hover:text-white transition-colors font-medium">Courses</button>
                            <span>/</span>
                            <span className="text-blue-100">{state?.category}</span>
                            <span>/</span>
                            <span className="truncate max-w-[200px] text-white font-semibold">{state?.title}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
                            {state?.title}
                        </h1>

                        {/* Short Description */}
                        <p className="text-lg text-blue-100 leading-relaxed max-w-2xl line-clamp-2">
                            {state?.description?.split('.')[0] + '.'}
                        </p>

                        {/* Ratings & Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                            <div className="flex items-center space-x-1 text-yellow-400">
                                <span className="font-bold text-lg">{state?.rating || 0}</span>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < (state?.rating || 0) ? "text-yellow-400" : "text-blue-300"} />
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:block text-blue-300">|</div>
                            <div className="flex items-center space-x-2 text-blue-100">
                                <FaUser />
                                <span>Created by <span className="text-white font-semibold">{state?.createdBy}</span></span>
                            </div>
                        </div>

                        {/* Mobile Enroll Button (Visible only on small screens) */}
                        <div className="lg:hidden mt-6">
                            <div className="text-3xl font-bold text-white mb-4">₹{state?.price}</div>
                            {isEnrolled ? (
                                <button
                                    onClick={() => navigate("/course/displaylectures", { state: { ...state } })}
                                    className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
                                >
                                    <FaPlay /> <span>Continue Learning</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/checkout", { state: { coursePrice: state?.price, courseId: state?._id } })}
                                    className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    <FaRupeeSign /> <span>Enroll Now</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* MAIN CONTENT SECTION */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Column: Course Details */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* What You'll Learn Box */}
                    {state?.learningObjectives && state.learningObjectives.length > 0 && (
                        <motion.div 
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {state.learningObjectives.map((objective, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">{objective}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Description</h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {state?.description}
                        </div>
                    </div>

                    {/* Instructor Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Instructor</h2>
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
                                {state?.createdBy?.charAt(0) || <FaUser />}
                            </div>
                            <div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{state?.createdBy}</div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Course Instructor</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Floating Sidebar (Desktop Only) */}
                <div className="hidden lg:block lg:col-span-1 relative">
                    <motion.div 
                        className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ marginTop: '-200px' }} // Negative margin to pull it up into the Hero
                    >
                        {/* Course Preview Image */}
                        <div className="relative h-52 group cursor-pointer overflow-hidden">
                            <img
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                alt="Course thumbnail"
                                src={state?.thumbnail?.secure_url || "/placeholder-course.jpg"}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <FaPlay className="text-black text-2xl" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                                <span className="text-white font-semibold text-sm drop-shadow-md">Preview this course</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Price */}
                            <div className="flex items-center space-x-3">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{state?.price}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {isEnrolled ? (
                                    <button
                                        onClick={() => navigate("/course/displaylectures", { state: { ...state } })}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2"
                                    >
                                        <FaPlay />
                                        <span>Go to Course</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate("/checkout", { state: { coursePrice: state?.price, courseId: state?._id } })}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center space-x-2"
                                    >
                                        <FaRupeeSign />
                                        <span>Enroll Now</span>
                                    </button>
                                )}
                            </div>

                            {/* Includes List */}
                            <div className="space-y-3 pt-2">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">This course includes:</p>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center space-x-3">
                                        <FaPlay className="text-xs w-4" /> <span>{state?.numberOfLectures} lectures</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <FaInfinity className="text-xs w-4" /> <span>Full lifetime access</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <FaCertificate className="text-xs w-4" /> <span>Certificate of completion</span>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
      </div>
    </Layout>
  );
}
