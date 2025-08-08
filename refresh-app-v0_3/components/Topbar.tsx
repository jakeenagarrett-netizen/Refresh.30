
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Topbar(){
  const [user, setUser] = useState<any>(null);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => { sub.subscription.unsubscribe(); };
  },[]);

  async function signOut(){ await supabase.auth.signOut(); }

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="text-2xl font-bold">Refresh</div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/projects" className="btn border">My Projects</Link>
            <span className="text-sm opacity-80">{user.email}</span>
            <button onClick={signOut} className="btn border">Sign out</button>
          </>
        ) : (
          <a href="/auth" className="btn border">Sign in</a>
        )}
      </div>
    </header>
  );
}
