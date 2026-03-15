import { createClient } from '@/lib/supabase/server'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

export async function GET(req: Request) {
  const { supabase, userId } = await getUserId()
  if (!userId) return Response.json([], { status: 200 })

  const { searchParams } = new URL(req.url)
  const semesterId = searchParams.get('semesterId')

  let query = supabase
    .from('courses')
    .select('id, name, code, color, semester_id, documents(id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (semesterId && semesterId !== 'all') {
    query = query.eq('semester_id', semesterId)
  }

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data ?? [])
}

export async function POST(req: Request) {
  const { supabase, userId } = await getUserId()
  if (!userId) return Response.json({ error: 'Not logged in' }, { status: 401 })

  const { name, code, semesterId, color } = await req.json()
  if (!name?.trim() || !semesterId) {
    return Response.json({ error: 'Name and semesterId are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('courses')
    .insert({
      user_id: userId,
      semester_id: semesterId,
      name: name.trim(),
      code: code?.trim() ?? null,
      color: color ?? '#7c3aed',
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}