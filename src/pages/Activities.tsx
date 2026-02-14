import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Activities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
      setActivities(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? activities : activities.filter(a => a.type === filter);
  const types = [...new Set(activities.map(a => a.type).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">الأنشطة والفعاليات</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          نحرص على تنظيم ندوات وورش عمل وحملات توعوية بشكل دوري لرفع الوعي وبناء بيئة جامعية آمنة.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <Button variant={filter === "all" ? "default" : "outline"} className="rounded-full" onClick={() => setFilter("all")}>الكل</Button>
        {types.map((t) => (
          <Button key={t} variant={filter === t ? "default" : "outline"} className="rounded-full" onClick={() => setFilter(t)}>{t}</Button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-20 text-muted-foreground">جاري التحميل...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">لا توجد أنشطة حالياً. يتم إضافة الأنشطة من لوحة التحكم.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((activity) => (
            <div key={activity.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border flex flex-col">
              <div className="relative h-56">
                <img
                  src={activity.image_url || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                {activity.type && (
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {activity.type}
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-3">{activity.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {activity.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span>{new Date(activity.date).toLocaleDateString("ar-EG")}</span>
                    </div>
                  )}
                  {activity.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
