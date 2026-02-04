import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../Layout/Layout";
import { changePassword } from "../../Redux/Slices/AuthSlice";
import InputBox from "../../Components/InputBox/InputBox";
import { FaLock } from "react-icons/fa";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserPassword({
      ...userPassword,
      [name]: value,
    });
  }

  async function onChangePassword(event) {
    event.preventDefault();
    if (!userPassword.oldPassword || !userPassword.newPassword) {
      toast.error("Please fill all the details");
      return;
    }

    setIsLoading(true);
    
    const response = await dispatch(changePassword(userPassword));
    if (response?.payload?.success) {
      setUserPassword({
        oldPassword: "",
        newPassword: "",
      });
      navigate("/");
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
                <FaLock className="h-8 w-8 text-primary" />
             </div>
             <h2 className="text-3xl font-extrabold text-text-primary">
              Change Password
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
                Ensure your account is secure by updating your password.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={onChangePassword} noValidate>
            <InputBox
              label="Old Password"
              name="oldPassword"
              type="password"
              placeholder="Enter your old password..."
              onChange={handleUserInput}
              value={userPassword.oldPassword}
            />
            <InputBox
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter your new password..."
              onChange={handleUserInput}
              value={userPassword.newPassword}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>

            <div className="text-center mt-4">
                <Link
                    to="/user/profile"
                    className="font-medium text-primary hover:text-primary-dark transition-colors text-sm"
                >
                    &larr; Back to Profile
                </Link>
            </div>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
}
