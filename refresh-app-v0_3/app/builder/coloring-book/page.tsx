
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Builder() {
  const [topic, setTopic] = useState("");
  const [bullets, setBullets] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [token, setToken] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({
      data
    })=> setToken(data.session?.access_token || ""));
  },[]);

  async function run() {
    setLoading(true);
    setOutput("");
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'coloring_book',
        topic,
        bullets: bullets ? bullets.split('\n').map(s=>s.trim()).filter(Boolean) : []
      })
    });
    const data = await res.json();
    if (data.ok) setOutput(data.content);
    else alert(data.error);
    setLoading(false);
  }

  async function saveProject(){ 
    if(!token){ alert('Please sign in to save.'); return; }
    setSaving(true);
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: `Coloring Book Prompt Generator - ${topic||'Untitled'}`, type: 'coloring_book', content: output })
    });
    const data = await res.json();
    if (!data.ok) alert(data.error); else alert('Saved!');
    setSaving(false);
  }

  async function exportPDF() {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `Coloring Book Prompt Generator - ${topic||'Untitled'}`, markdown: output })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `coloring_book.pdf`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold">Coloring Book Prompt Generator</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm opacity-70">Topic / Niche</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Mystic Color Pages: stress relief" className="w-full border rounded-xl px-3 py-2 mt-1 bg-transparent"/>
            <label className="text-sm opacity-70 block mt-4">Bullets (one per line, optional)</label>
            <textarea value={bullets} onChange={e=>setBullets(e.target.value)} rows={6} placeholder="Key points, audience, CTA..." className="w-full border rounded-xl px-3 py-2 mt-1 bg-transparent"/>
            <div className="flex gap-3 mt-4">
              <button onClick={run} disabled={loading || !topic} className="btn bg-black text-white disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate'}
              </button>
              <button onClick={saveProject} disabled={!output || saving} className="btn border disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <Link href="/projects" className="btn border">Open Projects</Link>
            </div>
          </div>
          <div>
            <label className="text-sm opacity-70">Output</label>
            <textarea value={output} readOnly rows={18} className="w-full border rounded-xl px-3 py-2 mt-1 bg-transparent font-mono"/>
            <div className="flex gap-2 mt-3">
              <button onClick={exportPDF} disabled={!output} className="btn border">Export PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
