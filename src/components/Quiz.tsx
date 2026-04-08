import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Quiz Completed!</h2>
        <p className="text-xl text-gray-600">
          You scored <span className="font-bold text-indigo-600">{score}</span> out of {questions.length}
        </p>
        <button
          onClick={resetQuiz}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-indigo-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-8">{currentQuestion.question}</h3>

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const isWrong = isSelected && !isCorrect;

          let bgColor = 'bg-white hover:border-indigo-300';
          let borderColor = 'border-gray-200';
          let textColor = 'text-gray-700';

          if (showResult) {
            if (isCorrect) {
              bgColor = 'bg-green-50';
              borderColor = 'border-green-500';
              textColor = 'text-green-700';
            } else if (isWrong) {
              bgColor = 'bg-red-50';
              borderColor = 'border-red-500';
              textColor = 'text-red-700';
            } else {
              bgColor = 'bg-gray-50 opacity-50';
            }
          }

          return (
            <button
              key={index}
              disabled={showResult}
              onClick={() => handleOptionSelect(option)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${bgColor} ${borderColor} ${textColor}`}
            >
              <span className="font-medium">{option}</span>
              {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
              {showResult && isWrong && <XCircle className="w-6 h-6 text-red-500" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100"
          >
            <p className="text-indigo-900 font-medium mb-2">Explanation:</p>
            <p className="text-indigo-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            
            <button
              onClick={nextQuestion}
              className="mt-6 w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <span>{currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
