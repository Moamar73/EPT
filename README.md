
# Agenriver – Creative Portfolio Agency (Next.js Version)

This is a fully converted and SEO-optimized version of the original Agenriver WordPress theme, rebuilt using **Next.js**.

## ✅ Features

- ✅ Fully migrated from WordPress/PHP to React (Next.js)
- 🎯 SEO Optimized with `next/head` and clean structure
- 💡 Uses `next/image`, `next/script` for best performance
- ⚙️ Includes original CSS & JS assets (GSAP, Swiper, etc.)
- 📱 Fully responsive and ready for deployment
- 🚀 Optimized for Vercel or custom hosting

## 📁 Project Structure

```
/public/assets       → Original CSS, JS, images from the WP theme
/src/components      → Header, Footer, Layout components
/src/pages           → index.js and additional pages
/src/styles          → Global styles + Tailwind setup
```

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your project live.

## 🛠 Building for Production

```bash
npm run build
npm start
```

## 📦 Notes

- All CSS and JS files are loaded from `public/assets`
- `Layout.jsx` automatically injects header, footer, and required scripts
- GSAP, Swiper, and custom animations are preserved

---

© 2025 Mi'mar Al-Khalil. All rights reserved.
