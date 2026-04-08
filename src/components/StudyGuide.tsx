import { motion } from 'motion/react';
import { BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import { StudyContent } from '../types';

interface StudyGuideProps {
  content: StudyContent;
}

export default function StudyGuide({ content }: StudyGuideProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-600">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Summary</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xl text-gray-700 leading-relaxed italic">
            "{content.summary}"
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center space-x-3 text-indigo-600">
          <Lightbulb className="w-6 h-6" />
          <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Deep Teaching</h2>
        </div>
        
        <div className="grid gap-8">
          {content.keyTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="space-y-3 pt-2">
                  <h3 className="text-2xl font-bold text-gray-900">{topic.title}</h3>
                  <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
                    {topic.content.split('\n').map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">Key Takeaways</h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-6">
            {content.keyTopics.slice(0, 4).map((topic, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <span className="text-indigo-100 font-medium">{topic.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
