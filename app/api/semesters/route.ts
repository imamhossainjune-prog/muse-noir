import { createClient } from '@/lib/supabase/server'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

export async function GET() {
  const { supabase, userId } = await getUserId()
  if (!userId) return Response.json([], { status: 200 })

  const { data, error } = await supabase
    .from('semesters')
    .select('*, courses(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data ?? [])
}

export async function POST(req: Request) {
  const { supabase, userId } = await getUserId()
  if (!userId) return Response.json({ error: 'Not logged in' }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Name is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('semesters')
    .insert({ user_id: userId, name: name.trim() })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}