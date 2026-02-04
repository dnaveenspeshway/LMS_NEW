import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../Layout/Layout";
import { resetPassword } from "../../Redux/Slices/AuthSlice";
import InputBox from "../../Components/InputBox/InputBox";
import { IoIosLock } from "react-icons/io";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");

  async function onChangePassword(event) {
    event.preventDefault();
    if (!password) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    const response = await dispatch(resetPassword({ resetToken, password }));
    if (response?.payload?.success) {
      setPassword("");
      navigate("/login");
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
                <IoIosLock className="h-8 w-8 text-primary-DEFAULT" />
             </div>
             <h2 className="text-3xl font-extrabold text-text-primary">
              Set New Password
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
                Create a strong password for your account.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={onChangePassword} noValidate>
            <InputBox
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter your new password..."
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-DEFAULT to-primary-dark hover:from-primary-dark hover:to-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>

            {isLoggedIn && (
                <div className="text-center mt-4">
                    <Link
                        to="/user/profile"
                        className="font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors text-sm"
                    >
                        &larr; Back to Profile
                    </Link>
                </div>
            )}
            {!isLoggedIn && (
                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        className="font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors text-sm"
                    >
                        &larr; Back to Login
                    </Link>
                </div>
            )}
          </form>
        </motion.div>
      </section>
    </Layout>
  );
}
