import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addCourseLecture } from "../../Redux/Slices/LectureSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { getVideoDuration } from "../../Helpers/api";
import { FaPlus, FaVideo, FaCloudUploadAlt, FaYoutube, FaGoogleDrive, FaClock, FaArrowLeft } from "react-icons/fa";

export default function AddLecture() {
  const courseDetails = useLocation().state;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const [userInput, setUserInput] = useState({
    id: courseDetails?._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: "",
    videoUrl: "",
    driveUrl: "", // New field for Google Drive URL
    duration: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput((prevInput) => {
      const newState = {
        ...prevInput,
        [name]: value,
      };

      if (name === "videoUrl" && value) {
        newState.lecture = undefined;
        newState.videoSrc = "";
        newState.driveUrl = ""; // Clear driveUrl when videoUrl is entered
      } else if (name === "driveUrl" && value) {
        newState.lecture = undefined;
        newState.videoSrc = "";
        newState.videoUrl = ""; // Clear videoUrl when driveUrl is entered
      } else if (name === "lecture" && value) {
        newState.videoUrl = "";
        newState.driveUrl = ""; // Clear driveUrl when lecture file is selected
        newState.duration = "";
      }
      return newState;
    });
  }

  function handleVideo(e) {
    const videoFile = e.target.files[0];
    if (!videoFile) return;

    // Revoke previous URL if any to prevent memory leaks
    if (userInput.videoSrc) {
      window.URL.revokeObjectURL(userInput.videoSrc);
    }

    const source = window.URL.createObjectURL(videoFile);

    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}m ${seconds}s`;

      setUserInput((prevInput) => ({
        ...prevInput,
        lecture: videoFile,
        videoSrc: source,
        duration: formattedDuration,
        videoUrl: "", // Clear videoUrl when a file is selected
      }));
    };
    videoElement.src = source;
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if ((!userInput.lecture && !userInput.videoUrl && !userInput.driveUrl) || !userInput.title || !userInput.description) {
      toast.error("All fields are mandatory, and either a video file, a YouTube URL, or a Drive URL must be provided.");
      return;
    }

    if ((userInput.lecture && userInput.videoUrl) || (userInput.lecture && userInput.driveUrl) || (userInput.videoUrl && userInput.driveUrl)) {
      toast.error("Please provide only one of: a video file, a YouTube URL, or a Drive URL.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (userInput.lecture) {
      formData.append("lecture", userInput.lecture);
    } else if (userInput.driveUrl) {
      formData.append("videoUrl", userInput.driveUrl); // Send driveUrl as videoUrl to backend
    } else if (userInput.videoUrl) {
      formData.append("videoUrl", userInput.videoUrl);
    }
    formData.append("title", userInput.title);
    formData.append("description", userInput.description);
    formData.append("duration", userInput.duration);

    const data = { formData, id: userInput.id };

    const response = await dispatch(addCourseLecture(data));
    if (response?.payload?.success) {
      navigate(-1);
      setUserInput({
        id: courseDetails?._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
        videoUrl: "",
        driveUrl: "", // Clear driveUrl after submission
        duration: "",
      });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!courseDetails) navigate("/courses");

    const fetchVideoDuration = async () => {
      const urlToFetch = userInput.driveUrl || userInput.videoUrl;

      if (!urlToFetch) return;

      // Regex patterns (matching backend validation)
      const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^\&\?\n]{11})/;
      const googleDriveRegex = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/;

      if (!youtubeRegex.test(urlToFetch) && !googleDriveRegex.test(urlToFetch)) {
        // Do not fetch if URL format is invalid to avoid 400 errors
        return;
      }

      try {
        const response = await getVideoDuration({ videoUrl: urlToFetch });
        setUserInput((prevInput) => ({ ...prevInput, duration: response.data.duration }));
      } catch (error) {
        console.error("Error fetching video duration:", error);
        // Only toast if it's a server error, not for bad requests which we try to filter client-side
        // But if we filter client-side, 400 shouldn't happen often. 
        // If it does, it might be a genuine issue, so keeping the toast but maybe making it less intrusive?
        // Actually, if we filter correctly, we shouldn't get 400.
        // If we get other errors (500), we should show toast.
        if (error.response && error.response.status !== 400) {
          toast.error("Failed to fetch video duration.");
        }
        setUserInput((prevInput) => ({ ...prevInput, duration: "" }));
      }
    };

    // Debounce the fetch to avoid too many requests while typing
    const timeoutId = setTimeout(() => {
      fetchVideoDuration();
    }, 1000);

    return () => clearTimeout(timeoutId);

  }, [courseDetails, navigate, userInput.videoUrl, userInput.driveUrl]);

  // Cleanup effect for video blob URL
  useEffect(() => {
    return () => {
      if (userInput.videoSrc) {
        window.URL.revokeObjectURL(userInput.videoSrc);
      }
    };
  }, [userInput.videoSrc]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/30">
        {/* Header */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Back Button - Left Side */}
              <motion.button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm">Back</span>
              </motion.button>

              {/* Centered Content */}
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Lecture
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm font-medium">
                  📚 Create engaging course content
                </p>
              </div>

              {/* Spacer for balance */}
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={onFormSubmit}
              autoComplete="off"
              noValidate
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-600/30 shadow-2xl p-8"
            >
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                  <FaVideo className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Lecture Details
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Fill in the information below to add your lecture
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Video Upload */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaCloudUploadAlt className="text-blue-500" />
                      Video Upload
                    </h3>

                    {/* File Upload Area */}
                    <div className="relative">
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors duration-300 bg-slate-50/50 dark:bg-slate-700/30">
                        {userInput.videoSrc ? (
                          <div className="space-y-4">
                            <video
                              muted
                              src={userInput.videoSrc}
                              controls
                              controlsList="nodownload nofullscreen"
                              disablePictureInPicture
                              className="w-full rounded-xl shadow-lg"
                            />
                            <p className="text-sm text-green-600 font-medium">Video uploaded successfully!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <FaCloudUploadAlt className="w-12 h-12 text-slate-400 mx-auto" />
                            <div>
                              <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                Upload Video File
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                MP4, MOV, or other video formats (max 500MB)
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => videoRef.current.click()}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              Choose File
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        id="lecture"
                        ref={videoRef}
                        name="lecture"
                        onChange={handleVideo}
                        accept="video/mp4, video/x-mp4, video/*"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Form Fields */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaVideo className="text-purple-500" />
                      Lecture Information
                    </h3>

                    <div className="space-y-5">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Lecture Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={userInput.title}
                          onChange={handleInputChange}
                          placeholder="Enter an engaging title for your lecture"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          rows={4}
                          value={userInput.description}
                          onChange={handleInputChange}
                          placeholder="Describe what students will learn in this lecture..."
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Video Source Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaYoutube className="text-red-500" />
                      Alternative Video Sources
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Choose one option: upload file above, or provide URL below
                    </p>

                    <div className="space-y-4">
                      {/* YouTube URL */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <FaYoutube className="text-red-500" />
                          YouTube URL
                        </label>
                        <input
                          type="url"
                          name="videoUrl"
                          value={userInput.videoUrl}
                          onChange={handleInputChange}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                        />
                      </div>

                      {/* Google Drive URL */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <FaGoogleDrive className="text-blue-500" />
                          Google Drive URL
                        </label>
                        <input
                          type="url"
                          name="driveUrl"
                          value={userInput.driveUrl}
                          onChange={handleInputChange}
                          placeholder="https://drive.google.com/file/d/..."
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <FaClock className="text-green-500" />
                          Duration
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={userInput.duration}
                          onChange={handleInputChange}
                          placeholder="e.g., 15m 30s or 1h 30m"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Auto-filled for uploaded videos, manual entry for URLs
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Lecture...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-xl" />
                      <span>Add New Lecture</span>
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
