import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserQuizScore } from '../../Redux/Slices/AuthSlice';
import { motion } from 'framer-motion';
import Layout from '../../Layout/Layout';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaTrophy, FaRedo, FaArrowLeft, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

import api from '../../Helpers/api';

export default function AssignmentPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const quizzes = state?.quizzes || [];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [userAnswers, setUserAnswers] = useState([]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const dispatch = useDispatch();

    const handleNextQuestion = async () => {
        if (!selectedOption) {
            toast.error("Please select an option");
            return;
        }

        const newUserAnswers = [...userAnswers, selectedOption];
        setUserAnswers(newUserAnswers);

        let newScore = score;
        if (selectedOption === quizzes[currentQuestion].correctAnswer) {
            newScore = score + 1;
            setScore(newScore);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizzes.length) {
            setCurrentQuestion(nextQuestion);
            setSelectedOption('');
        } else {
            setShowScore(true);
            await dispatch(updateUserQuizScore({
                courseId: state._id,
                isFinalAssignment: true,
                score: newScore
            }));
        }
    };

    const handleRetake = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedOption('');
        setUserAnswers([]);
    };

    const percentage = quizzes.length > 0 ? (score / quizzes.length) * 100 : 0;
    const isPassed = percentage >= 65;

    const downloadCertificate = async () => {
        try {
            const response = await api.generateCertificate(state._id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate-${state.title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download certificate");
        }
    }

    return (
        <Layout>
             <section className="min-h-screen py-8 px-4 lg:px-8 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Breadcrumb */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <button
                                onClick={() => navigate("/courses")}
                                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                Courses
                            </button>
                            <span>/</span>
                            <button
                                onClick={() => navigate(-1)}
                                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                Course
                            </button>
                            <span>/</span>
                            <span className="text-gray-900 dark:text-white font-medium">Assignment</span>
                        </nav>
                    </motion.div>

                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={`${showScore ? 'md:w-[900px]' : 'md:w-[700px]'} w-full bg-white dark:bg-base-100 shadow-2xl rounded-2xl p-8 lg:p-12 border border-gray-100 dark:border-base-300`}>
                            {showScore ? (
                                <motion.div
                                    className="space-y-8"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        >
                                            <FaTrophy className={`mx-auto text-6xl mb-4 ${isPassed ? 'text-yellow-500' : 'text-gray-400'}`} />
                                        </motion.div>
                                        <h2 className="text-4xl lg:text-5xl font-bold gradient-text">
                                            {isPassed ? "Assignment Passed!" : "Assignment Failed"}
                                        </h2>
                                        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
                                            You scored <span className={`font-bold ${isPassed ? 'text-success' : 'text-error'}`}>{percentage.toFixed(0)}%</span>
                                            <span className="text-base ml-2">({score}/{quizzes.length})</span>
                                        </p>
                                        <p className="text-gray-500">
                                            {isPassed ? "Great job! You have successfully completed this course." : "You need at least 65% to pass and earn your certificate."}
                                        </p>
                                    </div>

                                    {/* Result Review Section */}
                                     <motion.div
                                        className="space-y-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white border-b-4 border-accent pb-3 uppercase tracking-tight">
                                            Review Your Results
                                        </h3>
                                        {quizzes.map((quiz, index) => {
                                            const isUserCorrect = userAnswers[index] === quiz.correctAnswer;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    className="p-6 lg:p-8 rounded-2xl border-2 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-lg border-l-[12px] transition-all hover:shadow-xl"
                                                    style={{ borderLeftColor: isUserCorrect ? '#22c55e' : '#ef4444' }}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ y: -2 }}
                                                >
                                                    <div className="flex justify-between items-start gap-4 mb-6">
                                                        <h4 className="font-bold text-xl lg:text-2xl dark:text-white flex-1 leading-tight">
                                                            <span className="text-accent-500 font-black mr-2">Q{index + 1}:</span>
                                                            {quiz.question}
                                                        </h4>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${isUserCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                            {isUserCorrect ? <><AiOutlineCheckCircle className="inline mr-1" /> Correct</> : <><AiOutlineCloseCircle className="inline mr-1" /> Incorrect</>}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {quiz.options.map((option, optIdx) => {
                                                            const isSelected = option === userAnswers[index];
                                                            const isCorrect = option === quiz.correctAnswer;

                                                            let borderStyles = "border-gray-200 dark:border-gray-700";
                                                            let bgStyles = "bg-gray-50 dark:bg-slate-800";
                                                            let badge = null;

                                                            if (isCorrect) {
                                                                borderStyles = "border-green-300 bg-green-50 dark:bg-green-900/20";
                                                                badge = <span className="ml-auto text-xs font-bold uppercase tracking-wide bg-green-600 text-white px-3 py-1 rounded-full shadow-sm">Correct Answer</span>;
                                                            }

                                                            if (isSelected && !isCorrect) {
                                                                borderStyles = "border-red-300 bg-red-50 dark:bg-red-900/20";
                                                                badge = <span className="ml-auto text-xs font-bold uppercase tracking-wide bg-red-600 text-white px-3 py-1 rounded-full shadow-sm">Your Selection</span>;
                                                            } else if (isSelected && isCorrect) {
                                                                badge = <span className="ml-auto text-xs font-bold uppercase tracking-wide bg-green-600 text-white px-3 py-1 rounded-full shadow-sm">Your Selection ✓</span>;
                                                            }

                                                            return (
                                                                <div key={optIdx} className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${borderStyles} ${bgStyles} ${isSelected || isCorrect ? 'scale-[1.01] shadow-md' : 'opacity-70'}`}>
                                                                    <div className={`w-4 h-4 rounded-full mr-4 ${isCorrect ? 'bg-green-500' : isSelected ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                                                    <span className={`font-semibold ${isCorrect ? 'text-green-700 dark:text-green-300' : isSelected ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                        {option}
                                                                    </span>
                                                                    {badge}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>


                                    <motion.div
                                        className="flex flex-col md:flex-row justify-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-700"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        {!isPassed && (
                                            <motion.button
                                                onClick={handleRetake}
                                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaRedo className="text-sm" />
                                                Retake Assignment
                                            </motion.button>
                                        )}

                                        {isPassed && (
                                            <motion.button
                                                onClick={downloadCertificate}
                                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaDownload className="text-sm" />
                                                Download Certificate
                                            </motion.button>
                                        )}

                                        <motion.button
                                            onClick={() => navigate(-1)}
                                            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaArrowLeft className="text-sm" />
                                            Back to Course
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                quizzes.length > 0 ? (
                                    <motion.div
                                        className="flex flex-col gap-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6">
                                            <h2 className="text-2xl lg:text-3xl font-bold text-primary dark:text-primary-400">
                                                Question {currentQuestion + 1} of {quizzes.length}
                                            </h2>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                Final Assignment
                                            </span>
                                        </div>

                                        <motion.div
                                            className="text-xl lg:text-2xl font-semibold min-h-[100px] text-gray-900 dark:text-white leading-relaxed"
                                            key={currentQuestion}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {quizzes[currentQuestion]?.question}
                                        </motion.div>

                                        <motion.div
                                            className="flex flex-col gap-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {quizzes[currentQuestion]?.options.map((option, index) => (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => handleOptionSelect(option)}
                                                    className={`p-4 lg:p-6 rounded-xl border-2 text-left transition-all duration-300 text-lg font-medium ${selectedOption === option
                                                        ? "bg-accent-500 text-white border-accent-500 transform scale-[1.02] shadow-lg"
                                                        : "hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md border-gray-200 dark:border-gray-700"
                                                        }`}
                                                    whileHover={{ scale: selectedOption === option ? 1.02 : 1.01 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {option}
                                                </motion.button>
                                            ))}
                                        </motion.div>

                                        <motion.button
                                            onClick={handleNextQuestion}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg lg:text-xl mt-6"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={!selectedOption}
                                        >
                                            {currentQuestion === quizzes.length - 1 ? "Finish Assignment" : "Next Question"}
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="text-center py-12"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <div className="text-6xl mb-6">📝</div>
                                        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                                            No Assignment Found
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                                            There are no assignment questions available for this course.
                                        </p>
                                        <motion.button
                                            onClick={() => navigate(-1)}
                                            className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Go Back
                                        </motion.button>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
