import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import YouTube from 'react-youtube';
import {
  getCourseLectures,
  deleteCourseLecture,
} from "../../Redux/Slices/LectureSlice";
import { getUserProgress, updateProgress } from "../../Redux/Slices/AuthSlice";
import { generateCertificate } from "../../Helpers/api";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import { FaPlay, FaPlus, FaTrash, FaCheckCircle, FaCertificate, FaBookOpen, FaTrophy, FaUserGraduate, FaArrowRight, FaVideo } from "react-icons/fa";

export default function DisplayLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { lectures } = useSelector((state) => state.lecture);
  const { role, data } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [userProgress, setUserProgress] = useState({ lecturesCompleted: [] }); // New state for user progress

  useEffect(() => {
    if (!state) navigate("/courses");
    if (role !== "ADMIN" && !data?.courseProgress?.some((cp) => cp.courseId === state?._id)) {
      toast.error("You are not enrolled in this course");
      navigate("/courses");
    }
  }, [role, data, state, navigate]);

  const totalLectures = state?.numberOfLectures || 0; // Define totalLectures
  const completedLectures = Math.min(userProgress.lecturesCompleted.length, totalLectures); // Cap at total lectures

  const isCourseCompleted = totalLectures > 0 && completedLectures >= totalLectures;
  const progressPercentage = totalLectures > 0 ? Math.min(100, Math.round((completedLectures / totalLectures) * 100)) : 0;

  const handleCertificateDownload = async () => {
    try {
      const response = await generateCertificate(state._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${state.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  const handleVideoEnded = async () => {
    const lectureId = lectures[currentVideo]._id;
    if (!userProgress.lecturesCompleted.includes(lectureId)) {
      const res = await dispatch(updateProgress({ courseId: state._id, lectureId }));
      if (res?.payload?.success) {
        setUserProgress(res.payload.courseProgress);
      }
    }
  };

  async function onLectureDelete(courseId, lectureId) {
    await dispatch(
      deleteCourseLecture({ courseId: courseId, lectureId: lectureId })
    );
    await dispatch(getCourseLectures(courseId));
    // Go back to lectures list after deletion
    setShowVideo(false);
    // Reset current video to 0 to avoid index issues
    setCurrentVideo(0);
  }

  useEffect(() => {
    (async () => {
      if (!state) {
        navigate("/courses");
        return;
      }
      await dispatch(getCourseLectures(state._id));
      const progressRes = await dispatch(getUserProgress(state._id));
      if (progressRes?.payload?.success) {
        setUserProgress(progressRes.payload.courseProgress || { lecturesCompleted: [] });
      }
    })();
  }, [state, dispatch, navigate]); // Add dependencies
  const handleLectureClick = (idx) => {
    setCurrentVideo(idx);
    setShowVideo(true);
  };

  return (
    <Layout hideFooter={true} hideNav={true} hideBar={true}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/30">
        {/* Header */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Left Side - Back Button */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => showVideo ? setShowVideo(false) : navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowRight className="rotate-180 text-sm" />
                  <span className="text-sm">
                    {showVideo ? "Back to Lectures" : "Back to Courses"}
                  </span>
                </motion.button>
              </div>

              {/* Center - Title */}
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {showVideo ? `${currentVideo + 1}. ${lectures?.[currentVideo]?.title}` : state?.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm font-medium">
                  {showVideo ? "🎥 Video Lecture" : `📚 ${lectures?.length || 0} Lectures Available`}
                </p>
              </div>

              {/* Right Side - Progress (only for users, not when viewing video) */}
              {role === "USER" && !showVideo && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Progress</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {progressPercentage}%
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Spacer for balance when no progress shown */}
              {(role !== "USER" || showVideo) && <div className="w-24"></div>}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4">
          {!showVideo ? (
            /* Lectures Grid View */
            <div className="space-y-8">
              {/* Admin Controls - Moved to Top */}
              {role === "ADMIN" && (
                <motion.div
                  className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-2xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <FaPlus className="text-blue-400" />
                        Course Management
                      </h3>
                      <p className="text-slate-300 mt-1">Add new content to your course</p>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                        className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus className="text-lg" />
                        <span>Add Lecture</span>
                      </motion.button>
                      <motion.button
                        onClick={() => navigate("/course/addassignment", { state: { ...state } })}
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus className="text-lg" />
                        <span>Add Assignment</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Progress Overview */}
              {role === "USER" && (
                <motion.div
                  className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <FaUserGraduate className="text-yellow-300" />
                          Your Progress
                        </h2>
                        <p className="text-indigo-100 mt-1">Keep learning! 🚀</p>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-black">{progressPercentage}%</div>
                        <div className="text-sm text-indigo-200 font-medium">Complete</div>
                      </div>
                    </div>

                    <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden mb-4 shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-indigo-100">
                        {completedLectures} of {totalLectures} lectures completed
                      </span>
                      <span className="text-yellow-200 font-semibold">
                        {totalLectures - completedLectures} remaining
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Lectures Vertical List */}
              <motion.div
                className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-600/30 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-400/20 to-indigo-400/20 rounded-full translate-x-16 translate-y-16"></div>

                <div className="relative z-10">
                  <div className="p-8 border-b border-slate-200/60 dark:border-slate-600/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FaBookOpen className="text-white text-lg" />
                          </div>
                          Course Content
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm font-medium">
                          🎯 {lectures?.length || 0} engaging lectures • Tap to start learning
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                          Total Lectures
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {lectures?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200/40 dark:divide-slate-600/20">
                    {lectures?.map((lecture, idx) => (
                      <motion.div
                        key={lecture._id}
                        className={`group relative p-8 cursor-pointer transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 ${
                          userProgress?.lecturesCompleted?.includes(lecture?._id)
                            ? "bg-gradient-to-r from-green-50/60 to-emerald-50/40 dark:from-green-900/20 dark:to-emerald-900/10"
                            : ""
                        }`}
                        onClick={() => handleLectureClick(idx)}
                        whileHover={{ scale: 1.02, x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {/* Hover background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex items-start gap-6">
                          {/* Lecture Number/Icon with enhanced styling */}
                          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-500 shadow-lg ${
                            userProgress?.lecturesCompleted?.includes(lecture?._id)
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30 group-hover:shadow-green-500/50"
                              : currentVideo === idx
                              ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30 group-hover:shadow-blue-500/50"
                              : "bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 text-white group-hover:shadow-slate-500/30"
                          }`}>
                            {userProgress?.lecturesCompleted?.includes(lecture?._id) ? (
                              <FaCheckCircle className="text-3xl drop-shadow-sm" />
                            ) : currentVideo === idx ? (
                              <FaPlay className="text-xl ml-1 drop-shadow-sm" />
                            ) : (
                              <span className="text-2xl font-black drop-shadow-sm">{idx + 1}</span>
                            )}
                          </div>

                          {/* Lecture Content with enhanced layout */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 pr-4">
                                <h3 className={`text-xl font-bold mb-3 line-clamp-2 transition-all duration-300 ${
                                  currentVideo === idx
                                    ? "text-blue-700 dark:text-blue-300"
                                    : userProgress?.lecturesCompleted?.includes(lecture?._id)
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                }`}>
                                  {lecture?.title}
                                </h3>

                                {/* Enhanced metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                                    <FaVideo className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">Lecture {idx + 1}</span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium text-blue-700 dark:text-blue-300">Video Content</span>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced status indicators */}
                              <div className="flex flex-col items-end gap-2">
                                {userProgress?.lecturesCompleted?.includes(lecture?._id) && (
                                  <motion.div
                                    className="flex items-center gap-2 text-sm text-green-700 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-xl font-semibold shadow-sm"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                  >
                                    <FaCheckCircle className="w-4 h-4" />
                                    <span>Completed</span>
                                  </motion.div>
                                )}
                                {userProgress?.quizScores?.find(qs => qs.quizId === lecture._id) && (
                                  <div className="text-sm font-bold text-green-700 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-xl shadow-sm">
                                    Score: {userProgress.quizScores.find(qs => qs.quizId === lecture._id).score}/{lecture.quizzes.length}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Enhanced bottom section */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {lecture?.quizzes?.length > 0 && (
                                  <motion.div
                                    className="flex items-center gap-2 text-sm text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20 px-4 py-2 rounded-xl font-medium shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                                    <span>🧠 Quiz Available</span>
                                  </motion.div>
                                )}
                              </div>

                              <motion.div
                                className="text-sm text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium"
                                whileHover={{ x: -5 }}
                              >
                                ✨ Click to start learning
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>



              {/* Completion & Certificate Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedLectures >= totalLectures && state?.quizzes?.length > 0 && (
                  <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl">
                    <div className="text-center">
                      <FaTrophy className="text-5xl mx-auto mb-4 text-yellow-300" />
                      <h3 className="text-2xl font-bold mb-2">Course Completed! 🎉</h3>
                      <p className="text-orange-100 mb-6">Ready for final assessment</p>

                      {userProgress?.quizScores?.some(q => q.quizId === 'final-assignment') ? (
                        <div className="space-y-4">
                          <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-sm font-medium">Final Score</p>
                            <p className="text-3xl font-bold">
                              {userProgress.quizScores.find(q => q.quizId === 'final-assignment').score}/{state.quizzes.length}
                            </p>
                          </div>
                          <button
                            className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                              userProgress?.isCompleted
                                ? 'bg-green-600 hover:bg-green-600 cursor-default'
                                : 'bg-white text-orange-600 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              if (!userProgress?.isCompleted) {
                                navigate("/course/assignment", { state: { ...state, quizzes: state.quizzes, isFinalAssignment: true } });
                              }
                            }}
                          >
                            {userProgress?.isCompleted ? "Qualified ✓" : "Retake Assignment"}
                          </button>
                        </div>
                      ) : (
                        <button
                          className="w-full bg-white text-orange-600 hover:bg-gray-100 py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                          onClick={() => navigate("/course/assignment", { state: { ...state, quizzes: state.quizzes, isFinalAssignment: true } })}
                        >
                          Take Final Assignment
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {userProgress?.isCompleted && (
                  <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl">
                    <div className="text-center">
                      <FaCertificate className="text-6xl mx-auto mb-4 text-emerald-200" />
                      <h3 className="text-2xl font-bold mb-2">Congratulations! 🏆</h3>
                      <p className="text-emerald-100 mb-6">You've successfully completed this course</p>
                      <button
                        className="w-full bg-white text-emerald-600 hover:bg-gray-100 py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={handleCertificateDownload}
                      >
                        Download Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Video View */
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Player */}
              <div className="bg-black rounded-2xl shadow-2xl overflow-hidden mb-8">
                <div className="aspect-video">
                  {lectures && (lectures?.[currentVideo]?.lecture?.secure_url || lectures?.[currentVideo]?.lecture) && (() => {
                    const url = lectures[currentVideo]?.lecture?.secure_url || lectures[currentVideo]?.lecture;
                    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^\&\?\n]{11})/;
                    const driveRegex = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/;

                    const youtubeMatch = typeof url === 'string' ? url.match(youtubeRegex) : null;
                    const driveMatch = typeof url === 'string' ? url.match(driveRegex) : null;

                    if (youtubeMatch) {
                      return (
                        <YouTube
                          videoId={youtubeMatch[1]}
                          onEnd={handleVideoEnded}
                          opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: {
                              rel: 0,
                              modestbranding: 1,
                              autoplay: 0,
                            },
                          }}
                          className="w-full h-full"
                          iframeClassName="w-full h-full"
                        />
                      );
                    } else if (driveMatch) {
                      return (
                        <video
                          src={`https://drive.google.com/uc?id=${driveMatch[1]}&export=download`}
                          className="w-full h-full"
                          controls
                          disablePictureInPicture
                          controlsList="nodownload"
                          onEnded={handleVideoEnded}
                        />
                      );
                    } else {
                      return (
                        <video
                          src={url}
                          disablePictureInPicture
                          disableRemotePlayback
                          controls
                          controlsList="nodownload"
                          className="w-full h-full"
                          onEnded={handleVideoEnded}
                        />
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Lecture Info */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {currentVideo + 1}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {lectures?.[currentVideo]?.title}
                    </h2>
                  </div>

                  {lectures && !userProgress?.lecturesCompleted?.includes(lectures[currentVideo]?._id) && (
                    <button
                      onClick={handleVideoEnded}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaCheckCircle />
                      Mark as Completed
                    </button>
                  )}

                  {userProgress?.lecturesCompleted?.includes(lectures?.[currentVideo]?._id) && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                      <FaCheckCircle />
                      <span className="font-medium">Completed</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    {lectures?.[currentVideo]?.description}
                  </p>
                </div>

                {/* Quiz Actions */}
                {role === "USER" && userProgress?.lecturesCompleted?.includes(lectures?.[currentVideo]?._id) && lectures?.[currentVideo]?.quizzes?.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                    <button
                      onClick={() => navigate("/course/quiz", { state: { ...state, lectureId: lectures[currentVideo]._id, quizzes: lectures[currentVideo].quizzes } })}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <FaPlay />
                      Take Quiz
                    </button>
                    {userProgress?.quizScores?.find(qs => qs.quizId === lectures[currentVideo]._id) && (
                      <p className="text-center mt-3 text-green-600 font-medium">
                        Score: {userProgress.quizScores.find(qs => qs.quizId === lectures[currentVideo]._id).score}/{lectures[currentVideo].quizzes.length}
                      </p>
                    )}
                  </div>
                )}

                {/* Admin Actions */}
                {role === "ADMIN" && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate("/course/addquiz", { state: { ...state, lectureId: lectures[currentVideo]._id } })}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FaPlus />
                        Add Quiz
                      </button>
                      <button
                        onClick={() => onLectureDelete(state?._id, lectures[currentVideo]?._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
