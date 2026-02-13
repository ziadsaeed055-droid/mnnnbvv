
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Sparkles } from "lucide-react";

const Volunteer = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-100 text-secondary mb-6">
            <Heart className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">تطوعي معنا</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            كوني جزءاً من التغيير! انضمامك لفريق المتطوعين يعني مساهمتك المباشرة في خلق بيئة جامعية أكثر أماناً ووعياً. نحن نبحث دائماً عن طاقات شابة شغوفة.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-primary shrink-0 mt-1">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">المشاركة المجتمعية</h3>
                <p className="text-sm text-gray-500">المشاركة في تنظيم الفعاليات والحملات داخل الجامعة.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-primary shrink-0 mt-1">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">تطوير المهارات</h3>
                <p className="text-sm text-gray-500">الحصول على تدريبات خاصة وشهادات خبرة في العمل التطوعي.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">استمارة التطوع</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم بالكامل</Label>
                <Input id="name" placeholder="الاسم رباعي" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" placeholder="01xxxxxxxxx" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="example@edu.eg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">الكلية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الكلية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">الكلية التكنولوجية</SelectItem>
                  <SelectItem value="industry">كلية الصناعة والطاقة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">مهاراتك</Label>
              <Textarea id="skills" placeholder="تصميم، تنظيم، تصوير، كتابة محتوى..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">لماذا تريدين التطوع معنا؟</Label>
              <Textarea id="reason" placeholder="حدثينا عن دافعك..." />
            </div>

            <Button type="submit" size="lg" className="w-full bg-gradient-brand font-bold mt-4">
              إرسال طلب الانضمام
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
