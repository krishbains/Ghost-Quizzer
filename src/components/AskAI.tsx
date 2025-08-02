import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

// Check if API key is available
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.warn('Google AI API key is not set. Please add NEXT_PUBLIC_GOOGLE_AI_API_KEY to your .env.local file');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || ''
});

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

interface AskAIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quizData: QuizData) => void;
}

const AskAI: React.FC<AskAIProps> = ({ isOpen, onClose, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function AskGemini(prompt: string, topic: string) {
    try {
      if (!apiKey) {
        throw new Error('Google AI API key is not configured. Please add NEXT_PUBLIC_GOOGLE_AI_API_KEY to your .env.local file');
      }
      
      setIsLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      const responseText = response.text || '';
      console.log('AI Response:', responseText);
      
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        try {
          const quizData = JSON.parse(jsonString) as QuizData;
          console.log('Parsed quiz data:', quizData);
          
          // Generate a unique ID for the AI quiz
          const aiQuizData: QuizData = {
            ...quizData,
            id: `ai_quiz_${Date.now()}`,
            title: quizData.title || `${topic} Quiz`
          };
          
          onSubmit(aiQuizData);
          setTopic('');
          onClose();
        } catch (parseError) {
          console.error('Failed to parse JSON from AI response:', parseError);
          console.error('Response text:', responseText);
        }
      } else {
        console.error('No JSON found in AI response');
        console.error('Response text:', responseText);
      }
    } catch (error) {
      console.error('Error calling AI:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const prompt: string = `Generate a json '{}' object with the following structure. It must contain at least 10 multiple-choice questions about ${topic}. 

  The output must be valid Json and should not contain any explanations, markdown, comments, or extra text. Only output the Json object.

  The structure is:

  {
    id: "quiz_random_number",
    title: "${topic} Quiz",
    questions: [
      {
        id: "q1",
        text: "Question text here",
        options: [
          { id: "a", text: "Option A text" },
          { id: "b", text: "Option B text" },
          { id: "c", text: "Option C text" },
          { id: "d", text: "Option D text" }
        ],
        correctOptionId: "b"
      },
      // Repeat for q2, q3, q4, ... q10
    ]
  }

  Generate 10 or more unique questions under this structure.`

  const handleSubmit = () => {
    if (topic.trim()) {
      AskGemini(prompt, topic);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ask AI for Quiz Topic</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Enter a topic for AI-generated quiz:
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Ancient Egypt, Space Exploration, Cooking..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!topic.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskAI; 