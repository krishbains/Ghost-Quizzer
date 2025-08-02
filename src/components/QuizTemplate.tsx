import React from 'react';
import { quizData } from '@/data/quizData';

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

interface QuizTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuiz: (quizTitle: string, quizData: QuizData) => void;
  aiGeneratedQuiz?: QuizData | null; // AI-generated quiz data
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ isOpen, onClose, onSelectQuiz, aiGeneratedQuiz }) => {
  if (!isOpen) return null;

  // Combine static quizzes with AI-generated quiz if available
  const allQuizzes = aiGeneratedQuiz ? [...quizData, aiGeneratedQuiz] : quizData;

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 w-80 sm:w-96 max-h-80 sm:max-h-96 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Select Quiz Template</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
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
              className={`w-full text-left p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                quiz.id === aiGeneratedQuiz?.id ? 'bg-orange-50 border-orange-300' : ''
              }`}
            >
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{quiz.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{quiz.questions.length} questions</p>
              {quiz.id === aiGeneratedQuiz?.id && (
                <p className="text-xs text-orange-600 mt-1">AI Generated</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizTemplate; 