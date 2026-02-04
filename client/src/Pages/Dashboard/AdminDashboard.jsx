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
import {
  BsCollectionPlayFill,
  BsTrash
} from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
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

  const { allPayments, totalRevenue, monthlySalesRecord } = useSelector(
    (state) => state.razorpay
  );

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    fontColor: "#fff",
    datasets: [
      {
        label: "User Details",
        data: [allUsersCount, subscribedCount],
        backgroundColor: ["yellow", "green"],
        borderWidth: 1,
        borderColor: ["yellow", "green"],
      },
    ],
  };

  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: ["red"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };

  const myCourses = useSelector((state) => state.course.coursesData);

  async function onCourseDelete(id) {
    if (window.confirm("Are you sure you want to delete the course ? ")) {
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
      <section className="py-10 lg:py-16 flex flex-col gap-10 relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>

        <motion.h1
          className="text-center text-4xl font-bold gradient-text relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin{" "}
          <span className="text-primary-600 dark:text-primary-400">Dashboard</span>
        </motion.h1>

        <div className="flex flex-col gap-16 relative z-10">
          {/* Analytics section */}
          <motion.div
            className="grid lg:grid-cols-2 grid-cols-1 lg:gap-12 gap-8 m-auto lg:mx-10 mx-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* User analytics */}
            <motion.div
              className="card bg-white dark:bg-base-100 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              data-aos="fade-right"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
                <h3 className="text-white text-xl font-bold">User Analytics</h3>
                <p className="text-primary-100 text-sm">Registered vs Subscribed Users</p>
              </div>

              <div className="p-6">
                <div className="w-full h-64 mb-6">
                  <Pie
                    data={userData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                          }
                        }
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Registered</p>
                        <h4 className="text-2xl font-bold text-blue-800 dark:text-blue-200">{allUsersCount}</h4>
                      </div>
                      <FaUsers className="text-blue-500 text-3xl" />
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 dark:text-green-400 font-semibold text-sm">Subscribed</p>
                        <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">{subscribedCount}</h4>
                      </div>
                      <FaUsers className="text-green-500 text-3xl" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Sales analytics */}
            <motion.div
              className="card bg-white dark:bg-base-100 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              data-aos="fade-left"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6">
                <h3 className="text-white text-xl font-bold">Revenue Analytics</h3>
                <p className="text-secondary-100 text-sm">Monthly Sales & Total Revenue</p>
              </div>

              <div className="p-6">
                <div className="h-64 relative w-full mb-6">
                  <Bar
                    data={salesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: false,
                          }
                        },
                        x: {
                          grid: {
                            display: false,
                          }
                        }
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 dark:text-orange-400 font-semibold text-sm">Subscriptions</p>
                        <h4 className="text-2xl font-bold text-orange-800 dark:text-orange-200">{subscribedCount}</h4>
                      </div>
                      <FcSalesPerformance className="text-orange-500 text-3xl" />
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Revenue</p>
                        <h4 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{totalRevenue?.toLocaleString()}</h4>
                      </div>
                      <GiMoneyStack className="text-emerald-500 text-3xl" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Courses Management Section */}
          <motion.div
            className="w-full self-center flex flex-col justify-center gap-10 mb-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex w-full items-center justify-between md:px-[40px] px-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-center font-bold md:text-3xl text-xl text-gray-800 dark:text-slate-100">
                Courses Overview
              </h2>

              <motion.button
                onClick={() => navigate("/course/create")}
                className="btn-accent hover:scale-105 transform transition-all duration-300 shadow-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create New Course
              </motion.button>
            </motion.div>

            <motion.div
              className="w-full overflow-x-auto bg-white dark:bg-base-100 rounded-2xl shadow-xl"
              data-aos="fade-up"
            >
              <table className="table w-full">
                <thead className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-base-200 dark:to-base-300">
                  <tr className="text-gray-900 dark:text-slate-300 font-semibold">
                    <th className="px-6 py-4 text-left">S No</th>
                    <th className="px-6 py-4 text-left">Course Title</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Instructor</th>
                    <th className="px-6 py-4 text-left">Lectures</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-slate-300">
                  {myCourses?.map((course, idx) => (
                    <motion.tr
                      key={course._id}
                      className="hover:bg-gray-50 dark:hover:bg-base-200 transition-colors duration-200 border-b border-gray-100 dark:border-base-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <td className="px-6 py-4 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <textarea
                          readOnly
                          value={course?.title}
                          className="w-40 h-auto bg-transparent resize-none border-none outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium">
                          {course?.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{course?.createdBy}</td>
                      <td className="px-6 py-4">{course?.numberOfLectures}</td>
                      <td className="px-6 py-4 font-semibold text-secondary-600">
                        ₹{course?.price}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <textarea
                          value={course?.description}
                          readOnly
                          className="w-full h-auto bg-transparent resize-none border-none outline-none line-clamp-2"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                            onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                            title="View Lectures"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <BsCollectionPlayFill className="text-lg" />
                          </motion.button>
                          <motion.button
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                            onClick={() => navigate("/course/students", { state: { ...course } })}
                            title="View Enrolled Students"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaUsers className="text-lg" />
                          </motion.button>
                          <motion.button
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            onClick={() => onCourseDelete(course?._id)}
                            title="Delete Course"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <BsTrash className="text-lg" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
