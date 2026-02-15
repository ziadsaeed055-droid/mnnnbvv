import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: "الأنشطة", path: "/activities" },
    { name: "المكتبة", path: "/library" },
    { name: "دليل الطالبة", path: "/student-guide" },
    { name: "التوعية الرقمية", path: "/digital-awareness" },
    { name: "شركاؤنا", path: "/partners" },
    { name: "تبرع", path: "/donate" },
  ];

  const isActive = (path: string) => location.pathname === path;

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

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {link.name}
              </Link>
            ))}
            <Link to="/report">
              <Button variant="default" className="bg-gradient-brand shadow-lg hover:shadow-xl transition-all duration-300">
                <Shield className="ml-2 h-4 w-4" /> إبلاغ سري
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

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground hover:text-primary focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-card border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-base font-medium py-2 border-b border-border/50 ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
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
