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
          transition-all duration-200 ease-in-out font-medium
          ${isActive
            ? "bg-secondary-light text-secondary-900 shadow-sm"
            : "text-text-secondary hover:bg-gray-50 hover:text-primary-DEFAULT"
          }
        `}
      >
        <span className={`text-xl ${isActive ? "text-secondary-600" : ""}`}>
          {icon}
        </span>
        <span>{label}</span>
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
          <ul className="menu p-4 w-80 min-h-full bg-white text-base-content shadow-xl border-r border-gray-100">
            {/* Close Button */}
            <li className="mb-4 flex justify-end">
              <button onClick={closeDrawer} className="btn btn-ghost btn-circle text-text-secondary hover:bg-gray-100">
                <AiFillCloseCircle size={28} />
              </button>
            </li>

            {/* Menu Header */}
            <li className="mb-6 px-4">
              <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Menu</h2>
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
          </ul>
        )}
      </div>
    </div>
  );
}
