import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaAward, FaPlay } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import Layout from "../Layout/Layout";
import aboutMainImage from "../assets/images/about.png";
import { getAllCourses } from "../Redux/Slices/CourseSlice";
import { getStatsData } from "../Redux/Slices/StatSlice";

function AboutUs() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);
  const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);
  const { role } = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(getAllCourses());
    if (role === "ADMIN") {
      dispatch(getStatsData());
    }
  }, [dispatch, role]);

  // Calculate stats dynamically
  const stats = useMemo(() => {
    const dynamicStats = [];

    // Active Students (Admin only, or if data available)
    if (allUsersCount > 0) {
      dynamicStats.push({
        id: 1,
        label: "Active Students",
        value: `${allUsersCount > 1000 ? (allUsersCount / 1000).toFixed(1) + 'K+' : allUsersCount + "+"}`,
        icon: <FaUserGraduate />
      });
    }

    // Expert Instructors (Always available from course data)
    const uniqueInstructors = new Set(coursesData?.map(c => c.createdBy)).size;
    if (uniqueInstructors > 0) {
      dynamicStats.push({
        id: 2,
        label: "Expert Instructors",
        value: `${uniqueInstructors}+`,
        icon: <FaChalkboardTeacher />
      });
    }

    // Premium Courses (Always available)
    if (coursesData?.length > 0) {
      dynamicStats.push({
        id: 3,
        label: "Premium Courses",
        value: `${coursesData.length}+`,
        icon: <FaBook />
      });
    }

    // Certifications (Admin / Proxy using subscribed users who likely earn certs)
    if (subscribedCount > 0) {
      dynamicStats.push({
        id: 4,
        label: "Certifications",
        value: `${subscribedCount}+`,
        icon: <FaAward />
      });
    }

    // Total Lectures (Always available)
    const totalLectures = coursesData?.reduce((acc, course) => acc + (course.numberOfLectures || 0), 0) || 0;
    if (totalLectures > 0) {
      dynamicStats.push({
        id: 5,
        label: "Interactive Lectures",
        value: `${totalLectures}+`,
        icon: <FaPlay className="pl-1" />
      });
    }

    return dynamicStats;
  }, [coursesData, allUsersCount, subscribedCount]); // Added subscribedCount to dependencies

  const values = [
    {
      id: 1,
      title: "Global Learning",
      description: "Connecting students from all over the world to quality education.",
      icon: <BiWorld className="text-4xl text-blue-500" />,
    },
    {
      id: 2,
      title: "Expert Guidance",
      description: "Learn from industry experts who are passionate about teaching.",
      icon: <FaChalkboardTeacher className="text-4xl text-green-500" />,
    },
    {
      id: 3,
      title: "Affordable Access",
      description: "Quality education shouldn't break the bank. We make it accessible.",
      icon: <FaBook className="text-4xl text-purple-500" />,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-text-primary overflow-x-hidden">

        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          </div>

          <div className="mx-auto max-w-7xl py-12 sm:py-20 lg:py-24">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left lg:w-1/2"
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-text-primary mb-6 pb-2">
                  Empowering Your <br />
                  <span className="text-primary-DEFAULT">Learning Journey</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-text-secondary">
                  Welcome to LMS PRO, where education meets innovation. We are dedicated to providing a transformative learning experience that equips you with the skills to succeed in the modern world.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/courses"
                    className="btn btn-primary px-8 py-3 text-lg"
                  >
                    Explore Courses
                  </motion.a>
                  <a href="/contact" className="text-sm font-semibold leading-6 text-text-primary hover:text-primary-DEFAULT transition-colors">
                    Contact Us <span aria-hidden="true">→</span>
                  </a>
                </div>
              </motion.div>

              {/* Image Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT opacity-30 blur-2xl"></div>
                  <img
                    src={aboutMainImage}
                    alt="Team working"
                    className="relative w-full max-w-md rounded-2xl shadow-2xl ring-1 ring-gray-100 transform hover:-translate-y-2 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="bg-white py-16 sm:py-24 border-y border-gray-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="overflow-x-auto">
                <dl className="flex gap-x-8 gap-y-0 text-center pb-4 justify-center flex-wrap">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="mx-auto flex max-w-xs min-w-[180px] flex-col gap-y-4 p-6 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="text-4xl text-primary-DEFAULT mx-auto flex items-center justify-center bg-primary-50 w-16 h-16 rounded-full shadow-sm">
                        {stat.icon}
                      </div>
                      <dt className="text-base leading-7 text-text-secondary font-medium">{stat.label}</dt>
                      <dd className="order-first text-3xl font-bold tracking-tight text-text-primary">
                        {stat.value}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Values/Features Section */}
        <div className="px-6 py-24 sm:py-32 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Our Core Values</h2>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              We believe in more than just teaching. We believe in inspiring, empowering, and creating a community of lifelong learners.
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {values.map((value, idx) => (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-6 inline-block p-4 rounded-xl bg-primary-50 text-primary-DEFAULT">
                    {React.cloneElement(value.icon, { className: "text-4xl" })}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{value.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default AboutUs;
