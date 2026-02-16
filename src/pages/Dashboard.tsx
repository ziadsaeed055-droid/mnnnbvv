import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, FileText, AlertCircle, CheckCircle, Plus, Trash2, Heart, Upload, Image, Video, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const callDashboardApi = async (action: string, body?: any) => {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dashboard-api?action=${action}`;
  const options: RequestInit = {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "خطأ في الخادم");
  }
  return res.json();
};

const Dashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Activity form
  const [actForm, setActForm] = useState({ title: "", description: "", type: "seminar", location: "", date: "", organizer: "", target_audience: "", notes: "", max_attendees: "", contact_info: "", status: "upcoming" });
  const [actDialog, setActDialog] = useState(false);
  const [actImage, setActImage] = useState<File | null>(null);
  const [actUploading, setActUploading] = useState(false);
  const actImageRef = useRef<HTMLInputElement>(null);

  // Library forms - separate dialogs
  const [articleDialog, setArticleDialog] = useState(false);
  const [videoDialog, setVideoDialog] = useState(false);
  const [pdfDialog, setPdfDialog] = useState(false);
  const [infographicDialog, setInfographicDialog] = useState(false);

  const [libForm, setLibForm] = useState({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "", thumbnail_url: "" });
  const [libVideo, setLibVideo] = useState<File | null>(null);
  const [libUploading, setLibUploading] = useState(false);
  const libVideoRef = useRef<HTMLInputElement>(null);

  const fetchAll = async () => {
    try {
      const data = await callDashboardApi("fetch");
      setReports(data.reports || []);
      setVolunteers(data.volunteers || []);
      setActivities(data.activities || []);
      setLibraryItems(data.library || []);
      setDonations(data.donations || []);
      setSurveys(data.surveys || []);
    } catch (e: any) {
      toast.error("خطأ في تحميل البيانات: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateReportStatus = async (id: string, status: string) => {
    try {
      await callDashboardApi("update-report-status", { id, status });
      toast.success("تم التحديث");
      fetchAll();
    } catch { toast.error("خطأ في التحديث"); }
  };

  const addActivity = async () => {
    if (!actForm.title || !actForm.description) { toast.error("يرجى ملء العنوان والوصف"); return; }
    setActUploading(true);
    try {
      let image_url = null;
      if (actImage) {
        const fileName = `${Date.now()}-${actImage.name}`;
        const { data, error } = await supabase.storage.from("activity-images").upload(fileName, actImage);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("activity-images").getPublicUrl(data.path);
        image_url = urlData.publicUrl;
      }
      await callDashboardApi("add-activity", {
        title: actForm.title,
        description: actForm.description,
        date: actForm.date ? new Date(actForm.date).toISOString() : null,
        image_url,
        location: actForm.location || null,
        type: actForm.type || null,
        organizer: actForm.organizer || null,
        target_audience: actForm.target_audience || null,
        notes: actForm.notes || null,
        max_attendees: actForm.max_attendees ? parseInt(actForm.max_attendees) : null,
        contact_info: actForm.contact_info || null,
        status: actForm.status || "upcoming",
      });
      toast.success("تمت إضافة النشاط بنجاح");
      setActDialog(false);
      setActForm({ title: "", description: "", type: "seminar", location: "", date: "", organizer: "", target_audience: "", notes: "", max_attendees: "", contact_info: "", status: "upcoming" });
      setActImage(null);
      fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
    setActUploading(false);
  };

  const deleteActivity = async (id: string) => {
    try {
      await callDashboardApi("delete-activity", { id });
      toast.success("تم الحذف");
      fetchAll();
    } catch { toast.error("خطأ في الحذف"); }
  };

  const addLibraryItem = async (type: string) => {
    if (!libForm.title) { toast.error("يرجى إدخال العنوان"); return; }
    setLibUploading(true);
    try {
      let url = libForm.url || null;
      if (type === "video" && libVideo) {
        const fileName = `${Date.now()}-${libVideo.name}`;
        const { data, error } = await supabase.storage.from("library-videos").upload(fileName, libVideo);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("library-videos").getPublicUrl(data.path);
        url = urlData.publicUrl;
      }
      await callDashboardApi("add-library", {
        title: libForm.title,
        description: libForm.description || null,
        type,
        category: libForm.category || null,
        url,
        duration: libForm.duration || null,
        read_time: libForm.read_time || null,
        thumbnail_url: libForm.thumbnail_url || null,
      });
      toast.success("تمت الإضافة بنجاح");
      setArticleDialog(false); setVideoDialog(false); setPdfDialog(false); setInfographicDialog(false);
      setLibForm({ title: "", description: "", type: "article", category: "", url: "", duration: "", read_time: "", thumbnail_url: "" });
      setLibVideo(null);
      fetchAll();
    } catch (e: any) { toast.error("خطأ: " + e.message); }
    setLibUploading(false);
  };

  const deleteLibraryItem = async (id: string) => {
    try {
      await callDashboardApi("delete-library", { id });
      toast.success("تم الحذف");
      fetchAll();
    } catch { toast.error("خطأ في الحذف"); }
  };

  const safetyIndex = surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.feels_safe).length / surveys.length) * 100) : 0;
  const totalDonations = donations.reduce((sum: number, d: any) => sum + Number(d.amount), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على نشاط الوحدة والإحصائيات</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-8 bg-muted animate-pulse rounded" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">البلاغات</CardTitle><AlertCircle className="h-4 w-4 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold">{reports.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">تم حلها</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{reports.filter((r: any) => r.status === "resolved").length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">المتطوعين</CardTitle><Users className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{volunteers.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">الأنشطة</CardTitle><FileText className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">التبرعات</CardTitle><Heart className="h-4 w-4 text-secondary" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalDonations} ج.م</div></CardContent></Card>
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
                <CardHeader><CardTitle>البلاغات الواردة ({reports.length})</CardTitle></CardHeader>
                <CardContent>
                  {reports.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد بلاغات حالياً</p> : (
                    <div className="space-y-4">
                      {reports.map((r: any) => (
                        <div key={r.id} className="border border-border rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <p className="font-bold text-foreground">{r.is_anonymous ? "بلاغ مجهول" : r.reporter_name || "بدون اسم"}</p>
                              <p className="text-sm text-muted-foreground">الكلية: {r.college} • {new Date(r.created_at).toLocaleDateString("ar-EG")}</p>
                            </div>
                            <Badge className={statusColors[r.status] || ""}>{statusLabels[r.status] || r.status}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{r.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>وسيلة تواصل: {r.contact_info}</span></div>
                          <div className="flex gap-2 flex-wrap">
                            {["pending", "investigating", "resolved", "closed"].map((s) => (
                              <Button key={s} size="sm" variant={r.status === s ? "default" : "outline"} onClick={() => updateReportStatus(r.id, s)} className="text-xs">{statusLabels[s]}</Button>
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
                <CardHeader><CardTitle>طلبات التطوع ({volunteers.length})</CardTitle></CardHeader>
                <CardContent>
                  {volunteers.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد طلبات حالياً</p> : (
                    <div className="space-y-3">
                      {volunteers.map((v: any) => (
                        <div key={v.id} className="border border-border rounded-xl p-4 space-y-2">
                          <div className="flex justify-between items-start flex-wrap gap-3">
                            <div>
                              <p className="font-bold text-foreground text-lg">{v.name}</p>
                              <p className="text-sm text-muted-foreground">الكلية: {v.college} {v.department && `• القسم: ${v.department}`}</p>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                                {v.phone && <span>📞 {v.phone}</span>}
                                {v.email && <span>✉️ {v.email}</span>}
                                {v.gender && <span>👤 {v.gender === "male" ? "ذكر" : "أنثى"}</span>}
                                {v.national_id && <span>🪪 {v.national_id}</span>}
                                {v.birth_date && <span>🎂 {new Date(v.birth_date).toLocaleDateString("ar-EG")}</span>}
                              </div>
                              {v.skills && <p className="text-sm text-foreground mt-1">المهارات: {v.skills}</p>}
                              {v.reason && <p className="text-sm text-muted-foreground mt-1">السبب: {v.reason}</p>}
                            </div>
                            <Badge className={v.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {v.status === "approved" ? "مقبول" : "قيد المراجعة"}
                            </Badge>
                          </div>
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
                    <DialogTrigger asChild><Button size="sm"><Plus className="ml-1 h-4 w-4" /> إضافة نشاط</Button></DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>إضافة نشاط جديد</DialogTitle>
                        <DialogDescription>أضف نشاطاً أو فعالية جديدة للوحدة بكل تفاصيلها</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>العنوان *</Label><Input value={actForm.title} onChange={(e) => setActForm({ ...actForm, title: e.target.value })} placeholder="اسم النشاط أو الفعالية" /></div>
                          <div className="space-y-2">
                            <Label>نوع النشاط</Label>
                            <Select value={actForm.type} onValueChange={(v) => setActForm({ ...actForm, type: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="seminar">ندوة</SelectItem>
                                <SelectItem value="workshop">ورشة عمل</SelectItem>
                                <SelectItem value="campaign">حملة توعوية</SelectItem>
                                <SelectItem value="training">تدريب</SelectItem>
                                <SelectItem value="conference">مؤتمر</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2"><Label>الوصف التفصيلي *</Label><Textarea value={actForm.description} onChange={(e) => setActForm({ ...actForm, description: e.target.value })} className="min-h-[100px]" placeholder="وصف تفصيلي للنشاط وأهدافه..." /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>المكان</Label><Input value={actForm.location} onChange={(e) => setActForm({ ...actForm, location: e.target.value })} placeholder="مثال: قاعة المؤتمرات" /></div>
                          <div className="space-y-2"><Label>التاريخ والوقت</Label><Input type="datetime-local" value={actForm.date} onChange={(e) => setActForm({ ...actForm, date: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>الجهة المنظمة</Label><Input value={actForm.organizer} onChange={(e) => setActForm({ ...actForm, organizer: e.target.value })} placeholder="مثال: وحدة مناهضة العنف" /></div>
                          <div className="space-y-2"><Label>الفئة المستهدفة</Label><Input value={actForm.target_audience} onChange={(e) => setActForm({ ...actForm, target_audience: e.target.value })} placeholder="مثال: جميع الطلاب" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>الحد الأقصى للحضور</Label><Input type="number" value={actForm.max_attendees} onChange={(e) => setActForm({ ...actForm, max_attendees: e.target.value })} placeholder="مثال: 100" /></div>
                          <div className="space-y-2"><Label>وسيلة التواصل</Label><Input value={actForm.contact_info} onChange={(e) => setActForm({ ...actForm, contact_info: e.target.value })} placeholder="رقم هاتف أو بريد إلكتروني" /></div>
                        </div>
                        <div className="space-y-2">
                          <Label>الحالة</Label>
                          <Select value={actForm.status} onValueChange={(v) => setActForm({ ...actForm, status: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upcoming">قادم</SelectItem>
                              <SelectItem value="ongoing">جاري</SelectItem>
                              <SelectItem value="completed">منتهي</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label>ملاحظات إضافية</Label><Textarea value={actForm.notes} onChange={(e) => setActForm({ ...actForm, notes: e.target.value })} placeholder="أي ملاحظات إضافية..." /></div>
                        
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label>صورة النشاط</Label>
                          <div 
                            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => actImageRef.current?.click()}
                          >
                            {actImage ? (
                              <div className="space-y-2">
                                <img src={URL.createObjectURL(actImage)} alt="preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                                <p className="text-sm text-muted-foreground">{actImage.name}</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm font-medium text-foreground">اضغط لرفع صورة</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP حتى 5MB</p>
                              </>
                            )}
                          </div>
                          <input ref={actImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => setActImage(e.target.files?.[0] || null)} />
                        </div>

                        <Button onClick={addActivity} className="w-full bg-gradient-brand" disabled={actUploading}>
                          {actUploading ? "جاري الرفع والإضافة..." : "إضافة النشاط"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد أنشطة</p> : (
                    <div className="space-y-3">
                      {activities.map((a: any) => (
                        <div key={a.id} className="border border-border rounded-xl p-4 flex justify-between items-start gap-4">
                          <div className="flex gap-4 items-start flex-1">
                            {a.image_url && <img src={a.image_url} alt={a.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />}
                            <div>
                              <p className="font-bold text-foreground">{a.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {a.type && <span className="bg-accent px-2 py-0.5 rounded text-xs text-primary ml-2">{a.type}</span>}
                                {a.location && ` ${a.location}`}
                                {a.date && ` • ${new Date(a.date).toLocaleDateString("ar-EG")}`}
                              </p>
                              {a.organizer && <p className="text-xs text-muted-foreground mt-1">المنظم: {a.organizer}</p>}
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteActivity(a.id)}><Trash2 className="h-4 w-4" /></Button>
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
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                  <CardTitle>المكتبة التوعوية ({libraryItems.length})</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Dialog open={articleDialog} onOpenChange={setArticleDialog}>
                      <DialogTrigger asChild><Button size="sm" variant="outline"><BookOpen className="ml-1 h-4 w-4" /> مقال</Button></DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>إضافة مقال جديد</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={(e) => setLibForm({ ...libForm, title: e.target.value })} /></div>
                          <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={(e) => setLibForm({ ...libForm, description: e.target.value })} /></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={(e) => setLibForm({ ...libForm, category: e.target.value })} placeholder="حقوق، أمان رقمي..." /></div>
                            <div className="space-y-2"><Label>وقت القراءة</Label><Input value={libForm.read_time} onChange={(e) => setLibForm({ ...libForm, read_time: e.target.value })} placeholder="5 دقائق" /></div>
                          </div>
                          <div className="space-y-2"><Label>رابط المقال</Label><Input value={libForm.url} onChange={(e) => setLibForm({ ...libForm, url: e.target.value })} placeholder="https://..." /></div>
                          <Button onClick={() => addLibraryItem("article")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الإضافة..." : "إضافة المقال"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
                      <DialogTrigger asChild><Button size="sm" variant="outline"><Video className="ml-1 h-4 w-4" /> فيديو</Button></DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>إضافة فيديو جديد</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={(e) => setLibForm({ ...libForm, title: e.target.value })} /></div>
                          <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={(e) => setLibForm({ ...libForm, description: e.target.value })} /></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={(e) => setLibForm({ ...libForm, category: e.target.value })} /></div>
                            <div className="space-y-2"><Label>المدة</Label><Input value={libForm.duration} onChange={(e) => setLibForm({ ...libForm, duration: e.target.value })} placeholder="10:30" /></div>
                          </div>
                          <div className="space-y-2">
                            <Label>رفع الفيديو</Label>
                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => libVideoRef.current?.click()}>
                              {libVideo ? (
                                <p className="text-sm text-primary font-medium">✅ {libVideo.name}</p>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm font-medium text-foreground">اضغط لرفع الفيديو</p>
                                  <p className="text-xs text-muted-foreground">MP4, WebM حتى 50MB</p>
                                </>
                              )}
                            </div>
                            <input ref={libVideoRef} type="file" accept="video/*" className="hidden" onChange={(e) => setLibVideo(e.target.files?.[0] || null)} />
                          </div>
                          <Button onClick={() => addLibraryItem("video")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الرفع..." : "إضافة الفيديو"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={pdfDialog} onOpenChange={setPdfDialog}>
                      <DialogTrigger asChild><Button size="sm" variant="outline"><FileText className="ml-1 h-4 w-4" /> PDF</Button></DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>إضافة ملف PDF</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={(e) => setLibForm({ ...libForm, title: e.target.value })} /></div>
                          <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={(e) => setLibForm({ ...libForm, description: e.target.value })} /></div>
                          <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={(e) => setLibForm({ ...libForm, category: e.target.value })} /></div>
                          <div className="space-y-2"><Label>رابط الملف</Label><Input value={libForm.url} onChange={(e) => setLibForm({ ...libForm, url: e.target.value })} placeholder="https://..." /></div>
                          <Button onClick={() => addLibraryItem("pdf")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الإضافة..." : "إضافة الملف"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={infographicDialog} onOpenChange={setInfographicDialog}>
                      <DialogTrigger asChild><Button size="sm" variant="outline"><Image className="ml-1 h-4 w-4" /> إنفوجرافيك</Button></DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>إضافة إنفوجرافيك</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2"><Label>العنوان *</Label><Input value={libForm.title} onChange={(e) => setLibForm({ ...libForm, title: e.target.value })} /></div>
                          <div className="space-y-2"><Label>الوصف</Label><Textarea value={libForm.description} onChange={(e) => setLibForm({ ...libForm, description: e.target.value })} /></div>
                          <div className="space-y-2"><Label>التصنيف</Label><Input value={libForm.category} onChange={(e) => setLibForm({ ...libForm, category: e.target.value })} /></div>
                          <div className="space-y-2"><Label>رابط الصورة</Label><Input value={libForm.url} onChange={(e) => setLibForm({ ...libForm, url: e.target.value })} placeholder="https://..." /></div>
                          <Button onClick={() => addLibraryItem("infographic")} className="w-full bg-gradient-brand" disabled={libUploading}>{libUploading ? "جاري الإضافة..." : "إضافة الإنفوجرافيك"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {libraryItems.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا يوجد محتوى</p> : (
                    <div className="space-y-3">
                      {libraryItems.map((item: any) => (
                        <div key={item.id} className="border border-border rounded-xl p-4 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.type === "article" ? "📄 مقال" : item.type === "video" ? "🎬 فيديو" : item.type === "infographic" ? "📊 إنفوجرافيك" : "📋 PDF"}
                              </Badge>
                              {item.category && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.category}</span>}
                            </div>
                            <p className="font-bold text-foreground">{item.title}</p>
                            {item.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.description}</p>}
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
                <CardHeader><CardTitle>التبرعات ({donations.length}) - إجمالي: {totalDonations} ج.م</CardTitle></CardHeader>
                <CardContent>
                  {donations.length === 0 ? <p className="text-center py-10 text-muted-foreground">لا توجد تبرعات</p> : (
                    <div className="space-y-3">
                      {donations.map((d: any) => (
                        <div key={d.id} className="border border-border rounded-xl p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-foreground">{d.donor_name || "متبرع مجهول"} - {d.amount} ج.م</p>
                            <p className="text-sm text-muted-foreground">{d.phone} • {new Date(d.created_at).toLocaleDateString("ar-EG")}</p>
                          </div>
                          <Badge className={d.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{d.status === "confirmed" ? "مؤكد" : "قيد التأكيد"}</Badge>
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
                    <div className="text-center p-6 bg-accent rounded-xl"><p className="text-3xl font-bold text-primary">{safetyIndex}%</p><p className="text-sm text-muted-foreground mt-1">يشعرون بالأمان</p></div>
                    <div className="text-center p-6 bg-accent rounded-xl"><p className="text-3xl font-bold text-primary">{surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.knows_rights).length / surveys.length) * 100) : 0}%</p><p className="text-sm text-muted-foreground mt-1">يعرفون حقوقهم</p></div>
                    <div className="text-center p-6 bg-red-50 rounded-xl"><p className="text-3xl font-bold text-destructive">{surveys.length > 0 ? Math.round((surveys.filter((s: any) => s.harassed).length / surveys.length) * 100) : 0}%</p><p className="text-sm text-muted-foreground mt-1">تعرضوا للمضايقة</p></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
