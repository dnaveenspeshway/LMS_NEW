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
      <section className="flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 gradient-bg relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

        <motion.form
          onSubmit={createNewAccount}
          autoComplete="off"
          noValidate
          className="flex flex-col gap-6 rounded-2xl p-8 md:p-12 md:w-[500px] w-full bg-white shadow-xl relative z-10 border border-gray-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Join Our Community
            </h1>
            <p className="text-text-secondary text-sm">
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
            <label className="font-semibold text-text-primary flex items-center gap-2">
              <BsCloudUpload className="text-primary-DEFAULT" />
              Profile Picture
              <span className="text-sm text-text-secondary font-normal">
                (Optional)
              </span>
            </label>
            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-400 transition-colors duration-200 bg-gray-50">
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
                  className="cursor-pointer bg-white text-primary-DEFAULT border border-primary-200 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm shadow-sm"
                >
                  Choose File
                </label>
              </div>
            </div>
          </motion.div>

          {/* submit btn */}
          <motion.button
            type="submit"
            className="mt-2 btn btn-primary w-full py-3 text-lg"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </motion.button>

          {/* link */}
          <motion.p
            className="text-center text-text-secondary text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-DEFAULT hover:text-primary-dark font-semibold transition-colors duration-200"
            >
              Log in here
            </Link>
          </motion.p>
        </motion.form>
      </section>
    </Layout>
  );
}
