import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiMessageSquare, FiSend } from "react-icons/fi";

import { contactUs } from "../Helpers/api";
import { isEmail } from "../Helpers/regexMatcher";

import InputBox from "../Components/InputBox/InputBox";
import TextArea from "../Components/InputBox/TextArea";
import Layout from "../Layout/Layout";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!isEmail(userInput.email)) {
      toast.error("Invalid email");
      return;
    }

    setIsLoading(true);
    const loadingMessage = toast.loading("sending message...");
    try {
      const res = await contactUs(userInput);
      toast.success(res?.data?.message, { id: loadingMessage });
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("message sending failed! try again", { id: loadingMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-16 px-3 min-h-[100vh] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>

        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          >
            <FiMessageSquare className="text-white text-3xl" />
          </motion.div>
          <h1 className="gradient-text text-4xl font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions about our courses? Need help with your learning journey?
            We'd love to hear from you!
          </p>
        </motion.div>

        <motion.form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col dark:bg-base-100 gap-6 rounded-2xl md:py-10 py-8 md:px-10 px-6 md:w-[500px] w-full shadow-2xl backdrop-blur-lg bg-white/90 dark:bg-base-100/90 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <InputBox
              label={"Full Name"}
              name={"name"}
              type={"text"}
              placeholder={"Enter your full name..."}
              onChange={handleInputChange}
              value={userInput.name}
            />
          </motion.div>

          {/* email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <InputBox
              label={"Email Address"}
              name={"email"}
              type={"email"}
              placeholder={"Enter your email address..."}
              onChange={handleInputChange}
              value={userInput.email}
            />
          </motion.div>

          {/* message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TextArea
              label={"Your Message"}
              name={"message"}
              rows={5}
              placeholder={"Tell us how we can help you..."}
              onChange={handleInputChange}
              value={userInput.message}
            />
          </motion.div>

          {/* submit btn */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="mt-4 btn-accent hover:scale-105 transform transition-all duration-300 font-semibold text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Message...
              </>
            ) : (
              <>
                <FiSend className="text-lg" />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Contact info cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className="bg-white dark:bg-base-100 p-6 rounded-2xl shadow-xl backdrop-blur-lg"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <FiMail className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Quick Response
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We typically respond to all inquiries within 24 hours during business days.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-base-100 p-6 rounded-2xl shadow-xl backdrop-blur-lg"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mb-4">
              <FiMessageSquare className="text-secondary-600 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Support Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our support team is here to help with course recommendations and technical assistance.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}
