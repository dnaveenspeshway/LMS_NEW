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
    <nav className="sticky top-0 z-50 md:h-[80px] h-[70px] md:px-[45px] px-[25px] bg-primary-light/90 backdrop-blur-md border-b border-white/50 shadow-sm flex justify-between items-center transition-all duration-300">
      {/* Header */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <button onClick={toggleDrawer} className="p-2 rounded-lg hover:bg-white/50 text-primary transition-all duration-300">
                <FiMenu size={"26px"} />
              </button>
            )}
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity">
              LMS
            </Link>
        </div>

        {/* Middle section: Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-text-secondary font-medium hover:text-primary transition-colors duration-200">
            Home
          </Link>
          <Link to="/about" className="text-text-secondary font-medium hover:text-primary transition-colors duration-200">
            About Us
          </Link>
          <Link to="/contact" className="text-text-secondary font-medium hover:text-primary transition-colors duration-200">
            Contact Us
          </Link>
        </div>

        {/* Right section: Login/Logout buttons */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/user/profile" className="hidden md:block text-primary font-medium hover:text-primary-dark transition-colors">
                Profile
              </Link>
              <button onClick={onLogout} className="btn btn-primary py-2 px-5 text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-text-primary font-medium hover:text-primary transition-colors px-4 py-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary py-2 px-6 text-sm shadow-md hover:shadow-lg">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
