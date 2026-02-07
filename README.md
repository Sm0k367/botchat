# 3D AI Chat - Sm0ken420 🚀

Cyberpunk 3D AI Chatbot powered by Next.js 14, React Three Fiber, GSAP, Tailwind & Groq Llama3.

## Features
- Interactive 3D scene with orbiting cyberpunk box & stars
- Real-time Groq AI chat (llama-3.3-70b-versatile)
- Server-side API route for secure key handling
- Responsive design, dark gradient theme

## Quick Deploy (Free)

### Vercel (Recommended - SSR Support)
1. Fork/Clone repo
2. [Vercel.com](https://vercel.com) → New Project → Import GitHub repo
3. Add Env Var: `GROQ_API_KEY` from [console.groq.com/keys](https://console.groq.com/keys)
4. Deploy! Auto-builds on push.

### GitHub Pages (Static - No SSR)
```
npm run build
npm i -g gh-pages
gh-pages -d out
```

## Local Dev
```
npm i
cp .env.example .env.local  # Add GROQ_API_KEY
npm run dev
```

## Customize
- Edit `app/page.tsx` for UI/3D
- Change model in `app/api/chat/route.ts`
- Add GSAP animations

Live Preview: [8080 preview if available]