
import React, { useState, useEffect } from 'react';
import { generateSummary, generateFlashcards, generateQuiz } from '../services/geminiService';
import { TaskType, Flashcard, QuizQuestion, StudyMaterial } from '../types';

const StudyHub: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [subTab, setSubTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');
  const [results, setResults] = useState<{
    summary?: string;
    flashcards?: Flashcard[];
    quiz?: QuizQuestion[];
  }>({});
  const [library, setLibrary] = useState<StudyMaterial[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pino_library');
    if (saved) setLibrary(JSON.parse(saved));
  }, []);

  const saveToLibrary = (title: string, type: TaskType, data: any) => {
    const newItem: StudyMaterial = {
      id: Date.now().toString(),
      title: title || 'Untitled Study',
      type,
      content: JSON.stringify(data),
      timestamp: Date.now()
    };
    const updated = [newItem, ...library];
    setLibrary(updated);
    localStorage.setItem('pino_library', JSON.stringify(updated));
    alert('Saved to library!');
  };

  const deleteFromLibrary = (id: string) => {
    const updated = library.filter(item => item.id !== id);
    setLibrary(updated);
    localStorage.setItem('pino_library', JSON.stringify(updated));
  };

  const handleGenerate = async (type: TaskType) => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      if (type === TaskType.SUMMARY) {
        const sum = await generateSummary(content);
        setResults(prev => ({ ...prev, summary: sum }));
        setSubTab('summary');
      } else if (type === TaskType.FLASHCARDS) {
        const cards = await generateFlashcards(content);
        setResults(prev => ({ ...prev, flashcards: cards }));
        setSubTab('flashcards');
        setCurrentCardIndex(0);
        setShowAnswer(false);
      } else if (type === TaskType.QUIZ) {
        const questions = await generateQuiz(content);
        setResults(prev => ({ ...prev, quiz: questions }));
        setSubTab('quiz');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Study Hub</h1>
          <p className="text-gray-400">Transform raw content into knowledge assets.</p>
        </div>
        <div className="inline-flex p-1 bg-gray-900 rounded-2xl border border-gray-800">
          <button 
            onClick={() => setActiveTab('generate')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'generate' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Create
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            My Library ({library.length})
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        <div className="space-y-8">
          <div className="bg-[#111] border border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <textarea
              className="w-full h-48 bg-transparent resize-none focus:outline-none text-gray-200 text-lg leading-relaxed placeholder:text-gray-700"
              placeholder="Paste notes, PDF text, or a video transcript..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                onClick={() => handleGenerate(TaskType.SUMMARY)}
                disabled={loading}
                className="flex-1 min-w-[140px] py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <i className="fas fa-align-left text-blue-400"></i> Summarize
              </button>
              <button 
                onClick={() => handleGenerate(TaskType.FLASHCARDS)}
                disabled={loading}
                className="flex-1 min-w-[140px] py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <i className="fas fa-layer-group text-purple-400"></i> Flashcards
              </button>
              <button 
                onClick={() => handleGenerate(TaskType.QUIZ)}
                disabled={loading}
                className="flex-1 min-w-[140px] py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <i className="fas fa-vial text-green-400"></i> Take Quiz
              </button>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[2rem]">
                 <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="font-bold text-blue-400 animate-pulse uppercase tracking-widest text-xs">Pino is analyzing...</p>
              </div>
            )}
          </div>

          {(results.summary || results.flashcards || results.quiz) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex gap-4">
                    {['summary', 'flashcards', 'quiz'].map((tab) => (
                      results[tab as keyof typeof results] && (
                        <button
                          key={tab}
                          onClick={() => setSubTab(tab as any)}
                          className={`text-sm font-bold uppercase tracking-wider transition-all ${subTab === tab ? 'text-blue-500' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                          {tab}
                        </button>
                      )
                    ))}
                 </div>
                 <button 
                  onClick={() => {
                    const type = subTab === 'summary' ? TaskType.SUMMARY : subTab === 'flashcards' ? TaskType.FLASHCARDS : TaskType.QUIZ;
                    const data = results[subTab as keyof typeof results];
                    saveToLibrary(`${subTab.toUpperCase()} - ${new Date().toLocaleDateString()}`, type, data);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                 >
                    <i className="fas fa-save"></i> Save to Library
                 </button>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-800 rounded-[2rem] p-8 shadow-xl">
                {subTab === 'summary' && results.summary && (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{results.summary}</p>
                  </div>
                )}

                {subTab === 'flashcards' && results.flashcards && (
                  <div className="flex flex-col items-center py-10">
                    <div 
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="w-full max-w-lg aspect-video cursor-pointer group"
                      style={{ perspective: '1000px' }}
                    >
                      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${showAnswer ? 'rotate-y-180' : ''}`}>
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-10 rounded-[2.5rem] text-center border-2 border-gray-700 shadow-2xl group-hover:border-blue-500/30">
                          <span className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4">Question</span>
                          <p className="text-2xl font-bold">{results.flashcards[currentCardIndex].front}</p>
                        </div>
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-700 to-indigo-900 flex flex-col items-center justify-center p-10 rounded-[2.5rem] text-center border-2 border-blue-400 shadow-2xl transform rotate-y-180">
                          <span className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Answer</span>
                          <p className="text-2xl font-bold text-white">{results.flashcards[currentCardIndex].back}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 mt-10">
                      <button 
                        disabled={currentCardIndex === 0}
                        onClick={() => {setCurrentCardIndex(i => i - 1); setShowAnswer(false);}}
                        className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-gray-700 disabled:opacity-20 transition-all border border-gray-700"
                      >
                        <i className="fas fa-arrow-left"></i>
                      </button>
                      <div className="text-center">
                        <span className="block text-xl font-black text-white">{currentCardIndex + 1}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">of {results.flashcards.length}</span>
                      </div>
                      <button 
                        disabled={currentCardIndex === (results.flashcards?.length || 0) - 1}
                        onClick={() => {setCurrentCardIndex(i => i + 1); setShowAnswer(false);}}
                        className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-gray-700 disabled:opacity-20 transition-all border border-gray-700"
                      >
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {subTab === 'quiz' && results.quiz && (
                  <div className="space-y-12 max-w-2xl mx-auto py-4">
                     {results.quiz.map((q, qIdx) => (
                       <div key={qIdx} className="space-y-6">
                          <div className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-blue-400 mt-1">{qIdx + 1}</span>
                            <h4 className="text-xl font-bold leading-tight">{q.question}</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-3 ml-12">
                             {q.options.map((opt, oIdx) => (
                               <button 
                                 key={oIdx}
                                 onClick={() => {
                                   if (oIdx === q.correctAnswer) alert("Correct! Excellent job.");
                                   else alert("Incorrect. The right answer was: " + q.options[q.correctAnswer]);
                                 }}
                                 className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl text-left hover:border-blue-600 hover:bg-blue-600/5 transition-all text-gray-300 font-medium"
                               >
                                 <span className="mr-4 text-gray-600 font-mono">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                               </button>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
          {library.length === 0 ? (
            <div className="col-span-full py-20 text-center">
               <i className="fas fa-folder-open text-6xl text-gray-800 mb-6"></i>
               <h3 className="text-xl font-bold text-gray-500">Your library is empty</h3>
               <p className="text-gray-600">Start creating study materials to see them here.</p>
            </div>
          ) : (
            library.map(item => (
              <div key={item.id} className="group bg-[#111] border border-gray-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === TaskType.SUMMARY ? 'bg-blue-500/10 text-blue-500' :
                    item.type === TaskType.FLASHCARDS ? 'bg-purple-500/10 text-purple-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    <i className={`fas ${
                      item.type === TaskType.SUMMARY ? 'fa-align-left' :
                      item.type === TaskType.FLASHCARDS ? 'fa-layer-group' :
                      'fa-vial'
                    }`}></i>
                  </div>
                  <button 
                    onClick={() => deleteFromLibrary(item.id)}
                    className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                <h3 className="text-lg font-bold mb-1 truncate">{item.title}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                <button 
                  onClick={() => {
                    const parsed = JSON.parse(item.content);
                    if (item.type === TaskType.SUMMARY) setResults({ summary: parsed });
                    else if (item.type === TaskType.FLASHCARDS) setResults({ flashcards: parsed });
                    else setResults({ quiz: parsed });
                    setSubTab(item.type.toLowerCase() as any);
                    setActiveTab('generate');
                  }}
                  className="mt-6 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-black uppercase tracking-tighter transition-colors"
                >
                  Open Study
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudyHub;
