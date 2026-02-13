
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: "الأنشطة", path: "/activities" },
    { name: "المكتبة التوعوية", path: "/library" },
    { name: "خريطة الأمان", path: "/safe-map" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="شعار الوحدة" className="h-16 w-auto object-contain" />
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-primary">جامعة بني سويف التكنولوجية</span>
              <span className="text-xs text-muted-foreground">وحدة مناهضة العنف ضد المرأة</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary font-bold" : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link to="/report">
              <Button variant="default" className="bg-gradient-brand shadow-lg hover:shadow-xl transition-all duration-300">
                <Shield className="ml-2 h-4 w-4" />
                إبلاغ سري
              </Button>
            </Link>
            
             <Link to="/dashboard">
              <Button variant="outline" size="sm" className="mr-2">
                لوحة التحكم
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium py-2 border-b border-gray-50 ${
                    isActive(link.path) ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/report" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-brand">
                  <Shield className="ml-2 h-4 w-4" />
                  إبلاغ سري
                </Button>
              </Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mt-2">
                  لوحة التحكم
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
