
import { NextRequest, NextResponse } from 'next/server';
import { supabaseFromAuthHeader } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || undefined;
  const supa = supabaseFromAuthHeader(auth);
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supa.from('projects').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, projects: data });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || undefined;
  const supa = supabaseFromAuthHeader(auth);
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error: 'Unauthorized' }, { status: 401 });
  const { title, type, content } = await req.json();
  const { data, error } = await supa.from('projects').insert({ title, type, content, user_id: user.id }).select('*').single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, project: data });
}

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get('authorization') || undefined;
  const supa = supabaseFromAuthHeader(auth);
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supa.from('projects').delete().eq('id', id);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true });
}
