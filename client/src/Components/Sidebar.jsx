import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaBook, FaList, FaPlus } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const SidebarItem = ({ to, icon, label, onClick, closeDrawer, location }) => {
  const isActive = location.pathname === to;

  return (
    <li className="mb-2">
      <Link
        to={to}
        onClick={(event) => {
          if (closeDrawer) closeDrawer();
          onClick?.(event);
        }}
        className={`
          flex items-center gap-4 px-4 py-3 rounded-lg
          transition-all duration-300 ease-in-out
          ${isActive
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        `}
      >
        <span className={`text-xl ${isActive ? "text-yellow-300" : ""}`}>
          {icon}
        </span>
        <span className="font-semibold">{label}</span>
      </Link>
    </li>
  );
};

export default function Sidebar({ children, hideBar = false, isDrawerOpen, setIsDrawerOpen, closeDrawer }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (closeDrawer) closeDrawer();
  }, [location.pathname]);

  const onLogout = async function () {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isLoggedIn && !hideBar ? isDrawerOpen : false}
        disabled={!isLoggedIn || hideBar}
        onChange={(e) => setIsDrawerOpen(e.target.checked)}
      />
      <div className="drawer-content">
        {children}
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        {(isLoggedIn && !hideBar) && (
          <ul className="menu p-4 w-80 min-h-full bg-white dark:bg-gray-900 text-base-content shadow-xl border-r border-gray-200 dark:border-gray-700">
            {/* Close Button */}
            <li className="mb-4">
              <button onClick={closeDrawer} className="btn btn-sm btn-circle btn-ghost">
                <AiFillCloseCircle size={24} />
              </button>
            </li>

            {/* Menu Header */}
            <li className="mb-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-4 gradient-text">Menu</h2>
            </li>

            {/* Menu Items */}
            {role === "ADMIN" && (
              <>
                <SidebarItem
                  to="/admin/dashboard"
                  icon={<MdDashboard />}
                  label="Admin Dashboard"
                  location={location}
                  closeDrawer={closeDrawer}
                />
                <SidebarItem
                  to="/course/create"
                  icon={<FaPlus />}
                  label="Create Course"
                  location={location}
                  closeDrawer={closeDrawer}
                />
              </>
            )}

            <SidebarItem
              to="/courses"
              icon={<FaList />}
              label="All Courses"
              location={location}
              closeDrawer={closeDrawer}
            />

            {role === "USER" && (
              <SidebarItem
                to="/user/my-courses"
                icon={<FaBook />}
                label="My Courses"
                location={location}
                closeDrawer={closeDrawer}
              />
            )}

            <li className="mb-2 mt-auto">
              {/* Logout button or other items at bottom if needed */}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
