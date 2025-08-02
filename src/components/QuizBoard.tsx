'use client'
import { quizData as defaultQuizData } from '@/data/quizData';
import socket from '@/lib/socket';
import React, { useState, useEffect } from 'react'
import QuizResults from './QuizResults'
import QuizTimer from './QuizTimer'

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

interface Player {
  playerId: string;
  name: string;
  isHost: boolean;
  score: number;
}

interface QuizBoardProps {
  roomCode: string;
  isHost: boolean;
  quizData?: QuizData | null;
  onExitQuiz?: () => void;
}

const QuizBoard = ({ roomCode, isHost, quizData: propQuizData, onExitQuiz }: QuizBoardProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [finalPlayers, setFinalPlayers] = useState<Player[]>([]);

  // Use provided quiz data or fall back to default (first quiz in the array)
  const quizData = propQuizData || defaultQuizData[0];
  const currentQuestion = quizData.questions[currentQuestionIndex];

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setTimerActive(true);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!isHost) {
      socket.on("question-changed", ({ questionIndex }) => {
        setCurrentQuestionIndex(questionIndex)
        setSubmitted(false)
        setShowAnswer(false)
        setTimeLeft(30)
        setTimerActive(true)
      })
      socket.on("answer-visibility-changed", ({ visible }) => {
        setShowAnswer(visible)
        if (visible) setSubmitted(false) // Reveal overrides 'Submitted' state
      })
      socket.on("quiz-ended", (data) => {
        setQuizEnded(true)
        setShowResults(true)
        setTimerActive(false)
        if (data.players) {
          setFinalPlayers(data.players)
        }
      })
    } else {
      socket.on("quiz-ended", (data) => {
        setQuizEnded(true)
        setShowResults(true)
        setTimerActive(false)
        if (data.players) {
          setFinalPlayers(data.players)
        }
      })
    }

    return () => {
      if (!isHost) {
        socket.off("question-changed")
        socket.off("answer-visibility-changed")
        socket.off("quiz-ended")
      } else {
        socket.off("quiz-ended")
      }
    }
  }, [isHost])

  function handleAnswer(selectedId: string) {
    if (submitted || showAnswer || quizEnded) return // Prevent further answers after submission, reveal, or quiz end

    setSubmitted(true)
    socket.emit("submit-answer", { roomCode, selectedId })
  }

  function handleRevealToggle() {
    setShowAnswer(!showAnswer)
    socket.emit("toggle-answer-visibility", { roomCode, visible: !showAnswer })
  }

  function handleChangeQuestion(newIndex: number) {
    setCurrentQuestionIndex(newIndex)
    setSubmitted(false)
    setShowAnswer(false)
    setTimeLeft(30)
    setTimerActive(true)
    socket.emit("change-question", { roomCode, questionIndex: newIndex })
  }

  function handleEndQuiz() {
    socket.emit("end-quiz", { roomCode })
  }

  function handleExitQuiz() {
    if (onExitQuiz) {
      onExitQuiz()
    }
  }

  function handleTimeUp() {
    setTimerActive(false)
    if (isHost) {
      setShowAnswer(true)
      socket.emit("toggle-answer-visibility", { roomCode, visible: true })
    }
  }

  function handleTick() {
    setTimeLeft(prev => prev - 1);
  }

  if (showResults) {
    return (
      <QuizResults 
        quizData={quizData}
        isHost={isHost}
        onExitQuiz={handleExitQuiz}
        players={finalPlayers}
      />
    );
  }

  return (
    <div className='px-4 sm:px-10 pt-3 sm:pt-5'>
      <div className='border-2 shadow-xl border-b-6 border-r-6 border-black p-4 sm:p-10 rounded-md bg-yellow-50 relative'>
        {/* Circular Timer */}
        <QuizTimer 
          timeLeft={timeLeft}
          timerActive={timerActive}
          onTimeUp={handleTimeUp}
          onTick={handleTick}
        />

        <h2 className='border-2 border-black text-center font-bold bg-red-200 max-w-md mx-auto text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2'>{quizData.title}</h2>
        <div>
          <h2 className='text-sm sm:text-base font-semibold mt-2 sm:mt-4'>Question: {currentQuestionIndex + 1}</h2>
        </div>
        <div className='flex justify-center'>
          <div className='w-full'>
            <h3 className='mt-4 sm:mt-8 text-center text-sm sm:text-base px-2'>{currentQuestion.text}</h3>

            {(showAnswer || !submitted) && (
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mt-6 sm:mt-10 mb-3 sm:mb-5'>
                {currentQuestion.options.map((option: { id: string; text: string }) => {
                  const isCorrect = option.id === currentQuestion.correctOptionId;
                  const revealClass = showAnswer && isCorrect ? 'bg-green-300' : 'bg-amber-400';
                  return (
                    <li key={option.id} className="h-16 sm:h-24">
                      <button
                        className={`border border-black shadow-xl border-b-3 border-r-3 rounded-md w-full h-full flex items-center justify-center ${revealClass} ${submitted || showAnswer ? 'cursor-not-allowed opacity-60' : 'hover:bg-amber-500'} text-xs sm:text-sm px-2 sm:px-4`}
                        onClick={() => handleAnswer(option.id)}
                        disabled={submitted || showAnswer}
                      >
                        {option.text}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {submitted && !showAnswer && (
              <h2 className='text-center mt-3 sm:mt-5 font-bold text-sm sm:text-base'>Submitted!</h2>
            )}

            {isHost && (
              <div>
                <div className='text-center'>
                  <button
                    className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600 min-w-20 sm:min-w-22 mt-6 sm:mt-10 text-xs sm:text-sm'
                    onClick={handleRevealToggle}
                  >
                    {showAnswer ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                <div className='flex flex-col sm:flex-row justify-center gap-3 sm:gap-10 mt-3 sm:mt-5'>
                  <button
                    className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600 text-xs sm:text-sm'
                    onClick={() => {
                      if (currentQuestionIndex > 0) {
                        handleChangeQuestion(currentQuestionIndex - 1);
                      }
                    }}
                  >
                    Prev
                  </button>
                  {currentQuestionIndex < quizData.questions.length - 1 && (
                  <button
                    className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600 text-xs sm:text-sm'
                    onClick={() => {
                      if (currentQuestionIndex < quizData.questions.length - 1) {
                        handleChangeQuestion(currentQuestionIndex + 1);
                      }
                    }}
                  >
                    Next
                  </button>)}
                  {currentQuestionIndex === quizData.questions.length - 1 && (
                    <button
                      className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600 text-xs sm:text-sm'
                      onClick={handleEndQuiz}
                    >
                      End Quiz
                    </button>
                  )}
                  <button
                    onClick={handleExitQuiz}
                    className='bg-red-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-red-600 text-white text-xs sm:text-sm'
                  >
                    Exit Quiz
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizBoard;
