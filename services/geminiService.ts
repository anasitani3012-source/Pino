
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSummary = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please summarize the following content concisely but thoroughly: ${content}`,
  });
  return response.text;
};

export const generateSlides = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a structure for a presentation about "${topic}". Provide a JSON array of slides. Each slide must have a "title" and a list of 3-5 "bulletPoints".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "bulletPoints"],
        },
      },
    },
  });
  return JSON.parse(response.text || '[]');
};

export const writeCode = async (instruction: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write high-quality, documented code for: ${instruction}. Include only the code and minimal necessary comments.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

export const deepSearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a deep, multi-perspective analysis on: ${query}. Use your internal knowledge and logic to provide a comprehensive breakdown.`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 8000 }
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateFlashcards = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on this content: "${content}", generate a JSON array of 5-10 flashcards. Each card must have a "front" and "back".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
          },
          required: ["front", "back"],
        },
      },
    },
  });
  return JSON.parse(response.text || '[]');
};

export const generateQuiz = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a quiz about: "${content}". JSON array of 5 questions with options and correctAnswer index.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
          },
          required: ["question", "options", "correctAnswer"],
        },
      },
    },
  });
  return JSON.parse(response.text || '[]');
};

// Fix: Implemented generatePodcastScript for conversational Studio content
export const generatePodcastScript = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Rewrite the following content into a lively, conversational podcast script between two hosts, Joe and Jane. 
    Use a casual and engaging tone. Format the output with clear speaker labels:
    Joe: [Dialogue]
    Jane: [Dialogue]
    
    Content: ${content}`,
  });
  return response.text;
};

// Fix: Updated generateAudio to support multi-speaker synthesis for Studio podcasts
export const generateAudio = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: 'Joe',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            {
              speaker: 'Jane',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
            }
          ]
        }
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// Fix: Implemented generateBrainrotVideo using Veo video models
export const generateBrainrotVideo = async (prompt: string, aspectRatio: '16:9' | '9:16') => {
  // Always initialize a new GoogleGenAI instance right before the call for up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  // Append the API key to the download link as required by the guidelines
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error(`Video fetch failed: ${response.statusText}`);
  return await response.blob();
};

// Fix: Implemented generateImage using Gemini 3 Pro Image generation
export const generateImage = async (prompt: string, imageSize: "1K" | "2K" | "4K") => {
  // Always initialize a new GoogleGenAI instance right before the call for up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
            aspectRatio: "1:1",
            imageSize: imageSize
        }
    },
  });

  // Iterate through parts to find the image part as it may not be the first one
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  return null;
};

export const agentTask = async (query: string, history: Message[] = []) => {
  const ai = getAI();
  const contents = history.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
  contents.push({ role: 'user', parts: [{ text: query }] });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
