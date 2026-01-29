
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
            setStatus('Listening...');
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
               const text = message.serverContent.inputTranscription.text;
               setTranscriptions(prev => [...prev, { role: 'You', text }]);
            }
            if (message.serverContent?.outputTranscription) {
               const text = message.serverContent.outputTranscription.text;
               setTranscriptions(prev => [...prev, { role: 'Pino', text }]);
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
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live Error:', e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are Pino, a helpful and witty autonomous AI voice agent.',
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Error');
      setIsActive(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Live Talk</h1>
        <p className="text-gray-400">Real-time voice conversation with Pino.</p>
      </div>

      <div className="flex-1 bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-blue-600/20 scale-110 shadow-[0_0_80px_rgba(37,99,235,0.2)]' : 'bg-gray-800'}`}>
          <i className={`fas fa-microphone text-6xl ${isActive ? 'text-blue-500 animate-pulse' : 'text-gray-600'}`}></i>
        </div>
        
        <p className="mt-8 text-xl font-bold text-gray-300">{status}</p>

        <div className="mt-12 flex gap-4">
          {!isActive ? (
            <button 
              onClick={startConversation}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
            >
              Start Session
            </button>
          ) : (
            <button 
              onClick={stopConversation}
              className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
            >
              Stop Session
            </button>
          )}
        </div>

        <div className="mt-12 w-full max-w-md h-40 overflow-y-auto custom-scrollbar space-y-2 px-4">
          {transcriptions.map((t, i) => (
            <p key={i} className="text-sm"><span className="font-bold text-blue-400">{t.role}:</span> <span className="text-gray-400">{t.text}</span></p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveConversation;
