import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaCheckCircle, FaBookOpen } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";

export default function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [learningObjectives, setLearningObjectives] = useState([""]);
  const [userInput, setUserInput] = useState({
    title: "",
    category: "",
    createdBy: "",
    description: "",
    thumbnail: null,
    previewImage: "",
    price: "",
  });

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];
    if (uploadImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadImage,
        });
      });
    }
  }

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleLearningObjectiveChange(index, value) {
    const updatedObjectives = [...learningObjectives];
    updatedObjectives[index] = value;
    setLearningObjectives(updatedObjectives);
  }

  function addLearningObjective() {
    setLearningObjectives([...learningObjectives, ""]);
  }

  function removeLearningObjective(index) {
    if (learningObjectives.length > 1) {
      const updatedObjectives = learningObjectives.filter((_, i) => i !== index);
      setLearningObjectives(updatedObjectives);
    }
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (
      !userInput.title ||
      !userInput.description ||
      !userInput.category ||
      !userInput.createdBy ||
      !userInput.thumbnail ||
      !userInput.price
    ) {
      toast.error("All field are required!");
      return;
    }

    setIsCreatingCourse(true);
    const formData = new FormData();
    formData.append("title", userInput.title);
    formData.append("description", userInput.description);
    formData.append("category", userInput.category);
    formData.append("createdBy", userInput.createdBy);
    formData.append("price", userInput.price);
    formData.append("thumbnail", userInput.thumbnail);

    // Add learning objectives
    const filteredObjectives = learningObjectives.filter(obj => obj.trim() !== "");
    if (filteredObjectives.length > 0) {
      formData.append("learningObjectives", JSON.stringify(filteredObjectives));
    }

    const response = await dispatch(createNewCourse(formData));
    if (response?.payload?.success) {
      setUserInput({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: "",
        price: "",
      });
      navigate("/courses");
    }
    setIsCreatingCourse(false);
  }

  return (
    <Layout>
      <section className="min-h-screen py-12 px-4 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            >
              <FaBookOpen className="text-white text-3xl" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Create New Course
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Share your knowledge and build an amazing learning experience for students worldwide
            </p>
          </motion.div>

          <motion.form
            onSubmit={onFormSubmit}
            autoComplete="off"
            noValidate
            className="bg-white dark:bg-base-100 rounded-2xl shadow-2xl p-8 lg:p-12 backdrop-blur-lg border border-gray-100 dark:border-base-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
          <div className="w-full flex md:flex-row md:justify-between justify-center flex-col md:gap-0 gap-5">
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* thumbnail */}
              <div className="border border-gray-300">
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {userInput.previewImage ? (
                    <img
                      className="w-full h-44 m-auto"
                      src={userInput.previewImage}
                    />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center">
                      <h1 className="font-bold text-lg">
                        Upload your course thumbnail
                      </h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png"
                  name="image_uploads"
                  onChange={handleImageUpload}
                />
              </div>
              {/* title */}
              <InputBox
                label={"Title"}
                name={"title"}
                type={"text"}
                placeholder={"Enter Course Title"}
                onChange={handleUserInput}
                value={userInput.title}
              />
              <InputBox
                label={"Price"}
                name={"price"}
                type={"number"}
                placeholder={"Enter Course Price"}
                onChange={handleUserInput}
                value={userInput.price}
              />
            </div>
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* instructor */}
              <InputBox
                label={"Instructor"}
                name={"createdBy"}
                type={"text"}
                placeholder={"Enter Course instructor"}
                onChange={handleUserInput}
                value={userInput.createdBy}
              />
              {/* category */}
              <InputBox
                label={"Category"}
                name={"category"}
                type={"text"}
                placeholder={"Enter Course Category"}
                onChange={handleUserInput}
                value={userInput.category}
              />
              {/* description */}
              <TextArea
                label={"Description"}
                name={"description"}
                rows={3}
                type={"text"}
                placeholder={"Enter Course Description"}
                onChange={handleUserInput}
                value={userInput.description}
              />
            </div>
          </div>

          {/* What You'll Learn Section */}
          <motion.div
            className="w-full space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <FaBookOpen className="text-blue-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                What You'll Learn
              </h2>
            </div>

            <div className="space-y-3">
              {learningObjectives.map((objective, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => handleLearningObjectiveChange(index, e.target.value)}
                    placeholder={`Learning objective ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-base-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-base-100 text-gray-900 dark:text-white"
                  />
                  {learningObjectives.length > 1 && (
                    <motion.button
                      type="button"
                      onClick={() => removeLearningObjective(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={addLearningObjective}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="text-sm" />
              <span>Add Learning Objective</span>
            </motion.button>
          </motion.div>

          {/* submit btn */}
            <motion.button
              type="submit"
              disabled={isCreatingCourse}
              className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCreatingCourse ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Course...</span>
                </>
              ) : (
                <>
                  <FaBookOpen className="text-sm" />
                  <span>Create Course</span>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
}
