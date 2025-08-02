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
    const question = quizData.questions[currentQuestionIndex]
    socket.emit('submit-answer', { roomCode, questionId: question.id, optionId: selectedId, correctOptionId: question.correctOptionId })
    setSubmitted(true)
  }

  function handleRevealToggle() {
    if (quizEnded) return // Don't allow reveal toggle after quiz ends
    const newVisibility = !showAnswer;
    setShowAnswer(newVisibility);
    if (newVisibility) setSubmitted(false); // Clear submitted message
    socket.emit("toggle-answer-visibility", { roomCode, visible: newVisibility })
    console.log("Emitting reveal-scores for roomCode:", roomCode);
    socket.emit("reveal-scores", { roomCode });
    console.log("scores were revealed")
  }

  function handleChangeQuestion(newIndex: number) {
    if (quizEnded) return // Don't allow question changes after quiz ends
    setCurrentQuestionIndex(newIndex);
    setSubmitted(false);
    setShowAnswer(false);
    setTimeLeft(30);
    setTimerActive(true);
    socket.emit("change-question", { roomCode, questionIndex: newIndex });
  }

  function handleEndQuiz() {
    console.log("Ending quiz")
    setQuizEnded(true)
    setShowResults(true)
    setTimerActive(false)
    socket.emit("end-quiz", { roomCode });
    // Reveal final scores
    socket.emit("reveal-scores", { roomCode });
  }

  function handleExitQuiz() {
    if (onExitQuiz) {
      onExitQuiz();
    }
  }

  function handleTimeUp() {
    // Timer ran out, reveal answers
    setShowAnswer(true);
    setSubmitted(false);
    socket.emit("toggle-answer-visibility", { roomCode, visible: true });
    socket.emit("reveal-scores", { roomCode });
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
    <div className='pl-10 pr-10 pt-5'>
      <div className='border-2 shadow-xl border-b-6 border-r-6 border-black p-10 rounded-md bg-yellow-50 relative'>
        {/* Circular Timer */}
        <QuizTimer 
          timeLeft={timeLeft}
          timerActive={timerActive}
          onTimeUp={handleTimeUp}
          onTick={handleTick}
        />

        <h2 className='border-2 border-black text-center font-bold bg-red-200 max-w-md mx-auto'>{quizData.title}</h2>
        <div>
          <h2>Question: {currentQuestionIndex + 1}</h2>
        </div>
        <div className='flex justify-center'>
          <div className='w-full'>
            <h3 className='mt-8 text-center'>{currentQuestion.text}</h3>

            {(showAnswer || !submitted) && (
              <ul className='grid grid-cols-2 gap-5 mt-10 mb-5'>
                {currentQuestion.options.map((option: { id: string; text: string }) => {
                  const isCorrect = option.id === currentQuestion.correctOptionId;
                  const revealClass = showAnswer && isCorrect ? 'bg-green-300' : 'bg-amber-400';
                  return (
                    <li key={option.id} className="h-24">
                      <button
                        className={`border border-black shadow-xl border-b-3 border-r-3 rounded-md w-full h-full flex items-center justify-center ${revealClass} ${submitted || showAnswer ? 'cursor-not-allowed opacity-60' : 'hover:bg-amber-500'}`}
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
              <h2 className='text-center mt-5 font-bold'>Submitted!</h2>
            )}

            {isHost && (
              <div>
                <div className='text-center'>
                  <button
                    className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600 min-w-22 mt-10'
                    onClick={handleRevealToggle}
                  >
                    {showAnswer ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                <div className='flex justify-center gap-10 mt-5'>
                  <button
                    className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600'
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
                    className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600'
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
                      className='bg-slate-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-slate-600'
                      onClick={handleEndQuiz}
                    >
                      End Quiz
                    </button>
                  )}
                  <button
                    onClick={handleExitQuiz}
                    className='bg-red-500 border border-black border-b-3 border-r-3 p-2 rounded-md hover:bg-red-600 text-white'
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
