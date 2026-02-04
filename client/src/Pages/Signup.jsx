import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { BsPersonCircle, BsCloudUpload } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { createAccount } from "../Redux/Slices/AuthSlice";
import InputBox from "../Components/InputBox/InputBox";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function getImage(event) {
    event.preventDefault();
    // getting the image
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(event) {
    event.preventDefault();
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast.error("Please fill all the details");
      return;
    }

    // checking name field length
    if (signupData.fullName.length < 3) {
      toast.error("Name should be atleast of 3 characters");
      return;
    }
    // checking valid email
    if (!signupData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      toast.error("Invalid email id");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // dispatch create account action
    const response = await dispatch(createAccount(formData));
    if (response?.payload?.success) {
      setSignupData({
        fullName: "",
        email: "",
        password: "",
        avatar: "",
      });
      setPreviewImage("");

      navigate("/");
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-16 px-3 min-h-[100vh] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>

        <motion.form
          onSubmit={createNewAccount}
          autoComplete="off"
          noValidate
          className="flex flex-col dark:bg-base-100 gap-6 rounded-2xl md:py-10 py-8 md:px-10 px-6 md:w-[500px] w-full shadow-2xl backdrop-blur-lg bg-white/90 dark:bg-base-100/90 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="gradient-text text-4xl font-bold mb-2">
              Join Our Learning Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create your account and start your learning journey
            </p>
          </motion.div>

          {/* name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <InputBox
              label={"Full Name"}
              name={"fullName"}
              type={"text"}
              placeholder={"Enter your full name..."}
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </motion.div>

          {/* email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <InputBox
              label={"Email"}
              name={"email"}
              type={"email"}
              placeholder={"Enter your email..."}
              onChange={handleUserInput}
              value={signupData.email}
            />
          </motion.div>

          {/* password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <InputBox
              label={"Password"}
              name={"password"}
              type={"password"}
              placeholder={"Enter your password..."}
              onChange={handleUserInput}
              value={signupData.password}
            />
          </motion.div>

          {/* avatar */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <BsCloudUpload className="text-primary-500" />
              Profile Picture
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                (Optional)
              </span>
            </label>
            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-400 transition-colors duration-200">
              <div className="relative">
                {previewImage ? (
                  <img
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                    src={previewImage}
                    alt="Preview"
                  />
                ) : (
                  <BsPersonCircle className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  onChange={getImage}
                  className="hidden"
                  type="file"
                  name="image_uploads"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png, image/*"
                />
                <label
                  htmlFor="image_uploads"
                  className="cursor-pointer text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                >
                  Choose an image
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
          </motion.div>

          {/* submit btn */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="mt-4 btn-secondary hover:scale-105 transform transition-all duration-300 font-semibold text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </motion.button>

          {/* link */}
          <motion.p
            className="text-center font-medium text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-semibold transition-colors duration-200"
            >
              Sign in here
            </Link>
          </motion.p>
        </motion.form>
      </section>
    </Layout>
  );
}
