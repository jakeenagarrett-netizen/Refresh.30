
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export type Provider = 'gemini' | 'openai';

const getProvider = (): Provider => {
  if (process.env.GOOGLE_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  throw new Error('No AI provider configured. Set GOOGLE_API_KEY or OPENAI_API_KEY.');
};

export async function generateContent(prompt: string, system: string = '', model?: string) {
  const provider = getProvider();
  if (provider === 'gemini') {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const m = genAI.getGenerativeModel({ model: model || 'gemini-1.5-pro' });
    const res = await m.generateContent([{text: system}, {text: prompt}]);
    return res.response.text();
  } else {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [{role:'system', content: system}, {role:'user', content: prompt}],
      temperature: 0.4,
    });
    return res.choices[0].message.content || '';
  }
}
