
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProjectDetail({ params }:{ params:{ id:string } }){
  const [proj, setProj] = useState<any>(null);
  const [token, setToken] = useState('');

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data})=>{
      const t = data.session?.access_token || '';
      setToken(t);
      if(!t) return;
      const res = await fetch('/api/projects', { headers: { 'authorization': `Bearer ${t}` } });
      const dataJson = await res.json();
      const found = (dataJson.projects||[]).find((p:any)=>p.id===params.id);
      setProj(found || null);
    });
  },[params.id]);

  async function exportDrive(){
    const res = await fetch('/api/export/drive', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title: proj.title, markdown: proj.content })
    });
    const data = await res.json();
    if(data.ok) alert(`Uploaded to Drive: ${data.fileName}`);
    else alert(data.error);
  }

  if(!proj) return <div className="container"><div className="card">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">{proj.title}</h2>
        <div className="text-xs opacity-70 mb-4">{proj.type} • {new Date(proj.created_at).toLocaleString()}</div>
        <textarea value={proj.content} readOnly rows={20} className="w-full border rounded-xl px-3 py-2 mt-1 bg-transparent font-mono" />
        <div className="flex gap-2 mt-3">
          <a href="#" onClick={(e)=>{{e.preventDefault(); window.history.back();}}} className="btn border">Back</a>
          <button onClick={exportDrive} className="btn bg-black text-white">Send to Google Drive</button>
        </div>
      </div>
    </div>
  );
}
