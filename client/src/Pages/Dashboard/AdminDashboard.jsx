import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Layout from "../../Layout/Layout";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import { getStatsData } from "../../Redux/Slices/StatSlice";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);
  const { totalRevenue, monthlySalesRecord } = useSelector((state) => state.razorpay);

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    datasets: [
      {
        label: "User Details",
        data: [allUsersCount, subscribedCount],
        backgroundColor: ["#BEE3F8", "#A7F3D0"], // Primary-200, Secondary-200
        borderColor: ["#3B82F6", "#10B981"], // Darker shades for border
        borderWidth: 1,
      },
    ],
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: "#2DD4BF", // Teal
        borderColor: "#14B8A6",
        borderWidth: 1,
      },
    ],
  };

  const myCourses = useSelector((state) => state.course.coursesData);

  async function onCourseDelete(id) {
    if (window.confirm("Are you sure you want to delete the course?")) {
      const res = await dispatch(deleteCourse(id));
      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  }

  useEffect(() => {
    (async () => {
      await dispatch(getAllCourses());
      await dispatch(getStatsData());
      await dispatch(getPaymentRecord());
    })();
  }, [dispatch]);

  return (
    <Layout hideFooter={true}>
      <section className="py-10 lg:py-16 px-4 lg:px-8 flex flex-col gap-10 relative min-h-screen bg-gray-50 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

        <motion.div
          className="text-center relative z-10 mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
            Admin <span className="text-primary-DEFAULT">Dashboard</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Overview of platform performance and course management
          </p>
        </motion.div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* User Analytics */}
          <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <FaUsers className="text-primary-DEFAULT" /> User Overview
              </h3>
            </div>
            <div className="h-64 flex justify-center">
               <Pie data={userData} />
            </div>
             <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-primary-50 p-4 rounded-xl text-center">
                    <p className="text-sm text-text-secondary">Registered</p>
                    <h4 className="text-2xl font-bold text-primary-DEFAULT">{allUsersCount}</h4>
                </div>
                <div className="bg-secondary-50 p-4 rounded-xl text-center">
                    <p className="text-sm text-text-secondary">Subscribed</p>
                    <h4 className="text-2xl font-bold text-secondary-DEFAULT">{subscribedCount}</h4>
                </div>
             </div>
          </motion.div>

          {/* Revenue Analytics */}
          <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <GiMoneyStack className="text-secondary-DEFAULT" /> Revenue Overview
              </h3>
            </div>
            <div className="h-64">
              <Bar data={salesData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-primary-light p-4 rounded-xl text-center">
                    <p className="text-sm text-text-secondary">Subscriptions</p>
                    <h4 className="text-2xl font-bold text-primary-dark">{subscribedCount}</h4>
                </div>
                <div className="bg-secondary-light p-4 rounded-xl text-center">
                    <p className="text-sm text-text-secondary">Total Revenue</p>
                    <h4 className="text-2xl font-bold text-secondary-dark">₹{totalRevenue?.toLocaleString()}</h4>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Courses Section */}
        <motion.div
             className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 relative z-10"
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    <BsCollectionPlayFill className="text-primary-DEFAULT" /> Course Management
                </h2>
                <button
                    onClick={() => navigate("/course/create")}
                    className="bg-gradient-to-r from-primary-DEFAULT to-primary-dark hover:from-primary-dark hover:to-primary-900 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    Create New Course
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="p-4 text-text-secondary font-semibold">S No</th>
                            <th className="p-4 text-text-secondary font-semibold">Title</th>
                            <th className="p-4 text-text-secondary font-semibold">Category</th>
                            <th className="p-4 text-text-secondary font-semibold">Instructor</th>
                            <th className="p-4 text-text-secondary font-semibold text-center">Lectures</th>
                            <th className="p-4 text-text-secondary font-semibold">Price</th>
                            <th className="p-4 text-text-secondary font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCourses?.map((course, idx) => (
                            <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-text-primary">{idx + 1}</td>
                                <td className="p-4 text-text-primary font-medium">{course.title}</td>
                                <td className="p-4">
                                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                                        {course.category}
                                    </span>
                                </td>
                                <td className="p-4 text-text-primary">{course.createdBy}</td>
                                <td className="p-4 text-text-primary text-center">{course.numberOfLectures}</td>
                                <td className="p-4 text-text-primary font-bold">₹{course.price}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                                            className="p-2 text-secondary-DEFAULT hover:bg-secondary-light rounded-lg transition-colors"
                                            title="View Lectures"
                                        >
                                            <BsCollectionPlayFill size={20} />
                                        </button>
                                        <button
                                            onClick={() => navigate("/course/students", { state: { ...course } })}
                                            className="p-2 text-primary-DEFAULT hover:bg-primary-light rounded-lg transition-colors"
                                            title="View Students"
                                        >
                                            <FaUsers size={20} />
                                        </button>
                                        <button
                                            onClick={() => onCourseDelete(course._id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Delete Course"
                                        >
                                            <BsTrash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
      </section>
    </Layout>
  );
}
