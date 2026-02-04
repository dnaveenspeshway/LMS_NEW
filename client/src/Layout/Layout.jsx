import React, { useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Layout({ children, hideBar, hideNav, hideFooter }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = React.useCallback(() => setIsDrawerOpen(prev => !prev), []);
  const closeDrawer = React.useCallback(() => setIsDrawerOpen(false), []);

  return (
    <>
      <main className="bg-white dark:bg-base-200" style={{ minHeight: "100dvh" }}>
        <Sidebar
          hideBar={hideBar}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          closeDrawer={closeDrawer}
        >
          {/* navbar */}
          {!hideNav && <Navbar toggleDrawer={toggleDrawer} />}

          {/* main content */}
          {children}

          {/* footer */}
          {!hideFooter && <Footer />}
        </Sidebar>
      </main>
    </>
  );
}
