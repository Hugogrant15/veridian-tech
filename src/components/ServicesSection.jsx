import { motion } from "framer-motion";
import { Code, Cloud, Cpu, LineChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Software Development",
    description:
      "Custom mobile apps, digital platforms, and tailored software solutions.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "Technology Consulting",
    description:
      "Strategic IT consulting, systems integration, and technical support.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Digital Infrastructure",
    description: "Robust cloud solutions, hosting, and secure data management.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Product Innovation",
    description:
      "R&D and enterprise product development like Project Easypass.",
    color: "from-green-500 to-emerald-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const ServicesSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-100/50 to-transparent dark:from-slate-800/20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider text-sm uppercase">
              Our Expertise
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
              Engineered for Excellence
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We deliver comprehensive technology solutions that drive business
              growth and operational efficiency.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 group"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} p-2.5 text-white mb-6 shadow-md`}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {service.description}
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-sm font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                Explore
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors transition-transform hover:scale-105"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
