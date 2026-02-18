import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Heart, ThumbsUp, Smile, Download, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let id = sessionStorage.getItem("session_id");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("session_id", id); }
  return id;
};

const reactionIcons: Record<string, { icon: any; label: string; color: string }> = {
  like: { icon: ThumbsUp, label: "إعجاب", color: "text-blue-500" },
  love: { icon: Heart, label: "أحببته", color: "text-red-500" },
  smile: { icon: Smile, label: "مفيد", color: "text-yellow-500" },
};

const ArticleCard = ({ article, ReactionButtons }: { article: any; ReactionButtons: any }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className="bg-accent p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">{article.title}</h3>
          <div className="flex gap-3 text-sm text-muted-foreground mt-1">
            {article.category && <span className="bg-muted px-2 py-0.5 rounded text-xs">{article.category}</span>}
            {article.read_time && <span>{article.read_time} قراءة</span>}
            <span className="text-xs">{new Date(article.created_at).toLocaleDateString("ar-EG")}</span>
          </div>
          {article.description && <p className="text-sm text-muted-foreground mt-2">{article.description}</p>}
          {article.content && (
            <div className="mt-3">
              <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-sm text-primary font-bold hover:underline">
                {expanded ? "إخفاء المحتوى" : "قراءة المقال الكامل"}
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expanded && (
                <div className="mt-3 p-4 bg-muted/30 rounded-xl border border-border">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{article.content}</p>
                </div>
              )}
            </div>
          )}
          {article.type === "pdf" && article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm text-primary font-bold hover:underline">
              <Download className="h-4 w-4" /> تحميل الملف PDF
            </a>
          )}
          <ReactionButtons itemId={article.id} />
        </div>
      </div>
    </div>
  );
};

const Library = () => {
  const [items, setItems] = useState<any[]>([]);
  const [reactions, setReactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  const fetchData = async () => {
    const [itemsRes, reactionsRes] = await Promise.all([
      supabase.from("library_content").select("*").order("created_at", { ascending: false }),
      supabase.from("content_reactions").select("*"),
    ]);
    setItems(itemsRes.data || []);
    setReactions(reactionsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleReaction = async (contentId: string, type: string) => {
    const existing = reactions.find(r => r.content_id === contentId && r.reaction_type === type && r.session_id === sessionId);
    if (existing) {
      await supabase.from("content_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("content_reactions").insert({ content_id: contentId, reaction_type: type, session_id: sessionId, content_type: "library" } as any);
    }
    fetchData();
  };

  const getReactionCount = (contentId: string, type: string) => reactions.filter(r => r.content_id === contentId && r.reaction_type === type).length;
  const hasReacted = (contentId: string, type: string) => reactions.some(r => r.content_id === contentId && r.reaction_type === type && r.session_id === sessionId);

  const articles = items.filter(i => i.type === "article");
  const pdfs = items.filter(i => i.type === "pdf");
  const videos = items.filter(i => i.type === "video");
  const infographics = items.filter(i => i.type === "infographic");

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">جاري التحميل...</div>;

  const ReactionButtons = ({ itemId }: { itemId: string }) => (
    <div className="flex gap-1 mt-3">
      {Object.entries(reactionIcons).map(([key, { icon: Icon, color }]) => {
        const count = getReactionCount(itemId, key);
        const reacted = hasReacted(itemId, key);
        return (
          <button key={key} onClick={(e) => { e.stopPropagation(); toggleReaction(itemId, key); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${reacted ? "bg-accent border border-primary/30 font-bold" : "bg-muted hover:bg-accent border border-transparent"}`}>
            <Icon className={`h-3.5 w-3.5 ${reacted ? color : "text-muted-foreground"}`} />
            {count > 0 && <span className={reacted ? color : "text-muted-foreground"}>{count}</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">المكتبة التوعوية</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">مصدرك الموثوق للمعلومات حول حقوقك، الأمان الرقمي، والصحة النفسية.</p>
      </div>

      <Tabs defaultValue="articles" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full mb-8 grid-cols-4">
          <TabsTrigger value="articles">📄 مقالات ({articles.length})</TabsTrigger>
          <TabsTrigger value="pdfs">📋 ملفات PDF ({pdfs.length})</TabsTrigger>
          <TabsTrigger value="videos">🎬 فيديوهات ({videos.length})</TabsTrigger>
          <TabsTrigger value="infographics">📊 إنفوجرافيك ({infographics.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {articles.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا يوجد مقالات حالياً.</p>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} ReactionButtons={ReactionButtons} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdfs">
          {pdfs.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا يوجد ملفات PDF حالياً.</p>
          ) : (
            <div className="grid gap-4">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-lg text-red-600 shrink-0"><FileText className="h-6 w-6" /></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">{pdf.title}</h3>
                      {pdf.category && <span className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">{pdf.category}</span>}
                      {pdf.description && <p className="text-sm text-muted-foreground mt-2">{pdf.description}</p>}
                      {pdf.url && (
                        <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3">
                          <Button size="sm" variant="outline"><Download className="ml-1 h-4 w-4" /> تحميل PDF</Button>
                        </a>
                      )}
                      <ReactionButtons itemId={pdf.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {videos.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا يوجد فيديوهات حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow group">
                  <div className="aspect-video bg-foreground/5 relative flex items-center justify-center">
                    {video.url ? (
                      <video src={video.url} controls className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary border border-primary/50">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-primary border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    )}
                    {video.duration && <span className="absolute bottom-2 right-2 bg-foreground/70 text-background text-xs px-2 py-1 rounded">{video.duration}</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 line-clamp-1">{video.title}</h3>
                    {video.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{video.description}</p>}
                    <span className="text-xs text-muted-foreground">{new Date(video.created_at).toLocaleDateString("ar-EG")}</span>
                    <ReactionButtons itemId={video.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="infographics">
          {infographics.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا يوجد إنفوجرافيك حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infographics.map((item) => (
                <div key={item.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                  {item.url && <img src={item.url} alt={item.title} className="w-full aspect-[4/3] object-cover" />}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    <ReactionButtons itemId={item.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
