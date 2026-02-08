import { Shield, Target, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          About Veridian Tech
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          We are a forward-thinking technology company dedicated to transforming
          ideas into powerful digital solutions.
        </p>
      </section>

      {/* Corporate Info */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Who We Are
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Veridian Tech Innovations Ltd is a registered private limited
                liability company with the Corporate Affairs Commission (CAC) of
                Nigeria. Founded with a vision to bridge the gap between complex
                technology and everyday usability, we specialize in building
                secure, scalable, and user-centric software applications.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our team consists of passionate engineers, designers, and
                strategists who believe in the power of technology to drive
                progress. From estate management systems to custom enterprise
                software, we deliver excellence in every line of code.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700">
                <Shield className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold">
                  Registered
                </h3>
                <p className="text-sm text-slate-500">CAC Certified</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700">
                <Target className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold">
                  Focused
                </h3>
                <p className="text-sm text-slate-500">Client Success</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700">
                <Users className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold">
                  Expert
                </h3>
                <p className="text-sm text-slate-500">Dedicated Team</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700">
                <Award className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold">
                  Quality
                </h3>
                <p className="text-sm text-slate-500">World Class</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-none">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Our Vision
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To be the leading provider of innovative digital solutions in
              Africa, empowering businesses and communities with technology that
              is secure, reliable, and accessible.
            </p>
          </div>
          <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-none">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Our Mission
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To deliver premium software products and services that solve
              real-world problems, foster digital transformation, and create
              lasting value for our stakeholders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
