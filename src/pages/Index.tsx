import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Heart, Users, BookOpen, ChevronLeft, Calendar, Activity, ArrowLeft, Scale, HelpCircle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const typeLabels: Record<string, string> = {
  seminar: "ندوة", workshop: "ورشة عمل", campaign: "حملة توعوية", training: "تدريب", conference: "مؤتمر",
};

const Index = () => {
  const [safetyIndex, setSafetyIndex] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [surveyRes, actRes, volRes] = await Promise.all([
        supabase.from("safety_surveys").select("feels_safe"),
        supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(3),
        supabase.from("volunteers").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(4),
      ]);
      if (surveyRes.data && surveyRes.data.length > 0) {
        setSafetyIndex(Math.round((surveyRes.data.filter(s => s.feels_safe).length / surveyRes.data.length) * 100));
      }
      setActivities(actRes.data || []);
      setVolunteers((volRes.data as any[]) || []);
    };
    fetchData();
  }, []);

  const faqs = [
    { q: "هل الشكوى سرية؟", a: "نعم، جميع الشكاوى تُعامل بسرية تامة ولا يتم الكشف عن هوية المشتكي." },
    { q: "هل يتم ذكر اسمي في التحقيق؟", a: "لا، لديك الحق في تقديم بلاغ مجهول بالكامل." },
    { q: "كم يستغرق التحقيق؟", a: "يعتمد على طبيعة القضية، عادة من أسبوع إلى شهر." },
    { q: "هل يمكن التراجع عن الشكوى؟", a: "نعم، يحق لك التراجع في أي مرحلة من مراحل التحقيق." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-800/80 z-10" />
        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="صورة تعبيرية" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-20 mx-auto px-4 md:px-6 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4 border border-white/30">وحدة رسمية تابعة لجامعة بني سويف التكنولوجية</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">معاً لبيئة جامعية <span className="text-pink-300">آمنة</span> وتدعم <span className="text-purple-300">الجميع</span></h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed">نعمل على توفير بيئة تعليمية آمنة خالية من العنف والتمييز، وتقديم الدعم النفسي والقانوني والاجتماعي لجميع منتسبي الجامعة بسرية تامة.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/report"><Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold text-lg px-8 h-14"><Shield className="ml-2 h-5 w-5" /> إبلاغ سري</Button></Link>
              <Link to="/about"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white font-bold text-lg px-8 h-14">تعرف علينا</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety Index */}
      <section className="py-16 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-2"><Activity className="h-5 w-5" /><span>مؤشر الأمان الجامعي</span></div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">هل تشعر بالأمان داخل الحرم الجامعي؟</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">يساعدنا رأيك في تحسين بيئة الجامعة. شارك في الاستبيان الدوري لنرصد ونحسن مستوى الأمان معاً.</p>
              <div className="bg-accent p-6 rounded-2xl border border-primary/10 mb-8">
                <div className="flex justify-between items-end mb-2"><span className="text-lg font-bold text-primary">مؤشر الأمان الحالي</span><span className="text-3xl font-bold text-secondary">{safetyIndex}%</span></div>
                <div className="w-full bg-muted rounded-full h-3"><div className="bg-gradient-brand h-3 rounded-full transition-all duration-1000" style={{ width: `${safetyIndex}%` }}></div></div>
              </div>
              <Link to="/quiz"><Button className="w-full sm:w-auto">شارك في الاستبيان الآن</Button></Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-brand opacity-10 rounded-full blur-3xl"></div>
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80" alt="طلاب" className="relative rounded-2xl shadow-2xl z-10 w-full object-cover h-[400px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">خدمات الوحدة</h2>
            <p className="text-muted-foreground">نقدم مجموعة متكاملة من الخدمات لدعم وتوعية وحماية جميع منتسبي الجامعة</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border group">
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform"><Shield className="h-7 w-7" /></div>
              <h3 className="text-xl font-bold mb-3 text-foreground">نظام الإبلاغ الآمن</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">قناة سرية وآمنة للإبلاغ عن أي مضايقات أو عنف، مع ضمان الخصوصية التامة.</p>
              <Link to="/report" className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all">قدم بلاغ الآن <ChevronLeft className="h-4 w-4 mr-1" /></Link>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border group">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform"><Heart className="h-7 w-7" /></div>
              <h3 className="text-xl font-bold mb-3 text-foreground">الدعم النفسي</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">جلسات استماع ودعم نفسي مع متخصصين لمساعدة الطلاب على تجاوز الآثار النفسية.</p>
              <Link to="/safe-map" className="inline-flex items-center text-secondary font-bold hover:gap-2 transition-all">مراكز الدعم <ChevronLeft className="h-4 w-4 mr-1" /></Link>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform"><BookOpen className="h-7 w-7" /></div>
              <h3 className="text-xl font-bold mb-3 text-foreground">التوعية والتدريب</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">ورش عمل وندوات ومواد تثقيفية لرفع الوعي بحقوق الإنسان وآليات الحماية.</p>
              <Link to="/activities" className="inline-flex items-center text-indigo-600 font-bold hover:gap-2 transition-all">استكشف الأنشطة <ChevronLeft className="h-4 w-4 mr-1" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-2"><Scale className="h-5 w-5" /><span>ميثاق السلوك</span></div>
              <h2 className="text-3xl font-bold text-foreground mb-4">الدستور الأخلاقي للحرم الجامعي</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">وثيقة رسمية توضح السلوكيات المقبولة وغير المقبولة داخل الجامعة، والعقوبات المترتبة، والتزامات الطلاب وحقوقهم.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {["السلوكيات المرفوضة", "العقوبات التدريجية", "حقوق المشتكي", "الإبلاغ المجهول"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-accent p-3 rounded-xl text-sm font-medium text-foreground">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/code-of-conduct"><Button className="bg-gradient-brand font-bold">اطلع على الميثاق الكامل <ChevronLeft className="mr-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-brand opacity-5 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-primary/10">
                <Scale className="h-16 w-16 text-primary/20 mb-4" />
                <blockquote className="text-lg font-medium text-foreground leading-relaxed italic">
                  "تلتزم جامعة بني سويف التكنولوجية بتوفير بيئة تعليمية آمنة وعادلة خالية من جميع أشكال التمييز والعنف."
                </blockquote>
                <p className="text-sm text-muted-foreground mt-4">— مقدمة ميثاق السلوك الجامعي</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Know Your Rights Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-primary font-bold mb-2"><BookOpen className="h-5 w-5" /><span>اعرف حقوقك</span></div>
          <h2 className="text-3xl font-bold text-foreground mb-4">المعرفة هي خط الدفاع الأول</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">تعرّف على حقوقك الكاملة داخل الجامعة والقوانين المصرية والدولية التي تحميك</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Shield, title: "حقوقك الأساسية", desc: "الحق في بيئة آمنة وخالية من العنف والتمييز والتحرش", color: "text-blue-600 bg-blue-100" },
              { icon: Scale, title: "القوانين المحلية", desc: "قانون العقوبات وقانون مكافحة التحرش والجرائم الإلكترونية", color: "text-amber-600 bg-amber-100" },
              { icon: Users, title: "المواثيق الدولية", desc: "اتفاقية سيداو والإعلان العالمي لحقوق الإنسان", color: "text-green-600 bg-green-100" },
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border hover:shadow-md transition-shadow text-center">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color} mx-auto mb-4`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/know-your-rights"><Button className="bg-gradient-brand font-bold">اعرف حقوقك الكاملة <ChevronLeft className="mr-2 h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* Latest Activities */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div><h2 className="text-3xl font-bold text-foreground mb-2">أحدث الأنشطة والفعاليات</h2><p className="text-muted-foreground">تابع أخبارنا وشارك في فعالياتنا القادمة</p></div>
            <Link to="/activities"><Button variant="outline" className="hidden md:flex">عرض كل الأنشطة</Button></Link>
          </div>
          {activities.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا توجد أنشطة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((act) => (
                <Link key={act.id} to={`/activity/${act.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all">
                    <div className="relative h-48 overflow-hidden">
                      {act.type && <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary z-10">{typeLabels[act.type] || act.type}</div>}
                      <img src={act.image_url || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-xs text-muted-foreground mb-3 gap-3">
                        {act.date && <span className="flex items-center"><Calendar className="h-3 w-3 ml-1" /> {new Date(act.date).toLocaleDateString("ar-EG")}</span>}
                        {act.location && <span className="flex items-center"><Users className="h-3 w-3 ml-1" /> {act.location}</span>}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{act.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{act.description}</p>
                      <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">عرض التفاصيل <ArrowLeft className="h-4 w-4" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center md:hidden"><Link to="/activities"><Button variant="outline" className="w-full">عرض كل الأنشطة</Button></Link></div>
        </div>
      </section>

      {/* Volunteers Section */}
      {volunteers.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold mb-2"><Award className="h-5 w-5" /><span>أبطال التغيير</span></div>
                <h2 className="text-3xl font-bold text-foreground mb-2">فريق المتطوعين</h2>
                <p className="text-muted-foreground">طلاب متميزون يعملون لبيئة جامعية أكثر أماناً</p>
              </div>
              <Link to="/volunteers"><Button variant="outline" className="hidden md:flex">عرض الكل</Button></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {volunteers.map((v: any) => (
                <div key={v.id} className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md transition-shadow">
                  {v.photo_url ? (
                    <img src={v.photo_url} alt={v.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-accent flex items-center justify-center border-2 border-primary/20">
                      <span className="text-xl font-bold text-primary">{v.name?.charAt(0)}</span>
                    </div>
                  )}
                  <h4 className="font-bold text-foreground text-sm">{v.name}</h4>
                  {v.role_title && <p className="text-xs text-primary mt-1">{v.role_title}</p>}
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden"><Link to="/volunteers"><Button variant="outline" className="w-full">عرض كل المتطوعين</Button></Link></div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-primary font-bold mb-2"><HelpCircle className="h-5 w-5" /><span>أسئلة شائعة</span></div>
            <h2 className="text-3xl font-bold text-foreground mb-4">أسئلة يتكرر طرحها</h2>
          </div>
          <div className="space-y-3 mb-8">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-muted/30 border border-border rounded-xl p-5">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-muted-foreground pr-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/faq"><Button variant="outline" className="font-bold">عرض جميع الأسئلة ({">"}60 سؤال) <ChevronLeft className="mr-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-brand text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">هل ترغب في المساهمة معنا؟</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">انضم لفريق المتطوعين وكن جزءاً من التغيير الإيجابي في جامعتنا، أو ساهم بالتبرع لدعم أنشطة الوحدة.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/volunteer"><Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto font-bold">سجل كمتطوع</Button></Link>
            <Link to="/donate"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto font-bold">تبرع للوحدة</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
