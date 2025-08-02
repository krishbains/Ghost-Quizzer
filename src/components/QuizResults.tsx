'use client'
import React, { useState, useEffect } from 'react'
import socket from '@/lib/socket'

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

interface QuizResultsProps {
  quizData: QuizData;
  isHost: boolean;
  onExitQuiz?: () => void;
  players?: Player[];
}

const QuizResults = ({ quizData, isHost, onExitQuiz, players: propPlayers }: QuizResultsProps) => {
  const [showReview, setShowReview] = useState(false);
  const [players, setPlayers] = useState<Player[]>(propPlayers || []);

  useEffect(() => {
    // If players are passed as props, use them
    if (propPlayers) {
      setPlayers(propPlayers);
    }
    
    // Listen for player score updates
    socket.on('update-scores', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off('update-scores');
    };
  }, [propPlayers]);

  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className='px-4 sm:px-10 pt-3 sm:pt-5'>
      <div className='border-2 shadow-xl border-b-6 border-r-6 border-black p-4 sm:p-10 rounded-md bg-yellow-50'>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className='border-2 border-black text-center font-bold bg-red-200 max-w-md mx-auto px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base'>Quiz Completed!</h2>
          {isHost && (
            <button
              onClick={onExitQuiz}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow-lg text-sm sm:text-base"
            >
              Exit Quiz
            </button>
          )}
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Congratulations!</h3>
          <p className="text-sm sm:text-lg">The quiz has been completed. Check the leaderboard to see the final scores!</p>
        </div>

        {/* Leaderboard Section */}
        {players.length > 0 && (
          <div className="mb-6 sm:mb-8 border-2 border-black p-3 sm:p-4 rounded-lg bg-white">
            <h3 className="text-center font-bold mb-3 sm:mb-4 text-lg sm:text-xl">Final Leaderboard</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.playerId} 
                  className={`flex justify-between items-center p-2 sm:p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-200 border-2 border-yellow-400' : 
                    index === 1 ? 'bg-gray-200 border-2 border-gray-400' : 
                    index === 2 ? 'bg-orange-200 border-2 border-orange-400' : 
                    'bg-blue-100 border border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-2 sm:mr-3 text-sm sm:text-base">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-semibold text-sm sm:text-base">{player.name}</span>
                    {player.isHost && <span className="ml-2 text-xs sm:text-sm bg-purple-200 px-1 sm:px-2 py-1 rounded">Host</span>}
                  </div>
                  <span className="font-bold text-base sm:text-lg">{player.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Review Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowReview(!showReview)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base"
          >
            {showReview ? 'Hide Review' : 'Review Quiz'}
          </button>
        </div>

        {/* Quiz Review Section */}
        {showReview && (
          <div className="mt-4 sm:mt-6 border-2 border-black p-3 sm:p-4 rounded-lg bg-white">
            <h3 className="text-center font-bold mb-3 sm:mb-4 text-sm sm:text-base">Quiz Review</h3>
            <div className="space-y-3 sm:space-y-4">
              {quizData.questions.map((question, index: number) => (
                <div key={index} className="border border-gray-300 p-3 sm:p-4 rounded-lg">
                  <div className="font-semibold mb-2 text-sm sm:text-base">Question {index + 1}: {question.text}</div>
                  <div className="space-y-1">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded text-sm sm:text-base ${
                          option.id === question.correctOptionId
                            ? 'bg-green-200 border-2 border-green-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        {option.text}
                        {option.id === question.correctOptionId && (
                          <span className="ml-2 text-green-600 font-bold text-xs sm:text-sm">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizResults; 