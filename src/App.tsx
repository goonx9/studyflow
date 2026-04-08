import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  BrainCircuit, 
  GraduationCap, 
  Layout, 
  Layers, 
  HelpCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import FileUpload from './components/FileUpload';
import StudyGuide from './components/StudyGuide';
import Quiz from './components/Quiz';
import Flashcards from './components/Flashcards';
import { generateStudyGuide } from './services/gemini';
import { StudyContent } from './types';

type Tab = 'guide' | 'quiz' | 'flashcards';

export default function App() {
  const [studyContent, setStudyContent] = useState<StudyContent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('guide');

  const handleProcess = async (subject: string, contents: string[]) => {
    setIsProcessing(true);
    try {
      const result = await generateStudyGuide(subject, contents);
      setStudyContent(result);
      setActiveTab('guide');
    } catch (error) {
      console.error('Error generating study guide:', error);
      alert('Failed to generate study guide. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setStudyContent(null);
    setActiveTab('guide');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StudyFlow <span className="text-indigo-600">AI</span></span>
          </div>

          {studyContent && (
            <button 
              onClick={reset}
              className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Subject</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!studyContent ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-widest"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Learning</span>
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                  Master Any Subject <br />
                  <span className="text-indigo-600">Deeply.</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                  Upload your materials and let our AI tutor guide you through 
                  complex topics with structured teaching, quizzes, and flashcards.
                </p>
              </div>

              <FileUpload onProcess={handleProcess} isProcessing={isProcessing} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  {studyContent.subject}
                </h1>
                <div className="flex items-center justify-center space-x-2">
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-widest border border-green-100">
                    Mastery Mode Active
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-col items-center space-y-8">
                <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl">
                  {[
                    { id: 'guide', label: 'Study Guide', icon: Layout },
                    { id: 'flashcards', label: 'Flashcards', icon: Layers },
                    { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                        activeTab === tab.id 
                          ? 'text-indigo-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white shadow-sm rounded-xl"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <tab.icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'guide' && <StudyGuide content={studyContent} />}
                      {activeTab === 'flashcards' && <Flashcards cards={studyContent.flashcards} />}
                      {activeTab === 'quiz' && <Quiz questions={studyContent.quiz} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Powered by Gemini 3 Flash</span>
          </div>
          <p>© 2026 StudyFlow AI. Deep learning for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
