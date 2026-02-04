import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaTrash, FaEdit, FaPlus, FaQuestionCircle, FaCheck, FaArrowLeft, FaListUl } from "react-icons/fa";
import { updateQuizInCourse, addQuizToCourse, deleteQuizFromCourse } from "../../Helpers/api";
import { getCourseLectures } from "../../Redux/Slices/LectureSlice";

export default function AddAssignment() {
    const courseDetails = useLocation().state;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state) => state.lecture);

    const [userInput, setUserInput] = useState({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: ""
    });

    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        if (courseDetails?._id) {
            dispatch(getCourseLectures(courseDetails._id));
        }
    }, [courseDetails, dispatch]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserInput({ ...userInput, [name]: value });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userInput.question || !userInput.option1 || !userInput.option2 || !userInput.option3 || !userInput.option4 || !userInput.correctAnswer) {
            toast.error("All fields are required");
            return;
        }

        const options = [userInput.option1, userInput.option2, userInput.option3, userInput.option4];
        if (!options.includes(userInput.correctAnswer)) {
            toast.error("Correct answer must match one of the options");
            return;
        }

        const quizData = {
            question: userInput.question,
            options: options,
            correctAnswer: userInput.correctAnswer
        };

        try {
            if (isEditing) {
                const res = await updateQuizInCourse(courseDetails._id, isEditing, quizData);
                if (res.data.success) {
                    toast.success("Assignment updated successfully");
                    setIsEditing(null);
                }
            } else {
                const res = await addQuizToCourse(courseDetails._id, quizData);
                if (res.data.success) {
                    toast.success("Assignment question added successfully");
                }
            }

            // Reset and Refresh
            dispatch(getCourseLectures(courseDetails._id));
            setUserInput({
                question: "",
                option1: "",
                option2: "",
                option3: "",
                option4: "",
                correctAnswer: ""
            });

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save assignment");
        }
    }

    async function handleDelete(quizId) {
        if (!window.confirm("Are you sure you want to delete this assignment question?")) return;
        try {
            const res = await deleteQuizFromCourse(courseDetails._id, quizId);
            if (res.data.success) {
                toast.success("Assignment deleted successfully");
                dispatch(getCourseLectures(courseDetails._id));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete assignment");
        }
    }

    function handleEdit(quiz) {
        setIsEditing(quiz._id);
        setUserInput({
            question: quiz.question,
            option1: quiz.options[0],
            option2: quiz.options[1],
            option3: quiz.options[2],
            option4: quiz.options[3],
            correctAnswer: quiz.correctAnswer
        });
        // Scroll to top
        window.scrollTo(0, 0);
    }

    function cancelEdit() {
        setIsEditing(null);
        setUserInput({
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctAnswer: ""
        });
    }

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
                                    {isEditing ? "Edit Assignment Question" : "Add New Assignment"}
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm font-medium">
                                    📝 Create final assessment questions
                                </p>
                            </div>

                            {/* Spacer for balance */}
                            <div className="w-24"></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Add/Edit Form */}
                        <motion.div
                            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-600/30 shadow-2xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <form onSubmit={onFormSubmit} className="space-y-8">
                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                        <FaQuestionCircle className="text-white text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        {isEditing ? "Edit Question" : "Create New Question"}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        This question will be part of the Final Course Assignment
                                    </p>
                                </div>

                                {/* Question Input */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <div>
                                        <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <FaQuestionCircle className="text-purple-500" />
                                            Question
                                        </label>
                                        <textarea
                                            name="question"
                                            rows={4}
                                            value={userInput.question}
                                            onChange={handleInputChange}
                                            placeholder="Enter a clear, engaging question for the assignment..."
                                            className="w-full px-6 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 resize-none text-lg"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                {/* Options Grid */}
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <FaListUl className="text-blue-500" />
                                            Answer Options
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Option A
                                                </label>
                                                <input
                                                    type="text"
                                                    name="option1"
                                                    value={userInput.option1}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter first option"
                                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Option B
                                                </label>
                                                <input
                                                    type="text"
                                                    name="option2"
                                                    value={userInput.option2}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter second option"
                                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="pt-8">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Option C
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="option3"
                                                        value={userInput.option3}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter third option"
                                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Option D
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="option4"
                                                        value={userInput.option4}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter fourth option"
                                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Correct Answer */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <div>
                                        <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <FaCheck className="text-green-500" />
                                            Correct Answer
                                        </label>
                                        <input
                                            type="text"
                                            name="correctAnswer"
                                            value={userInput.correctAnswer}
                                            onChange={handleInputChange}
                                            placeholder="Copy the exact text of the correct option above"
                                            className="w-full px-6 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 text-lg"
                                            required
                                        />
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                            Must exactly match one of the options above
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Submit Buttons */}
                                <motion.div
                                    className="pt-6 border-t border-slate-200 dark:border-slate-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                >
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                                        >
                                            <FaPlus className="text-xl" />
                                            <span>{isEditing ? "Update Question" : "Add Question"}</span>
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                            >
                                                <span>Cancel</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            </form>
                        </motion.div>

                        {/* Existing Questions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-600/30 shadow-2xl overflow-hidden">
                                <div className="p-8 border-b border-slate-200/60 dark:border-slate-600/30">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <FaListUl className="text-white text-xl" />
                                        </div>
                                        Existing Questions ({quizzes?.length || 0})
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                                        Review and manage your assignment questions
                                    </p>
                                </div>

                                <div className="p-8">
                                    {quizzes && quizzes.length > 0 ? (
                                        <div className="space-y-6">
                                            {quizzes.map((quiz, index) => (
                                                <motion.div
                                                    key={quiz._id}
                                                    className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-600/30 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-600/20 hover:shadow-lg transition-all duration-300"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                                    Question {index + 1}
                                                                </h3>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    Assignment Question
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                onClick={() => handleEdit(quiz)}
                                                                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-colors duration-200"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaEdit className="text-sm" />
                                                            </motion.button>

                                                            <motion.button
                                                                onClick={() => handleDelete(quiz._id)}
                                                                className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-colors duration-200"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaTrash className="text-sm" />
                                                            </motion.button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <p className="text-slate-900 dark:text-white font-medium text-lg leading-relaxed">
                                                            {quiz.question}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {quiz.options.map((option, optIndex) => (
                                                            <div
                                                                key={optIndex}
                                                                className={`p-3 rounded-xl border transition-all duration-200 ${
                                                                    option === quiz.correctAnswer
                                                                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200"
                                                                        : "bg-white dark:bg-slate-600 border-slate-200 dark:border-slate-500 text-slate-700 dark:text-slate-300"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                                                        option === quiz.correctAnswer
                                                                            ? "bg-green-500 text-white"
                                                                            : "bg-slate-300 dark:bg-slate-500 text-slate-600 dark:text-slate-300"
                                                                    }`}>
                                                                        {String.fromCharCode(65 + optIndex)}
                                                                    </span>
                                                                    <span className="flex-1 font-medium">{option}</span>
                                                                    {option === quiz.correctAnswer && (
                                                                        <FaCheck className="text-green-500" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <FaQuestionCircle className="text-slate-400 text-2xl" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                No Questions Yet
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Start building your assignment by adding the first question above
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
