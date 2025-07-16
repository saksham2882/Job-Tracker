import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center"
    >
      <div className="mb-8 sm:mb-0 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-[var(--primary)] mb-2 sm:mb-0">
          JobTracker
        </h3>
        <p className="text-sm text-[var(--secondary)] mb-6 sm:mb-4">
          by <span className="font-semibold">Saksham Agrahari.</span>
        </p>
        <p className="text-sm text-[var(--secondary)] mt-1">
          Copyright &copy; {new Date().getFullYear()} {" "}
          <a href="/" className="font-semibold">
            JobTracker
          </a>. 
          All rights reserved.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <a href="#" className="links" > About </a>
        <a href="#" className="links" > Services </a>
        <a href="#" className="links" > Contact </a>
        <a href="#" className="links" > Feedback </a>
      </div>
    </motion.div>
  );
};

export default Footer;