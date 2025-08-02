'use client'
import GameRoom from "@/components/GameRoom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { use } from "react";

interface Props {
  params: Promise<{ roomCode: string }>;
}

export default function PlayerGame({ params }: Props) {
  const { roomCode } = use(params);
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    if (name) setPlayerName(name)
  }, [])

  if (!playerName) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
        {/* SIMPLIFIED BACKGROUND */}
        <div className="absolute inset-0">
          {/* Static gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
          
          {/* Subtle grid pattern - smaller for mobile */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] sm:bg-[size:100px_100px]"></div>
          
          {/* Minimal floating elements - reduced opacity and size for mobile */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* LOADING CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center px-4"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-400 mx-auto mb-4 sm:mb-6"></div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Loading Game...</h3>
              <p className="text-white/80 text-base sm:text-lg">Preparing your quiz experience</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      
      {/* SIMPLIFIED BACKGROUND */}
      <div className="absolute inset-0">
        {/* Static gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Subtle grid pattern - smaller for mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] sm:bg-[size:100px_100px]"></div>
        
        {/* Minimal floating elements - reduced opacity and size for mobile */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        <GameRoom roomCode={roomCode} playerName={playerName} isHost={false} />
      </div>
    </div>
  );
}