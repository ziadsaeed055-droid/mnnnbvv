import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Mail, Phone, GraduationCap, Save, LogOut, Camera, MessageSquare, Send, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const collegeLabels: Record<string, string> = {
  egyptian_korean: "الكلية المصرية الكورية",
  technology: "الكلية التكنولوجية",
  industry: "كلية الصناعة والطاقة",
  other: "أخرى",
};

const ekcDepartments = [
  { value: "ict", label: "تكنولوجيا المعلومات والاتصالات (ICT)" },
  { value: "mechatronics", label: "الميكاترونيكس" },
  { value: "autotronics", label: "الأوتوترونيكس" },
  { value: "renewable_energy", label: "الطاقة المتجددة" },
  { value: "industrial_control", label: "التحكم في العمليات الصناعية" },
  { value: "railway", label: "السكة الحديد" },
  { value: "marketing", label: "التسويق" },
];

const Profile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [chatMsg, setChatMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCollege(profile.college || "");
      setDepartment((profile as any).department || "");
      setAvatarUrl((profile as any).avatar_url || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchChat = async () => {
      const { data } = await supabase.from("chat_messages").select("*").eq("sender_id", user.id).order("created_at", { ascending: true });
      setMessages((data as any[]) || []);
    };
    fetchChat();

    const channel = supabase.channel("user-chat").on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
      const msg = payload.new as any;
      if (msg.sender_id === user.id || (msg.is_admin && msg.receiver_id === user.id)) {
        setMessages(prev => [...prev, msg]);
      }
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
      setNotifications((data as any[]) || []);
    };
    fetchNotifications();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });
    if (error) { toast.error("خطأ في رفع الصورة"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
    setAvatarUrl(urlData.publicUrl);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl } as any).eq("user_id", user.id);
    await refreshProfile();
    toast.success("تم تحديث الصورة");
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, college, department, updated_at: new Date().toISOString() } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("خطأ في حفظ البيانات"); }
    else { toast.success("تم حفظ البيانات بنجاح"); await refreshProfile(); }
    setSaving(false);
  };

  const sendMessage = async () => {
    if (!user || !chatMsg.trim()) return;
    setSendingMsg(true);
    await supabase.from("chat_messages").insert({ sender_id: user.id, message: chatMsg.trim(), is_admin: false } as any);
    setChatMsg("");
    setSendingMsg(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast.success("تم تسجيل الخروج");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Avatar & Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="relative inline-block mb-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="الصورة الشخصية" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center border-4 border-primary/20">
              <User className="h-12 w-12 text-white" />
            </div>
          )}
          <button
            onClick={() => avatarRef.current?.click()}
            className="absolute bottom-0 left-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            disabled={uploading}
          >
            <Camera className="h-4 w-4" />
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{fullName || "الملف الشخصي"}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        {college && <p className="text-sm text-primary mt-1">{collegeLabels[college] || college}{department && ` - ${ekcDepartments.find(d => d.value === department)?.label || department}`}</p>}
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile"><User className="h-4 w-4 ml-1" /> بياناتي</TabsTrigger>
          <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 ml-1" /> المراسلات</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 ml-1" /> الإشعارات</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User size={16} /> الاسم الكامل</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="الاسم الكامل" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail size={16} /> البريد الإلكتروني</Label>
              <Input value={user.email || ""} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone size={16} /> رقم الهاتف</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><GraduationCap size={16} /> الكلية</Label>
              <Select value={college} onValueChange={v => { setCollege(v); setDepartment(""); }}>
                <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="egyptian_korean">الكلية المصرية الكورية</SelectItem>
                  <SelectItem value="technology">الكلية التكنولوجية</SelectItem>
                  <SelectItem value="industry">كلية الصناعة والطاقة</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {college === "egyptian_korean" && (
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                  <SelectContent>
                    {ekcDepartments.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="flex-1 bg-gradient-brand font-bold" disabled={saving}>
                <Save className="ml-2 h-4 w-4" /> {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
              <Button onClick={handleLogout} variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/30">
              <h3 className="font-bold text-foreground">محادثة مع إدارة الوحدة</h3>
              <p className="text-xs text-muted-foreground">أرسل رسالتك وسيتم الرد عليك في أقرب وقت</p>
            </div>
            <div className="h-[400px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && <p className="text-center text-muted-foreground text-sm py-10">لا توجد رسائل بعد. أرسل رسالتك الأولى!</p>}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.is_admin ? "bg-muted text-foreground rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"}`}>
                    {msg.message}
                    <p className={`text-[10px] mt-1 ${msg.is_admin ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1" onKeyDown={e => e.key === "Enter" && sendMessage()} />
              <Button onClick={sendMessage} size="icon" className="bg-gradient-brand shrink-0" disabled={sendingMsg}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">لا توجد إشعارات حالياً</p>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-3 p-4 bg-accent/30 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
