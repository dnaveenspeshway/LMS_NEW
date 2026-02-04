import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserGraduate, FaEnvelope, FaChartLine, FaCheckCircle } from "react-icons/fa";

import { getEnrolledStudents } from "../../Helpers/api";
import Layout from "../../Layout/Layout";

export default function EnrolledStudents() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (!state?._id) navigate("/admin/dashboard");
        (async () => {
            try {
                const res = await getEnrolledStudents(state._id);
                if (res?.data?.success) {
                    setStudents(res.data.students);
                }
            } catch (error) {
                toast.error("Failed to fetch enrolled students");
            }
        })();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light dark:from-slate-900 dark:via-primary-900/20 dark:to-secondary-900/30">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Back Button */}
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg font-medium transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaArrowLeft className="text-sm" />
                                <span className="text-sm">Back</span>
                            </motion.button>

                            {/* Centered Content */}
                            <div className="flex-1 text-center">
                                <h1 className="text-2xl font-bold text-text-primary">
                                    Enrolled Students
                                </h1>
                                <p className="text-text-secondary mt-1 text-sm font-medium">
                                    Course: <span className="font-bold text-primary-DEFAULT">{state?.title}</span>
                                </p>
                            </div>

                            {/* Spacer */}
                            <div className="w-24"></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6 lg:p-10">
                    <motion.div
                        className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Table Header Section */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                                    <FaUserGraduate className="text-primary-DEFAULT" />
                                    Student List
                                </h2>
                                <p className="text-text-secondary mt-1 text-sm">
                                    Total Enrolled: <span className="font-bold text-primary-DEFAULT">{students.length}</span>
                                </p>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">S No</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((student, idx) => {
                                        const progress = student.progress;
                                        const completedCount = progress?.lecturesCompleted?.length || 0;
                                        const totalLectures = state?.numberOfLectures || 1;
                                        const percent = Math.round((completedCount / totalLectures) * 100);

                                        return (
                                            <motion.tr 
                                                key={student._id} 
                                                className="hover:bg-primary-50/20 transition-colors duration-200"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold text-xs uppercase">
                                                            {student.fullName?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="text-sm font-medium text-text-primary">{student.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                        <FaEnvelope className="text-gray-400" />
                                                        {student.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full max-w-xs">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-medium text-text-primary">{percent}% Completed</span>
                                                            <span className="text-xs text-text-secondary">{completedCount}/{totalLectures} Lectures</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                                            <div 
                                                                className="bg-primary-DEFAULT h-2 rounded-full transition-all duration-500" 
                                                                style={{ width: `${percent}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {progress?.isCompleted ?
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary-light text-secondary-dark border border-secondary-medium">
                                                            <FaCheckCircle /> Completed
                                                        </span> :
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                                            <FaChartLine /> In Progress
                                                        </span>
                                                    }
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <FaUserGraduate className="text-3xl text-gray-300" />
                                                    </div>
                                                    <p className="text-lg font-medium text-text-primary">No students enrolled yet</p>
                                                    <p className="text-text-secondary mt-1">Wait for students to enroll in this course.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
