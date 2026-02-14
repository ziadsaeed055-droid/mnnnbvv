import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Library = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("library_content").select("*").order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const articles = items.filter(i => i.type === "article" || i.type === "pdf");
  const videos = items.filter(i => i.type === "video");

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">المكتبة التوعوية</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          مصدرك الموثوق للمعلومات حول حقوقك، الأمان الرقمي، والصحة النفسية.
        </p>
      </div>

      <Tabs defaultValue="articles" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="articles">مقالات وأدلة ({articles.length})</TabsTrigger>
          <TabsTrigger value="videos">مكتبة الفيديو ({videos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {articles.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">لا يوجد محتوى حالياً. يتم إضافته من لوحة التحكم.</p>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow flex justify-between items-center group">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">{article.title}</h3>
                      <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                        {article.category && <span className="bg-muted px-2 py-0.5 rounded text-xs">{article.category}</span>}
                        {article.read_time && <span>{article.read_time} قراءة</span>}
                      </div>
                      {article.description && <p className="text-sm text-muted-foreground mt-2">{article.description}</p>}
                    </div>
                  </div>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
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
                  <div className="aspect-video bg-foreground/5 relative flex items-center justify-center cursor-pointer"
                    onClick={() => video.url && window.open(video.url, "_blank")}>
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary border border-primary/50">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-primary border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    )}
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 bg-foreground/70 text-background text-xs px-2 py-1 rounded">{video.duration}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-2 line-clamp-1">{video.title}</h3>
                    <div className="flex items-center text-primary text-sm font-medium cursor-pointer hover:underline gap-1"
                      onClick={() => video.url && window.open(video.url, "_blank")}>
                      <Video className="h-4 w-4" /> شاهد الآن
                    </div>
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
