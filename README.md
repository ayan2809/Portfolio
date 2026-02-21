# Ayan Sadhukhan | Senior Backend Engineer Portfolio (v3)

Welcome to the source repository for my personal portfolio website, version 3. This project is a highly advanced, performance-optimized Single Page Application (SPA) built without heavy frontend frameworks (no React, Vue, or Tailwind) to demonstrate complete mastery over the DOM, WebGL, and modern browser APIs.

## 🚀 Live Demo
[https://d1j3ndwdltz090.cloudfront.net](https://d1j3ndwdltz090.cloudfront.net)

## 🧠 Architectural Philosophy
This portfolio is engineered with the same rigor applied to backend distributed systems: **Clarity over cleverness, and performance above all.**

The entire experience is driven by pure HTML5, highly customized CSS variables (with Light/Dark modes), and Vanilla JavaScript modules bundled by Vite. It focuses on achieving perfect Lighthouse scores without sacrificing rich, interactive 3D aesthetics.

## ✨ Core Features

### 1. WebGL "Cluster" Visualization (Three.js Hero)
A lightweight Three.js scene renders a 3D node graph conceptually representing a distributed Kubernetes cluster.
- Features a Bloom post-processing pass (`EffectComposer`) for realistic neon glows.
- Custom raycasting enables a pure HTML/CSS tooltip to perfectly track 3D nodes as the mouse hovers over them, displaying mock system telemetry.
- Automatically degrades gracefully via `@media (prefers-reduced-motion)` and halts the `requestAnimationFrame` loop on `visibilitychange` to save battery.

### 2. The "Data Pipeline" Scroll Flow
A continuous flow of data guides the user down the page.
- A complex absolute SVG `<path>` weaves through the Experience, Skills, and Projects sections.
- Vanilla JS and `IntersectionObserver` animate the `stroke-dashoffset` in real-time, perfectly synced with the scroll position.
- Glowing SVG `<circle>` packets dynamically travel down the path using `getPointAtLength`.

### 3. The "Quake-Style" Terminal Emulator Overlay
A hidden, fully functional Command Line Interface built directly into the DOM.
- **Trigger:** Drops down from the top of the screen when pressing **` (Backtick)** or **Ctrl+K**.
- **Commands:** Supports a custom parser for `help`, `theme --toggle`, `cat resume.txt`, `fetch leetcode`, and `status`.
- **Styling:** Authentically styled with animated CRT scanline linear gradients, a blinking block cursor, and command history navigation (Up/Down arrows).

### 4. Client-Side Telemetry Dashboard (SVG Sparklines)
Located in the Skills section, it dynamically tracks my open-source impact without relying on bulky charting libraries like Chart.js.
- Fetches live data from the GitHub API (`api.github.com/users/ayan2809/repos`).
- Aggregates `stargazers_count` and `size`, then generates smooth Catmull-Rom approximated quadratic bezier SVG curves (`Q`) on the fly.
- Implements `sessionStorage` caching with a 1-hour TTL to prevent rate limiting.

### 5. Seamless Light/Dark Theme Interpolation
A custom dynamic theme system controlled by `localStorage` and `window.matchMedia`.
- Changing themes swaps root variables (`--bg-primary`, `--text-primary`), preserving the custom indigo/cyan accent gradients.
- A global `--transition-colors` ensures a smooth 400ms crossfade across the entire UI.

## 🛠️ Tech Stack & Build System

| Layer | Technology | Details |
|---|---|---|
| **Bundler** | Vite | Dev server, HMR, highly optimized production rollups |
| **Markup** | Vanilla HTML5 | Single `index.html` structure |
| **Styling** | Vanilla CSS | Single `main.css` file |
| **Interactivity** | Vanilla JS | Single `main.js` (ES Module) |
| **3D Engine** | Three.js | Node cluster visualization |
| **Hosting (Target)**| AWS S3 + CloudFront | Configured for static bucket hosting with CDN |

## 📦 Local Development Setup

To run this project locally, you only need Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone git@github.com:ayan2809/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   # This will only install Vite, Three.js, and build tools
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The site will be available instantly at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   This will output a highly minified vanilla HTML/CSS/JS bundle into the `/dist` directory, ready to be deployed to any static host like S3, Vercel, or Netlify.

## 🤝 Contact
Feel free to reach out if you have any questions about the architecture or implementation details!
- **Email:** (Update with your email)
- **LinkedIn:** [Ayan Sadhukhan](https://www.linkedin.com/in/ayansadhukhan/)
- **GitHub:** [@ayan2809](https://github.com/ayan2809)
