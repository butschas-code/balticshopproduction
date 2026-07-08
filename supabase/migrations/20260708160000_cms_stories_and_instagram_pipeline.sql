-- CMS: stories (blog), categories, Instagram social pipeline, admin roles

alter table public.profiles
  add column if not exists cms_role text check (cms_role in ('admin', 'editor'));

create or replace function public.is_cms_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.cms_role in ('admin', 'editor')
  );
$$;

create table if not exists public.story_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_de text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.story_categories(id) on delete set null,
  hero_image_url text,
  hero_image_alt text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  read_time_minutes int not null default 4,
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stories_status_published_at_idx
  on public.stories (status, published_at desc nulls last);

create table if not exists public.story_translations (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  title text not null,
  excerpt text,
  body_html text not null default '',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, locale)
);

create index if not exists story_translations_story_id_idx on public.story_translations(story_id);

create table if not exists public.story_social_posts (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references public.stories(id) on delete cascade,
  platform text not null default 'instagram' check (platform in ('instagram')),
  caption text not null default '',
  short_caption text not null default '',
  hashtags text not null default '',
  status text not null default 'needs_review' check (status in ('needs_review', 'ready', 'used', 'skipped')),
  instagram_media_url text,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists story_social_posts_story_id_idx on public.story_social_posts(story_id);

create unique index if not exists story_social_posts_story_platform_uidx
  on public.story_social_posts (story_id, platform)
  where story_id is not null;

create table if not exists public.story_pipeline_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brief text,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_pipeline_settings (
  id text primary key default 'global',
  enabled boolean not null default false,
  social_platforms jsonb not null default '["instagram"]'::jsonb,
  brand_voice text not null default 'Calm Baltic luxury editorial voice. Poetic, premium, nature-inspired.',
  instagram_handle text,
  openai_model text not null default 'gpt-4.1-mini',
  auto_generate_instagram boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.story_pipeline_settings (id)
values ('global')
on conflict (id) do nothing;

-- updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'story_categories_set_updated_at') THEN
    CREATE TRIGGER story_categories_set_updated_at BEFORE UPDATE ON public.story_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'stories_set_updated_at') THEN
    CREATE TRIGGER stories_set_updated_at BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'story_translations_set_updated_at') THEN
    CREATE TRIGGER story_translations_set_updated_at BEFORE UPDATE ON public.story_translations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'story_social_posts_set_updated_at') THEN
    CREATE TRIGGER story_social_posts_set_updated_at BEFORE UPDATE ON public.story_social_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'story_pipeline_topics_set_updated_at') THEN
    CREATE TRIGGER story_pipeline_topics_set_updated_at BEFORE UPDATE ON public.story_pipeline_topics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'story_pipeline_settings_set_updated_at') THEN
    CREATE TRIGGER story_pipeline_settings_set_updated_at BEFORE UPDATE ON public.story_pipeline_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- RLS
alter table public.story_categories enable row level security;
alter table public.stories enable row level security;
alter table public.story_translations enable row level security;
alter table public.story_social_posts enable row level security;
alter table public.story_pipeline_topics enable row level security;
alter table public.story_pipeline_settings enable row level security;

drop policy if exists "public read story categories" on public.story_categories;
create policy "public read story categories" on public.story_categories
for select using (true);

drop policy if exists "cms staff manage story categories" on public.story_categories;
create policy "cms staff manage story categories" on public.story_categories
for all using (public.is_cms_staff()) with check (public.is_cms_staff());

drop policy if exists "public read published stories" on public.stories;
create policy "public read published stories" on public.stories
for select using (status = 'published');

drop policy if exists "cms staff manage stories" on public.stories;
create policy "cms staff manage stories" on public.stories
for all using (public.is_cms_staff()) with check (public.is_cms_staff());

drop policy if exists "public read published story translations" on public.story_translations;
create policy "public read published story translations" on public.story_translations
for select using (
  exists (
    select 1 from public.stories s
    where s.id = story_translations.story_id and s.status = 'published'
  )
);

drop policy if exists "cms staff manage story translations" on public.story_translations;
create policy "cms staff manage story translations" on public.story_translations
for all using (public.is_cms_staff()) with check (public.is_cms_staff());

drop policy if exists "cms staff manage social posts" on public.story_social_posts;
create policy "cms staff manage social posts" on public.story_social_posts
for all using (public.is_cms_staff()) with check (public.is_cms_staff());

drop policy if exists "cms staff manage pipeline topics" on public.story_pipeline_topics;
create policy "cms staff manage pipeline topics" on public.story_pipeline_topics
for all using (public.is_cms_staff()) with check (public.is_cms_staff());

drop policy if exists "cms staff manage pipeline settings" on public.story_pipeline_settings;
create policy "cms staff manage pipeline settings" on public.story_pipeline_settings
for all using (public.is_cms_staff()) with check (public.is_cms_staff());

-- Seed categories
insert into public.story_categories (slug, name, name_de) values
  ('the-baltic', 'The Baltic', 'Der Baltikum'),
  ('craft', 'Craft', 'Handwerk'),
  ('artisans', 'Artisans', 'Handwerker'),
  ('partner-profile', 'Partner Profile', 'Partnerprofil')
on conflict (slug) do nothing;

-- Seed journal stories (English body from static data)
with seeded as (
  select * from (values
    ('amber-coast', 'the-baltic', '/catalog/asset-974afdab4f55.jpg', 4, 'The Amber Coast', 'A journey along the Baltic shore where amber washes up like gold from the sea.', '<p>Amber is one of the Baltic''s quiet signatures. It arrives after storms, caught in seaweed and sand, warm to the hand even on cold mornings.</p><p>For makers, amber is not only a material. It is a record of ancient forests and a reminder that small objects can carry geological time.</p><p>The best pieces are often left simple: polished, framed, and allowed to keep their honeyed depth without too much interference.</p>'),
    ('linen-traditions', 'craft', '/catalog/asset-f08763f15d20.jpg', 5, 'Linen Traditions', 'How generations of Baltic weavers have kept linen alive in every home.', '<p>Linen has always belonged close to daily life: tablecloths, towels, bedding, summer clothing, and ceremonial textiles.</p><p>In Latvia, weaving is both practical and expressive. The loom gives structure, while colour, density, fringe, and finish reveal the hand of the maker.</p><p>Modern linen studios keep this tradition alive by treating the fabric as something durable enough for everyday use and refined enough for the best room in the house.</p>'),
    ('forest-hands', 'artisans', '/catalog/asset-3b9e4c58f508.jpg', 4, 'Hands in the Forest', 'Meeting the woodworkers who turn oak, birch and walnut into lasting objects.', '<p>Woodcraft starts before the tool touches the board. A good maker reads colour, grain, weight, and tension.</p><p>End-grain boards, carved bowls, small games, and table objects all ask the same question: how much should the hand shape, and how much should the wood be allowed to speak?</p><p>The strongest Baltic wood objects feel generous in use. They are made for kitchens, tables, and hands, not only shelves.</p>'),
    ('studio-natural-linen-lifestyle', 'partner-profile', '/catalog/asset-ae953a857c67.jpg', 5, 'Studio Natural and Linen as a Lifestyle', 'Inside a Riga studio where handwoven linen becomes clothing, table pieces, and interiors.', '<p>Studio Natural was established in 1990 by textile artist Laima Kaugure, and its work still carries the patience of loom-based production.</p><p>The studio''s pieces range from scarves and table runners to coats and custom interior textiles. What connects them is a belief that linen is not a seasonal trend, but a way of living with natural material.</p><p>Handwoven linen has small irregularities that industrial fabric tries to remove. Here, those marks are part of the value: a sign that the textile passed through a person''s hands.</p>'),
    ('vaidava-clay-from-gauja', 'partner-profile', '/catalog/asset-959c6861d25e.jpg', 5, 'VAIDAVA CERAMICS: Clay from Gauja Country', 'A Northern Latvian ceramics workshop making tableware from local clay and long practice.', '<p>VAIDAVA CERAMICS works from a scenic corner of Gauja National Park, where material, landscape, and production are closely tied.</p><p>The workshop has nearly 45 years of ceramic experience. Its tableware is made to support both everyday meals and the slower rituals of gathering.</p><p>Their strongest pieces are calm and practical: mugs, bowls, plates, candle holders, and serving forms that bring the warmth of clay directly to the table.</p>'),
    ('cepli-black-ceramics', 'partner-profile', '/catalog/asset-492275668909.jpg', 4, 'Cepļi and the Fire of Black Ceramics', 'Ingrīda Žagata''s workshop near the Baltic Sea keeps Latvian ceramic traditions close to nature.', '<p>Cepļi has been open since 1985 near the Vidzeme seacoast, surrounded by meadows, forest, and the rhythm of a working pottery.</p><p>Founder Ingrīda Žagata describes ceramics as both work and way of life. The workshop''s black pottery and stoneware carry Latvian ornament, local clay, and the drama of firing.</p><p>These are not anonymous ceramics. Bowls, cups, vases, and serving plates all hold the marks of process: forming, drying, glazing, firing, and finishing by hand.</p>'),
    ('cerannic-slow-cup', 'partner-profile', '/catalog/asset-4ee0ceae13e4.jpg', 4, 'cerannic and the Slow Cup', 'Annija Kanska''s porcelain mugs are built around the idea of a calmer everyday ritual.', '<p>cerannic is built around a simple idea: a cup can give someone a moment of peace in a hurried day.</p><p>Annija Kanska''s collections use lines, dots, checks, strokes, nature motifs, solid colour, animals, and graffiti as small visual personalities.</p><p>The shop works as an ordering platform rather than a classic warehouse store, with pieces made on a slower rhythm and an expected fulfilment time.</p>'),
    ('marketplace-of-latvian-clay', 'the-baltic', '/catalog/asset-b6995a1401f4.jpg', 4, 'A Marketplace of Latvian Clay', 'Latvijas Labumu Tirgus brings many ceramic voices into one clay catalog.', '<p>The Māls section of Latvijas Labumu Tirgus is less a single studio than a shelf of many ceramic voices.</p><p>There are black pottery cups, decorative bottles, fruit bowls, painted plates, vases, and everyday dishes from makers across Latvia.</p><p>For a shop like ours, the marketplace is useful because it shows the range of local clay work: practical, symbolic, decorative, and sometimes wonderfully idiosyncratic.</p>')
  ) as t(slug, category_slug, hero_image_url, read_time_minutes, title, excerpt, body_html)
),
inserted_stories as (
  insert into public.stories (slug, category_id, hero_image_url, status, read_time_minutes, featured, published_at)
  select s.slug, c.id, s.hero_image_url, 'published', s.read_time_minutes, false, now()
  from seeded s
  join public.story_categories c on c.slug = s.category_slug
  on conflict (slug) do nothing
  returning id, slug
)
insert into public.story_translations (story_id, locale, title, excerpt, body_html)
select st.id, 'en', s.title, s.excerpt, s.body_html
from inserted_stories st
join seeded s on s.slug = st.slug
on conflict (story_id, locale) do nothing;
