# Engineering Assembly Methodology & Technical Documentation

## Project Overview
**وحدة مناهضة العنف ضد المرأة** (Women's Safety Unit) - A modern, secure university platform providing psychological support and campus safety services.

**Development Timeline:** 22 consecutive days of planning, development, and continuous improvement
**Developer:** Ayman - Developer Specialist

---

## Architecture & Modular Design

This project uses **Modular Architecture** principles to ensure:
- **Maintainability**: Clean separation of concerns across components
- **Scalability**: Easy to extend with new features without affecting existing code
- **Reusability**: Shared utilities and hooks across the application
- **Testability**: Individual modules can be tested in isolation

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── WelcomeModal.tsx       # First-visit developer introduction
│   ├── AIChat.tsx             # Psychological support chatbot
│   ├── InstallAppButton.tsx   # PWA installation prompt
│   └── ui/                    # shadcn/ui components
├── hooks/              # Custom React hooks
│   ├── usePWA.tsx             # Progressive Web App management
│   ├── useWelcomeModal.tsx    # Modal state management
│   └── [other hooks]
├── contexts/           # React Context for state management
│   └── AuthContext.tsx        # Authentication state
├── services/           # Business logic & API integration
│   └── aiService.ts           # AI chat service logic
├── integrations/       # Third-party integrations
│   └── supabase/               # Supabase database client
└── pages/              # Page components
```

---

## Technology Stack

### Frontend
- **React 18** - UI library with hooks and component composition
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS styling
- **Framer Motion** - Smooth animations and transitions
- **lucide-react** - Beautiful SVG icons

### Backend & Database
- **Supabase** - Open-source Firebase alternative
  - Authentication management
  - Real-time database (PostgreSQL)
  - Row Level Security (RLS) policies
  - Edge Functions for serverless logic
- **Groq** - Fast AI model inference

### Development Tools
- **Vite** - Next-generation frontend build tool
- **TypeScript** - Type safety and IntelliSense
- **Tailwind CSS** - Responsive design system
- **shadcn/ui** - High-quality React components

### PWA Features
- **vite-plugin-pwa** - Progressive Web App support
  - Service Worker generation
  - Offline functionality
  - App manifest configuration
  - Install prompts on supported browsers

---

## Key Features Implementation

### 1. Welcome Modal Component
**File:** `src/components/WelcomeModal.tsx`

Displays on first visit to introduce the developer and project methodology.

**Features:**
- Developer profile image with smooth animations
- Bilingual content (Arabic/English)
- Project timeline (22-day development)
- Engineering methodology explanation
- LocalStorage-based persistence (shows once per session)

**Design Principles:**
- Gradient backgrounds (purple to pink)
- Smooth Framer Motion animations
- Professional appearance with glassmorphism effects

### 2. AI Chat Component
**File:** `src/components/AIChat.tsx`

Real-time psychological support chatbot powered by Groq and Supabase.

**Features:**
- Streaming text responses for real-time feedback
- Bilingual support (Arabic and English)
- Message history management
- Loading states with animated indicators
- Responsive chat window
- Click-outside to close

**Message Flow:**
1. User sends message via input field
2. Message sent to Supabase Edge Function
3. Function calls Groq AI API with streaming
4. Response streamed back as text deltas
5. Display with typewriter effect

**Data Structure:**
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
```

### 3. Progressive Web App (PWA)
**Files:** 
- `vite.config.ts` - PWA plugin configuration
- `src/hooks/usePWA.tsx` - PWA state management
- `src/components/InstallAppButton.tsx` - Install prompt

**Features:**
- Automatic service worker registration
- Offline-first strategy with caching
- App manifest with metadata
- Install prompt button (when installable)
- Smooth animations for install flow

**Manifest Configuration:**
- App name (Arabic): وحدة الأمان
- Display mode: Standalone (full-screen app experience)
- Theme color: Purple (#7C5CFF)
- Icons and app metadata

### 4. Database Integration
**File:** `supabase/migrations/create_ai_chat_history.sql`

**Table Structure:**
```sql
ai_chat_history {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key to auth.users)
  session_id: TEXT (Chat session identifier)
  role: TEXT ('user' | 'assistant')
  content: TEXT (Message content)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Security:**
- Row Level Security (RLS) enabled
- Users can only read their own chat history
- Users can only insert their own messages
- Automatic user_id enforcement via auth context

---

## Design System & Colors

### Color Palette
- **Primary Brand:** Purple `#7C5CFF` (262° 52% 47%)
- **Secondary:** Pink/Magenta `#D63384` (326° 68% 55%)
- **Light Accent:** Light Purple `#F3EBFF` (262° 30% 95%)
- **Neutrals:** White, Light Gray, Dark Gray

### Typography
- **Font Family:** Cairo (Google Fonts)
- **Heading Font Weight:** 600-800 (Bold)
- **Body Font Weight:** 400-500 (Regular)
- **Line Height:** 1.5-1.6 (Relaxed)

---

## API Integration

### Supabase Edge Functions
**Endpoint:** `POST /functions/v1/ai-chat`

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ]
}
```

**Response:** Server-Sent Events (SSE) with streaming chunks
```
data: {"type": "text-delta", "delta": "مرحبا بك"}
data: {"type": "text-delta", "delta": "..."}
data: [DONE]
```

### Groq Integration
- Model: `mixtral-8x7b-32768` (or other available models)
- System prompt: Configured for psychological support
- Temperature: Optimized for empathetic responses
- Max tokens: Configurable per request

---

## State Management

### Hooks & Context

**useWelcomeModal.tsx**
```typescript
const { showModal, dismissModal } = useWelcomeModal();
```
- Manages welcome modal visibility
- Uses localStorage for persistence
- Auto-dismisses after 30 seconds

**usePWA.tsx**
```typescript
const { isInstallable, installApp } = usePWA();
```
- Listens for install prompt event
- Handles app installation
- Manages PWA state

**AuthContext.tsx**
- Global authentication state
- User information management
- Session persistence

---

## Styling Architecture

### Tailwind CSS + Semantic Tokens
All colors use CSS custom properties (CSS variables) defined in `src/index.css`:

```css
:root {
  --primary: 262 52% 47%;
  --secondary: 326 68% 55%;
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
}
```

**Usage in Components:**
```tsx
<div className="bg-gradient-to-r from-purple-500 to-pink-400">
  Content
</div>
```

**Responsive Design:**
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Flex-based layouts for flexibility

---

## Security Best Practices

### Authentication & Authorization
- Supabase Auth for user management
- JWT tokens for API requests
- Row Level Security (RLS) on database tables
- Secure session management with HTTP-only cookies

### Data Protection
- Parameterized queries (via Supabase ORM)
- Input sanitization on frontend
- HTTPS-only communication
- Encrypted sensitive data at rest

### Environment Variables
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
GROQ_API_KEY=your_groq_key (server-side only)
```

---

## Performance Optimizations

### Frontend
- Code splitting with React.lazy() for route-based splitting
- Image optimization (WebP format with fallbacks)
- CSS-in-JS minimization
- Bundle size monitoring

### Backend
- Supabase connection pooling
- Query optimization with indexes
- Caching strategies (browser cache + CDN)
- Edge Function performance optimization

### PWA
- Service Worker caching strategies
- Offline-first architecture
- Lazy loading of non-critical resources

---

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with @testing-library/react-hooks
- Service function testing

### Integration Tests
- API integration with Supabase
- User flows (login → chat → logout)
- PWA installation flow

### E2E Tests
- Full user journey testing
- Cross-browser compatibility
- Mobile responsiveness

---

## Deployment Guide

### Prerequisites
```bash
npm install -g supabase-cli
```

### Setup Steps
1. Clone repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Setup environment: Copy `.env.example` to `.env.local`
4. Deploy Supabase functions: `supabase functions deploy`
5. Run migrations: `supabase db push`
6. Start dev server: `npm run dev`

### Production Deployment
```bash
npm run build
npm run preview

# Deploy to Vercel
vercel deploy --prod
```

---

## Maintenance & Future Enhancements

### Current Maintenance
- Regular security updates
- Dependency updates (quarterly)
- Performance monitoring
- User feedback collection

### Planned Features
1. **Enhanced AI Models**
   - Fine-tuned models for better context
   - Multi-language support improvement

2. **Advanced Analytics**
   - User engagement metrics
   - Chat sentiment analysis
   - Resource usage patterns

3. **Social Features**
   - User profiles
   - Community support groups
   - Resource sharing

4. **Mobile Apps**
   - Native iOS/Android apps
   - Offline-first architecture

---

## Resources & References

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Groq API](https://console.groq.com/docs)

### Tools
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

---

## License & Credits

**Project:** وحدة مناهضة العنف ضد المرأة (Women's Safety Unit)
**University:** Beni Suef Technological University
**Developer:** Ayman - Developer Specialist
**Development Period:** 22 Days

---

**Last Updated:** February 2026
**Documentation Version:** 1.0
