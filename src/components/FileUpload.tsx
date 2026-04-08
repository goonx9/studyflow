import React, { useState } from 'react';
import { Upload, FileText, X, Loader2, BookOpen } from 'lucide-react';
import { extractTextFromFile } from '../lib/pdfUtils';

interface FileUploadProps {
  onProcess: (subject: string, contents: string[]) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onProcess, isProcessing }: FileUploadProps) {
  const [subject, setSubject] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please enter a subject.');
      return;
    }
    if (files.length === 0) {
      setError('Please upload at least one file.');
      return;
    }

    try {
      setError(null);
      const contents = await Promise.all(files.map(extractTextFromFile));
      onProcess(subject, contents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing files.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
            Subject to Master
          </label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Quantum Physics, Renaissance Art, Biology 101"
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
            Study Materials (PDF or TXT)
          </label>
          <div className="relative group">
            <input
              type="file"
              multiple
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center group-hover:border-indigo-400 transition-colors bg-gray-50/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm text-indigo-600 mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">PDF or TXT files supported</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing Materials...</span>
            </>
          ) : (
            <span>Generate Study Guide</span>
          )}
        </button>
      </form>
    </div>
  );
}
