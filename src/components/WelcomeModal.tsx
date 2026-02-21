import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useWelcomeModal } from '@/hooks/useWelcomeModal';

export const WelcomeModal = () => {
  const { showModal, dismissModal } = useWelcomeModal();

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={dismissModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header with gradient */}
            <div className="h-48 bg-gradient-to-b from-purple-500 via-purple-400 to-pink-300 relative overflow-hidden flex items-end justify-center pb-8">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
              </div>
              
              {/* Developer Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative z-10 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden"
              >
                <img
                  src="/images/ayman-developer.jpg"
                  alt="Ayman - Developer Specialist"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Close Button */}
              <button
                onClick={dismissModal}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="p-8 space-y-4"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  أيمن - متخصص التطوير
                </h2>
                <p className="text-sm text-purple-600 font-semibold">Developer Specialist</p>
              </div>

              <div className="space-y-3 text-right">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center justify-end gap-2">
                    <span>⚡</span>
                    <span>المدة الزمنية</span>
                  </h3>
                  <p className="text-sm text-gray-600">تم تطوير هذا المشروع على مدار 22 يوماً متواصلاً من التخطيط والبناء والتحسين المستمر</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center justify-end gap-2">
                    <span>🔧</span>
                    <span>منهجية الهندسة</span>
                  </h3>
                  <p className="text-sm text-gray-600">تم بناء المشروع باستخدام معمارية العناصر المعيارية (Modular Architecture)، مما يسمح بسهولة الصيانة والتوسع المستقبلي</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center justify-end gap-2">
                    <span>🚀</span>
                    <span>التكنولوجيا</span>
                  </h3>
                  <p className="text-sm text-gray-600">React + TypeScript + Tailwind CSS لواجهة مستخدم حديثة، مع Supabase للتكامل الآمن للبيانات</p>
                </div>
              </div>

              <button
                onClick={dismissModal}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
              >
                ابدأ الآن
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
