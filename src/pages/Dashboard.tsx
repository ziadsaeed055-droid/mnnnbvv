import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, FileText, AlertCircle, CheckCircle, Plus, Trash2, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  investigating: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  investigating: "قيد التحقيق",
  resolved: "تم الحل",
  closed: "مغلق",
};

const Dashboard = () => {
  const _auth = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Activity form
  const [actForm, setActForm] = useState({ title: "", description: "", type: "", location: "", date: "", image_url: "" });
  const [actDialog, setActDialog] = useState(false);

  // Library form
  const [libForm, setLibForm] = useState({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "" });
  const [libDialog, setLibDialog] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [r, v, a, l, d, s] = await Promise.all([
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
      supabase.from("activities").select("*").order("created_at", { ascending: false }),
      supabase.from("library_content").select("*").order("created_at", { ascending: false }),
      supabase.from("donations").select("*").order("created_at", { ascending: false }),
      supabase.from("safety_surveys").select("*"),
    ]);
    setReports(r.data || []);
    setVolunteers(v.data || []);
    setActivities(a.data || []);
    setLibraryItems(l.data || []);
    setDonations(d.data || []);
    setSurveys(s.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateReportStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) toast.error("خطأ في التحديث");
    else { toast.success("تم التحديث"); fetchAll(); }
  };

  const addActivity = async () => {
    if (!actForm.title || !actForm.description) { toast.error("يرجى ملء الحقول المطلوبة"); return; }
    const { error } = await supabase.from("activities").insert({
      ...actForm,
      date: actForm.date ? new Date(actForm.date).toISOString() : null,
      image_url: actForm.image_url || null,
      location: actForm.location || null,
      type: actForm.type || null,
    });
    if (error) toast.error("خطأ: " + error.message);
    else { toast.success("تمت الإضافة"); setActDialog(false); setActForm({ title: "", description: "", type: "", location: "", date: "", image_url: "" }); fetchAll(); }
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) toast.error("خطأ في الحذف");
    else { toast.success("تم الحذف"); fetchAll(); }
  };

  const addLibraryItem = async () => {
    if (!libForm.title) { toast.error("يرجى إدخال العنوان"); return; }
    const { error } = await supabase.from("library_content").insert({
      ...libForm,
      description: libForm.description || null,
      category: libForm.category || null,
      url: libForm.url || null,
      duration: libForm.duration || null,
      read_time: libForm.read_time || null,
    });
    if (error) toast.error("خطأ: " + error.message);
    else { toast.success("تمت الإضافة"); setLibDialog(false); setLibForm({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "" }); fetchAll(); }
  };

  const deleteLibraryItem = async (id: string) => {
    const { error } = await supabase.from("library_content").delete().eq("id", id);
    if (error) toast.error("خطأ في الحذف");
    else { toast.success("تم الحذف"); fetchAll(); }
  };

  const safetyIndex = surveys.length > 0
    ? Math.round((surveys.filter(s => s.feels_safe).length / surveys.length) * 100)
    : 0;

  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على نشاط الوحدة والإحصائيات</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">البلاغات</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{reports.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم حلها</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{reports.filter(r => r.status === "resolved").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتطوعين</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{volunteers.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأنشطة</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التبرعات</CardTitle>
            <Heart className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalDonations} ج.م</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="reports">البلاغات</TabsTrigger>
          <TabsTrigger value="volunteers">المتطوعين</TabsTrigger>
          <TabsTrigger value="activities">الأنشطة</TabsTrigger>
          <TabsTrigger value="library">المكتبة</TabsTrigger>
          <TabsTrigger value="donations">التبرعات</TabsTrigger>
          <TabsTrigger value="surveys">الاستبيانات</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>البلاغات الواردة ({reports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">لا توجد بلاغات حالياً</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((r) => (
                    <div key={r.id} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <p className="font-bold text-foreground">{r.is_anonymous ? "بلاغ مجهول" : r.reporter_name || "بدون اسم"}</p>
                          <p className="text-sm text-muted-foreground">الكلية: {r.college} • {new Date(r.created_at).toLocaleDateString("ar-EG")}</p>
                        </div>
                        <Badge className={statusColors[r.status] || ""}>{statusLabels[r.status] || r.status}</Badge>
                      </div>
                      <p className="text-sm text-foreground">{r.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>وسيلة تواصل: {r.contact_info}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {["pending", "investigating", "resolved", "closed"].map((s) => (
                          <Button key={s} size="sm" variant={r.status === s ? "default" : "outline"} onClick={() => updateReportStatus(r.id, s)} className="text-xs">
                            {statusLabels[s]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>طلبات التطوع ({volunteers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {volunteers.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">لا توجد طلبات حالياً</p>
              ) : (
                <div className="space-y-3">
                  {volunteers.map((v) => (
                    <div key={v.id} className="border border-border rounded-xl p-4 flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <p className="font-bold text-foreground">{v.name}</p>
                        <p className="text-sm text-muted-foreground">الكلية: {v.college} {v.phone && `• ${v.phone}`} {v.email && `• ${v.email}`}</p>
                        {v.skills && <p className="text-sm text-foreground mt-1">المهارات: {v.skills}</p>}
                        {v.reason && <p className="text-sm text-muted-foreground mt-1">السبب: {v.reason}</p>}
                      </div>
                      <Badge className={v.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {v.status === "approved" ? "مقبول" : "قيد المراجعة"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الأنشطة والفعاليات ({activities.length})</CardTitle>
              <Dialog open={actDialog} onOpenChange={setActDialog}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="ml-1 h-4 w-4" /> إضافة نشاط</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>إضافة نشاط جديد</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2"><Label>العنوان *</Label><Input value={actForm.title} onChange={(e) => setActForm({ ...actForm, title: e.target.value })} /></div>
                    <div className="space-y-2"><Label>الوصف *</Label><Textarea value={actForm.description} onChange={(e) => setActForm({ ...actForm, description: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>النوع</Label><Input value={actForm.type} onChange={(e) => setActForm({ ...actForm, type: e.target.value })} placeholder="ندوة، ورشة..." /></div>
                      <div className="space-y-2"><Label>المكان</Label><Input value={actForm.location} onChange={(e) => setActForm({ ...actForm, location: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>التاريخ</Label><Input type="datetime-local" value={actForm.date} onChange={(e) => setActForm({ ...actForm, date: e.target.value })} /></div>
                      <div className="space-y-2"><Label>رابط الصورة</Label><Input value={actForm.image_url} onChange={(e) => setActForm({ ...actForm, image_url: e.target.value })} placeholder="https://..." /></div>
                    </div>
                    <Button onClick={addActivity} className="w-full bg-gradient-brand">إضافة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">لا توجد أنشطة</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((a) => (
                    <div key={a.id} className="border border-border rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <p className="font-bold text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.type} {a.location && `• ${a.location}`} {a.date && `• ${new Date(a.date).toLocaleDateString("ar-EG")}`}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteActivity(a.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>المكتبة التوعوية ({libraryItems.length})</CardTitle>
              <Dialog open={libDialog} onOpenChange={setLibDialog}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="ml-1 h-4 w-4" /> إضافة محتوى</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>إضافة محتوى جديد</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={(e) => setLibForm({ ...libForm, title: e.target.value })} /></div>
                    <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={(e) => setLibForm({ ...libForm, description: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>النوع</Label>
                        <Select value={libForm.type} onValueChange={(v) => setLibForm({ ...libForm, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="article">مقال</SelectItem>
                            <SelectItem value="video">فيديو</SelectItem>
                            <SelectItem value="pdf">ملف PDF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={(e) => setLibForm({ ...libForm, category: e.target.value })} placeholder="أمان رقمي..." /></div>
                    </div>
                    <div className="space-y-2"><Label>الرابط</Label><Input value={libForm.url} onChange={(e) => setLibForm({ ...libForm, url: e.target.value })} placeholder="https://..." /></div>
                    <Button onClick={addLibraryItem} className="w-full bg-gradient-brand">إضافة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {libraryItems.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">لا يوجد محتوى</p>
              ) : (
                <div className="space-y-3">
                  {libraryItems.map((item) => (
                    <div key={item.id} className="border border-border rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <p className="font-bold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.type === "article" ? "مقال" : item.type === "video" ? "فيديو" : "PDF"} {item.category && `• ${item.category}`}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteLibraryItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>التبرعات ({donations.length}) - إجمالي: {totalDonations} ج.م</CardTitle>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">لا توجد تبرعات</p>
              ) : (
                <div className="space-y-3">
                  {donations.map((d) => (
                    <div key={d.id} className="border border-border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-foreground">{d.donor_name || "متبرع مجهول"} - {d.amount} ج.م</p>
                        <p className="text-sm text-muted-foreground">{d.phone} • {new Date(d.created_at).toLocaleDateString("ar-EG")}</p>
                      </div>
                      <Badge className={d.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {d.status === "confirmed" ? "مؤكد" : "قيد التأكيد"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Surveys Tab */}
        <TabsContent value="surveys">
          <Card>
            <CardHeader>
              <CardTitle>نتائج الاستبيانات ({surveys.length} مشاركة)</CardTitle>
              <CardDescription>مؤشر الأمان الحالي: {safetyIndex}%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-accent rounded-xl">
                  <p className="text-3xl font-bold text-primary">{safetyIndex}%</p>
                  <p className="text-sm text-muted-foreground mt-1">يشعرون بالأمان</p>
                </div>
                <div className="text-center p-6 bg-accent rounded-xl">
                  <p className="text-3xl font-bold text-primary">
                    {surveys.length > 0 ? Math.round((surveys.filter(s => s.knows_rights).length / surveys.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">يعرفون حقوقهم</p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-destructive">
                    {surveys.length > 0 ? Math.round((surveys.filter(s => s.harassed).length / surveys.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">تعرضوا للمضايقة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
