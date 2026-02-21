# Setup Guide - وحدة مناهضة العنف ضد المرأة

## تثبيت وتشغيل المشروع

### 1. متطلبات النظام
- Node.js 16+ 
- npm أو pnpm
- حساب Supabase
- مفتاح API من Groq

### 2. تثبيت الحزم

```bash
# استخدام pnpm (مفضل)
pnpm install

# أو استخدام npm
npm install --legacy-peer-deps
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. إعداد Supabase Functions

تأكد من أن متغيرات البيئة الخاصة بـ Supabase تحتوي على:
- `GROQ_API_KEY`: مفتاح API من Groq للدعم النفسي بالذكاء الاصطناعي

اجعل Supabase يعرف مفتاح Groq:

```bash
supabase secrets set GROQ_API_KEY=your_groq_api_key
```

### 5. تشغيل المشروع

```bash
# بدء خادم التطوير
pnpm dev

# أو استخدام npm
npm run dev
```

## استكشاف الأخطاء

### خطأ: "عذراً، حدث خطأ"

**السبب الأساسي**: غالباً ما يكون بسبب:
1. عدم تكوين GROQ_API_KEY في Supabase
2. عدم تشغيل Supabase Edge Function
3. مشاكل الاتصال بـ Supabase

**الحل**:
1. تحقق من أن `GROQ_API_KEY` موجود في Supabase secrets:
   ```bash
   supabase secrets list
   ```

2. تحقق من سجلات Supabase Functions:
   ```bash
   supabase functions list
   supabase functions logs ai-chat
   ```

3. تأكد من أن `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` صحيحة

### خطأ: React Version Conflict

**الحل**: تم إصلاحه بتحديث `react-leaflet` إلى الإصدار المتوافق.

```bash
pnpm install
```

### خطأ: PWA Install Button لا يظهر

**الحل**:
1. تأكد من أنك في بيئة HTTPS (PWA يتطلب HTTPS)
2. تأكد من أن manifest.json يتم تقديمه بشكل صحيح
3. تحقق من أن المتصفح يدعم PWA (Chrome, Edge, Firefox)

## ميزات المشروع

### 1. تطبيق الويب التقدمي (PWA)
- تثبيت التطبيق على الهاتف
- العمل بدون إنترنت
- أيقونة على شاشة المنزل

### 2. مستشار الدعم النفسي بالذكاء الاصطناعي
- دردشة ثنائية اللغة (العربية والإنجليزية)
- دعم متخصص لضحايا العنف
- حفظ السجل في Supabase

### 3. معلومات المطور
- نموذج ترحيب يوضح عملية البناء
- وثائق تقنية شاملة
- معلومات عن منهجية الهندسة

## البنية التقنية

```
src/
├── components/
│   ├── AIChat.tsx          # واجهة الدردشة
│   ├── WelcomeModal.tsx    # نموذج الترحيب
│   ├── InstallAppButton.tsx # زر تثبيت PWA
│   └── ...
├── hooks/
│   ├── usePWA.tsx         # إدارة تثبيت PWA
│   ├── useWelcomeModal.tsx # إدارة نموذج الترحيب
│   └── ...
├── services/
│   └── aiService.ts       # خدمات الذكاء الاصطناعي
└── ...

supabase/
├── functions/
│   └── ai-chat/
│       └── index.ts       # Supabase Edge Function لـ Groq
└── migrations/
    └── create_ai_chat_history.sql  # قاعدة البيانات
```

## الدعم والمساعدة

للإبلاغ عن مشاكل أو الحصول على دعم:
1. تحقق من السجلات في المتصفح (F12)
2. تحقق من سجلات Supabase Functions
3. راجع الوثائق الكاملة في ENGINEERING.md
