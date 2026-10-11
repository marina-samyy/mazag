import { motion } from 'framer-motion';

// One simple fade when a page opens. MotionConfig in main.jsx
// removes movement automatically for users who prefer reduced motion.
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
