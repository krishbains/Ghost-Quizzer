"use client"
import { customAlphabet } from 'nanoid'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CreateQuiz() {
  const router = useRouter()
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const nanoid = customAlphabet(alphabet, 6)

  const handleClick = () => {
    if (!name.trim()) {
      return;
    }
    
    setIsLoading(true);
    localStorage.setItem('playerName', name);
    
    const roomCode = nanoid() // e.g. "4XJ7KQ"
    console.log(roomCode)
    
    // Simulate loading for better UX
    setTimeout(() => {
      router.push(`/host/game/${roomCode}`)
    }, 1000);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans overflow-hidden">
      
      {/* ANIMATED BACKGROUND LAYERS */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/6 right-1/6 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/6 left-1/6 w-24 h-24 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 py-16">
        
        {/* BACK BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => router.push('/dashboard')}
          className="absolute top-8 left-8 group px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold text-white shadow-2xl"
        >
          <span className="relative z-10">← Back</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>

        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-16"
        >
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-none tracking-tight mb-6">
              Create Quiz
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Set up your quiz room and start hosting the ultimate quiz experience
            </p>
          </div>
        </motion.header>

        {/* CREATE FORM */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-8 sm:p-12 relative group">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10 space-y-8">
              
              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-white/90 font-semibold text-lg">
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 text-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Create Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                disabled={!name.trim() || isLoading}
                className="w-full group relative px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-2xl border border-purple-400/30 rounded-2xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-500 font-bold text-lg text-white shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Quiz'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.button>

              {/* Quick Tips */}
              <div className="text-center pt-6">
                <p className="text-white/60 text-sm">
                  💡 Pro tip: Choose a memorable name that players will recognize!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
            <div className="text-white/60 text-sm">
              Ready to host? Create your quiz room and start the competition!
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}