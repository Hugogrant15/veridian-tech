import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submitting logic here
    alert("Thank you for your message. We will get back to you soon!");
  };

  return (
    <div className="bg-white dark:bg-slate-950 py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider text-sm">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
              Let&apos;s Build Something Great Together.
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
              Have a project in mind or want to learn more about Project
              Easypass? We&apos;d love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg mr-4 text-cyan-600 dark:text-cyan-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-medium text-lg">
                    Email Us
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Our friendly team is here to help.
                  </p>
                  <a
                    href="mailto:info@veridiantech.com"
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                  >
                    info@veridiantech.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg mr-4 text-cyan-600 dark:text-cyan-400">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-medium text-lg">
                    Call Us
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Mon-Fri from 8am to 5pm.
                  </p>
                  <a
                    href="tel:+2348000000000"
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                  >
                    +234 800 000 0000
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg mr-4 text-cyan-600 dark:text-cyan-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-medium text-lg">
                    Visit Us
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Come say hello at our office HQ.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
