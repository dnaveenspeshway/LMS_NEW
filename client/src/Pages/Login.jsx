import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { login } from "../Redux/Slices/AuthSlice";
import InputBox from "../Components/InputBox/InputBox";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details");
      return;
    }

    setIsLoading(true);
    const Data = { email: loginData.email, password: loginData.password };

    // dispatch create account action
    const response = await dispatch(login(Data));
    if (response?.payload?.success) {
      setLoginData({
        email: "",
        password: "",
      });
      navigate("/");
    }
    setIsLoading(false);
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-16 px-3 min-h-[100vh] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>

        <motion.form
          onSubmit={onLogin}
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
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in to your account to continue learning
            </p>
          </motion.div>

          {/* email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <InputBox
              label={"Email"}
              name={"email"}
              type={"email"}
              placeholder={"Enter your email..."}
              onChange={handleUserInput}
              value={loginData.email}
            />
          </motion.div>

          {/* password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <InputBox
              label={"Password"}
              name={"password"}
              type={"password"}
              placeholder={"Enter your password..."}
              onChange={handleUserInput}
              value={loginData.password}
            />
          </motion.div>

          {/* submit btn */}
          <motion.button
            type="submit"
            className="mt-4 btn-primary hover:scale-105 transform transition-all duration-300 font-semibold text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </motion.button>

          {/* link */}
          <motion.p
            className="text-center font-medium text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors duration-200"
            >
              Sign up here
            </Link>
          </motion.p>
        </motion.form>
      </section>
    </Layout>
  );
}
