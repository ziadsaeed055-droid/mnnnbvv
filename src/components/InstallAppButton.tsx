import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useState } from 'react';

export const InstallAppButton = () => {
  const { isInstallable, installApp } = usePWA();
  const [isLoading, setIsLoading] = useState(false);

  const handleInstall = async () => {
    setIsLoading(true);
    try {
      await installApp();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isInstallable && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3 }}
          onClick={handleInstall}
          disabled={isLoading}
          className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {/* Background shimmer effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
          
          <div className="relative flex items-center gap-2">
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
            >
              <Download className="w-4 h-4" />
            </motion.div>
            <span className="hidden sm:inline">تثبيت التطبيق</span>
            <span className="sm:hidden">تثبيت</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
