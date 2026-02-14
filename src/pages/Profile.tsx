import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Phone, GraduationCap, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCollege(profile.college || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, college, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) {
      toast.error("خطأ في حفظ البيانات");
    } else {
      toast.success("تم حفظ البيانات بنجاح");
      await refreshProfile();
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast.success("تم تسجيل الخروج");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">الملف الشخصي</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><User size={16} /> الاسم الكامل</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="الاسم الكامل" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Mail size={16} /> البريد الإلكتروني</Label>
          <Input value={user.email || ""} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Phone size={16} /> رقم الهاتف</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2"><GraduationCap size={16} /> الكلية</Label>
          <Select value={college} onValueChange={setCollege}>
            <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">الكلية التكنولوجية</SelectItem>
              <SelectItem value="industry">كلية الصناعة والطاقة</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-gradient-brand font-bold" disabled={saving}>
            <Save className="ml-2 h-4 w-4" />
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
          <Button onClick={handleLogout} variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
