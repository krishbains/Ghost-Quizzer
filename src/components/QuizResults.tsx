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
    <div className='pl-10 pr-10 pt-5'>
      <div className='border-2 shadow-xl border-b-6 border-r-6 border-black p-10 rounded-md bg-yellow-50'>
        <div className="flex justify-between items-center mb-6">
          <h2 className='border-2 border-black text-center font-bold bg-red-200 max-w-md mx-auto px-4 py-2'>Quiz Completed!</h2>
          {isHost && (
            <button
              onClick={onExitQuiz}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
            >
              Exit Quiz
            </button>
          )}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Congratulations!</h3>
          <p className="text-lg">The quiz has been completed. Check the leaderboard to see the final scores!</p>
        </div>

        {/* Leaderboard Section */}
        {players.length > 0 && (
          <div className="mb-8 border-2 border-black p-4 rounded-lg bg-white">
            <h3 className="text-center font-bold mb-4 text-xl">Final Leaderboard</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.playerId} 
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-200 border-2 border-yellow-400' : 
                    index === 1 ? 'bg-gray-200 border-2 border-gray-400' : 
                    index === 2 ? 'bg-orange-200 border-2 border-orange-400' : 
                    'bg-blue-100 border border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-semibold">{player.name}</span>
                    {player.isHost && <span className="ml-2 text-sm bg-purple-200 px-2 py-1 rounded">Host</span>}
                  </div>
                  <span className="font-bold text-lg">{player.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Review Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowReview(!showReview)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
          >
            {showReview ? 'Hide Review' : 'Review Quiz'}
          </button>
        </div>

        {/* Quiz Review Section */}
        {showReview && (
          <div className="mt-6 border-2 border-black p-4 rounded-lg bg-white">
            <h3 className="text-center font-bold mb-4">Quiz Review</h3>
            <div className="space-y-4">
              {quizData.questions.map((question, index: number) => (
                <div key={index} className="border border-gray-300 p-4 rounded-lg">
                  <div className="font-semibold mb-2">Question {index + 1}: {question.text}</div>
                  <div className="space-y-1">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded ${
                          option.id === question.correctOptionId
                            ? 'bg-green-200 border-2 border-green-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        {option.text}
                        {option.id === question.correctOptionId && (
                          <span className="ml-2 text-green-600 font-bold">✓ Correct</span>
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