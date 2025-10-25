import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.h3
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-2xl font-bold text-[var(--primary)] mb-2"
            >
              JobTracker
            </motion.h3>

            <p className="text-sm text-[var(--secondary)]">
              Created by{" "}
              <a
                href="https://saksham-agrahari.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1 transition-all duration-200"
              >
                Saksham Agrahari
                <FaExternalLinkAlt className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Social Links  */}
          <div className="flex justify-center md:justify-end gap-4">
            {[
              {
                Icon: FaGithub,
                href: "https://github.com/saksham2882",
                label: "GitHub",
              },
              {
                Icon: FaLinkedin,
                href: "https://www.linkedin.com/in/saksham-agrahari/",
                label: "LinkedIn",
              },
              {
                Icon: FaEnvelope,
                href: "mailto:agrahari0899@gmail.com",
                label: "Email",
              },
            ].map(({ Icon, href, label }, idx) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.3, duration: 0.3 }}
                className="p-3 rounded-full bg-[var(--card)] text-[var(--foreground)] transition-all duration-300 shadow-sm flex items-center justify-center"
                whileHover={{
                  y: -2,
                  color: "var(--primary)",
                }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted)]">
            Copyright &copy; {currentYear}{" "}
            <a
              href="/"
              className="hover:text-[var(--primary)] transition-colors font-medium"
            >
              JobTracker
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;