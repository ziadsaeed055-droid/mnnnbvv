
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Heart, Users, BookOpen, ChevronLeft, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-800/80 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" 
          alt="صورة تعبيرية للطلاب في الجامعة" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-20 mx-auto px-4 md:px-6 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4 border border-white/30">
              وحدة رسمية تابعة لجامعة بني سويف التكنولوجية
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              معاً لبيئة جامعية <span className="text-pink-300">آمنة</span> وتدعم <span className="text-purple-300">الجميع</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed">
              نعمل على توفير بيئة تعليمية آمنة خالية من العنف والتمييز، وتقديم الدعم النفسي والقانوني والاجتماعي لجميع منتسبات الجامعة بسرية تامة.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/report">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold text-lg px-8 h-14">
                  <Shield className="ml-2 h-5 w-5" />
                  إبلاغ سري
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white font-bold text-lg px-8 h-14">
                  تعرف علينا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety Index Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <Activity className="h-5 w-5" />
                <span>مؤشر الأمان الجامعي</span>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">هل تشعرين بالأمان داخل الحرم الجامعي؟</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                يساعدنا رأيك في تحسين بيئة الجامعة. شاركي في الاستبيان الدوري لنرصد ونحسن مستوى الأمان معاً. نتائجنا لهذا الشهر تشير إلى مستوى أمان مرتفع بفضل جهود الجميع.
              </p>
              
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg font-bold text-primary">مؤشر الأمان الحالي</span>
                  <span className="text-3xl font-bold text-secondary">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full" style={{ width: "82%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-left">آخر تحديث: فبراير 2024</p>
              </div>

              <Link to="/quiz">
                <Button className="w-full sm:w-auto">شارك في الاستبيان الآن</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-brand opacity-10 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80" 
                alt="طلاب سعداء" 
                className="relative rounded-2xl shadow-2xl z-10 w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">خدمات الوحدة</h2>
            <p className="text-gray-600">نقدم مجموعة متكاملة من الخدمات لدعم وتوعية وحماية جميع منتسبات الجامعة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">نظام الإبلاغ الآمن</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                قناة سرية وآمنة للإبلاغ عن أي مضايقات أو عنف، مع ضمان الخصوصية التامة وسرية المعلومات والتعامل الجاد مع كل بلاغ.
              </p>
              <Link to="/report" className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
                قدم بلاغ الآن <ChevronLeft className="h-4 w-4 mr-1" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">الدعم النفسي</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                جلسات استماع ودعم نفسي مع متخصصين لمساعدة الطالبات والموظفات على تجاوز الآثار النفسية لأي تجارب سلبية.
              </p>
              <Link to="/consultation" className="inline-flex items-center text-secondary font-bold hover:gap-2 transition-all">
                احجز استشارة <ChevronLeft className="h-4 w-4 mr-1" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">التوعية والتدريب</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                ورش عمل وندوات ومواد تثقيفية لرفع الوعي بحقوق المرأة وكيفية التصدي للعنف وآليات الحماية المتاحة.
              </p>
              <Link to="/activities" className="inline-flex items-center text-indigo-600 font-bold hover:gap-2 transition-all">
                استكشف الأنشطة <ChevronLeft className="h-4 w-4 mr-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Activities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">أحدث الأنشطة والفعاليات</h2>
              <p className="text-gray-600">تابع أخبارنا وشارك في فعالياتنا القادمة</p>
            </div>
            <Link to="/activities">
              <Button variant="outline" className="hidden md:flex">عرض كل الأنشطة</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Activity Card 1 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary z-10">
                  ندوة توعوية
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80" 
                  alt="ندوة" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                  <span className="flex items-center"><Calendar className="h-3 w-3 ml-1" /> 15 مارس 2024</span>
                  <span className="flex items-center"><Users className="h-3 w-3 ml-1" /> قاعة المؤتمرات</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">ندوة: اعرفي حقوقك واحمي نفسك</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  ندوة تثقيفية حول الحقوق القانونية للمرأة وكيفية التعامل مع حالات التحرش في الأماكن العامة والجامعة.
                </p>
                <Link to="/activities/1" className="text-sm font-bold text-primary hover:underline">اقرأ المزيد</Link>
              </div>
            </div>

            {/* Activity Card 2 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-secondary z-10">
                  ورشة عمل
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80" 
                  alt="ورشة عمل" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                  <span className="flex items-center"><Calendar className="h-3 w-3 ml-1" /> 20 مارس 2024</span>
                  <span className="flex items-center"><Users className="h-3 w-3 ml-1" /> معمل الحاسب</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">ورشة: الأمن السيبراني وحماية الخصوصية</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  ورشة عملية لتعلم كيفية حماية حساباتك الشخصية وتأمين بياناتك من الاختراق والابتزاز الإلكتروني.
                </p>
                <Link to="/activities/2" className="text-sm font-bold text-primary hover:underline">اقرأ المزيد</Link>
              </div>
            </div>

            {/* Activity Card 3 */}
            <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 z-10">
                  حملة تطوع
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80" 
                  alt="تطوع" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                  <span className="flex items-center"><Calendar className="h-3 w-3 ml-1" /> 1 أبريل 2024</span>
                  <span className="flex items-center"><Users className="h-3 w-3 ml-1" /> الحرم الجامعي</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">حملة: جامعتنا آمنة بيكم</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  انضمي لفريق المتطوعين لنشر الوعي وتوزيع المطبوعات التعريفية بخدمات الوحدة داخل كليات الجامعة.
                </p>
                <Link to="/activities/3" className="text-sm font-bold text-primary hover:underline">اقرأ المزيد</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/activities">
              <Button variant="outline" className="w-full">عرض كل الأنشطة</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-brand text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">هل ترغبين في المساهمة معنا؟</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            انضمي لفريق المتطوعين وكوني جزءاً من التغيير الإيجابي في جامعتنا، أو ساهمي بالتبرع لدعم أنشطة الوحدة.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/volunteer">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto font-bold">
                سجلي كمتطوعة
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto font-bold">
                تبرع للوحدة
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
