import {
  Code,
  Cloud,
  Cpu,
  LineChart,
  Shield,
  Database,
  Globe,
  Server,
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4 text-center bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Comprehensive Digital Solutions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            From custom software development to robust cloud infrastructure,
            Veridian Tech offers a full spectrum of IT services designed to
            empower your business.
          </p>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-24">
          {/* Pillar 1: IT & Software Development */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 mb-6">
                <Code className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                IT & Software Development
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                We build scalable, high-performance applications tailored to
                your unique requirements. Our development process prioritizes
                security, user experience, and code quality.
              </p>
              <ul className="space-y-3">
                {[
                  "Custom Web Application Development",
                  "Mobile App Development (iOS & Android)",
                  "Enterprise Intranet Portals",
                  "API Development & Integration",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700/30 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
              <Globe className="w-24 h-24 text-blue-500 relative z-10 opacity-80" />
            </div>
          </div>

          {/* Pillar 2: Technology Consulting */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="md:order-2">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 mb-6">
                <LineChart className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Technology Consulting & Services
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Navigate the complex digital landscape with confidence. Our
                experts provide strategic guidance to help you modernize systems
                and optimize IT operations.
              </p>
              <ul className="space-y-3">
                {[
                  "Digital Transformation Strategy",
                  "Legacy System Modernization",
                  "Technical Audit & Feasibility Studies",
                  "IT Support & Maintenance",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-dotted-spacing-4 bg-dotted-slate-300 dark:bg-dotted-slate-600"></div>
              <Shield className="w-24 h-24 text-purple-500 relative z-10 opacity-80" />
            </div>
          </div>

          {/* Pillar 3: Digital Infrastructure */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400 mb-6">
                <Cloud className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Digital Infrastructure & Cloud
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Build a resilient foundation for your data and applications. We
                offer end-to-end infrastructure services from hosting to
                advanced cloud architectures.
              </p>
              <ul className="space-y-3">
                {[
                  "Cloud Migration & Deployment",
                  "Database Design & Management",
                  "Secure Web Hosting Services",
                  "DevOps & CI/CD Pipelines",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
              <Server className="w-24 h-24 text-orange-500 relative z-10 opacity-80" />
            </div>
          </div>

          {/* Pillar 4: Innovation */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="md:order-2">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 mb-6">
                <Cpu className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Innovation & Product Development
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                We don&apos;t just follow trends; we create them. Our R&D
                division focuses on building proprietary products that solve
                real-world problems.
              </p>
              <ul className="space-y-3">
                {[
                  "SaaS Product Development (e.g., Easypass)",
                  "IoT & Smart Home Solutions",
                  "AI & Machine Learning integration",
                  "Prototyping & MVP Development",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden">
              <Database className="w-24 h-24 text-green-500 relative z-10 opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to upgrade your technology?
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10">
          Let&apos;s discuss how our services can align with your business
          goals.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors"
        >
          Start a Conversation
        </Link>
      </section>
    </div>
  );
};

export default Services;
