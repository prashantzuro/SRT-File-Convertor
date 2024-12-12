import { Language } from '../types';

const TRANSLATION_PROXY_URL = 'http://localhost:5000/proxy/anthropic'; // Backend proxy endpoint

const translateWithClaude = async (
  content: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> => {
  const prompt = `Translate the following SRT subtitle content to ${targetLanguage}. Maintain the same SRT format, including timestamps and subtitle numbers. Only translate the text content:

${content}`;

  const response = await fetch(TRANSLATION_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, prompt }),
  });

  if (!response.ok) {
    throw new Error('Translation API request failed');
  }

  const data = await response.json();
  return data.completion; // Adjust this to match the backend API response structure
};

export const translateSrt = async (
  content: string,
  apiKey: string,
  targetLanguage: Language,
  onProgress: (progress: number) => void
): Promise<string> => {
  try {
    onProgress(50); // Set progress to 50% when starting translation

    const translatedContent = await translateWithClaude(content, targetLanguage, apiKey);

    onProgress(100); // Set progress to 100% when done
    
    return translatedContent;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed: ' + (error as Error).message);
  }
};
