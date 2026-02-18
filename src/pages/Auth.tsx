import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Shield, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        let msg = "خطأ في تسجيل الدخول";
        if (error.message?.includes("Invalid login credentials")) msg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        else if (error.message?.includes("Email not confirmed")) msg = "لم يتم تأكيد البريد الإلكتروني بعد";
        else if (error.message?.includes("Invalid email")) msg = "البريد الإلكتروني غير صالح";
        toast.error(msg);
      } else {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      }
    } else {
      if (password.length < 6) {
        toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }
      if (!fullName.trim()) {
        toast.error("يرجى إدخال الاسم الكامل");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        let msg = "خطأ في إنشاء الحساب";
        if (error.message?.includes("already registered")) msg = "هذا البريد الإلكتروني مسجل مسبقاً";
        else if (error.message?.includes("valid email")) msg = "يرجى إدخال بريد إلكتروني صالح";
        else if (error.message?.includes("Password")) msg = "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل";
        toast.error(msg);
      } else {
        toast.success("تم إنشاء الحساب بنجاح! يمكنك الآن استخدام النظام.");
        navigate("/profile");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "ادخل بياناتك للوصول لحسابك" : "أنشئ حسابك للاستفادة من جميع الخدمات"}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="الاسم الثلاثي" required={!isLogin} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@edu.eg" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="pl-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-brand font-bold text-lg h-12" disabled={loading}>
              {loading ? "جاري المعالجة..." : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline font-medium">
              {isLogin ? "ليس لديك حساب؟ أنشئ حساب جديد" : "لديك حساب بالفعل؟ سجل دخولك"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
