<div align="center">
  <img src="public/logo.png" alt="DailyTracker Logo" width="120" />
  <h1>DailyTracker</h1>
  <p>Track your tasks, journals, and progress with elegance and ease.</p>

  [![Vue 3](https://img.shields.io/badge/Vue.js-3.5-4fc08d?logo=vue.js)](https://vuejs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

![DailyTracker Preview](public/preview.png)

## ✨ Features

- **✅ Task Management**: Effortlessly add, track, and complete your daily tasks.
- **📖 Journaling**: Keep a personal daily journal with a beautiful distraction-free editor.
- **📊 Analytics**: Visualize your productivity over time with detailed charts and insights.
- **🛡️ Data Safety**: 
  - **IndexedDB**: Persistent local storage using Dexie.js.
  - **Backup & Restore**: Export/Import your data as JSON.
  - **Persistent Storage**: Proactive browser permission handling.
- **📱 PWA Support**: Install the app on your home screen for a native experience.
- **💡 Daily Inspiration**: Get a fresh motivational quote every day.
- **🎨 Premium UI**: Dark mode, glassmorphism, and smooth micro-animations.

## 🚀 Tech Stack

- **Framework**: [Vue.js 3 (Composition API)](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Dexie.js (IndexedDB)](https://dexie.org/)
- **State/Reactivity**: [RxJS](https://rxjs.dev/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dailytracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd dailytracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components
├── views/        # Main pages (Today, Analytics, Journal, Settings)
├── services/     # Business logic (Tasks, Quotes, Journals)
├── db/           # Database configuration
├── assets/       # Static files & styles
└── layouts/      # Page layouts
```
