
import React, { useState, useRef } from 'react';
import { generatePodcastScript, generateAudio, generateBrainrotVideo, generateImage } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';

const Studio: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('9:16');
  const [imgSize, setImgSize] = useState<"1K" | "2K" | "4K">("1K");

  const audioContextRef = useRef<AudioContext | null>(null);

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Mandatory guideline: MUST assume the key selection was successful after triggering openSelectKey()
        return true;
      }
    }
    return true;
  };

  const handleGeneratePodcast = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setStatus('Generating conversational podcast script...');
    try {
      const script = await generatePodcastScript(content);
      setStatus('Synthesizing Joe & Jane (Gemini 2.5 TTS)...');
      const audioData = await generateAudio(script || "Welcome to the Pino Podcast.");
      if (audioData) {
        setGeneratedAudio(audioData);
        setStatus('Podcast production complete!');
      }
    } catch (error: any) {
      console.error(error);
      setStatus('Error in audio engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setStatus('Ensuring Veo Access...');
    try {
      await checkApiKey();
      setStatus(`Rendering Video (${videoAspect})...`);
      const blob = await generateBrainrotVideo(content.substring(0, 150), videoAspect);
      const url = URL.createObjectURL(blob);
      setGeneratedVideo(url);
      setStatus('Video successfully rendered!');
    } catch (error: any) {
      console.error(error);
      // Handling mandatory guideline for specific error reset
      if (error?.message?.includes('Requested entity was not found')) {
        setStatus('Key invalid or project not found. Resetting...');
        // @ts-ignore
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setStatus('Video generation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setStatus(`Generating ${imgSize} Image...`);
    try {
      await checkApiKey();
      const url = await generateImage(content, imgSize);
      if (url) {
        setGeneratedImg(url);
        setStatus('Image ready!');
      } else {
        setStatus('No image generated.');
      }
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('Requested entity was not found')) {
        setStatus('Key invalid or project not found. Resetting...');
        // @ts-ignore
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setStatus('Image generation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (!generatedAudio) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    const bytes = decode(generatedAudio);
    const buffer = await decodeAudioData(bytes, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black tracking-tight mb-2">Creation Studio</h1>
        <p className="text-gray-400">Convert text into professional audio, viral video, or high-res images.</p>
        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-2">
          Note: High-quality models require a paid API key. 
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline ml-1">View Billing Docs</a>
        </p>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 mb-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32"></div>
        <textarea
          className="w-full h-32 bg-transparent resize-none focus:outline-none text-xl leading-relaxed text-gray-200 placeholder:text-gray-800 font-medium mb-4"
          placeholder="Describe your vision or paste your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-4">
             <button 
              onClick={handleGeneratePodcast}
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase tracking-widest text-xs active-scale"
            >
              <i className="fas fa-podcast"></i> Podcast
            </button>
          </div>

          <div className="space-y-2">
             <button 
              onClick={handleGenerateVideo}
              disabled={loading}
              className="w-full py-4 bg-pink-600 hover:bg-pink-500 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase tracking-widest text-xs active-scale"
            >
              <i className="fas fa-play"></i> Veo Video
            </button>
            <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
               <button onClick={() => setVideoAspect('16:9')} className={`flex-1 py-1 text-[10px] font-bold rounded-lg ${videoAspect === '16:9' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>16:9</button>
               <button onClick={() => setVideoAspect('9:16')} className={`flex-1 py-1 text-[10px] font-bold rounded-lg ${videoAspect === '9:16' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>9:16</button>
            </div>
          </div>

          <div className="space-y-2">
             <button 
              onClick={handleGenerateImage}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase tracking-widest text-xs active-scale"
            >
              <i className="fas fa-image"></i> Pro Image
            </button>
            <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
               {["1K", "2K", "4K"].map(s => (
                 <button key={s} onClick={() => setImgSize(s as any)} className={`flex-1 py-1 text-[10px] font-bold rounded-lg ${imgSize === s ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>{s}</button>
               ))}
            </div>
          </div>
        </div>
        
        {status && (
          <div className="mt-6 flex items-center justify-center gap-3 py-2 px-4 bg-gray-900/50 rounded-xl border border-gray-800/50 animate-in fade-in zoom-in duration-300">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{status}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Audio Output */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[300px] shadow-xl">
          {generatedAudio ? (
            <button onClick={playAudio} className="w-full aspect-square bg-orange-600/10 rounded-full flex flex-col items-center justify-center border border-orange-500/20 hover:bg-orange-600/20 transition-all active-scale">
              <i className="fas fa-headphones text-4xl text-orange-500 mb-2"></i>
              <span className="text-xs font-black uppercase text-orange-500">Play Podcast</span>
            </button>
          ) : <i className="fas fa-waveform text-4xl text-gray-800"></i>}
        </div>

        {/* Video Output */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-4 flex items-center justify-center min-h-[300px] overflow-hidden">
          {generatedVideo ? (
            <video src={generatedVideo} controls className="w-full h-full rounded-2xl object-cover" autoPlay />
          ) : <i className="fas fa-clapperboard text-4xl text-gray-800"></i>}
        </div>

        {/* Image Output */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-4 flex items-center justify-center min-h-[300px] overflow-hidden">
          {generatedImg ? (
            <img src={generatedImg} alt="Generated" className="w-full h-full rounded-2xl object-cover shadow-2xl" />
          ) : <i className="fas fa-image text-4xl text-gray-800"></i>}
        </div>
      </div>
    </div>
  );
};

export default Studio;
