import { Rocket, Heart, Zap, Briefcase, ChevronRight } from "lucide-react";

const Careers = () => {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      type: "Full-time",
      location: "Lagos / Remote",
      department: "Engineering",
    },
    {
      title: "Product Marketing Manager",
      type: "Full-time",
      location: "Lagos",
      department: "Marketing",
    },
    {
      title: "Backend Developer (Node.js)",
      type: "Contract",
      location: "Remote",
      department: "Engineering",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Join the Frontline of Innovation
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          At Veridian Tech, we&apos;re building the future of digital
          infrastructure in Africa. Come do the best work of your career.
        </p>
      </section>

      {/* Culture / Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Why Veridian?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Our culture is built on impact, integrity, and innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Room to Grow
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We invest in your professional development with mentorship and
              learning resources.
            </p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Work-Life Balance
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We believe in working smart. Flexible hours and remote options are
              part of our DNA.
            </p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Meaningful Impact
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Work on products like EasyPass that solve real problems for real
              people every day.
            </p>
          </div>
        </div>
      </section>

      {/* Hiring Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Open Positions
            </h2>
            <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 py-1 px-3 rounded-full text-sm font-medium">
              Hiring Now
            </span>
          </div>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {job.department}
                    </span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500" />
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Don&apos;t see your role?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
              We are always looking for talented individuals. Send your CV and
              portfolio to our HR team.
            </p>
            <a
              href="mailto:careers@veridiantech.com"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Email Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
