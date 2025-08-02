'use client'
import socket from '@/lib/socket'
import React, { useEffect, useState, useRef } from 'react'
import QuizBoard from './QuizBoard'
import LeaderBoard from './LeaderBoard'
import TopicBubbleSelector from './PollInput'
import QuizTemplate from './QuizTemplate'
import AskAI from './AskAI'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { IconCircle, IconTriangle, IconStar, IconUmbrella, IconTrophy, IconLogout2 } from '@tabler/icons-react'

interface QuizData {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    correctOptionId: string;
  }>;
}

const GameRoom = ({roomCode, playerName, isHost}: {roomCode: string, playerName: string, isHost: boolean}) => {
    const router = useRouter()
    const [quizStarted, setQuizStarted] = useState(false)
    const [selectedQuizTitle, setSelectedQuizTitle] = useState<string>('')
    const [selectedQuizData, setSelectedQuizData] = useState<QuizData | null>(null)
    const [showPollTopics, setShowPollTopics] = useState(false)
    const [showQuizTemplate, setShowQuizTemplate] = useState(false)
    const [showAskAI, setShowAskAI] = useState(false)
    const [showLeaderBoard, setShowLeaderBoard] = useState(false)
    const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState<QuizData | null>(null)
    const hasJoined = useRef(false)
    
    useEffect(() => {
      // Only join once
      if (!hasJoined.current) {
        socket.emit("join-room", {roomCode, playerName, isHost})
        hasJoined.current = true
      }

      socket.on("user-joined", ({playerName, isHost})=>{
        console.log(`👋 ${playerName} (${isHost ? "host" : "player"}) joined`)
      })

      socket.on("quiz-started", (data) => {
        setQuizStarted(true)
        // If server sends back quiz data, use it
        if (data && data.quizData) {
          setSelectedQuizData(data.quizData);
          setSelectedQuizTitle(data.quizData.title);
        }
        console.log('quiz-started', data)
      })
    
      return () => {
        socket.off('user-joined')
        socket.off('quiz-started')
      }
    }, [roomCode, playerName, isHost]) // Added missing dependencies

    const handleStartQuiz = () => {
      if (selectedQuizData) {
        // Emit the selected quiz data to the server
        socket.emit("quiz-start", { roomCode, quizData: selectedQuizData });
        console.log("Start Quiz Pressed with quiz:", selectedQuizData.title);
      } else {
        // Use default quiz data if none selected
        socket.emit("quiz-start", roomCode);
        console.log("Start Quiz Pressed with default quiz");
      }
    }

    const handleQuizTemplateSelect = (quizTitle: string, quizData: QuizData) => {
      setSelectedQuizTitle(quizTitle);
      setSelectedQuizData(quizData);
      console.log("Selected quiz:", quizTitle, quizData);
    }

    const handleAskAISubmit = (quizData: QuizData) => {
      console.log("AI quiz generated:", quizData);
      setAiGeneratedQuiz(quizData);
      // Automatically open quiz template to show the AI-generated quiz
      setShowQuizTemplate(true);
    }

    const handleExitQuiz = () => {
      setQuizStarted(false);
      // Reset any quiz-related state if needed
    }

    const handleLeaveRoom = () => {
      if (isHost) {
        router.push('/dashboard')
      } else {
        router.push('/player/join')
      }
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
        
        {/* LEAVE ROOM BUTTON - Top Left */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleLeaveRoom}
          className="absolute top-4 sm:top-8 left-4 sm:left-8 group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-400/30 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 font-semibold text-white shadow-lg text-sm sm:text-base"
        >
          <span className="relative z-10 flex items-center gap-1 sm:gap-2">
            <IconLogout2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Leave Room</span>
            <span className="sm:hidden">Leave</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
        
        {/* ROOM CODE DISPLAY */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8 w-full max-w-sm mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-semibold text-white/80 mb-1 sm:mb-2">Room Code</h2>
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-wider">
                {roomCode}
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-2">
                {isHost ? 'You are the host' : `Joined as ${playerName}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* LeaderBoard Toggle Button - Top Right */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowLeaderBoard(true)}
          className="absolute top-4 sm:top-8 right-4 sm:right-8 group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/30 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 font-semibold text-white shadow-lg text-sm sm:text-base"
        >
          <span className="relative z-10 flex items-center gap-1 sm:gap-2">
            <IconTrophy size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="sm:hidden">Board</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
        
        {/* HOST CONTROLS */}
        {(isHost && !quizStarted) && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-4xl px-4"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden p-6 sm:p-8 lg:p-12 relative group">
              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                    Quiz Control Panel
                  </h2>
                  {selectedQuizTitle && (
                    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 inline-block">
                      <span className="text-white/80 font-semibold text-sm sm:text-base">Selected Topic: </span>
                      <span className="text-purple-300 font-bold text-sm sm:text-base">{selectedQuizTitle}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartQuiz}
                    className="group relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-400/30 rounded-xl sm:rounded-2xl hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 font-bold text-white shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <IconCircle size={16} className="sm:w-[20px] sm:h-[20px]" />
                      <span className="hidden sm:inline">Start Quiz</span>
                      <span className="sm:hidden">Start</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-green-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPollTopics(true)}
                    className="group relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl border border-cyan-400/30 rounded-xl sm:rounded-2xl hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all duration-300 font-bold text-white shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <IconTriangle size={16} className="sm:w-[20px] sm:h-[20px]" />
                      <span className="hidden sm:inline">Poll Topics</span>
                      <span className="sm:hidden">Poll</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-cyan-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQuizTemplate(true)}
                    className="group relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-400/30 rounded-xl sm:rounded-2xl hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 font-bold text-white shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <IconStar size={16} className="sm:w-[20px] sm:h-[20px]" />
                      <span className="hidden sm:inline">Quiz Template</span>
                      <span className="sm:hidden">Template</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAskAI(true)}
                    className="group relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-400/30 rounded-xl sm:rounded-2xl hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 font-bold text-white shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <IconUmbrella size={16} className="sm:w-[20px] sm:h-[20px]" />
                      <span className="hidden sm:inline">Ask AI</span>
                      <span className="sm:hidden">AI</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* QUIZ BOARD */}
        {quizStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl px-4"
          >
            <QuizBoard 
              roomCode={roomCode} 
              isHost={isHost} 
              quizData={selectedQuizData}
              onExitQuiz={handleExitQuiz}
            />
          </motion.div>
        )}

        {/* PLAYER WAITING STATE */}
        {(!isHost && !quizStarted) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center px-4"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-400 mx-auto mb-4 sm:mb-6"></div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Waiting for Host</h3>
              <p className="text-white/80 text-base sm:text-lg">The host will start the quiz soon...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* LeaderBoard Modal */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          showLeaderBoard ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dimmed background */}
        <div 
          className="absolute inset-0 bg-[rgba(15,23,42,0.8)] backdrop-blur-sm"
          onClick={() => setShowLeaderBoard(false)}
        />
        
        {/* LeaderBoard overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showLeaderBoard ? 1 : 0, scale: showLeaderBoard ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-lg max-w-sm sm:max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowLeaderBoard(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/80 hover:text-white text-xl sm:text-2xl font-bold z-10 hover:scale-110 transition-transform duration-200"
            >
              ×
            </button>
            
            {/* LeaderBoard content */}
            <div className="p-4 sm:p-6">
              <LeaderBoard />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {/* Poll Topics Modal */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          showPollTopics ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dimmed background */}
        <div 
          className="absolute inset-0 bg-[rgba(15,23,42,0.8)] backdrop-blur-sm"
          onClick={() => setShowPollTopics(false)}
        />
        
        {/* Poll Topics overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <TopicBubbleSelector 
            isOpen={showPollTopics} 
            onClose={() => setShowPollTopics(false)} 
            isHost={isHost}
          />
        </div>
      </div>
      
      {/* Ask AI Modal */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          showAskAI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dimmed background */}
        <div 
          className="absolute inset-0 bg-[rgba(15,23,42,0.8)] backdrop-blur-sm"
          onClick={() => setShowAskAI(false)}
        />
        
        {/* Ask AI overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showAskAI ? 1 : 0, scale: showAskAI ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <AskAI 
            isOpen={showAskAI}
            onClose={() => setShowAskAI(false)}
            onSubmit={handleAskAISubmit}
          />
        </motion.div>
      </div>
      
      {/* Quiz Template Modal */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          showQuizTemplate ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dimmed background */}
        <div 
          className="absolute inset-0 bg-[rgba(15,23,42,0.8)] backdrop-blur-sm"
          onClick={() => setShowQuizTemplate(false)}
        />
        
        {/* Quiz Template overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showQuizTemplate ? 1 : 0, scale: showQuizTemplate ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <QuizTemplate 
            isOpen={showQuizTemplate}
            onClose={() => setShowQuizTemplate(false)}
            onSelectQuiz={handleQuizTemplateSelect}
            aiGeneratedQuiz={aiGeneratedQuiz}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default GameRoom