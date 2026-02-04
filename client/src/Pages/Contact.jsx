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
    const loadingMessage = toast.loading("Sending message...");
    try {
      const res = await contactUs(userInput);
      toast.success(res?.data?.message, { id: loadingMessage });
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("Message sending failed! Try again", { id: loadingMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-16 px-4 min-h-screen relative overflow-hidden bg-gray-50">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-primary-DEFAULT to-secondary-DEFAULT rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 3 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          >
            <FiMessageSquare className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 text-text-primary">
            Get In <span className="text-primary-DEFAULT">Touch</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about our courses? Need help with your learning journey?
            We'd love to hear from you!
          </p>
        </motion.div>

        <motion.form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col gap-6 rounded-2xl md:py-10 py-8 md:px-10 px-6 md:w-[600px] w-full shadow-xl bg-white border border-gray-100 relative z-10"
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
            className="mt-4 btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
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
          className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl w-full relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
              <FiMail className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Quick Response
            </h3>
            <p className="text-text-secondary">
              We typically respond to all inquiries within 24 hours during business days.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 text-secondary-600">
              <FiMessageSquare className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Support Available
            </h3>
            <p className="text-text-secondary">
              Our support team is here to help with course recommendations and technical assistance.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}
