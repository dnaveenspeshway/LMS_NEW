import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../Layout/Layout";
import DeniedPng from '../assets/images/denied.png'

function Denied() {
  const navigate = useNavigate();
  return (
    <Layout hideBar={true} hideNav={true}>
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
        <motion.div
          className="flex flex-col items-center text-center max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative mb-8">
            <h1 className="text-9xl font-extrabold text-gray-200 tracking-widest select-none">
              403
            </h1>
            <div className="bg-red-500 text-white px-3 py-1 text-sm rounded absolute top-12 left-1/2 -translate-x-1/2 rotate-12 shadow-md">
              Access Denied
            </div>
          </div>

          <img 
            src={DeniedPng} 
            alt="Access Denied" 
            className="w-64 h-auto mb-8 drop-shadow-lg"
          />

          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Permission Restricted
          </h2>
          <p className="text-text-secondary mb-8">
            You do not have permission to view this page. Please contact the administrator if you believe this is an error.
          </p>

          <button 
            onClick={() => navigate(-2)}
            className="btn btn-primary px-8 py-3 bg-red-500 hover:bg-red-600 border-none"
          >
            Go Back
          </button>
        </motion.div>
      </section>
    </Layout>
  );
}

export default Denied;
