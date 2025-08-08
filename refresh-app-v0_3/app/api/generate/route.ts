
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateContent } from '@/lib/ai';

const Schema = z.object({
  type: z.enum(['ebook','business_plan','coloring_book']),
  topic: z.string().min(3),
  bullets: z.array(z.string()).optional()
});

const SYSTEM = `You are Refresh, an AI publishing assistant. 
- Output clean Markdown for ebooks and workbooks.
- For business plans, use structured sections (Executive Summary, Problem, Solution, Market, GTM, Ops, Team, Financials).
- For coloring books, emit a JSON array of page prompts describing black-and-white line-art scenes. No color.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, topic, bullets } = Schema.parse(body);
    const prompt = type === 'business_plan'
      ? `Create a concise business plan for: ${topic}.
         If present, incorporate bullet points: ${bullets?.join('; ') || 'none'}. 1500-2500 words.`
      : type === 'ebook'
      ? `Draft an educational short ebook on: ${topic}.
         Include: intro, 5-8 short chapters with key takeaways, and a conclusion.
         If present, incorporate bullet points: ${bullets?.join('; ') || 'none'}.`
      : `Generate 30 JSON objects for coloring-book page prompts around theme: ${topic}.
         Each object: { "title": "", "prompt": "" } describing line-art only.`;
    const content = await generateContent(prompt, SYSTEM);
    return NextResponse.json({ ok: true, content });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err.message }, { status: 400 });
  }
}
