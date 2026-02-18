import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Send, Plus, Clock, User, ChevronDown, ChevronUp, Trash2, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const categoryLabels: Record<string, string> = {
  general: "عام",
  awareness: "توعية",
  rights: "حقوق",
  experience: "تجارب",
  question: "سؤال",
  suggestion: "اقتراح",
};

const categoryColors: Record<string, string> = {
  general: "bg-muted text-muted-foreground",
  awareness: "bg-blue-100 text-blue-700",
  rights: "bg-purple-100 text-purple-700",
  experience: "bg-green-100 text-green-700",
  question: "bg-amber-100 text-amber-700",
  suggestion: "bg-pink-100 text-pink-700",
};

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [postForm, setPostForm] = useState({ title: "", content: "", category: "general" });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    const [postsRes, likesRes, commentsRes, profilesRes] = await Promise.all([
      supabase.from("forum_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("forum_likes").select("*"),
      supabase.from("forum_comments").select("*").order("created_at", { ascending: true }),
      supabase.from("profiles").select("user_id, full_name, avatar_url"),
    ]);
    setPosts((postsRes.data as any[]) || []);
    setLikes((likesRes.data as any[]) || []);
    setComments((commentsRes.data as any[]) || []);
    const pMap: Record<string, any> = {};
    (profilesRes.data || []).forEach((p: any) => { pMap[p.user_id] = p; });
    setProfiles(pMap);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const createPost = async () => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    if (!postForm.title || !postForm.content) { toast.error("يرجى ملء العنوان والمحتوى"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("forum_posts").insert({
      user_id: user.id,
      title: postForm.title,
      content: postForm.content,
      category: postForm.category,
    } as any);
    if (error) { toast.error("خطأ في النشر"); console.error(error); }
    else {
      toast.success("تم نشر المنشور بنجاح!");
      setNewPostDialog(false);
      setPostForm({ title: "", content: "", category: "general" });
      fetchData();
    }
    setSubmitting(false);
  };

  const toggleLike = async (postId: string) => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    const existing = likes.find(l => l.post_id === postId && l.user_id === user.id);
    if (existing) {
      await supabase.from("forum_likes").delete().eq("id", existing.id);
    } else {
      await supabase.from("forum_likes").insert({ post_id: postId, user_id: user.id } as any);
    }
    fetchData();
  };

  const addComment = async (postId: string) => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    const text = commentText[postId]?.trim();
    if (!text) return;
    const { error } = await supabase.from("forum_comments").insert({
      post_id: postId, user_id: user.id, content: text,
    } as any);
    if (error) { toast.error("خطأ في إضافة التعليق"); }
    else {
      setCommentText({ ...commentText, [postId]: "" });
      fetchData();
    }
  };

  const deletePost = async (postId: string) => {
    await supabase.from("forum_posts").delete().eq("id", postId);
    fetchData();
    toast.success("تم حذف المنشور");
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("forum_comments").delete().eq("id", commentId);
    fetchData();
  };

  const sharePost = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/forum#${postId}`);
    toast.success("تم نسخ رابط المنشور");
  };

  const filteredPosts = filter === "all" ? posts : posts.filter(p => p.category === filter);

  const getPostComments = (postId: string) => comments.filter(c => c.post_id === postId);
  const hasLiked = (postId: string) => user ? likes.some(l => l.post_id === postId && l.user_id === user.id) : false;
  const getLikeCount = (postId: string) => likes.filter(l => l.post_id === postId).length;

  const getProfileName = (userId: string) => profiles[userId]?.full_name || "مستخدم";
  const getProfileAvatar = (userId: string) => profiles[userId]?.avatar_url;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">المنتدى</h1>
          <p className="text-muted-foreground">شارك أفكارك وتجاربك مع مجتمع الجامعة</p>
        </div>
        {user ? (
          <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-brand font-bold"><Plus className="ml-2 h-4 w-4" /> منشور جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>إنشاء منشور جديد</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>العنوان *</Label>
                  <Input value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} placeholder="عنوان المنشور" />
                </div>
                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <Select value={postForm.category} onValueChange={v => setPostForm({ ...postForm, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المحتوى *</Label>
                  <Textarea value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} className="min-h-[150px]" placeholder="اكتب ما تريد مشاركته..." />
                </div>
                <Button onClick={createPost} className="w-full bg-gradient-brand" disabled={submitting}>
                  {submitting ? "جاري النشر..." : "نشر المنشور"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Link to="/auth"><Button variant="outline">سجل دخولك للمشاركة</Button></Link>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>الكل</Button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)}>{v}</Button>
        ))}
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">لا توجد منشورات بعد. كن أول من ينشر!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredPosts.map((post) => {
              const postComments = getPostComments(post.id);
              const isExpanded = expandedPost === post.id;
              return (
                <motion.div
                  key={post.id}
                  id={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Post header */}
                    <div className="flex items-center gap-3 mb-4">
                      {getProfileAvatar(post.user_id) ? (
                        <img src={getProfileAvatar(post.user_id)} alt="" className="w-10 h-10 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">{getProfileName(post.user_id)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(post.created_at)}</p>
                      </div>
                      <Badge className={categoryColors[post.category] || "bg-muted"}>{categoryLabels[post.category] || post.category}</Badge>
                    </div>

                    {/* Post content */}
                    <h3 className="text-lg font-bold text-foreground mb-2">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${hasLiked(post.id) ? "text-red-500 font-bold" : "text-muted-foreground hover:text-red-500"}`}>
                        <Heart className={`h-4 w-4 ${hasLiked(post.id) ? "fill-red-500" : ""}`} />
                        <span>{getLikeCount(post.id)}</span>
                      </button>
                      <button onClick={() => setExpandedPost(isExpanded ? null : post.id)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{postComments.length} تعليق</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                      <button onClick={() => sharePost(post.id)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>مشاركة</span>
                      </button>
                      {user?.id === post.user_id && (
                        <button onClick={() => deletePost(post.id)} className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors mr-auto">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comments section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border bg-muted/20">
                        <div className="p-6 space-y-4">
                          {postComments.length === 0 && <p className="text-sm text-muted-foreground text-center">لا توجد تعليقات بعد</p>}
                          {postComments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                                {getProfileAvatar(comment.user_id) ? (
                                  <img src={getProfileAvatar(comment.user_id)} alt="" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <User className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 bg-card p-3 rounded-xl border border-border">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-bold text-foreground">{getProfileName(comment.user_id)}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
                                    {user?.id === comment.user_id && (
                                      <button onClick={() => deleteComment(comment.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                          {user && (
                            <div className="flex gap-3 items-center">
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0"><User className="h-4 w-4 text-primary" /></div>
                              <div className="flex-1 flex gap-2">
                                <Input
                                  value={commentText[post.id] || ""}
                                  onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                  placeholder="أضف تعليقاً..."
                                  className="flex-1"
                                  onKeyDown={e => e.key === "Enter" && addComment(post.id)}
                                />
                                <Button size="icon" onClick={() => addComment(post.id)} className="bg-gradient-brand shrink-0"><Send className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Forum;
