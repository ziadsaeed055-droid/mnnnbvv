import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code, Database, Globe, Layers, Cpu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import developerPhoto from "@/assets/developer-photo.png";

const WelcomeModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("welcome-modal-seen");
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("welcome-modal-seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[71] md:w-full md:max-w-2xl md:max-h-[85vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border"
          >
            {/* Header gradient */}
            <div className="relative h-48 md:h-56 overflow-hidden rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50" />
              
              <button onClick={dismiss} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10">
                <X className="h-4 w-4" />
              </button>

              <div className="absolute bottom-0 right-6 flex items-end gap-4">
                <div className="relative">
                  <img
                    src={developerPhoto}
                    alt="Ayman - المطور"
                    className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-card shadow-xl translate-y-6"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-2 -left-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-card"
                  >
                    <Code className="h-4 w-4 text-white" />
                  </motion.div>
                </div>
                <div className="text-white pb-8">
                  <h2 className="text-xl md:text-2xl font-bold">Ayman</h2>
                  <p className="text-white/80 text-sm">Full-Stack Developer & IT Specialist</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-10 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  مرحباً بك في نظام وحدة تكافؤ الفرص ومناهضة العنف ضد المرأة
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  التابعة لجامعة بني سويف التكنولوجية • رئيسة الوحدة: د. غادة توفيق • نائب الرئيس: د. سمر محمد
                </p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-5 border border-border">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  كيف تم بناء هذا النظام؟
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  تم بناء هذا النظام باستخدام <strong>منهجية الهندسة التجميعية (Engineering Assembly)</strong>، 
                  وهي منهجية تعتمد على تجميع وتكامل المكتبات البرمجية والأُطر التقنية (Frameworks) 
                  المتاحة مفتوحة المصدر، وربطها وتكييفها مع قواعد البيانات السحابية لإنشاء نظام متكامل وفعّال.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Globe, title: "الواجهة الأمامية", desc: "React + TypeScript + Tailwind CSS + Framer Motion" },
                    { icon: Database, title: "قواعد البيانات", desc: "Supabase (PostgreSQL) + Row Level Security" },
                    { icon: Layers, title: "البنية التحتية", desc: "Edge Functions + Realtime + Storage + Auth" },
                    { icon: Code, title: "الأدوات", desc: "Vite + PWA + Shadcn/UI + React Query" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-card p-3 rounded-xl border border-border"
                    >
                      <item.icon className="h-4 w-4 text-primary mb-1" />
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                يجمع النظام بين تقنيات الـ Front-End الحديثة (React، TypeScript) مع بنية خلفية (Back-End) 
                سحابية قوية تعتمد على Supabase لإدارة البيانات والمصادقة والتخزين، مما يوفر نظامًا آمنًا 
                وقابلًا للتطوير يخدم أهداف الوحدة في حماية حقوق المرأة ومناهضة العنف.
              </p>

              <Button onClick={dismiss} className="w-full bg-gradient-brand font-bold h-12 rounded-xl">
                ابدأ الاستكشاف
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
