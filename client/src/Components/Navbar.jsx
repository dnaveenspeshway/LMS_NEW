import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/AuthSlice";
import { FiMenu } from "react-icons/fi";

export default function Navbar({ toggleDrawer }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const onLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 md:h-[85px] h-[75px] md:px-[45px] px-[25px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-blue-200/30 dark:border-gray-700/30 shadow-lg flex justify-between items-center rounded-b-3xl">
      {/* Left section: Sidebar toggle and Logo */}
      <div className="flex items-center gap-3">
        {isLoggedIn && (
          <button onClick={toggleDrawer} className="p-2.5 rounded-full bg-blue-100/80 hover:bg-blue-200/80 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-blue-300/30">
            <FiMenu size={"28px"} className="text-blue-700" />
          </button>
        )}
        <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LMS</div>
      </div>

      {/* Middle section: Navigation links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md backdrop-blur-sm border border-transparent hover:border-blue-200/50 group">
          <span className="relative z-10">Home</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <Link to="/about" className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md backdrop-blur-sm border border-transparent hover:border-blue-200/50 group relative">
          <span className="relative z-10">About Us</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <Link to="/contact" className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md backdrop-blur-sm border border-transparent hover:border-blue-200/50 group relative">
          <span className="relative z-10">Contact Us</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>

      {/* Right section: Login/Logout buttons */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/user/profile" className="bg-blue-50/80 backdrop-blur-sm text-blue-700 px-5 py-2.5 font-bold rounded-xl hover:bg-blue-100/80 transition-all duration-300 transform hover:scale-105 border border-blue-200/50 shadow-sm hover:shadow-md">
              Profile
            </Link>
            <button onClick={onLogout} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-50/80 backdrop-blur-sm text-blue-700 px-5 py-2.5 font-bold rounded-xl hover:bg-blue-100/80 transition-all duration-300 transform hover:scale-105 border border-blue-200/50 shadow-sm hover:shadow-md">
              Login
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
