
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

const Activities = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">الأنشطة والفعاليات</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          نحرص على تنظيم ندوات وورش عمل وحملات توعوية بشكل دوري لرفع الوعي وبناء بيئة جامعية آمنة.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <Button variant="default" className="rounded-full">الكل</Button>
        <Button variant="outline" className="rounded-full">ندوات</Button>
        <Button variant="outline" className="rounded-full">ورش عمل</Button>
        <Button variant="outline" className="rounded-full">حملات</Button>
        <Button variant="outline" className="rounded-full">فيديو</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
            <div className="relative h-56">
              <img 
                src={`https://images.unsplash.com/photo-${item % 2 === 0 ? '1544531586-fde5298cdd40' : '1517245386807-bb43f82c33c4'}?auto=format&fit=crop&q=80`}
                alt="صورة النشاط" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                {item % 2 === 0 ? 'ندوة' : 'ورشة عمل'}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-3">عنوان النشاط التوعوي رقم {item}</h3>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <span>15 مارس 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span>قاعة المؤتمرات الرئيسية</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                نبذة مختصرة عن النشاط وأهدافه وما سيتم مناقشته خلال الفعالية. هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.
              </p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full group">
                  التفاصيل والتسجيل
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
