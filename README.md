# 🔥 Burner List - PoC

A productivity web application that helps you manage tasks using the "Burner" methodology - organizing your work into Front Burner (top priority), Back Burner (next priority), and Kitchen Sink (everything else).

## 🎯 Problem It Solves

Traditional todo lists can become overwhelming with endless items. Burner List solves this by:

- **Forcing prioritization**: Only one Front Burner item at a time
- **Reducing decision fatigue**: Clear hierarchy of what to work on
- **Preventing task accumulation**: Regular session rollovers keep lists fresh
- **Maintaining focus**: Visual separation between priority levels

## ✨ Features

### Core Functionality
- **3-Tier Task Organization**
  - 🔥 Front Burner: Your single most important task (1 item max)
  - 🔶 Back Burner: Your next priority (1 item max)
  - 🗂️ Kitchen Sink: Everything else (unlimited)

- **Task Management**
  - Quick add to Kitchen Sink with `/` shortcut
  - Promote/demote tasks between tiers
  - Subtasks with progress tracking for Front/Back items
  - Task status: open, done, snoozed, dropped

- **Session Management**
  - Daily or weekly sessions
  - Automatic rollover with customizable downgrade options
  - Session history tracking
  - Configurable auto-downgrade for incomplete items

### User Experience
- **Desktop**: Side-by-side layout with Front/Back cards and Kitchen Sink list
- **Mobile**: Tab-based navigation with floating action button
- **PWA Support**: Installable as a mobile/desktop app
- **Keyboard Shortcuts**: 
  - `/` - Focus quick add
  - `f` - Focus Front Burner
  - `b` - Focus Back Burner

## 🚀 Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd burner-list

# Install dependencies (pnpm recommended)
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for desktop view or [http://localhost:3000/m](http://localhost:3000/m) for mobile view.

## 🛠️ Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Testing
pnpm test         # Run tests with Vitest
pnpm test:ui      # Run tests with UI (if available)

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
```

## ⚙️ Configuration

### Default Settings
- **Default Period**: `day` (can be changed to `week`)
- **Auto-downgrade Incomplete**: `true` (moves incomplete Front/Back items to Kitchen Sink on rollover)
- **Push Notifications**: `false` (future feature)

### Customization
Settings can be modified through the Settings panel (⚙️ button) or by updating the initial state in `src/store/useBurnerStore.ts`.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) + React + TypeScript
- **State Management**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **PWA**: Custom service worker + manifest

### Project Structure
```
src/
├── app/
│   ├── page.tsx          # Desktop view
│   ├── m/page.tsx        # Mobile view
│   └── layout.tsx        # Root layout with PWA setup
├── components/
│   ├── FrontCard.tsx     # Front Burner component
│   ├── BackCard.tsx      # Back Burner component
│   ├── SinkList.tsx      # Kitchen Sink component
│   ├── QuickAdd.tsx      # Quick add input
│   ├── RolloverDialog.tsx # Session rollover modal
│   └── SettingsSheet.tsx # Settings panel
├── store/
│   └── useBurnerStore.ts # Zustand store
├── lib/
│   └── rollover.ts       # Session management logic
└── types/
    └── index.ts          # TypeScript definitions
```

## 📱 PWA Features

- **Installable**: Can be installed as a standalone app
- **Offline Support**: Basic caching for core functionality
- **Mobile Optimized**: Touch-friendly interface with tab navigation
- **App-like Experience**: Full-screen mode, custom icons

## 🧪 Testing

The project includes comprehensive tests for the core store functionality:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

Test coverage includes:
- Task creation, updating, and deletion
- Promotion/demotion between tiers
- Session management and rollover
- Settings persistence

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Other Platforms
The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🔮 Future Enhancements (MVP TODO)

### Core Features
- [ ] **Drag & Drop**: Implement dnd-kit for visual task reordering
- [ ] **Task Scheduling**: Due dates and time-based reminders
- [ ] **Rich Text**: Markdown support for task descriptions
- [ ] **Task Templates**: Predefined task structures

### Sync & Collaboration
- [ ] **Cloud Sync**: Real-time synchronization across devices
- [ ] **Team Workspaces**: Shared burner lists for teams
- [ ] **Export/Import**: Backup and restore functionality

### Mobile & Desktop
- [ ] **Push Notifications**: Rollover reminders and deadlines
- [ ] **Android App**: Capacitor-based native wrapper
- [ ] **Desktop App**: Electron wrapper for desktop users
- [ ] **Widget Support**: Home screen widgets for quick access

### Analytics & Insights
- [ ] **Productivity Metrics**: Task completion rates and patterns
- [ ] **Time Tracking**: Built-in pomodoro timer
- [ ] **Reflection Tools**: End-of-session review prompts

### Advanced Features
- [ ] **AI Suggestions**: Smart task prioritization
- [ ] **Integration**: Calendar, email, and project management tools
- [ ] **Themes**: Customizable UI themes and layouts
- [ ] **Accessibility**: Enhanced screen reader and keyboard navigation

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for productivity enthusiasts**

