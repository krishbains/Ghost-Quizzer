"use client";
import TopicBubbleSelector from "@/components/PollInput";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (animationFrame.current === null) {
        animationFrame.current = requestAnimationFrame(updateGlowPosition);
      }
    };

    const updateGlowPosition = () => {
      if (glowRef.current) {
        glowRef.current.style.left = `${mousePosition.current.x - 300}px`;
        glowRef.current.style.top = `${mousePosition.current.y - 300}px`;
      }
      animationFrame.current = null; // Reset frame request
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans overflow-hidden">
      
      {/* ANIMATED BACKGROUND LAYERS */}
      <div className="absolute inset-0">
        {/* Floating orbs with enhanced animations */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-glow animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-glow animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-glow animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/6 right-1/6 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/6 left-1/6 w-24 h-24 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Mouse-following glow (optimized) */}
        <div
          ref={glowRef}
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: '-300px',
            top: '-300px',
          }}
        ></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 py-16">
        
        {/* HEADER WITH GLASSMORPHISM */}
        <header className="text-center mb-20">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl animate-glow">
            <h1 className="text-6xl sm:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-none tracking-tight mb-6 animate-shimmer">
              GhostQuizzer
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Create interactive quizzes with real-time multiplayer gameplay.<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                Choose from trending topics or craft your own using AI.
              </span>
            </p>
          </div>
        </header>

        {/* DEMO BUBBLE SELECTOR IN ULTRA GLASSMORPHISM */}
        <div className="w-full max-w-5xl mb-20">
          <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-8 sm:p-12 relative group animate-glow">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-border-flow"></div>
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white/90 mb-2">Level up your 🧠</h3>
                <p className="text-white/60">Poll topics with your peers and watch them come to life with AI.</p>
              </div>
              <TopicBubbleSelector isOpen={true} onClose={() => { }} isHost={false} isDemo={true} />
            </div>
          </div>
        </div>

        {/* DIVIDER WITH GLOW */}
        <div className="relative w-full max-w-4xl mb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent blur-sm"></div>
        </div>

        {/* CTA BUTTONS WITH GLASSMORPHISM */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
          <button className="group relative px-10 py-5 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl hover:scale-105 active:scale-100 transition-all duration-500 font-bold text-lg text-white shadow-2xl overflow-hidden animate-glow"
          onClick={() => router.push(`/dashboard/`)}
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>

          <button
            className="group relative px-10 py-5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-2xl border border-blue-400/30 rounded-2xl hover:scale-105 active:scale-100 transition-all duration-500 font-bold text-lg text-white shadow-2xl overflow-hidden animate-glow"
            style={{ animationDelay: '0.5s' }}
            onClick={() => router.push(`/host/create`)}
          >
            <span className="relative z-10">Create Room</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>

          <button
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-2xl border border-purple-400/30 rounded-2xl hover:scale-105 active:scale-100 transition-all duration-500 font-bold text-lg text-white shadow-2xl overflow-hidden animate-glow"
            style={{ animationDelay: '1s' }}
            onClick={() => router.push(`/player/join`)}
          >
            <span className="relative z-10">Join Room</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

        {/* TRUSTED BADGE WITH GLASSMORPHISM */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 mb-16 animate-glow" style={{ animationDelay: '1.5s' }}>
          <div className="text-white/70 text-center">
            <span className="font-semibold text-white">Trusted by thousands of quiz masters</span> worldwide
          </div>
        </div>

        {/* Footer */}
        <footer className="text-white/40 text-sm">
          &copy; {new Date().getFullYear()} GhostQuizzer. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
