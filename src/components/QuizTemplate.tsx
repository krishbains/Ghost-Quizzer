import React from 'react';
import { quizData } from '@/data/quizData';

interface QuizTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuiz: (quizTitle: string, quizData: any) => void;
  aiGeneratedQuiz?: any; // AI-generated quiz data
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ isOpen, onClose, onSelectQuiz, aiGeneratedQuiz }) => {
  if (!isOpen) return null;

  // Combine static quizzes with AI-generated quiz if available
  const allQuizzes = aiGeneratedQuiz ? [...quizData, aiGeneratedQuiz] : quizData;

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.7)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Quiz Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {allQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => {
                  onSelectQuiz(quiz.title, quiz);
                  onClose();
                }}
                className={`w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                  quiz.id === aiGeneratedQuiz?.id ? 'bg-orange-50 border-orange-300' : ''
                }`}
              >
                <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} questions</p>
                {quiz.id === aiGeneratedQuiz?.id && (
                  <p className="text-xs text-orange-600 mt-1">AI Generated</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate; 