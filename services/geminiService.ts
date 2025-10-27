// FIX: Import Modality for use in text-to-speech generation.
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { CorrectionResponse } from '../types';

function getAiClient(): GoogleGenAI {
  const apiKey = localStorage.getItem('gemini-secret-key');
  if (!apiKey) {
    // This error will be caught by the calling function and displayed to the user.
    throw new Error("Secret Key not found. Please set your Secret Key to continue.");
  }
  return new GoogleGenAI({ apiKey });
}


const correctionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    correctedText: {
      type: Type.STRING,
      description: 'The full text with all spelling mistakes corrected.',
    },
    corrections: {
      type: Type.ARRAY,
      description: 'A list of corrections made.',
      items: {
        type: Type.OBJECT,
        properties: {
          original: {
            type: Type.STRING,
            description: 'The original word with the spelling mistake.',
          },
          corrected: {
            type: Type.STRING,
            description: 'The corrected spelling of the word.',
          },
        },
        required: ['original', 'corrected'],
      },
    },
  },
  required: ['correctedText', 'corrections'],
};

const headlineResponseSchema = {
    type: Type.OBJECT,
    properties: {
        headlines: {
            type: Type.ARRAY,
            description: 'An array of exactly three non-empty headline strings.',
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['headlines'],
};


export const correctKannadaSpelling = async (text: string): Promise<CorrectionResponse> => {
  const prompt = `
    You are an expert in the Kannada language. Your task is to identify and correct spelling mistakes in the given Kannada text. 
    Do not change the meaning or grammar of the sentences. Only correct clear spelling errors.
    Return the fully corrected text and a list of the specific corrections you made.
    If there are no spelling mistakes, return the original text and an empty corrections array.

    Original Text:
    ---
    ${text}
    ---
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: correctionResponseSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: CorrectionResponse = JSON.parse(jsonText);
    return parsedResponse;
  } catch (error) {
    console.error("Error calling Gemini API for spell correction:", error);
    throw new Error("Failed to process the text with the Gemini API. Check your Secret Key and try again.");
  }
};

export const rewriteKannadaText = async (text: string): Promise<string> => {
  const prompt = `
    You are an expert Kannada news editor. The following Kannada text has already been spell-checked.
    Your task is to rewrite it to improve its readability, flow, and sentence structure for a news article.
    While rewriting, identify the most critical phrase or sentence that captures the essence of the news and make it bold using Markdown syntax (e.g., **important text**).
    Additionally, if the rewritten text is lengthy and contains multiple paragraphs, add a short, meaningful title to each relevant paragraph using Markdown H3 format (e.g., ### ಚಿಕ್ಕ ಶೀರ್ಷಿಕೆ).
    Do not change the original meaning. Make the text sound more natural and engaging.
    Return only the rewritten text with the Markdown formatting.

    Text to rewrite:
    ---
    ${text}
    ---
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for rewriting:", error);
    throw new Error("Failed to rewrite the text with the Gemini API.");
  }
};

export const generateKannadaHeadline = async (text: string): Promise<string[]> => {
  const prompt = `
    You are an expert Kannada news editor. Your task is to create exactly three compelling and concise headlines for the following news article content.
    The headlines should be both engaging to spark curiosity and have an emotional connection with the reader. Each headline must be a non-empty string. Do not start headlines with punctuation like colons.

    Return the result as a JSON object with a single key "headlines" containing an array of exactly three headline strings.

    News Content:
    ---
    ${text}
    ---
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
       config: {
        responseMimeType: "application/json",
        responseSchema: headlineResponseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: { headlines: string[] } = JSON.parse(jsonText);
    
    // Clean, filter, and limit the headlines
    const cleanedHeadlines = parsedResponse.headlines
      .map(h => h.replace(/"/g, '').trim()) // Trim whitespace and remove quotes
      .map(h => h.replace(/^[:\s]+/, ''))    // Remove leading colons and whitespace
      .filter(h => h.length > 0);            // Filter out any empty strings after cleaning

    return cleanedHeadlines.slice(0, 3); // Ensure we only return a maximum of 3 headlines
  } catch (error) {
    console.error("Error calling Gemini API for headline generation:", error);
    throw new Error("Failed to generate headlines with the Gemini API.");
  }
};

// FIX: Add and export generateKannadaVoiceoverAudio function to fix the error in VoiceoverDisplay.tsx.
export const generateKannadaVoiceoverAudio = async (text: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the API.");
    }

    return base64Audio;
  } catch (error) {
    console.error("Error calling Gemini API for voiceover generation:", error);
    throw new Error("Failed to generate voiceover with the Gemini API.");
  }
};