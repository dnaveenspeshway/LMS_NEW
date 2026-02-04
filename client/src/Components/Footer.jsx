import React from "react";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

export default function Footer() {
  const curDate = new Date();
  const year = curDate.getFullYear();
  return (
    <footer className="py-10 md:px-16 px-6 bg-white border-t border-gray-100 flex md:flex-row flex-col md:justify-between justify-center items-center gap-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
      <span className="text-lg font-medium text-text-secondary">
        Copyright {year} | All Right Reserved
      </span>
      <div className="flex gap-6 items-center">
        <a
          href="#"
          className="text-2xl text-text-secondary hover:text-primary-DEFAULT transition-colors duration-300"
        >
          <BsFacebook />
        </a>
        <a
          href="#"
          className="text-2xl text-text-secondary hover:text-primary-DEFAULT transition-colors duration-300"
        >
          <BsInstagram />
        </a>
        <a
          href="#"
          className="text-2xl text-text-secondary hover:text-primary-DEFAULT transition-colors duration-300"
        >
          <BsLinkedin />
        </a>
        <a
          href="#"
          className="text-2xl text-text-secondary hover:text-primary-DEFAULT transition-colors duration-300"
        >
          <BsTwitter />
        </a>
      </div>
    </footer>
  );
}
