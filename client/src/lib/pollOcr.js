import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_PROMPT = `Analyze this image and extract poll information.
You must respond with ONLY a valid JSON object in this exact format:
{
  "question": "the poll question",
  "options": ["option1", "option2", "option3"]
}

If the image contains a poll question and multiple choice options, extract them.
If the image does not contain clear poll information, still provide a JSON response with empty or placeholder values.
Do not include markdown formatting, explanations, or additional text.`;

async function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getOcrConfig() {
  return {
    provider: import.meta.env.VITE_POLL_OCR_PROVIDER || 'gemini',
    apiKey: import.meta.env.VITE_POLL_OCR_API_KEY || import.meta.env.VITE_GEMINI_API_KEY,
    model: import.meta.env.VITE_POLL_OCR_MODEL || 'gemini-2.5-flash',
  };
}

export async function extractPollFromFile(file) {
  const { provider, apiKey, model } = getOcrConfig();

  if (provider !== 'gemini') {
    throw new Error(`Unsupported OCR provider "${provider}".`);
  }

  if (!apiKey) {
    throw new Error('OCR API key not configured. Add VITE_POLL_OCR_API_KEY.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const imagePart = await fileToGenerativePart(file);
  const response = await genAI.getGenerativeModel({ model }).generateContent([DEFAULT_PROMPT, imagePart]);
  const text = await response.response.text();

  let jsonText = text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '');
  }

  const parsed = JSON.parse(jsonText);
  if (!parsed.question || !parsed.options || !Array.isArray(parsed.options)) {
    throw new Error('Invalid OCR response format.');
  }

  return parsed;
}
