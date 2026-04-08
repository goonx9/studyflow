import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsProps {
  cards: Flashcard[];
}

export default function Flashcards({ cards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const reset = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <div className="relative w-full max-w-md h-64 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <motion.div
              className="w-full h-full cursor-pointer preserve-3d transition-transform duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-gray-200 rounded-2xl shadow-sm flex items-center justify-center p-8 text-center">
                <p className="text-xl font-medium text-gray-800">{cards[currentIndex].question}</p>
                <div className="absolute bottom-4 text-xs text-gray-400 uppercase tracking-widest">Click to flip</div>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-sm flex items-center justify-center p-8 text-center"
                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              >
                <p className="text-lg text-indigo-900">{cards[currentIndex].answer}</p>
                <div className="absolute bottom-4 text-xs text-indigo-400 uppercase tracking-widest">Answer</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={prevCard}
          className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="text-sm font-medium text-gray-500">
          {currentIndex + 1} / {cards.length}
        </div>

        <button
          onClick={nextCard}
          className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <button
        onClick={reset}
        className="flex items-center space-x-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset Deck</span>
      </button>
    </div>
  );
}
