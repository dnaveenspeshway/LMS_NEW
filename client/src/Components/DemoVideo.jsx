import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FaGraduationCap, FaFingerprint } from 'react-icons/fa';
import { FiArrowRight, FiAward, FiCheck, FiClock, FiLayers, FiLock, FiMail, FiPlay, FiStar, FiX, FiCpu, FiActivity, FiGlobe, FiPause, FiSkipBack, FiSkipForward } from 'react-icons/fi';

// --- Cinematic Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const staggerSlow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } }
};

const softZoom = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(4px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(8px)', transition: { duration: 0.8 } }
};

const magneticPull = {
  hover: { scale: 1.02, x: 2, transition: { type: 'spring', stiffness: 400, damping: 10 } }
};

const aiGlowPulse = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(6,182,212,0)",
      "0 0 20px rgba(6,182,212,0.4)",
      "0 0 0px rgba(6,182,212,0)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const cameraShake = {
  initial: { x: 0 },
  shake: {
    x: [0, -5, 5, -3, 3, 0],
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// --- Helper Components ---

const Cursor = ({ from = { x: 0, y: 0 }, to = { x: 0, y: 0 }, delay = 0.5, duration = 1, clickAt = null }) => (
  <motion.div
    initial={{ opacity: 0, x: from.x, y: from.y }}
    animate={{ 
      opacity: [0, 1, 1, 0],
      x: [from.x, to.x],
      y: [from.y, to.y],
      scale: clickAt ? [1, 1, 0.8, 1] : 1
    }}
    transition={{
      opacity: { duration: duration + 1.5, times: [0, 0.1, 0.9, 1], delay },
      x: { duration: duration, ease: "easeInOut", delay },
      y: { duration: duration, ease: "easeInOut", delay },
      scale: clickAt ? { delay: delay + duration * clickAt, duration: 0.3 } : {}
    }}
    className="absolute z-50 pointer-events-none drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </motion.div>
);

const Particle = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
    animate={{ 
      opacity: [0, 1, 0], 
      scale: [0, 1.5, 0], 
      y: [0, Math.random() * -100], 
      x: [0, (Math.random() - 0.5) * 100] 
    }}
    transition={{ duration: 3, repeat: Infinity, delay: delay, ease: "easeOut" }}
    className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
    style={{ left: `${50 + (Math.random() - 0.5) * 20}%`, top: `${50 + (Math.random() - 0.5) * 20}%` }}
  />
);

const ParallaxBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <motion.div
      animate={{ 
        x: [-20, 20, -20], 
        y: [-10, 10, -10],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_70%)]"
    />
  </div>
);

// --- Main Component ---

const DemoVideo = ({ isOpen, onClose }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = useMemo(() => ([
    { title: "The Journey Begins", duration: 5000, component: OpeningScene },
    { title: "Smart Login", duration: 6000, component: LoginScene },
    { title: "Living Dashboard", duration: 7000, component: DashboardScene },
    { title: "Explore Courses", duration: 6000, component: CoursesScene },
    { title: "Course World", duration: 7000, component: CourseWorldScene },
    { title: "Assignment Challenge", duration: 7000, component: AssignmentScene },
    { title: "Achievement Moment", duration: 5000, component: AchievementScene },
    { title: "Certification Reveal", duration: 7000, component: CertificationScene },
    { title: "Empowered Future", duration: 6000, component: FinalScene }
  ]), []);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentScene(0);
    } else {
      setIsPlaying(false);
      setCurrentScene(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isPlaying && currentScene < scenes.length) {
      const timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
      }, scenes[currentScene].duration);
      return () => clearTimeout(timer);
    } else if (currentScene >= scenes.length) {
      const timer = setTimeout(() => {
        setCurrentScene(0);
        setIsPlaying(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScene, isPlaying, isOpen, scenes, onClose]);

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentScene(0);
    onClose();
  };

  const CurrentSceneComponent = scenes[currentScene]?.component;
  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full bg-[#0B1120] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cinematic Letterbox Bars */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />

            {/* UI Overlay */}
            <div className="absolute top-6 left-8 z-30 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/60 text-xs font-mono tracking-widest uppercase">LMS Cinematic Preview • 8K</span>
            </div>
            
            <button 
              onClick={handleClose}
              className="absolute top-6 right-8 z-30 p-2 text-white/50 hover:text-white transition-colors"
            >
              <FiX className="text-xl" />
            </button>

            {/* Progress Line */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600 z-30 transition-all duration-[4000ms] ease-linear" style={{ width: `${progress}%` }} />

            {/* Playback Controls Removed */}

            {/* Main Stage */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B1120] to-[#0B1120]" />
              
              <AnimatePresence mode="wait">
                {isPlaying && CurrentSceneComponent ? (
                  <CurrentSceneComponent key={currentScene} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <h2 className="text-white text-xl font-light tracking-widest">INITIALIZING...</h2>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

DemoVideo.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

// --- Scene Components ---

const OpeningScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full flex flex-col items-center justify-center relative overflow-hidden">
    <ParallaxBackground />
    {[...Array(20)].map((_, i) => <Particle key={i} delay={i * 0.1} />)}
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="relative z-10 text-center"
    >
      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.5)] rotate-3">
        <FaGraduationCap className="text-6xl text-white drop-shadow-lg" />
      </div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white tracking-tighter mb-4"
      >
        LMS PRO
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-xl text-cyan-200 font-light tracking-[0.2em] uppercase"
      >
        Your Learning Journey Starts Here
      </motion.p>
    </motion.div>
  </motion.div>
);

const LoginScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full flex items-center justify-center bg-[#0B1120] relative overflow-hidden">
    <ParallaxBackground />
    <Cursor from={{ x: 800, y: 600 }} to={{ x: 600, y: 450 }} delay={2} duration={1} clickAt={1} />
    <motion.div 
      className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl"
      style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px) rotateY(-5deg)' }}
    >
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px]" />
      
      <motion.div variants={staggerFast} initial="hidden" animate="show" className="relative z-10 space-y-6">
        <motion.div variants={fadeInUp} className="text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <FaFingerprint className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-blue-200/60 text-sm">Secure Neural Access</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          <motion.div whileHover="hover" variants={magneticPull} className="group relative">
            <FiMail className="absolute left-4 top-4 text-blue-400 group-hover:text-cyan-300 transition-colors" />
            <motion.input 
              variants={aiGlowPulse}
              animate="animate"
              disabled type="text" value="alex.designer@lms.pro" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-all shadow-inner" 
            />
          </motion.div>
          <motion.div whileHover="hover" variants={magneticPull} className="group relative">
            <FiLock className="absolute left-4 top-4 text-blue-400 group-hover:text-cyan-300 transition-colors" />
            <input disabled type="password" value="••••••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 text-white focus:outline-none transition-all shadow-inner" />
          </motion.div>
        </motion.div>

        <motion.button
          variants={fadeInUp}
          animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.5)', '0 0 0px rgba(59,130,246,0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">Login <FiArrowRight /></span>
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 4, opacity: [0.5, 0] }}
            transition={{ delay: 3, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
          />
        </motion.button>
      </motion.div>
    </motion.div>
  </motion.div>
);

const DashboardScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full bg-[#0B1120] p-8 perspective-1000 relative overflow-hidden">
    <ParallaxBackground />
    <Cursor from={{ x: 1000, y: 800 }} to={{ x: 180, y: 280 }} delay={4} duration={1.5} clickAt={1} />
    <motion.div 
      initial={{ rotateY: -5 }}
      animate={{ rotateY: 5 }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      className="h-full grid grid-cols-12 gap-6 max-w-7xl mx-auto relative z-10"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Sidebar Hologram */}
      <motion.div variants={fadeInUp} className="col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-0.5">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold">Alex Morgan</h3>
            <p className="text-xs text-white/50">Pro Member</p>
          </div>
        </div>
        <div className="space-y-2">
          {['Dashboard', 'My Courses', 'Certifications'].map((item, i) => (
            <motion.div 
              key={item} 
              animate={i === 1 ? { 
                backgroundColor: ["rgba(255,255,255,0)", "rgba(37,99,235,0.2)"],
                color: ["rgba(255,255,255,0.6)", "#60A5FA"],
                borderColor: ["rgba(0,0,0,0)", "rgba(59,130,246,0.3)"]
              } : i === 0 ? {
                backgroundColor: ["rgba(37,99,235,0.2)", "rgba(255,255,255,0)"],
                color: ["#60A5FA", "rgba(255,255,255,0.6)"],
                borderColor: ["rgba(59,130,246,0.3)", "rgba(0,0,0,0)"]
              } : {}}
              transition={{ delay: 5.5, duration: 0.3 }}
              className={`p-3 rounded-xl flex items-center gap-3 border border-transparent ${i === 0 ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'text-white/60'}`}
            >
              <motion.div 
                animate={i === 0 ? { opacity: [1, 0] } : i === 1 ? { opacity: [0, 1], backgroundColor: ["#60A5FA", "#60A5FA"], boxShadow: ["0 0 0px", "0 0 10px rgba(59,130,246,1)"] } : {}}
                transition={{ delay: 5.5, duration: 0.3 }}
                className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,1)]' : 'bg-transparent'}`} 
              />
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerFast} className="col-span-9 space-y-6">
        <motion.div variants={fadeInUp} className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Command Center</h1>
            <p className="text-white/40">Real-time learning metrics</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-white/60 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Online
            </div>
          </div>
        </motion.div>

        {/* Floating Cards */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Weekly Progress', value: '78%', color: 'from-cyan-500 to-blue-500', icon: <FiActivity /> },
            { label: 'Active Courses', value: '04', color: 'from-purple-500 to-pink-500', icon: <FiLayers /> },
            { label: 'Certificates', value: '12', color: 'from-amber-500 to-orange-500', icon: <FiAward /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications Showcase */}
        <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 rounded-3xl p-6 h-48 relative overflow-hidden flex items-center justify-between px-10">
           <div>
             <h3 className="text-xl font-bold text-white mb-2">Latest Certification</h3>
             <p className="text-white/60 text-sm mb-4">Advanced 3D Architecture</p>
             <div className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg text-xs inline-flex items-center gap-2">
               <FiAward /> VERIFIED
             </div>
           </div>
           <div className="w-32 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg shadow-lg flex items-center justify-center relative">
              <FiAward className="text-4xl text-white" />
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-lg animate-pulse" />
           </div>
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.div>
);

const CoursesScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full bg-[#0B1120] flex items-center justify-center relative overflow-hidden">
    <ParallaxBackground />
    {/* Cursor targets the center card's Preview button - adjusted coordinates for better visibility */}
    <Cursor from={{ x: 900, y: 600 }} to={{ x: 700, y: 320 }} delay={1.5} duration={1.5} clickAt={1} />
    
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />
    
    <motion.div 
      className="flex gap-8 perspective-1000 items-center"
      initial={{ x: 200 }}
      animate={{ x: -200 }}
      transition={{ duration: 4, ease: "linear" }}
    >
      {[
        { title: "React Performance", type: "code" },
        { title: "Advanced 3D Architecture", type: "3d" },
        { title: "UI/UX Mastery", type: "ui" }
      ].map((course, i) => (
        <motion.div
          key={i}
          animate={i === 1 ? { scale: 1.15, zIndex: 10, y: -20, rotateY: 0 } : { scale: 0.9, opacity: 0.6, rotateY: i === 0 ? 15 : -15 }}
          transition={{ duration: 1 }}
          className={`w-80 bg-[#162032] border ${i === 1 ? 'border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]' : 'border-white/10'} rounded-3xl overflow-hidden flex-shrink-0 relative group`}
        >
          {/* Animated Card Cover */}
          <div className="h-40 bg-slate-900 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
            <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-cyan-500/20 to-blue-600/20' : 'from-purple-500/10 to-pink-500/10'}`} />
            
            {/* Simulated Content Animations - Made Bolder */}
            {course.type === '3d' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ rotateX: 360, rotateY: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-cyan-400 rounded-xl transform-style-3d shadow-[0_0_30px_rgba(34,211,238,0.6)] bg-cyan-400/10"
                />
                <motion.div 
                  animate={{ rotateX: -360, rotateY: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-24 h-24 border-2 border-blue-500 rounded-full opacity-60"
                />
              </div>
            )}

            {course.type === 'code' && (
              <div className="p-4 space-y-3 opacity-80 flex flex-col justify-center h-full">
                 <motion.div animate={{ width: ["60%", "80%", "60%"] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                 <motion.div animate={{ width: ["40%", "60%", "40%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                 <motion.div animate={{ width: ["70%", "50%", "70%"] }} transition={{ duration: 2.5, repeat: Infinity }} className="h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              </div>
            )}

             {course.type === 'ui' && (
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                 <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity }} className="w-10 h-16 bg-pink-500 rounded-xl border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                 <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 2.5, repeat: Infinity }} className="w-10 h-16 bg-purple-500 rounded-xl border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              </div>
            )}

            <motion.div 
               animate={i === 1 ? { scale: [1, 1.1, 1], backgroundColor: ["rgba(0,0,0,0.6)", "rgba(6,182,212,0.8)", "rgba(0,0,0,0.6)"] } : {}}
               transition={{ delay: 3, duration: 0.3 }} /* Click Feedback Synced with Cursor */
               className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-xs text-white flex items-center gap-1 cursor-pointer border border-white/10 z-20"
            >
              <FiPlay className={i === 1 ? "text-white" : "text-cyan-400"} /> Preview
            </motion.div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">PREMIUM</span>
              <div className="flex text-amber-400 text-xs gap-0.5"><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-white/40 border border-white/10 px-2 py-1 rounded-full">WebGL</span>
              <span className="text-xs text-white/40 border border-white/10 px-2 py-1 rounded-full">React</span>
            </div>
            {i === 1 && (
               <motion.div layoutId="highlight" className="absolute inset-0 border-2 border-cyan-400 rounded-3xl pointer-events-none" />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
    
    <div className="absolute bottom-12 left-0 right-0 text-center">
      <motion.p 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 3.2 }}
        className="text-cyan-400 text-sm tracking-widest uppercase font-bold"
      >
        Course Selected
      </motion.p>
    </div>
  </motion.div>
);

const CourseWorldScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full bg-[#0B1120] p-8 grid grid-cols-12 gap-8 relative overflow-hidden">
    <ParallaxBackground />
    {/* Video Panel */}
    <motion.div 
      variants={aiGlowPulse}
      animate="animate"
      className="col-span-8 bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col"
    >
      {/* Simulated Video Player UI */}
      <div className="relative w-full h-full bg-[#1E1E1E] overflow-hidden">
        {/* Code Editor Header */}
        <div className="h-8 bg-[#2D2D2D] flex items-center px-4 gap-2 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-xs text-white/40 font-mono">Architecture.jsx</span>
        </div>

        {/* Animated Code Content */}
        <div className="p-6 font-mono text-sm space-y-3">
           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 0.5 }}
             className="flex gap-2"
           >
             <span className="text-pink-400">import</span>
             <span className="text-cyan-300">React</span>
             <span className="text-pink-400">from</span>
             <span className="text-amber-300">'react'</span>;
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 1.0 }}
             className="flex gap-2"
           >
             <span className="text-pink-400">const</span>
             <span className="text-yellow-300">CourseWorld</span>
             <span className="text-white">=</span>
             <span className="text-blue-300">()</span>
             <span className="text-pink-400">=&gt;</span>
             <span className="text-blue-300">{`{`}</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 1.5 }}
             className="pl-4 flex gap-2"
           >
             <span className="text-pink-400">return</span>
             <span className="text-blue-300">(</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 2.0 }}
             className="pl-8 flex gap-2"
           >
             <span className="text-white">&lt;</span>
             <span className="text-green-400">div</span>
             <span className="text-purple-300">className</span>
             <span className="text-white">=</span>
             <span className="text-amber-300">"3d-scene"</span>
             <span className="text-white">&gt;</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 2.5 }}
             className="pl-12 flex gap-2"
           >
             <span className="text-white">&lt;</span>
             <span className="text-green-400">Canvas</span>
             <span className="text-white">/&gt;</span>
             <span className="text-gray-500">// Rendering 3D Model...</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 3.0 }}
             className="pl-8 flex gap-2"
           >
             <span className="text-white">&lt;/</span>
             <span className="text-green-400">div</span>
             <span className="text-white">&gt;</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 3.5 }}
             className="pl-4 flex gap-2"
           >
             <span className="text-blue-300">)</span>;
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, x: -10 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 4.0 }}
             className="flex gap-2"
           >
             <span className="text-blue-300">{`}`}</span>;
           </motion.div>
        </div>

        {/* Video Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
               <div className="flex items-center justify-between text-white mb-2 text-sm">
                 <div className="flex items-center gap-2">
                    <FiPlay className="fill-white" />
                    <span>Lesson 1: Introduction to React 3D</span>
                 </div>
                 <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }}>00:04 / 05:00</motion.span>
               </div>
               <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: '0%' }}
                   animate={{ width: '100%' }}
                   transition={{ duration: 7, ease: "linear" }}
                   className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                 />
               </div>
            </div>
            
            {/* Big Play Button Overlay - Fades Out */}
            <motion.div 
               initial={{ opacity: 1, scale: 1 }}
               animate={{ opacity: 0, scale: 1.5 }}
               transition={{ duration: 0.5, delay: 0.5 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30"
            >
               <FiPlay className="text-4xl text-white ml-2 fill-white" />
            </motion.div>
        </div>
      </div>
    </motion.div>

    {/* Modules Steps */}
    <motion.div variants={staggerSlow} className="col-span-4 flex flex-col gap-4 justify-center relative z-10">
       {[1, 2, 3, 4].map((i) => (
         <motion.div 
           key={i} 
           variants={fadeInUp}
           className={`p-4 rounded-2xl border backdrop-blur-sm transition-all ${i === 2 ? 'bg-cyan-500/10 border-cyan-500/50 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/5 opacity-50'}`}
         >
           <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white'}`}>
               {i < 3 ? <FiCheck /> : i}
             </div>
             <div>
               <h4 className="text-white text-sm font-bold">Module 0{i}</h4>
               <p className="text-white/40 text-xs">Interactive Logic</p>
             </div>
           </div>
         </motion.div>
       ))}
    </motion.div>
  </motion.div>
);

const AchievementScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full bg-[#0B1120] flex flex-col items-center justify-center relative overflow-hidden">
    {/* Confetti */}
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: 0, opacity: 1, scale: 0 }}
        animate={{ y: 400, x: (Math.random() - 0.5) * 400, opacity: 0, scale: 1, rotate: Math.random() * 360 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute top-1/4 w-2 h-2 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-sm"
      />
    ))}

    <motion.div variants={cameraShake} initial="initial" animate="shake" className="relative flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.6)] z-10 relative"
      >
        <FiAward className="text-6xl text-white" />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl"
      />

      <motion.div variants={staggerFast} initial="hidden" animate="show" className="text-center mt-8 z-10">
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-2">Course Completed</motion.h2>
        <motion.p variants={fadeInUp} className="text-amber-400 uppercase tracking-widest font-semibold">Mastery Achieved</motion.p>
        <motion.div variants={fadeInUp} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full border border-white/20 backdrop-blur">
          <span className="text-white font-mono">XP GAINED</span>
          <span className="text-amber-400 font-bold text-xl">+2500</span>
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.div>
);

const AssignmentScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full bg-[#0B1120] flex items-center justify-center p-8 relative overflow-hidden">
    <ParallaxBackground />
    
    {/* Cursor 1: Select Option (Simulates finding the right answer) */}
    <Cursor from={{ x: 800, y: 600 }} to={{ x: 600, y: 495 }} delay={2} duration={1} clickAt={1} />
    
    {/* Cursor 2: Click Submit (Simulates completing the task) */}
    <Cursor from={{ x: 600, y: 495 }} to={{ x: 600, y: 565 }} delay={4} duration={0.8} clickAt={1} />
    
    <div className="w-full max-w-3xl relative h-[700px] flex items-center justify-center">
       {/* Assignment Header */}
       <div className="absolute top-10 left-0 right-0 text-center z-20">
         <motion.h2 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="text-3xl font-bold text-white tracking-wide"
         >
           Assignment: React Optimization
         </motion.h2>
       </div>

       {/* Stacked Layers */}
       {[2, 1, 0].map((layer) => (
         <motion.div
           key={layer}
           initial={{ y: layer * 20, scale: 1 - layer * 0.05, opacity: 1 - layer * 0.3 }}
           animate={layer === 0 ? { y: 0, scale: 1, opacity: 1 } : {}}
           className={`absolute top-28 left-0 w-full bg-[#162032] border border-white/10 rounded-2xl p-6 shadow-2xl ${layer > 0 ? 'z-0' : 'z-10'}`}
           style={{ transformOrigin: 'top center' }}
         >
           {layer === 0 && (
             <>
               <div className="flex items-start gap-4 mb-4">
                 <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">Q3</div>
                 <div>
                   <h3 className="text-xl text-white font-semibold mb-2">Optimize the following render cycle:</h3>
                   <code className="block bg-black/50 p-3 rounded-lg text-sm text-gray-300 font-mono">useEffect(() ={'>'} {'{'} ... {'}'}, [dep]);</code>
                 </div>
               </div>
               <div className="space-y-2">
                  {['Use useMemo', 'Remove dependency', 'Use useCallback', 'Implement AbortController'].map((opt, i) => (
                    <motion.div 
                      key={opt}
                      initial={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                      animate={i === 3 ? { 
                        backgroundColor: ["rgba(255,255,255,0.05)", "rgba(6,182,212,0.1)"],
                        borderColor: ["rgba(255,255,255,0.1)", "rgba(6,182,212,0.5)"]
                      } : {}}
                      transition={{ delay: 3, duration: 0.3 }}
                      className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-colors`}
                    >
                      <span className="text-gray-300">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center`}>
                        {i === 3 && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ delay: 3, type: "spring" }}
                            className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]" 
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
               </div>
               <motion.button
                 animate={{ scale: [1, 0.95, 1] }}
                 transition={{ delay: 5, duration: 0.2 }}
                 className="w-full mt-4 bg-cyan-500 text-black font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] relative overflow-hidden group"
               >
                 <span className="relative z-10 group-hover:text-white transition-colors">Submit Solution</span>
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ delay: 5, duration: 0.5 }}
                    className="absolute inset-0 bg-white"
                 />
               </motion.button>
             </>
           )}
         </motion.div>
       ))}
    </div>
  </motion.div>
);

const CertificationScene = () => (
  <motion.div variants={softZoom} initial="hidden" animate="show" exit="exit" className="h-full bg-white flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 to-gray-300" />
    
    <motion.div 
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
      className="relative w-[700px] bg-white aspect-[1.4/1] shadow-2xl border-8 border-double border-gray-200 p-12 text-center flex flex-col items-center justify-between"
      style={{ transformStyle: 'preserve-3d' }}
    >
       {/* Decorative Background Pattern */}
       <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
       
       <div className="relative z-10">
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} className="w-20 h-20 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
            <FaGraduationCap className="text-4xl text-white" />
         </motion.div>
         <h1 className="text-4xl font-serif text-gray-900 mb-2">CERTIFICATE</h1>
         <p className="text-gray-500 uppercase tracking-widest text-sm mb-8">Of Completion</p>
         
         <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
         <motion.div 
           initial={{ width: 0 }} 
           animate={{ width: '100%' }} 
           transition={{ delay: 2, duration: 2 }}
           className="overflow-hidden whitespace-nowrap mx-auto max-w-md border-b-2 border-gray-300 pb-2 mb-6"
         >
           <h2 className="text-3xl font-bold text-gray-900 font-serif">Alex Morgan</h2>
         </motion.div>
         
         <p className="text-gray-600">Has successfully mastered</p>
         <h3 className="text-xl font-bold text-blue-600 mt-2">Advanced 3D Architecture Systems</h3>
       </div>

       <div className="relative z-10 w-full flex justify-between items-end mt-8">
         <div className="text-left">
           <p className="text-xs text-gray-400">Date</p>
           <p className="font-mono text-sm">Oct 24, 2026</p>
         </div>
         <motion.div 
           initial={{ scale: 2, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 3.5, type: "spring" }}
           className="w-24 h-24 border-4 border-amber-500 rounded-full flex items-center justify-center rotate-[-15deg] opacity-80"
         >
           <div className="w-20 h-20 border border-amber-500 rounded-full flex items-center justify-center text-amber-600 font-bold text-xs uppercase text-center leading-none">
             Official<br/>Seal
           </div>
         </motion.div>
         <div className="text-right">
           <p className="text-xs text-gray-400">ID</p>
           <p className="font-mono text-sm">LMS-8829-X</p>
         </div>
       </div>

       <motion.div 
         initial={{ x: '-100%' }}
         animate={{ x: '200%' }}
         transition={{ delay: 4, duration: 1.5, ease: "easeInOut" }}
         className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none"
       />
    </motion.div>
  </motion.div>
);

const FinalScene = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 1.2 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 2 }}
    className="h-full bg-[#0B1120] flex flex-col items-center justify-center relative overflow-hidden"
  >
     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0B1120] to-[#0B1120]" />
     <ParallaxBackground />
     
     {/* Ecosystem Floating Elements */}
     {[...Array(6)].map((_, i) => (
       <motion.div
         key={i}
         initial={{ opacity: 0, y: 100 }}
         animate={{ opacity: 0.3, y: 0 }}
         transition={{ delay: i * 0.2, duration: 2 }}
         className="absolute text-cyan-500/20 text-6xl"
         style={{ 
           top: `${20 + Math.random() * 60}%`, 
           left: `${10 + Math.random() * 80}%`,
           transform: `scale(${0.5 + Math.random()})`
         }}
       >
         {i % 2 === 0 ? <FiGlobe /> : <FiCpu />}
       </motion.div>
     ))}

     <div className="relative z-10 text-center space-y-8">
       <motion.h2 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 1 }}
         className="text-6xl font-bold text-white tracking-tighter"
       >
         Learn. <span className="text-cyan-400">Grow.</span> Get Certified.
       </motion.h2>
       
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: 200 }}
         transition={{ delay: 2, duration: 1 }}
         className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"
       />

       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 3 }}
         className="flex items-center justify-center gap-4"
       >
         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-black text-xl" />
         </div>
         <span className="text-white font-mono text-xl">LMS PRO</span>
       </motion.div>

       <motion.button
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow"
       >
         Start Your Journey
       </motion.button>
     </div>
  </motion.div>
);

export default DemoVideo;
