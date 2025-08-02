'use client'
import GameRoom from "@/components/GameRoom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { use } from "react";

interface Props {
  params: Promise<{ roomCode: string }>;
}

export default function HostGame({ params }: Props) {
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
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          
          {/* Minimal floating elements - reduced opacity and size */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* LOADING CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-white mb-4">Loading Host Panel...</h3>
              <p className="text-white/80 text-lg">Preparing your quiz control center</p>
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
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        {/* Minimal floating elements - reduced opacity and size */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        <GameRoom roomCode={roomCode} playerName={playerName} isHost={true} />
      </div>
    </div>
  );
}