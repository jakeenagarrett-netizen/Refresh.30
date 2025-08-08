
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Project = { id:string; title:string; type:string; content:string; created_at:string };

export default function ProjectsPage(){
  const [items, setItems] = useState<Project[]>([]);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      const t = data.session?.access_token || '';
      setToken(t);
      if(!t){ setLoading(false); return; }
      load(t);
    });
  },[]);

  async function load(t:string){
    setLoading(true);
    const res = await fetch('/api/projects', { headers: { 'authorization': `Bearer ${t}` } });
    const data = await res.json();
    setItems(data.projects || []);
    setLoading(false);
  }

  async function remove(id:string){
    if(!token) return;
    if(!confirm('Delete this project?')) return;
    await fetch('/api/projects', { method:'DELETE', headers:{ 'authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ id }) });
    await load(token);
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        {loading ? <div>Loading...</div> : (
          items.length ? (
            <ul className="divide-y">
              {items.map(p=> (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs opacity-70">{p.type} • {new Date(p.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/projects/${p.id}`} className="btn border">Open</a>
                    <button onClick={()=>remove(p.id)} className="btn border">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="opacity-70">No projects yet.</div>
        )}
      </div>
    </div>
  );
}
