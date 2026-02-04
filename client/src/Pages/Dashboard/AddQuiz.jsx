import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addLectureQuiz, getCourseLectures } from "../../Redux/Slices/LectureSlice";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaTrash, FaEdit } from "react-icons/fa";
import { updateQuizInLecture, addQuizToCourse, deleteQuizFromLecture } from "../../Helpers/api";

export default function AddQuiz() {
    const courseDetails = useLocation().state;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { lectures } = useSelector((state) => state.lecture);

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

    const currentLecture = lectures?.find((l) => l._id === courseDetails?.lectureId);
    const existingQuizzes = currentLecture?.quizzes || [];

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

        if (courseDetails?.lectureId) {
            if (isEditing) {
                // UPDATE QUIZ
                try {
                    const res = await updateQuizInLecture(courseDetails._id, courseDetails.lectureId, isEditing, quizData);
                    if (res.data.success) {
                        toast.success("Quiz updated successfully");
                        setIsEditing(null);
                        dispatch(getCourseLectures(courseDetails._id));
                        setUserInput({
                            question: "",
                            option1: "",
                            option2: "",
                            option3: "",
                            option4: "",
                            correctAnswer: ""
                        });
                    }
                } catch (err) {
                    toast.error(err.response?.data?.message || "Failed to update quiz");
                }
            } else {
                // CREATE QUIZ
                const response = await dispatch(addLectureQuiz({ courseId: courseDetails._id, lectureId: courseDetails.lectureId, quizData }));
                if (response?.payload?.success) {
                    dispatch(getCourseLectures(courseDetails._id));
                    setUserInput({
                        question: "",
                        option1: "",
                        option2: "",
                        option3: "",
                        option4: "",
                        correctAnswer: ""
                    });
                }
            }
        } else {
            // Fallback for legacy global quiz adding (though AddAssignment handles this now)
            try {
                const res = await addQuizToCourse(courseDetails._id, quizData);
                if (res.data.success) {
                    toast.success("Quiz added successfully");
                    navigate(-1);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to add quiz");
            }
        }
    }

    async function handleDelete(quizId) {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;
        try {
            const res = await deleteQuizFromLecture(courseDetails._id, courseDetails.lectureId, quizId);
            if (res.data.success) {
                toast.success("Quiz deleted successfully");
                dispatch(getCourseLectures(courseDetails._id));
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete quiz");
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
            <section className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light dark:from-slate-900 dark:via-primary-900/20 dark:to-secondary-900/30 py-8 px-4 flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-3xl"
                >
                    <form onSubmit={onFormSubmit} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                        {/* Decorative background blobs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-light/50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                        <header className="flex items-center justify-between mb-8 relative z-10">
                            <motion.button 
                                type="button"
                                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors" 
                                onClick={() => navigate(-1)}
                                whileHover={{ x: -5 }}
                            >
                                <AiOutlineArrowLeft className="text-xl" />
                                <span className="font-medium">Back</span>
                            </motion.button>
                            <h1 className="text-2xl md:text-3xl font-bold text-text-primary text-center flex-1">
                                {isEditing ? "Edit Quiz Question" : "Add New Quiz"}
                            </h1>
                            <div className="w-20"></div> {/* Spacer for balance */}
                        </header>

                        <div className="flex flex-col gap-6 relative z-10">
                            <TextArea
                                label="Question"
                                name="question"
                                value={userInput.question}
                                onChange={handleInputChange}
                                placeholder="Enter the question"
                                className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-primary"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputBox label="Option 1" name="option1" value={userInput.option1} onChange={handleInputChange} className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-primary" />
                                <InputBox label="Option 2" name="option2" value={userInput.option2} onChange={handleInputChange} className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-primary" />
                                <InputBox label="Option 3" name="option3" value={userInput.option3} onChange={handleInputChange} className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-primary" />
                                <InputBox label="Option 4" name="option4" value={userInput.option4} onChange={handleInputChange} className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-primary" />
                            </div>
                            <InputBox
                                label="Correct Answer"
                                name="correctAnswer"
                                value={userInput.correctAnswer}
                                onChange={handleInputChange}
                                placeholder="Copy exact text of correct option"
                                className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 focus:border-primary"
                            />
                            
                            <div className="flex gap-4 mt-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-900 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {isEditing ? "Update Quiz" : "Add Quiz"}
                                </button>
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={cancelEdit} 
                                        className="w-1/3 bg-gray-100 text-text-secondary hover:bg-gray-200 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>

                {/* Display Existing Quizzes */}
                {courseDetails?.lectureId && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-3xl mt-8 flex flex-col gap-4"
                    >
                        <h2 className="text-2xl font-bold text-text-primary pl-2 border-l-4 border-secondary">
                            Existing Quizzes
                        </h2>
                        {existingQuizzes.length > 0 ? (
                            <div className="space-y-4">
                                {existingQuizzes.map((quiz, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow relative group"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(quiz)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(quiz._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                <FaTrash />
                                            </button>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                                Q{index + 1}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-lg text-text-primary mb-3">{quiz.question}</p>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                                    {quiz.options.map((opt, i) => (
                                                        <li key={i} className={`flex items-center gap-2 text-sm ${opt === quiz.correctAnswer ? "text-secondary font-medium" : "text-text-secondary"}`}>
                                                            <span className={`w-2 h-2 rounded-full ${opt === quiz.correctAnswer ? "bg-secondary" : "bg-gray-300"}`}></span>
                                                            {opt}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
                                <p className="text-text-secondary">No quizzes added for this lecture yet.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </section>
        </Layout>
    );
}
er3sze1 wae 1aswa1rtf