
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audio';

const LiveConversation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcriptions, setTranscriptions] = useState<{ role: string, text: string }[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopConversation = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('Ended');
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
  };

  const startConversation = async () => {
    try {
      setStatus('Connecting...');
      setIsActive(true);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Active');
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
               setTranscriptions(prev => [...prev, { role: 'You', text: message.serverContent!.inputTranscription!.text }]);
            }
            if (message.serverContent?.outputTranscription) {
               setTranscriptions(prev => [...prev, { role: 'Pino', text: message.serverContent!.outputTranscription!.text }]);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => setStatus('Error'),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are Pino, an autonomous voice agent. Keep responses natural and brief.',
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('Failed');
      setIsActive(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Live Talk</h1>
        <p className="text-gray-400">Low-latency autonomous voice interaction.</p>
      </div>

      <div className="flex-1 bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-blue-600/20 scale-110 shadow-[0_0_100px_rgba(37,99,235,0.3)]' : 'bg-gray-800'}`}>
          <div className={`w-12 h-12 bg-white rounded-full ${isActive ? 'animate-ping' : ''}`}></div>
        </div>
        
        <p className="mt-8 text-2xl font-black text-white uppercase tracking-widest">{status}</p>

        <div className="mt-10 flex gap-4">
          {!isActive ? (
            <button onClick={startConversation} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">Connect</button>
          ) : (
            <button onClick={stopConversation} className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95">Disconnect</button>
          )}
        </div>

        <div className="mt-12 w-full max-w-lg h-48 overflow-y-auto custom-scrollbar bg-black/30 rounded-2xl p-6 border border-gray-800/50">
          {transcriptions.length === 0 && <p className="text-center text-[10px] text-gray-600 uppercase font-black tracking-widest">Awaiting interaction...</p>}
          {transcriptions.map((t, i) => (
            <div key={i} className="mb-3 animate-in fade-in slide-in-from-bottom-1">
               <span className={`text-[10px] font-black uppercase mr-2 ${t.role === 'Pino' ? 'text-blue-500' : 'text-gray-500'}`}>{t.role}:</span>
               <span className="text-sm text-gray-300">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveConversation;
