-- משפחות
create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'המשפחה שלנו',
  child_name text,
  start_date date not null,
  created_at timestamptz default now()
);

-- חברי משפחה
create table family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member',
  email text not null,
  created_at timestamptz default now(),
  unique(family_id, user_id)
);

-- הזמנות
create table invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  email text not null,
  status text not null default 'pending',
  invited_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- רשומות תיעוד יומי
create table log_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  date date not null,
  food text not null,
  amount text,
  time time,
  note text,
  is_allergen boolean default false,
  source text default 'custom',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- מזונות ייחודיים
create table unique_foods (
  family_id uuid references families(id) on delete cascade,
  food text not null,
  first_tried_at timestamptz default now(),
  primary key (family_id, food)
);

-- RLS
alter table families enable row level security;
alter table family_members enable row level security;
alter table invites enable row level security;
alter table log_entries enable row level security;
alter table unique_foods enable row level security;

-- Families policy
create policy "family members can access their family"
on families for all
using (id in (select family_id from family_members where user_id = auth.uid()));

-- Family members policy
create policy "members can see their family members"
on family_members for all
using (family_id in (select family_id from family_members where user_id = auth.uid()));

-- Invites: read for family members, insert for owners
create policy "family members can see invites"
on invites for select
using (family_id in (select family_id from family_members where user_id = auth.uid()));

create policy "owners can manage invites"
on invites for all
using (
  family_id in (
    select family_id from family_members where user_id = auth.uid() and role = 'owner'
  )
);

-- Log entries
create policy "family members can access their logs"
on log_entries for all
using (family_id in (select family_id from family_members where user_id = auth.uid()));

-- Unique foods
create policy "family members can access unique foods"
on unique_foods for all
using (family_id in (select family_id from family_members where user_id = auth.uid()));

-- Realtime
alter publication supabase_realtime add table log_entries;
