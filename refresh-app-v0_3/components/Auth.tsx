
'use client';
import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthUI(){
  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3">Sign in to Refresh</h2>
      <Auth supabaseClient={supabase} providers={['google']} appearance={{ theme: ThemeSupa }} />
    </div>
  );
}
