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
            <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light dark:from-slate-900 dark:via-primary-900/20 dark:to-secondary-900/30">
                {/* Header */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-5">
                        <div className="flex items-center justify-between">
                            {/* Back Button - Left Side */}
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-secondary-DEFAULT border border-secondary-DEFAULT rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaArrowLeft className="text-sm" />
                                <span className="text-sm">Back</span>
                            </motion.button>

                            {/* Centered Content */}
                            <div className="flex-1 text-center">
                                <h1 className="text-3xl font-bold text-text-primary">
                                    {isEditing ? "Edit Assignment Question" : "Add New Assignment"}
                                </h1>
                                <p className="text-text-secondary mt-1 text-sm font-medium">
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
                                    <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                        <FaQuestionCircle className="text-primary-DEFAULT text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                                        {isEditing ? "Edit Question" : "Create New Question"}
                                    </h2>
                                    <p className="text-text-secondary">
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
                                        <label className="block text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                                            <FaQuestionCircle className="text-primary-DEFAULT" />
                                            Question
                                        </label>
                                        <textarea
                                            name="question"
                                            rows={4}
                                            value={userInput.question}
                                            onChange={handleInputChange}
                                            placeholder="Enter a clear, engaging question for the assignment..."
                                            className="w-full px-6 py-4 border border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent bg-white dark:bg-slate-700 text-text-primary transition-all duration-200 resize-none text-lg"
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
                                        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                            <FaListUl className="text-secondary-DEFAULT" />
                                            Answer Options
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Option A
                                                </label>
                                                <input
                                                    type="text"
                                                    name="option1"
                                                    value={userInput.option1}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter first option"
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent bg-white dark:bg-slate-700 text-text-primary transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Option B
                                                </label>
                                                <input
                                                    type="text"
                                                    name="option2"
                                                    value={userInput.option2}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter second option"
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent bg-white dark:bg-slate-700 text-text-primary transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="pt-8">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Option C
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="option3"
                                                        value={userInput.option3}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter third option"
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent bg-white dark:bg-slate-700 text-text-primary transition-all duration-200"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Option D
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="option4"
                                                        value={userInput.option4}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter fourth option"
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent bg-white dark:bg-slate-700 text-text-primary transition-all duration-200"
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
                                        <label className="block text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                                            <FaCheck className="text-secondary-DEFAULT" />
                                            Correct Answer
                                        </label>
                                        <input
                                            type="text"
                                            name="correctAnswer"
                                            value={userInput.correctAnswer}
                                            onChange={handleInputChange}
                                            placeholder="Copy the exact text of the correct option above"
                                            className="w-full px-6 py-4 border border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-secondary-DEFAULT focus:border-transparent bg-white dark:bg-slate-700 text-text-primary transition-all duration-200 text-lg"
                                            required
                                        />
                                        <p className="text-sm text-text-secondary mt-2">
                                            Must exactly match one of the options above
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Submit Buttons */}
                                <motion.div
                                    className="pt-6 border-t border-gray-200 dark:border-slate-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                >
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-primary-DEFAULT to-primary-dark hover:from-primary-dark hover:to-primary-900 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                                        >
                                            <FaPlus className="text-xl" />
                                            <span>{isEditing ? "Update Question" : "Add Question"}</span>
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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
                                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-text-primary">
                                        Added Questions ({quizzes?.length || 0})
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {quizzes?.map((quiz, idx) => (
                                        <div key={quiz._id} className="p-6 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-DEFAULT flex items-center justify-center font-bold text-sm">
                                                            {idx + 1}
                                                        </span>
                                                        <h4 className="font-semibold text-lg text-text-primary">{quiz.question}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-11">
                                                        {quiz.options.map((option, i) => (
                                                            <div key={i} className={`flex items-center gap-2 text-sm ${option === quiz.correctAnswer ? 'text-secondary-DEFAULT font-medium' : 'text-text-secondary'}`}>
                                                                <div className={`w-2 h-2 rounded-full ${option === quiz.correctAnswer ? 'bg-secondary-DEFAULT' : 'bg-gray-300'}`}></div>
                                                                {option}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(quiz)}
                                                        className="p-2 text-primary-DEFAULT hover:bg-primary-light rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(quiz._id)}
                                                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {quizzes?.length === 0 && (
                                        <div className="p-12 text-center text-text-secondary">
                                            <FaQuestionCircle className="mx-auto text-4xl mb-3 opacity-20" />
                                            <p>No questions added yet</p>
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
