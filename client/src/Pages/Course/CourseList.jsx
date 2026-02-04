import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import CourseCard from "../../Components/CourseCard";
import Layout from "../../Layout/Layout";
import { FaSearch, FaFilter, FaGraduationCap, FaBookOpen } from "react-icons/fa";

export default function CourseList() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const { state } = useLocation();

  async function fetchCourses() {
    await dispatch(getAllCourses());
  }

  useEffect(() => {
    fetchCourses();
    if (state?.category) {
      setSelectedCategory(state.category);
    }
  }, [state]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(coursesData?.map(course => course.category) || [])];
    return cats;
  }, [coursesData]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = coursesData || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Sort (create a copy to avoid mutating Redux state)
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
          return b.numberOfLectures - a.numberOfLectures;
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return filtered;
  }, [coursesData, searchTerm, selectedCategory, sortBy]);

  const averageRating = useMemo(() => {
    if (!coursesData || coursesData.length === 0) return 0;
    const totalRating = coursesData.reduce((acc, course) => acc + (course.rating || 0), 0);
    return (totalRating / coursesData.length).toFixed(1);
  }, [coursesData]);

  return (
    <Layout>
      <section className="min-h-screen relative overflow-hidden bg-white">
        {/* Enhanced Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

        {/* Hero Section */}
        <div className="relative z-10 bg-gradient-to-br from-primary-light via-white to-secondary-light py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-DEFAULT to-secondary-DEFAULT rounded-full mb-6 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              >
                <FaGraduationCap className="text-white text-3xl" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 pb-2">
                Discover Your Next
                <span className="block text-primary-DEFAULT mt-2">
                  Learning Adventure
                </span>
              </h1>

              <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
                Explore our comprehensive collection of courses taught by industry experts.
                From beginner to advanced, find the perfect course to advance your career.
              </p>

              {/* Stats */}
              <div className="flex justify-center space-x-8 mb-8">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-3xl font-bold text-primary-DEFAULT">
                    {coursesData?.length || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Courses</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl font-bold text-secondary-DEFAULT">
                    {categories.length - 1}
                  </div>
                  <div className="text-sm text-text-secondary">Categories</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-3xl font-bold text-accent-DEFAULT">
                    {averageRating}★
                  </div>
                  <div className="text-sm text-text-secondary">Avg Rating</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="relative z-10 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              className="flex flex-col lg:flex-row gap-4 items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all duration-200 bg-gray-50 text-text-primary"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                {/* Category Filter */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-text-primary cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-text-primary cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCourses.length > 0 ? (
              <>
                <motion.div
                  className="flex justify-between items-center mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-text-secondary">
                    Showing <span className="font-semibold text-text-primary">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
                    {searchTerm && <span> for "<span className="font-semibold text-text-primary">{searchTerm}</span>"</span>}
                    {selectedCategory !== "All" && <span> in <span className="font-semibold text-text-primary">{selectedCategory}</span></span>}
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {filteredCourses.map((course, index) => (
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
                      className="w-full"
                    >
                      <CourseCard data={course} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.div
                className="flex flex-col justify-center items-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
                  <FaBookOpen className="w-16 h-16 text-gray-300" />
                </div>
                <h3 className="text-3xl font-bold text-text-primary mb-4 text-center">
                  {searchTerm || selectedCategory !== "All" ? "No courses found" : "No courses available"}
                </h3>
                <p className="text-text-secondary text-center max-w-md mb-6">
                  {searchTerm || selectedCategory !== "All"
                    ? "Try adjusting your search or filter criteria to find more courses."
                    : "We're working on adding exciting courses. Check back soon or contact us to suggest topics you'd like to learn!"
                  }
                </p>
                {(searchTerm || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="btn btn-primary"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}