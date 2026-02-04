import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getCourseLectures,
  deleteCourseLecture,
} from "../../Redux/Slices/LectureSlice";
import { getUserProgress, updateProgress } from "../../Redux/Slices/AuthSlice";
import { generateCertificate } from "../../Helpers/api";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import { FaPlay, FaPlus, FaCheckCircle, FaBookOpen, FaUserGraduate, FaArrowRight, FaVideo } from "react-icons/fa";

export default function DisplayLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { lectures } = useSelector((state) => state.lecture);
  const { role, data } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [userProgress, setUserProgress] = useState({ lecturesCompleted: [] });

  useEffect(() => {
    if (!state) navigate("/courses");
    if (role !== "ADMIN" && !data?.courseProgress?.some((cp) => cp.courseId === state?._id)) {
      toast.error("You are not enrolled in this course");
      navigate("/courses");
    }
  }, [role, data, state, navigate]);

  const totalLectures = state?.numberOfLectures || 0;
  const completedLectures = Math.min(userProgress.lecturesCompleted.length, totalLectures);
  const progressPercentage = totalLectures > 0 ? Math.min(100, Math.round((completedLectures / totalLectures) * 100)) : 0;

  const handleVideoEnded = async () => {
    if (role === "ADMIN") return; 
    const lectureId = lectures[currentVideo]._id;
    if (!userProgress.lecturesCompleted.includes(lectureId)) {
      const res = await dispatch(updateProgress({ courseId: state._id, lectureId }));
      if (res?.payload?.success) {
        setUserProgress(res.payload.courseProgress);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!state) {
        navigate("/courses");
        return;
      }
      await dispatch(getCourseLectures(state._id));
      if (role === "USER") {
        const progressRes = await dispatch(getUserProgress(state._id));
        if (progressRes?.payload?.success) {
            setUserProgress(progressRes.payload.courseProgress || { lecturesCompleted: [] });
        }
      }
    })();
  }, [state, dispatch, navigate, role]);

  const handleLectureClick = (idx) => {
    setCurrentVideo(idx);
    setShowVideo(true);
  };

  return (
    <Layout hideFooter={true} hideNav={true} hideBar={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side - Back Button */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => showVideo ? setShowVideo(false) : navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg font-medium transition-all duration-300"
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
              <div className="flex-1 text-center hidden md:block">
                <h1 className="text-xl font-bold text-text-primary truncate px-4">
                  {showVideo ? `${currentVideo + 1}. ${lectures?.[currentVideo]?.title}` : state?.title}
                </h1>
                <p className="text-text-secondary text-xs font-medium">
                  {showVideo ? "🎥 Video Lecture" : `📚 ${lectures?.length || 0} Lectures Available`}
                </p>
              </div>

              {/* Right Side - Progress (only for users, not when viewing video) */}
              {role === "USER" && !showVideo && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-text-secondary">Progress</div>
                    <div className="text-sm font-bold text-primary-DEFAULT">
                      {progressPercentage}%
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-DEFAULT transition-all duration-500 ease-out"
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

        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {showVideo ? (
             <div className="flex flex-col gap-6">
                 {/* Video Player */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative">
                    <video
                        src={lectures?.[currentVideo]?.lecture?.secure_url}
                        className="w-full h-full object-contain"
                        controls
                        disablePictureInPicture
                        controlsList="nodownload"
                        onEnded={handleVideoEnded}
                    ></video>
                </div>
                
                {/* Video Info */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        {lectures?.[currentVideo]?.title}
                    </h2>
                    <p className="text-text-secondary leading-relaxed">
                        {lectures?.[currentVideo]?.description}
                    </p>
                </div>
             </div>
          ) : (
            /* Lectures Grid View */
            <div className="space-y-8">
              {/* Admin Controls */}
              {role === "ADMIN" && (
                <motion.div
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                        <FaPlus className="text-primary-DEFAULT" />
                        Course Management
                      </h3>
                      <p className="text-text-secondary text-sm">Add new content to your course</p>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                        className="flex items-center gap-2 bg-primary-DEFAULT text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus />
                        <span>Add Lecture</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Progress Overview for User */}
              {role === "USER" && (
                <motion.div
                  className="relative bg-gradient-to-r from-primary-DEFAULT to-primary-dark rounded-3xl p-8 text-white shadow-xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <FaUserGraduate className="text-secondary-light" />
                          Your Progress
                        </h2>
                        <p className="text-primary-light mt-1">Keep learning! 🚀</p>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-black">{progressPercentage}%</div>
                        <div className="text-sm text-primary-light font-medium">Complete</div>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="h-full bg-secondary-DEFAULT rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-light">
                        {completedLectures} of {totalLectures} lectures completed
                      </span>
                      <span className="text-secondary-light font-semibold">
                        {totalLectures - completedLectures} remaining
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Lectures List */}
              <motion.div
                className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                          <FaBookOpen className="text-primary-dark text-lg" />
                        </div>
                        Course Content
                      </h2>
                      <p className="text-text-secondary mt-1 text-sm">
                        {lectures?.length || 0} engaging lectures
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {lectures?.map((lecture, idx) => (
                    <motion.div
                      key={lecture._id}
                      className={`group relative p-6 cursor-pointer transition-all duration-300 hover:bg-primary-light/30 ${
                        userProgress?.lecturesCompleted?.includes(lecture?._id)
                          ? "bg-secondary-light/30"
                          : ""
                      }`}
                      onClick={() => handleLectureClick(idx)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Lecture Number/Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          userProgress?.lecturesCompleted?.includes(lecture?._id)
                            ? "bg-secondary-light text-secondary-dark"
                            : "bg-gray-100 text-gray-500 group-hover:bg-primary-light group-hover:text-primary-dark"
                        }`}>
                          {userProgress?.lecturesCompleted?.includes(lecture?._id) ? (
                            <FaCheckCircle />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Lecture Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold mb-1 ${
                            userProgress?.lecturesCompleted?.includes(lecture?._id)
                              ? "text-text-primary"
                              : "text-text-primary group-hover:text-primary-dark"
                          }`}>
                            {lecture?.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <div className="flex items-center gap-1.5">
                              <FaVideo className="text-primary-DEFAULT" />
                              <span>Video</span>
                            </div>
                            {userProgress?.lecturesCompleted?.includes(lecture?._id) && (
                                <span className="text-secondary-dark font-medium text-xs bg-secondary-light px-2 py-0.5 rounded-full">
                                    Completed
                                </span>
                            )}
                          </div>
                        </div>

                        {/* Play Icon (Hover) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 rounded-full bg-primary-DEFAULT flex items-center justify-center shadow-lg">
                                <FaPlay className="text-white text-sm ml-1" />
                            </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {lectures?.length === 0 && (
                      <div className="p-10 text-center text-text-secondary">
                          No lectures uploaded yet.
                      </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
