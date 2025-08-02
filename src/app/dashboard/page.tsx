'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playerName, setPlayerName] = useState('');
  const [recentRooms] = useState([
    { id: 1, code: 'ABC123', title: 'Science Quiz', participants: 8, date: '2024-01-15' },
    { id: 2, code: 'XYZ789', title: 'History Quiz', participants: 12, date: '2024-01-14' },
    { id: 3, code: 'DEF456', title: 'Math Quiz', participants: 6, date: '2024-01-13' },
  ]);
  const { user } = useUser();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const name = user?.username || user?.firstName || 'Quiz Master';
    if (name) setPlayerName(name)
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [user])

  const handleCreateRoom = () => {
    router.push('/host/create');
  };

  const handleJoinRoom = () => {
    router.push('/player/join');
  };

  const handleViewStats = () => {
    // TODO: Implement stats view
    console.log('View stats clicked');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans overflow-hidden">
      
      {/* ANIMATED BACKGROUND LAYERS */}
      <div className="absolute inset-0">
        {/* Floating orbs - reduced size for mobile */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Additional floating elements - smaller for mobile */}
        <div className="absolute top-1/6 right-1/6 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/6 left-1/6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Grid pattern - smaller for mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
        
        {/* Mouse-following glow - hidden on mobile */}
        <div 
          className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ease-out hidden sm:block"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        ></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
        
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl mx-4">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-none tracking-tight mb-4 sm:mb-6">
              Dashboard
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
              Welcome back, {playerName || 'Quiz Master'}! Ready to create some magic?
            </p>
          </div>
        </motion.header>

        {/* QUICK ACTIONS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 sm:mb-16 px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRoom}
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-2xl border border-green-400/30 rounded-2xl hover:from-green-500/30 hover:to-green-600/30 transition-all duration-500 font-bold text-base sm:text-lg text-white shadow-2xl overflow-hidden"
          >
            <span className="relative z-10">🚀 Create New Quiz</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-green-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinRoom}
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-2xl border border-blue-400/30 rounded-2xl hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-500 font-bold text-base sm:text-lg text-white shadow-2xl overflow-hidden"
          >
            <span className="relative z-10">🎯 Join Quiz</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewStats}
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-2xl border border-purple-400/30 rounded-2xl hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-500 font-bold text-base sm:text-lg text-white shadow-2xl overflow-hidden"
          >
            <span className="relative z-10">📊 View Stats</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.button>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">26</div>
              <div className="text-white/80 text-base sm:text-lg">Quizzes Created</div>
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1,247</div>
              <div className="text-white/80 text-base sm:text-lg">Total Participants</div>
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">4.9</div>
              <div className="text-white/80 text-base sm:text-lg">Average Rating</div>
            </div>
          </div>
        </motion.div>

        {/* RECENT ROOMS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-6xl mx-auto px-4"
        >
          <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Recent Quiz Rooms</h2>
              
              <div className="space-y-3 sm:space-y-4">
                {recentRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-lg sm:text-2xl">🎯</span>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white">{room.title}</h3>
                          <p className="text-white/60 text-sm sm:text-base">Room Code: {room.code}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-white font-semibold text-sm sm:text-base">{room.participants} participants</div>
                        <div className="text-white/60 text-xs sm:text-sm">{room.date}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {recentRooms.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">🎉</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No recent rooms</h3>
                  <p className="text-white/60 text-sm sm:text-base">Create your first quiz room to get started!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 sm:mt-16 text-center px-4"
        >
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-6 sm:px-8 py-4">
            <div className="text-white/60 text-sm sm:text-base">
              Ready to create the next viral quiz? Let&apos;s make learning fun! 🚀
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
