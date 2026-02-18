import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, User, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: "الأنشطة", path: "/activities" },
    { name: "المكتبة", path: "/library" },
    { name: "المنتدى", path: "/forum" },
    { name: "ميثاق السلوك", path: "/code-of-conduct" },
    { name: "اعرف حقوقك", path: "/know-your-rights" },
    { name: "التوعية الرقمية", path: "/digital-awareness" },
    { name: "دليل الطالب", path: "/student-guide" },
    { name: "الشركاء", path: "/partners" },
    { name: "المتطوعين", path: "/volunteers" },
    { name: "الأسئلة الشائعة", path: "/faq" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(5);
      setNotifications((data as any[]) || []);
    };
    fetchNotifs();

    const channel = supabase.channel("navbar-notifs").on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
      setNotifications(prev => [payload.new as any, ...prev.slice(0, 4)]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-card/80 backdrop-blur-md border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="شعار الوحدة" className="h-16 w-auto object-contain" />
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-primary">جامعة بني سويف التكنولوجية</span>
              <span className="text-xs text-muted-foreground">وحدة مناهضة العنف ضد المرأة</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.slice(0, 8).map((link) => (
              <Link key={link.path} to={link.path} className={`text-xs font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {link.name}
              </Link>
            ))}
            {/* Notifications bell */}
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative text-muted-foreground hover:text-primary p-1">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">{notifications.length}</span>}
              </button>
              {showNotifs && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-border font-bold text-sm text-foreground">الإشعارات</div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">لا توجد إشعارات</p>
                  ) : notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <p className="text-sm font-bold text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("ar-EG")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/report">
              <Button variant="default" size="sm" className="bg-gradient-brand shadow-lg hover:shadow-xl transition-all duration-300">
                <Shield className="ml-1 h-4 w-4" /> إبلاغ سري
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">لوحة التحكم</Button>
            </Link>
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">تسجيل الدخول</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative text-muted-foreground hover:text-primary p-1">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">{notifications.length}</span>}
              </button>
              {showNotifs && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">لا توجد إشعارات</p>
                  ) : notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-border last:border-0">
                      <p className="text-sm font-bold text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground hover:text-primary focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-card border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-sm font-medium py-2 border-b border-border/50 ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
                  {link.name}
                </Link>
              ))}
              <Link to="/report" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-brand"><Shield className="ml-2 h-4 w-4" /> إبلاغ سري</Button>
              </Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">لوحة التحكم</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
