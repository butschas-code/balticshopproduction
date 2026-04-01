# Baltic Artisan — Ecommerce Mockup

A premium ecommerce website mockup for a Baltic artisan lifestyle brand. Handcrafted products from Latvia, Lithuania, and Estonia — woodcraft, linen, amber, ceramics, wool & felt — with a distinct Baltic luxury aesthetic.

## Design

- **Palette:** Deep forest green, amber gold, linen white, driftwood gray, soft fog
- **Typography:** Playfair Display (headlines), Inter (body)
- **Vibe:** Scandinavian minimalism, Baltic nature mysticism, Nordic editorial, slow luxury (Aesop / Skagerak / Menu / Kinfolk inspired)

## Tech Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Framer Motion** (scroll and hover animations)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- **Home** — Hero, Featured Collections, Artisans, Signature Products, Baltic Atmosphere, Journal
- **Shop** — Product grid; **Shop/[slug]** — Product detail with gallery, story, “Meet the Artisan”
- **Artisans** — Artisan grid; **Artisans/[slug]** — Profile, workshop, video placeholder, products
- Placeholder routes: Stories, The Baltic, Journal, About, Contact, Cart, Shipping, Returns, Privacy

## Components

Reusable UI: `Navbar`, `Hero`, `CollectionGrid`, `ProductCard`, `ArtisanCard`, `StorySection`, `JournalSection`, `Footer`.

Images use Unsplash placeholders; replace with real assets for production.
