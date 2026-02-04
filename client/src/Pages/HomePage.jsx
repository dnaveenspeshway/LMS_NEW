import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import DemoVideo from "../Components/DemoVideo";
import heroPng from "../assets/images/hero.png";
import { getAllCourses } from "../Redux/Slices/CourseSlice";
import { getStatsData } from "../Redux/Slices/StatSlice";
import { FiBook, FiUserCheck, FiAward, FiArrowRight, FiPlayCircle, FiCode, FiDatabase, FiPenTool, FiPieChart, FiMonitor, FiBriefcase, FiLayers, FiUser } from "react-icons/fi";
import { BiWorld, BiSupport } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";

export default function HomePage() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);
  const { isLoggedIn, data } = useSelector((state) => state.auth);
  const { allUsersCount } = useSelector((state) => state.stat);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(getStatsData());
  }, [dispatch]);

  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // DYNAMIC CONSTANTS
  const totalCourses = coursesData?.length || 0;
  const displayedCourses = coursesData?.slice(0, 3) || [];

  // Dynamic Categories: unique list from data
  const dynamicCategories = coursesData?.length > 0
    ? [...new Set(coursesData.map(c => c.category))].slice(0, 6)
    : [];

  // Derived Stats
  const totalInstructors = coursesData?.length > 0
    ? new Set(coursesData.map(c => c.createdBy)).size
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-900 overflow-x-hidden font-sans">

        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 bg-white/5 dark:bg-gray-900/5 backdrop-blur-sm"></div>

          <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

            {/* Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {isLoggedIn ? `Welcome back, ${data?.fullName}!` : "#1 Learning Platform"}
                </span>
              </div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                {isLoggedIn ? "Continue" : "Start"} Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Success Story
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                Unlock your potential with <span className="font-bold text-gray-900 dark:text-white">{totalCourses}+</span> expert-led courses.
                Learn by doing, tracking your progress, and earning certificates that matter.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1">
                    Get Started Now <FiArrowRight />
                  </button>
                </Link>
                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-purple-200 hover:bg-purple-50 text-lg font-bold py-4 px-8 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <FiPlayCircle className="text-purple-600" /> Watch Demo
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{allUsersCount}+ Students</p>
                  <div className="flex text-yellow-500 text-sm">
                    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image / Composition */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-transparent rounded-full opacity-20 filter blur-3xl transform translate-x-10 translate-y-10"></div>
              <img src={heroPng} alt="Hero" className="w-full relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out" />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -left-6 bg-white dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 border border-gray-100 dark:border-gray-700 max-w-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                    <FiUserCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Expert Mentors</p>
                    <p className="text-xs text-gray-500">Learn from the best.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>


        {/* ================= STATS SECTION ================= */}
        <section className="py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { value: `${totalCourses}+`, label: "Online Courses", icon: <FiBook /> },
              { value: `${allUsersCount}+`, label: "Active Students", icon: <FiUserCheck /> },
              { value: `${totalInstructors || "50"}+`, label: "Instructors", icon: <BiWorld /> },
              { value: "99%", label: "Satisfaction Rate", icon: <FiAward /> },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center space-y-2 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
              >
                <span className="text-purple-300 text-3xl mb-2">{stat.icon}</span>
                <h3 className="text-4xl md:text-5xl font-bold">{stat.value}</h3>
                <p className="text-purple-200 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ================= CATEGORIES SECTION ================= */}
        {dynamicCategories.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm"></div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16 space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Categories</h2>
                <p className="text-gray-500 max-w-xl mx-auto">Explore our most popular categories found within our course library.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {dynamicCategories.map((cat, i) => (
                  <Link to="/courses" state={{ category: cat }} key={i}>
                    <motion.div
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="flex flex-col items-center justify-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl cursor-pointer transition-all duration-300 border border-white/20 dark:border-gray-700/50 h-full shadow-lg hover:shadow-xl"
                    >
                      <div className="text-3xl text-purple-600 mb-3"><FiLayers /></div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-center">{cat}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ================= FEATURED COURSES SECTION ================= */}
        {displayedCourses.length > 0 && (
          <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                <div className="space-y-2">
                  <span className="text-purple-600 font-bold uppercase tracking-wider text-sm">Discover</span>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Additions</h2>
                </div>
                <Link to="/courses">
                  <button className="hidden md:flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors">
                    View All Courses <FiArrowRight />
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {displayedCourses.map((course, idx) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={course?.thumbnail?.secure_url}
                        alt={course?.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link to="/courses">
                          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            View Course
                          </button>
                        </Link>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-purple-600 uppercase tracking-wide">
                        {course.category}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1 min-h-[3rem]">{course.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                            {course.createdBy ? course.createdBy[0] : "?"}
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{course.createdBy || "Unknown Instructor"}</span>
                        </div>
                        <div className="flex text-yellow-500 text-xs gap-0.5">
                          <FaGraduationCap className="text-lg text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center md:hidden">
                <Link to="/courses" className="btn-primary w-full justify-center">
                  View All Courses
                </Link>
              </div>
            </div>
          </section>
        )}


        {/* ================= FEATURES GRID ================= */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Offering <span className="text-purple-600">Smart Features</span> for <br /> Smarter Learning.
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  We don't just provide courses; we provide an ecosystem for your growth.
                  Experience features designed to help you succeed.
                </p>

                <div className="space-y-6">
                  {[
                    { title: "Interactive Quizzes", desc: "Test your knowledge with engaging quizzes after each lecture.", icon: <FiCode /> },
                    { title: "Assignment Submissions", desc: "Submit assignments and get personalized feedback.", icon: <FiPenTool /> },
                    { title: "Progress Tracking", desc: "Monitor your learning journey with detailed analytics.", icon: <FiPieChart /> },
                    { title: "Mobile Learning", desc: "Learn anytime, anywhere with our responsive platform.", icon: <FiMonitor /> },
                    { title: "Career Guidance", desc: "Get insights into industry trends and career paths.", icon: <FiBriefcase /> },
                    { title: "Community Support", desc: "Connect with thousands of learners and instructors.", icon: <BiSupport /> }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 border border-white/20 dark:border-gray-700/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white">{item.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Representation (Generic Learning Context) */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl transform rotate-3 opacity-10"></div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px] flex items-center justify-center">
                  <div className="text-center p-10 space-y-4">
                    <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-full shadow-lg mb-4">
                      <FaGraduationCap className="text-6xl text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Master Your Skills</h3>
                    <p className="text-gray-500">Join our platform and take your career to the next level with industry-recognized certifications.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= CTA SECTION ================= */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="relative bg-purple-600 rounded-[2rem] p-12 md:p-20 overflow-hidden text-center text-white">
              <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden opacity-30">
                <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              </div>

              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold">Ready to transform your career?</h2>
                <p className="text-purple-100 text-xl">Join {allUsersCount}+ others and start learning today.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/signup">
                    <button className="bg-white text-purple-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
                      Join for Free
                    </button>
                  </Link>
                  <Link to="/courses">
                    <button className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-xl hover:bg-white/10 transition-all">
                      Browse Courses
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Demo Video Modal */}
      <DemoVideo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </Layout>
  );
}
