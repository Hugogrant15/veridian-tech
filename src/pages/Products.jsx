import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Player } from "@remotion/player";
import { DemoVideo } from "../components/DemoVideo";

const Products = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <section className="py-20 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Our Products
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Innovative solutions designed to streamline operations and enhance
          security.
        </p>
      </section>

      {/* Project Easypass Detail */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-sm font-semibold w-max mb-6">
                Flagship Product
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Project Easypass
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">
                A state-of-the-art Estate Management System that revolutionizes
                how residential communities handle security, access control, and
                administration.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Advanced QR Code Access Control for Residents & Guests",
                  "Automated License Plate Recognition (ALPR)",
                  "Digital Resident Database & Management Portal",
                  "Incident Reporting & Emergency Panic System",
                  "Service Payment Integration",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0 mr-3" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href="https://www.easypass.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
                >
                  Request Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
                <a
                  href="https://www.easypass.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white font-medium transition-colors"
                >
                  Download Brochure
                </a>
              </div>
            </div>

            {/* Image / Preview Side */}
            <div className="bg-slate-100 dark:bg-slate-800 p-8 md:p-12 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100/20 to-blue-100/20 dark:from-cyan-900/20 dark:to-blue-900/20"></div>
              {/* App Video Preview */}
              <div className="relative z-10 w-full max-w-md aspect-[4/3] bg-white dark:bg-slate-950 rounded-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <div className="h-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 transition-colors duration-300">
                  <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
                </div>
                <div className="w-full h-full bg-slate-100 dark:bg-slate-800">
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

      {/* Future Products Teaser */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          More Coming Soon
        </h2>
        <div className="flex justify-center gap-4">
          <span className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full animate-bounce delay-100"></span>
          <span className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full animate-bounce delay-200"></span>
        </div>
      </section>
    </div>
  );
};

export default Products;
