import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Supabase Configuration ────────────────────────────────────────────────────
//
//  1. Create a free project at https://supabase.com
//  2. Go to Project Settings → API
//  3. Replace the two placeholder strings below with:
//       - "Project URL"  → SUPABASE_URL
//       - "anon / public key" → SUPABASE_ANON_KEY
//
//  The anon key is safe to commit to a public repo.
//  Row Level Security (RLS) on each table ensures users can only access their own data.
//
//  Required Supabase table (run in SQL Editor):
//
//    create table public.army_lists (
//      id         uuid primary key default gen_random_uuid(),
//      user_id    uuid references auth.users not null,
//      name       text not null,
//      size       int  default 0,
//      cost       int  default 0,
//      units      jsonb default '[]'::jsonb,
//      updated_at timestamptz default now()
//    );
//
//    alter table public.army_lists enable row level security;
//
//    create policy "Users manage own lists"
//      on public.army_lists
//      for all
//      using  (auth.uid() = user_id)
//      with check (auth.uid() = user_id);
//
// ──────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL      = 'https://eioywqjcpgonrwqvetpw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpb3l3cWpjcGdvbnJ3cXZldHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjMwNjEsImV4cCI6MjA5MTczOTA2MX0.eByKeagQlhdYP6kPLPp795xxW2V_IqTHPwj04eAgsG8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
