import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../Layout/Layout";
import { forgetPassword } from "../../Redux/Slices/AuthSlice";
import InputBox from "../../Components/InputBox/InputBox";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPassword() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function onForgotPassword(event) {
    event.preventDefault();
    if (!email) {
      toast.error("Email is required to reset password!");
      return;
    }

    setIsLoading(true);

    const response = await dispatch(forgetPassword(email));
    if (response?.payload?.success) {
      setEmail("");
    }
    setIsLoading(false);
  }

  return (
    <Layout>
      <section className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="text-center">
             <div className="mx-auto h-16 w-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
                <FaEnvelope className="h-8 w-8 text-primary-DEFAULT" />
             </div>
             <h2 className="text-3xl font-extrabold text-text-primary">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
                Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={onForgotPassword} noValidate>
            <InputBox
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-DEFAULT to-primary-dark hover:from-primary-dark hover:to-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending Email..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-4">
                <Link
                    to="/login"
                    className="font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors text-sm"
                >
                    &larr; Back to Login
                </Link>
            </div>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
}
