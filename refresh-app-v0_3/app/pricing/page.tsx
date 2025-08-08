
'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Pricing(){
  const [user, setUser] = useState<any>(null);
  useEffect(()=>{ supabase.auth.getUser().then(({data})=> setUser(data.user)); },[]);

  async function checkout(){
    if(!user){ alert('Please sign in first.'); return; }
    const res = await fetch('/api/stripe/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: user.id }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="container">
      <div className="card max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-semibold">Pricing</h2>
        <p className="opacity-80 mt-2">Start free. Upgrade for higher limits and templates.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="border rounded-2xl p-5">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-sm opacity-80 mt-1">Basic generation • Export to PDF</p>
          </div>
          <div className="border rounded-2xl p-5">
            <h3 className="text-xl font-semibold">Basic</h3>
            <p className="text-sm opacity-80 mt-1">Higher limits • Templates</p>
            <button onClick={checkout} className="btn bg-black text-white mt-3">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}
