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
      <section className="flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 gradient-bg relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

        <motion.form
          onSubmit={onLogin}
          autoComplete="off"
          noValidate
          className="flex flex-col gap-6 rounded-2xl p-8 md:p-12 md:w-[480px] w-full bg-white shadow-xl relative z-10 border border-gray-100"
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
              Welcome Back
            </h1>
            <p className="text-text-secondary text-sm">
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
            className="mt-2 btn btn-primary w-full py-3 text-lg"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
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
            className="text-center text-text-secondary text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-DEFAULT hover:text-primary-dark font-semibold transition-colors duration-200"
            >
              Sign up here
            </Link>
          </motion.p>
        </motion.form>
      </section>
    </Layout>
  );
}
