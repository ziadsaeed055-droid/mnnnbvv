import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useState, useEffect } from 'react';
import { useWelcomeModal } from '@/hooks/useWelcomeModal';

export const InstallAppButton = () => {
  const { isInstallable, installApp } = usePWA();
  const { showModal } = useWelcomeModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Show notification when modal closes
  useEffect(() => {
    if (!showModal && isInstallable) {
      setShowNotification(true);
    }
  }, [showModal, isInstallable]);

  const handleInstall = async () => {
    setIsLoading(true);
    try {
      await installApp();
      setShowNotification(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showNotification && isInstallable && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-8 left-8 z-40 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">تثبيت التطبيق</h4>
                  <p className="text-xs text-purple-100">Install App</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700">
                يمكنك الآن تثبيت التطبيق على هاتفك للوصول السريع والاستخدام بدون الإنترنت
              </p>
              
              <button
                onClick={handleInstall}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري التثبيت...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تثبيت الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
