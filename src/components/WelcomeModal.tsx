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
              className="p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  أيمن - متخصص التطوير
                </h2>
                <p className="text-sm text-purple-600 font-semibold">Developer Specialist</p>
              </div>

              <div className="text-right space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  مرحباً بك في وحدة مناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية. أنا أيمن، ومن شرف لي أن أقدم لك هذا المشروع الذي طورته بعناية فائقة على مدار 22 يوماً متواصلاً من العمل الجاد والتخطيط المدقق والبناء المستمر.
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  تم بناء هذا التطبيق باستخدام معمارية معيارية حديثة (Modular Architecture)، مما يعني أن كل جزء من المشروع مستقل وسهل الصيانة والتطوير. اعتمدت على أفضل الممارسات الهندسية في تطوير البرمجيات، حيث قمت بتصميم البنية التحتية بحيث تكون قابلة للتوسع والتحسين المستقبلي.
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  من الناحية التقنية، استخدمت أحدث التقنيات: React لواجهة مستخدم حديثة وتفاعلية، TypeScript لضمان سلامة الكود، Tailwind CSS للتصميم الاحترافي، و Supabase كقاعدة بيانات آمنة وموثوقة. أضفت أيضاً دعم تطبيق الويب التقدمي (PWA) ليمكنك تثبيت التطبيق على هاتفك، بالإضافة إلى مستشار الذكاء الاصطناعي للدعم النفسي.
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  أتمنى أن يكون هذا التطبيق مفيداً لك ويلبي احتياجاتك. جميع الميزات الموجودة هنا تم تطويرها بتركيز على تجربة المستخدم والأمان والأداء. شكراً لاستخدامك التطبيق!
                </p>
              </div>

              <button
                onClick={dismissModal}
                className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
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
