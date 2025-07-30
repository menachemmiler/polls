import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface SnackbarProps {
  open: boolean;
  message: string;
}

const Snackbar: React.FC<SnackbarProps> = ({ open, message }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.36 }}
        className="
          fixed left-6 bottom-6 z-50
          px-5 py-3 shadow-lg
          bg-[#575759] text-white text-[15px] font-medium
          min-w-[200px] max-w-[360px]
        "
        role="alert"
        aria-live="assertive"
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Snackbar;
