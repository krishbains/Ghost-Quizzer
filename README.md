# 🎯 GhostQuizzer

> **The Ultimate Real-Time Multiplayer Quiz Platform**  
> Create, host, and play interactive quizzes with AI-powered question generation and real-time multiplayer gameplay.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-orange?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini_2.5_Flash-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Deployment-Vercel-blue?style=for-the-badge&logo=vercel" alt="Deployment"/>
</div>

---

## 🚀 Features

### 🎮 **Real-Time Multiplayer Gaming**
- **Live Room System**: Create and join quiz rooms with unique codes
- **Real-Time Updates**: Instant score updates, leaderboards, and game state synchronization
- **Host Controls**: Full game management with start/pause/end capabilities
- **Player Management**: Track active players, scores, and participation

### 🤖 **AI-Powered Quiz Generation**
- **Google Gemini 2.5 Flash Integration**: Generate custom quizzes on any topic
- **Smart Question Creation**: AI crafts engaging multiple-choice questions
- **Topic Flexibility**: From pop culture to academic subjects
- **Instant Generation**: Create quizzes in seconds with natural language prompts

### 🎨 **Modern UI/UX Design**
- **Glassmorphism Design**: Beautiful frosted glass effects and modern aesthetics
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Dark Theme**: Eye-friendly dark mode with gradient accents

### 📊 **Interactive Gameplay**
- **Live Polling System**: Vote on trending topics and popular subjects
- **Real-Time Leaderboards**: Track scores and rankings during gameplay
- **Quiz Templates**: Pre-built quizzes on popular topics (Marvel, Gaming, etc.)
- **Timer System**: Configurable question timers for competitive play

### 🔐 **Authentication & Security**
- **Clerk Integration**: Secure user authentication and management
- **Room Privacy**: Private room codes for controlled access
- **User Profiles**: Personalized experience with user accounts

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.4.3** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives

### **Backend & Real-Time**
- **Socket.IO 4.8.1** - Real-time bidirectional communication
- **Node.js** - Server-side JavaScript runtime
- **TypeScript** - Type-safe server development

### **AI & External Services**
- **Google Gemini 2.5 Flash** - AI-powered quiz generation
- **Clerk** - Authentication and user management

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **ts-node** - TypeScript execution

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google AI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GhostQuizzer.git
   cd GhostQuizzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Start Next.js app
   npm run dev
   
   # Terminal 2: Start Socket.IO server
   npm run socket-server
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🎮 How to Play

### **For Hosts**
1. Navigate to `/host/create`
2. Create a new quiz room
3. Choose from trending topics or use AI to generate custom questions
4. Share the room code with players
5. Start the quiz and manage gameplay

### **For Players**
1. Navigate to `/player/join`
2. Enter the room code provided by the host
3. Enter your name and join the room
4. Answer questions in real-time
5. Compete for the top spot on the leaderboard

### **AI Quiz Generation**
1. Click "Ask AI" in the host interface
2. Enter any topic (e.g., "Space Exploration", "90s Pop Culture")
3. AI generates 10+ multiple-choice questions instantly
4. Review and start the AI-generated quiz

---

## 📁 Project Structure with Dynamic Next.js Routing

```
quiz_app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # User dashboard
│   │   ├── host/              # Host game interface
│   │   ├── player/            # Player game interface
│   │   └── layout.tsx         # Root layout with auth
│   ├── components/            # Reusable React components
│   │   ├── GameRoom.tsx       # Main game room component
│   │   ├── QuizBoard.tsx      # Quiz display and interaction
│   │   ├── LeaderBoard.tsx    # Real-time score tracking
│   │   ├── AskAI.tsx          # AI quiz generation
│   │   └── ...                # Other UI components
│   ├── server/                # Socket.IO server
│   │   └── socketServer.ts    # Real-time game logic
│   ├── data/                  # Static data and quiz templates
│   │   ├── quizData.ts        # Pre-built quiz templates
│   │   └── demoTopics.ts      # Trending topics
│   └── lib/                   # Utility functions and configurations
│       ├── socket.ts          # Socket.IO client setup
│       └── utils.ts           # Helper functions
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```
---

## 🌟 Key Features Deep Dive

### **Real-Time Multiplayer Architecture**
- **Socket.IO Integration**: Bidirectional communication for instant updates
- **Room Management**: Dynamic room creation and player management
- **State Synchronization**: Real-time game state across all players
- **Disconnection Handling**: Graceful player removal and room cleanup

### **AI Quiz Generation Engine**
- **Google Gemini 2.5 Flash**: Latest AI model for question generation
- **Structured Output**: JSON-formatted quiz data for consistency
- **Topic Flexibility**: Generate quizzes on any subject imaginable
- **Quality Control**: Error handling and response validation

### **Modern UI Components**
- **Glassmorphism Effects**: Beautiful frosted glass design elements
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: ARIA labels and keyboard navigation

---

## 🚀 Deployment

### **Frontend Deployment**
The Next.js frontend has been deployed to:
- **Netlify**: Free plan

### **Socket.IO Server Deployment**
The Socket.IO server has been deployed to:
- **Render**: Free plan

## 📊 Performance & Optimization

### **Frontend Optimizations**
- **Next.js 15**: Latest performance improvements
- **React 19**: Concurrent features and better rendering
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js built-in image optimization

### **Real-Time Performance**
- **Socket.IO**: Efficient WebSocket communication
- **Room Management**: Optimized player tracking
- **State Updates**: Minimal data transfer for real-time updates

---

## 🔒 Security

- **Authentication**: Secure user authentication with Clerk
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Secure API key management
---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Socket.IO** for real-time communication capabilities
- **Google AI** for powerful question generation
- **Clerk** for seamless authentication
- **Tailwind CSS** for beautiful styling utilities
- **Framer Motion** for smooth animations

---

<div align="center">
  <p>Made with ❤️ by the GhostQuizzer Team</p>
  <p>
    <a href="https://github.com/yourusername/GhostQuizzer/stargazers">
      <img src="https://img.shields.io/github/stars/yourusername/GhostQuizzer?style=social" alt="Stars"/>
    </a>
    <a href="https://github.com/yourusername/GhostQuizzer/forks">
      <img src="https://img.shields.io/github/forks/yourusername/GhostQuizzer?style=social" alt="Forks"/>
    </a>
    <a href="https://github.com/yourusername/GhostQuizzer/issues">
      <img src="https://img.shields.io/github/issues/yourusername/GhostQuizzer" alt="Issues"/>
    </a>
  </p>
</div>
