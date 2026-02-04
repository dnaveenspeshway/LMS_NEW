import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserData } from "../../Redux/Slices/AuthSlice";
import { motion } from "framer-motion";
import InputBox from "../../Components/InputBox/InputBox";
import { FaUserCircle, FaUser } from "react-icons/fa";
import { IoIosLock, IoIosRefresh } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userInput, setUserInput] = useState({
    name: userData?.fullName || "",
    avatar: null,
    previewImage: null,
    userId: userData?._id || null,
  });
  const avatarInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isChanged = userInput.name !== userData?.fullName || !!userInput.avatar;

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
          avatar: uploadImage,
        });
      });
    }
  }

  async function onFormSubmit(e) {
    setIsUpdating(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", userInput.name);
    if (userInput.avatar) {
      formData.append("avatar", userInput.avatar);
    }
    const data = { formData, id: userInput.userId };
    const response = await dispatch(updateUserData(data));
    if (response?.payload?.success) {
      await dispatch(getUserData());
      setUserInput((prev) => ({
        ...prev,
        avatar: null,
        previewImage: null,
      }));
    }
    setIsUpdating(false);
  }

  async function handleCancelSubscription() {
    const res = await dispatch(cancelCourseBundle());
    if (res?.payload?.success) {
      await dispatch(getUserData());
    }
  }

  useEffect(() => {
    if (!userData || Object.keys(userData).length < 1) {
      dispatch(getUserData());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setUserInput((prev) => ({
        ...prev,
        name: userData?.fullName || "",
        userId: userData?._id || null,
      }));
    }
  }, [userData]);

  return (
    <Layout hideFooter={true}>
      <section className="min-h-screen py-12 px-4 lg:px-8 relative overflow-hidden bg-white">
        {/* Background elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-DEFAULT to-secondary-DEFAULT rounded-full mb-6 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            >
              <FaUser className="text-white text-3xl" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              User Profile
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <motion.form
            onSubmit={onFormSubmit}
            autoComplete="off"
            noValidate
            className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Avatar and more options */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden cursor-pointer ring-4 ring-primary-100 hover:ring-primary-200 transition-all duration-300"
                  onClick={() => avatarInputRef.current.click()}
                >
                  {userData?.avatar?.secure_url || userInput.previewImage ? (
                    <img
                      src={
                        userInput.previewImage
                          ? userInput.previewImage
                          : userData?.avatar?.secure_url
                      }
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-full w-full text-gray-300" />
                  )}
                  <input
                    type="file"
                    accept=".png, .jpeg, .jpg"
                    className="hidden"
                    ref={avatarInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
                {/* more options */}
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
                  onClick={() => setIsDialogOpen((prev) => !prev)}
                >
                  <FiMoreVertical size={16} className="text-text-secondary" />
                </button>

                <dialog
                  open={isDialogOpen}
                  className="bg-white transition-all duration-500 border border-gray-100 rounded-xl py-3 shadow-xl w-fit absolute right-0 top-10 z-50"
                >
                  <div className="w-full flex flex-col gap-1 items-start min-w-[160px]">
                    <button
                      type="button"
                      className="text-text-primary w-full flex items-center gap-3 px-4 py-2 hover:bg-primary-light transition-colors text-sm"
                      onClick={() => navigate("change-password")}
                    >
                      <IoIosLock /> Change password
                    </button>
                    <button
                      type="button"
                      className="text-red-500 w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-sm"
                      onClick={() => navigate("reset-password")}
                    >
                      <IoIosRefresh /> Reset password
                    </button>
                  </div>
                </dialog>
              </div>
            </div>

          <div className="w-full flex flex-wrap gap-6">
            {/* name */}
            <InputBox
              label={"Name"}
              name={"name"}
              type={"text"}
              placeholder={"Enter fullName"}
              value={userInput.name}
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              className="md:w-[48%] w-[100%]"
            />

            {/* email */}
            <InputBox
              label={"Email"}
              name={"email"}
              type={"email"}
              value={userData?.email || ""}
              className="md:w-[48%] w-[100%]"
              disabled={true}
            />
            {/* role */}
            <InputBox
              label={"Role"}
              name={"role"}
              type={"text"}
              value={userData?.role}
              className="md:w-[48%] w-[100%]"
              disabled={true}
            />
            {/* subscription */}
            <InputBox
              label={"Subscription"}
              name={"subscription"}
              type={"text"}
              value={userData?.subscription?.status || "Not-Active"}
              className="md:w-[48%] w-[100%]"
              disabled={true}
            />
          </div>
            {/* submit button */}
            <motion.button
              type="submit"
              disabled={!isChanged || isUpdating}
              className="mt-6 btn btn-primary py-3 px-8 text-lg w-full md:w-auto flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUpdating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FaUser className="text-sm" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>

            {/* show cancel subscription btn if Active */}
            {userData?.subscription?.status === "active" && (
              <motion.button
                type="button"
                onClick={handleCancelSubscription}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-lg w-full md:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Cancel Subscription</span>
              </motion.button>
            )}
          </motion.form>
        </div>
      </section>
    </Layout>
  );
}