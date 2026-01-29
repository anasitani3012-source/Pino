
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message } from "../types";

// Create a fresh instance for each request to ensure the latest API key is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSummary = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please summarize the following content concisely but thoroughly: ${content}`,
  });
  return response.text;
};

export const generateFlashcards = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Pro for complex JSON structure generation
    contents: `Based on this content: "${content}", generate a JSON array of 5-10 flashcards. Each card must have a "front" (question/concept) and "back" (answer/definition).`,
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
    model: 'gemini-3-pro-preview', // Pro for complex JSON structure generation
    contents: `Based on this content: "${content}", generate a JSON array of 5 multiple choice quiz questions. Each question must have a "question", "options" (array of 4 strings), and "correctAnswer" (index 0-3).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.INTEGER },
          },
          required: ["question", "options", "correctAnswer"],
        },
      },
    },
  });
  return JSON.parse(response.text || '[]');
};

// Added generatePodcastScript for Studio component
export const generatePodcastScript = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on this source material, write a short and engaging 2-person podcast script between Joe and Jane. 
    They should discuss the key points in a conversational way. 
    Source material: "${content}"
    
    Format the output exactly as:
    Joe: [dialogue]
    Jane: [dialogue]`,
  });
  return response.text;
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateBrainrotVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '9:16') => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `An chaotic, fast-paced, high-energy brainrot style video of: ${prompt}`,
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
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  return response.blob();
};

export const generateAudio = async (text: string) => {
  const ai = getAI();
  const isDialogue = text.includes('Joe:') && text.includes('Jane:');

  // Configure multi-speaker if dialogue is detected
  const speechConfig = isDialogue ? {
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
  } : {
    voiceConfig: {
      prebuiltVoiceConfig: { voiceName: 'Kore' },
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: isDialogue ? `TTS the following conversation between Joe and Jane:\n${text}` : `Say this naturally: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: speechConfig,
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// Fixed signature to accept query and history array
export const agentTask = async (query: string, history: Message[] = []) => {
  const ai = getAI();
  
  // Transform app-specific message type to Gemini contents format
  const contents = history.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));
  
  // Add current user query to the contents array
  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      tools: [{ googleSearch: {} }] // Mandatory search grounding
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
