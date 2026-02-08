import { Shield, Globe, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ServicesSection from "../components/ServicesSection";
import Hero from "../components/Hero";
import { Player } from "@remotion/player";
import { DemoVideo } from "../components/DemoVideo";

const Home = () => {
  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <Hero />

      {/* Services Section with Animation */}
      <ServicesSection />

      {/* Stats / Trust Section */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                CAC
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Registered Company
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                100%
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Secure Solutions
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                24/7
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Support Available
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                Cloud
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Native Architecture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature / Value Prop */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Veridian Tech?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We combine technical expertise with business acumen to deliver
              solutions that drive real growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <Shield className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                ),
                title: "Security First",
                desc: "Our solutions are built with enterprise-grade security protocols to protect your data and assets.",
              },
              {
                icon: (
                  <Zap className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                ),
                title: "High Performance",
                desc: "Optimized for speed and scalability, ensuring your applications run smoothly under any load.",
              },
              {
                icon: (
                  <Globe className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                ),
                title: "Global Standards",
                desc: "We adhere to international best practices in software development and project management.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-colors"
                style={{ transition: "border-color 0.3s" }}
              >
                <div className="bg-white dark:bg-slate-800 w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlight: Project Easypass */}
      <section className="py-20 relative overflow-hidden bg-slate-50 dark:bg-transparent">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider text-sm">
                FLAGSHIP PRODUCT
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                Easypass.ng
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                A comprehensive Estate Management & Access Control System
                designed for modern residential communities.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "QR Code & Face Recognition Access",
                  "Resident & Visitor Management Portals",
                  "Automated License Plate Recognition",
                  "Emergency Panic Button System",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://www.easypass.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 dark:text-white border-b-2 border-cyan-500 pb-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
              >
                Learn more about Easypass →
              </a>
            </div>
            <div className="relative">
              {/* Abstract representation of the app interface */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800">
                  <Player
                    component={DemoVideo}
                    durationInFrames={300}
                    fps={30}
                    compositionWidth={1080}
                    compositionHeight={1080}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    autoPlay
                    loop
                    muted
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
