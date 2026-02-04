import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserGraduate, FaEnvelope, FaChartLine, FaTrophy, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/30">
                {/* Header */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg sticky top-0 z-50">
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
                                    Enrolled Students
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm font-medium">
                                    Course: <span className="font-bold text-purple-600 dark:text-purple-400">{state?.title}</span>
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
                        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-600/30 shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Table Header Section */}
                        <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <FaUserGraduate className="text-indigo-500" />
                                    Student List
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    Total Enrolled: <span className="font-bold text-indigo-600 dark:text-indigo-400">{students.length}</span>
                                </p>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">S No</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Assignment Score</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {students.map((student, idx) => {
                                        const progress = student.progress;
                                        const completedCount = progress?.lecturesCompleted?.length || 0;
                                        const totalLectures = state?.numberOfLectures || 1;
                                        const percent = Math.round((completedCount / totalLectures) * 100);

                                        const finalAssignment = progress?.quizScores?.find(q => q.quizId === 'final-assignment');
                                        const assignmentScore = finalAssignment ? finalAssignment.score : 0;
                                        const totalAssignments = state?.quizzes?.length || 0;
                                        const assignmentPercent = totalAssignments > 0 ? Math.round((assignmentScore / totalAssignments) * 100) : 0;

                                        return (
                                            <motion.tr 
                                                key={student._id} 
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors duration-200"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                                                            {student.fullName?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{student.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                        <FaEnvelope className="text-slate-400" />
                                                        {student.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full max-w-xs">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{percent}% Completed</span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">{completedCount}/{totalLectures} Lectures</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                                            <div 
                                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                                                                style={{ width: `${percent}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {finalAssignment ? (
                                                        <div className="flex items-center gap-2">
                                                            <FaTrophy className={`text-sm ${assignmentPercent >= 65 ? 'text-yellow-500' : 'text-slate-400'}`} />
                                                            <span className={`text-sm font-bold ${assignmentPercent >= 65 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                                {assignmentScore}/{totalAssignments} ({assignmentPercent}%)
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                                            Not Attempted
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {progress?.isCompleted ?
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                                            <FaCheckCircle /> Issued
                                                        </span> :
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">
                                                            <FaChartLine /> In Progress
                                                        </span>
                                                    }
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                                        <FaUserGraduate className="text-3xl text-slate-400" />
                                                    </div>
                                                    <p className="text-lg font-medium text-slate-900 dark:text-white">No students enrolled yet</p>
                                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Wait for students to enroll in this course.</p>
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
