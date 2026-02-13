
import { MapPin, Shield, AlertTriangle } from "lucide-react";

const SafeMap = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">خريطة الجامعة الآمنة</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          تعرفي على أماكن الدعم، مكاتب الأمن، ونقاط الإبلاغ داخل الحرم الجامعي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-slate-100 rounded-3xl border border-gray-200 h-[500px] relative overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
          <div className="relative z-10 bg-white/90 backdrop-blur px-8 py-6 rounded-2xl shadow-xl text-center max-w-sm mx-4">
             <MapPin className="h-10 w-10 text-primary mx-auto mb-4 animate-bounce" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">الخريطة التفاعلية</h3>
             <p className="text-gray-600">
               سيتم هنا عرض خريطة تفاعلية للجامعة توضح أماكن تواجد أفراد الأمن ومكتب الوحدة.
             </p>
          </div>
        </div>

        {/* Emergency Contacts & Locations */}
        <div className="space-y-6">
           <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-4 text-red-700">
               <AlertTriangle className="h-6 w-6" />
               <h3 className="text-xl font-bold">أرقام الطوارئ</h3>
             </div>
             <ul className="space-y-3">
               <li className="flex justify-between items-center border-b border-red-100 pb-2 last:border-0 last:pb-0">
                 <span className="font-medium text-gray-700">أمن الجامعة</span>
                 <span className="font-bold text-red-600 font-mono text-lg">0100000000</span>
               </li>
               <li className="flex justify-between items-center border-b border-red-100 pb-2 last:border-0 last:pb-0">
                 <span className="font-medium text-gray-700">الإسعاف</span>
                 <span className="font-bold text-red-600 font-mono text-lg">123</span>
               </li>
               <li className="flex justify-between items-center border-b border-red-100 pb-2 last:border-0 last:pb-0">
                 <span className="font-medium text-gray-700">النجدة</span>
                 <span className="font-bold text-red-600 font-mono text-lg">122</span>
               </li>
             </ul>
           </div>

           <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-4 text-primary">
               <Shield className="h-6 w-6" />
               <h3 className="text-xl font-bold">نقاط آمنة</h3>
             </div>
             <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="bg-purple-100 p-2 rounded-lg text-primary shrink-0 mt-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">مكتب وحدة مناهضة العنف</h4>
                    <p className="text-sm text-gray-500">المبنى الإداري، الدور الثاني، مكتب رقم 204</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="bg-purple-100 p-2 rounded-lg text-primary shrink-0 mt-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">مكتب الأخصائي النفسي</h4>
                    <p className="text-sm text-gray-500">مبنى كلية الصناعة، الدور الأرضي</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SafeMap;
