import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Zap, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const Hero = () => {
  const headline = "Building the Future of Digital Solutions.";
  const startWords = headline.split(" ").slice(0, 2);
  const highlightWord = headline.split(" ")[2]; // "Future"
  const endWords = headline.split(" ").slice(3);

  return (
    <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column: Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-left"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block py-1 px-3 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-6 border border-cyan-200 dark:border-cyan-500/20"
          >
            Veridian Tech Innovations Ltd
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight flex flex-wrap gap-x-3 gap-y-1">
            {startWords.map((word, i) => (
              <motion.span key={i} variants={wordVariants}>
                {word}
              </motion.span>
            ))}
            <motion.span
              variants={wordVariants}
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              {highlightWord}
            </motion.span>
            {endWords.map((word, i) => (
              <motion.span key={i} variants={wordVariants}>
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={wordVariants}
            className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10"
          >
            We empower businesses and communities with cutting-edge software,
            robust security systems, and innovative digital strategies.
          </motion.p>

          <motion.div
            variants={wordVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              Our Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex justify-center items-center relative"
        >
          <div className="relative w-full aspect-square max-w-md">
            {/* Abstract Tech Globe Visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-full h-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700/30 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

              {/* Central Icon Cluster */}
              <div className="relative grid grid-cols-2 gap-4 animate-[spin_20s_linear_infinite]">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transform -rotate-12 translate-y-4">
                  <Globe className="w-12 h-12 text-cyan-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transform rotate-6 translate-x-2">
                  <Shield className="w-12 h-12 text-blue-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transform rotate-3 -translate-y-2">
                  <Zap className="w-12 h-12 text-purple-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transform -rotate-6 -translate-x-2">
                  <Layers className="w-12 h-12 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                System Operational
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
