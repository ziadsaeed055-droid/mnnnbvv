
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Download } from "lucide-react";

const articles = [
  { id: 1, title: "كيف تحمي نفسك من الابتزاز الإلكتروني؟", category: "أمان رقمي", readTime: "5 دقائق" },
  { id: 2, title: "علامات العلاقات السامة وكيفية التعامل معها", category: "صحة نفسية", readTime: "7 دقائق" },
  { id: 3, title: "الحقوق القانونية للمرأة في قانون العمل المصري", category: "حقوق قانونية", readTime: "10 دقائق" },
];

const videos = [
  { id: 1, title: "قصة نجاح: من ضحية إلى ملهمة", duration: "3:45" },
  { id: 2, title: "شرح خطوات تقديم بلاغ سري", duration: "2:10" },
  { id: 3, title: "نصائح للأمان الشخصي داخل وخارج الجامعة", duration: "5:30" },
];

const Library = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">المكتبة التوعوية</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          مصدرك الموثوق للمعلومات حول حقوقك، الأمان الرقمي، والصحة النفسية. مقالات، فيديوهات، وأدلة إرشادية.
        </p>
      </div>

      <Tabs defaultValue="articles" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="articles">مقالات وأدلة (PDF)</TabsTrigger>
          <TabsTrigger value="videos">مكتبة الفيديو</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <div className="grid gap-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">{article.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{article.category}</span>
                      <span>•</span>
                      <span>{article.readTime} قراءة</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="aspect-video bg-gray-900 relative flex items-center justify-center group-hover:opacity-90 transition-opacity cursor-pointer">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/50">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                   <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{video.title}</h3>
                   <div className="flex items-center text-primary text-sm font-medium cursor-pointer hover:underline gap-1">
                     <Video className="h-4 w-4" />
                     شاهد الآن
                   </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
