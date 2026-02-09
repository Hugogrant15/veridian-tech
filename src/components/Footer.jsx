import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src="/logo-blue.png"
                alt="Veridian Tech Logo"
                className="h-24 w-auto object-contain mb-4"
              />
            </Link>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-sm">
              Innovating the future with secure, scalable, and intelligent
              software solutions. Registered with the CAC as a Limited Liability
              Company.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "About Us", path: "/about" },
                { name: "Products", path: "/products" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <MapPin
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400 flex-shrink-0"
                />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400 flex-shrink-0"
                />
                <a
                  href="mailto:info@veridiantech.com"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  info@veridiantech.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400 flex-shrink-0"
                />
                <a
                  href="tel:+2348000000000"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  +234 800 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Veridian Tech Innovations Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
