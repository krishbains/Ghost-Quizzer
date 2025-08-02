'use client'
import socket from '@/lib/socket'
import React, { useEffect, useState, useRef } from 'react'
import QuizBoard from './QuizBoard'
import { Button } from './ui/button'
import LeaderBoard from './LeaderBoard'
import TopicBubbleSelector from './PollInput'
import QuizTemplate from './QuizTemplate'
import AskAI from './AskAI'

const GameRoom = ({roomCode, playerName, isHost}: {roomCode: string, playerName: string, isHost: boolean}) => {
    const [quizStarted, setQuizStarted] = useState(false)
    const [selectedQuizTitle, setSelectedQuizTitle] = useState<string>('')
    const [selectedQuizData, setSelectedQuizData] = useState<any>(null)
    const [showPollTopics, setShowPollTopics] = useState(false)
    const [showQuizTemplate, setShowQuizTemplate] = useState(false)
    const [showAskAI, setShowAskAI] = useState(false)
    const [showLeaderBoard, setShowLeaderBoard] = useState(false)
    const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState<any>(null)
    const hasJoined = useRef(false)
    
    useEffect(() => {
      // Only join once
      if (!hasJoined.current) {
        socket.emit("join-room", {roomCode, playerName, isHost})
        hasJoined.current = true
      }

      socket.on("user-joined", ({playerName, isHost, socketId})=>{
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
    }, []) // Empty dependency array to run only once

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

    const handleQuizTemplateSelect = (quizTitle: string, quizData: any) => {
      setSelectedQuizTitle(quizTitle);
      setSelectedQuizData(quizData);
      console.log("Selected quiz:", quizTitle, quizData);
    }

    const handleAskAISubmit = (quizData: any) => {
      console.log("AI quiz generated:", quizData);
      setAiGeneratedQuiz(quizData);
      // Automatically open quiz template to show the AI-generated quiz
      setShowQuizTemplate(true);
    }

    const handleExitQuiz = () => {
      setQuizStarted(false);
      // Reset any quiz-related state if needed
    }
    
  return (
    <div className='mt-15 relative'>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-xl font-bold border-1 border-black border-r-3 border-b-3 bg-indigo-200 max-w-66 p-2 rounded-md shadow-xl'>
          Room Code: {roomCode}
        </div> 
      </div>

      {/* LeaderBoard Toggle Button - Top Right */}
      <button
        onClick={() => setShowLeaderBoard(true)}
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg z-10"
      >
        Leaderboard
      </button>
      
      {(isHost && !quizStarted) && (
        <div className="flex items-center justify-center mt-5">
          <div className=" bg-indigo-600 flex flex-col items-center justify-center border-2 border-black p-10 w-[38rem] min-h-[27rem] rounded shadow-xl gap-5">
            <div className="w-full text-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Topic: {selectedQuizTitle || ''}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Button 
                onClick={handleStartQuiz}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                Start Quiz
              </Button>
              <Button 
                onClick={() => setShowPollTopics(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                Poll Topics
              </Button>
              <Button 
                onClick={() => setShowQuizTemplate(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                Quiz Template
              </Button>
              <Button 
                onClick={() => setShowAskAI(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {quizStarted && 
        <div>
          <QuizBoard 
            roomCode={roomCode} 
            isHost={isHost} 
            quizData={selectedQuizData}
            onExitQuiz={handleExitQuiz}
          />
        </div>
      }

      {/* Always render LeaderBoard but hide it */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          showLeaderBoard ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dimmed background */}
        <div 
          className="absolute inset-0 bg-[rgba(15,23,42,0.7)] "
          onClick={() => setShowLeaderBoard(false)}
        />
        
        {/* LeaderBoard overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowLeaderBoard(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            >
              ×
            </button>
            
            {/* LeaderBoard content */}
            <div className="p-6">
              <LeaderBoard />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TopicBubbleSelector 
        isOpen={showPollTopics} 
        onClose={() => setShowPollTopics(false)} 
        isHost={isHost}
      />
      
      <QuizTemplate 
        isOpen={showQuizTemplate}
        onClose={() => setShowQuizTemplate(false)}
        onSelectQuiz={handleQuizTemplateSelect}
        aiGeneratedQuiz={aiGeneratedQuiz}
      />
      
      <AskAI 
        isOpen={showAskAI}
        onClose={() => setShowAskAI(false)}
        onSubmit={handleAskAISubmit}
      />
    </div>
  )
}

export default GameRoom