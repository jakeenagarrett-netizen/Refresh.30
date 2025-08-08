
import { createClient } from '@supabase/supabase-js';

export function supabaseFromAuthHeader(authorization?: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authorization || '' } } }
  );
  return supabase;
}
