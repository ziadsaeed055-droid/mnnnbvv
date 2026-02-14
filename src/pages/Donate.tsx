import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Smartphone, CreditCard, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const amounts = [50, 100, 200, 500];

const Donate = () => {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("donations").insert({
      donor_name: donorName || null,
      amount: Number(amount),
      phone: phone || null,
      email: email || null,
      message: message || null,
    });

    if (error) {
      toast.error("حدث خطأ، يرجى المحاولة لاحقاً");
    } else {
      setSuccess(true);
      toast.success("شكراً لتبرعك الكريم!");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-10 w-10" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-4">شكراً لك!</h2>
        <p className="text-muted-foreground mb-2">تم تسجيل نية التبرع بنجاح. سيتم التواصل معك لإتمام عملية التحويل.</p>
        <p className="text-sm text-muted-foreground mb-8">رقم فودافون كاش: <span className="font-bold font-mono text-foreground">01012345678</span></p>
        <Button onClick={() => setSuccess(false)} variant="outline">تبرع مرة أخرى</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-secondary mb-4">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">تبرع لدعم الوحدة</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          مساهمتك تساعدنا في تنظيم المزيد من الأنشطة التوعوية والندوات وتقديم الدعم النفسي للمحتاجين.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>اختر مبلغ التبرع (جنيه مصري)</Label>
              <div className="grid grid-cols-4 gap-3">
                {amounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`py-3 rounded-xl font-bold text-lg border-2 transition-all ${
                      amount === a
                        ? "border-primary bg-accent text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                min={1}
                placeholder="أو أدخل مبلغاً آخر"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>الاسم (اختياري)</Label>
              <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="اسمك الكريم" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>رسالة (اختياري)</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="كلمة تشجيعية..." />
            </div>

            <Button type="submit" className="w-full bg-gradient-brand font-bold text-lg h-12" disabled={submitting}>
              {submitting ? "جاري الإرسال..." : "تأكيد التبرع"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-accent rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Smartphone className="h-6 w-6" />
              <h3 className="font-bold text-lg">فودافون كاش</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">يمكنك التحويل مباشرة على الرقم التالي:</p>
            <p className="font-bold font-mono text-xl text-foreground text-center bg-card rounded-lg py-3 border border-border">01012345678</p>
            <p className="text-xs text-muted-foreground mt-2 text-center">سيتم تأكيد التبرع بعد التحقق من التحويل</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <CreditCard className="h-6 w-6" />
              <h3 className="font-bold text-lg">طرق أخرى</h3>
            </div>
            <p className="text-sm text-muted-foreground">سيتم إضافة طرق دفع إلكترونية إضافية قريباً.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
