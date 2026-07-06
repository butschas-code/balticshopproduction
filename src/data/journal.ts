export type JournalPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  body: string[];
};

export const journalPosts = [
  {
    slug: "amber-coast",
    title: "The Amber Coast",
    category: "The Baltic",
    excerpt: "A journey along the Baltic shore where amber washes up like gold from the sea.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    date: "July 6, 2026",
    readTime: "4 min read",
    body: [
      "Amber is one of the Baltic's quiet signatures. It arrives after storms, caught in seaweed and sand, warm to the hand even on cold mornings.",
      "For makers, amber is not only a material. It is a record of ancient forests and a reminder that small objects can carry geological time.",
      "The best pieces are often left simple: polished, framed, and allowed to keep their honeyed depth without too much interference.",
    ],
  },
  {
    slug: "linen-traditions",
    title: "Linen Traditions",
    category: "Craft",
    excerpt: "How generations of Baltic weavers have kept linen alive in every home.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
    date: "July 6, 2026",
    readTime: "5 min read",
    body: [
      "Linen has always belonged close to daily life: tablecloths, towels, bedding, summer clothing, and ceremonial textiles.",
      "In Latvia, weaving is both practical and expressive. The loom gives structure, while colour, density, fringe, and finish reveal the hand of the maker.",
      "Modern linen studios keep this tradition alive by treating the fabric as something durable enough for everyday use and refined enough for the best room in the house.",
    ],
  },
  {
    slug: "forest-hands",
    title: "Hands in the Forest",
    category: "Artisans",
    excerpt: "Meeting the woodworkers who turn oak, birch and walnut into lasting objects.",
    image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=1200&q=80",
    date: "July 6, 2026",
    readTime: "4 min read",
    body: [
      "Woodcraft starts before the tool touches the board. A good maker reads colour, grain, weight, and tension.",
      "End-grain boards, carved bowls, small games, and table objects all ask the same question: how much should the hand shape, and how much should the wood be allowed to speak?",
      "The strongest Baltic wood objects feel generous in use. They are made for kitchens, tables, and hands, not only shelves.",
    ],
  },
  {
    slug: "studio-natural-linen-lifestyle",
    title: "Studio Natural and Linen as a Lifestyle",
    category: "Partner Profile",
    excerpt: "Inside a Riga studio where handwoven linen becomes clothing, table pieces, and interiors.",
    image: "https://www.studionatural.lv/cdn/shop/files/1_6a42e69a-7033-4419-8dec-741c2f529db3_1600x.jpg?v=1652790117",
    date: "July 6, 2026",
    readTime: "5 min read",
    body: [
      "Studio Natural was established in 1990 by textile artist Laima Kaugure, and its work still carries the patience of loom-based production.",
      "The studio's pieces range from scarves and table runners to coats and custom interior textiles. What connects them is a belief that linen is not a seasonal trend, but a way of living with natural material.",
      "Handwoven linen has small irregularities that industrial fabric tries to remove. Here, those marks are part of the value: a sign that the textile passed through a person's hands.",
    ],
  },
  {
    slug: "vaidava-clay-from-gauja",
    title: "VAIDAVA CERAMICS: Clay from Gauja Country",
    category: "Partner Profile",
    excerpt: "A Northern Latvian ceramics workshop making tableware from local clay and long practice.",
    image: "https://vaidava.com/cdn/shop/files/clay-craftsman-working.jpg?v=1679904289&width=3840",
    date: "July 6, 2026",
    readTime: "5 min read",
    body: [
      "VAIDAVA CERAMICS works from a scenic corner of Gauja National Park, where material, landscape, and production are closely tied.",
      "The workshop has nearly 45 years of ceramic experience. Its tableware is made to support both everyday meals and the slower rituals of gathering.",
      "Their strongest pieces are calm and practical: mugs, bowls, plates, candle holders, and serving forms that bring the warmth of clay directly to the table.",
    ],
  },
  {
    slug: "cepli-black-ceramics",
    title: "Cepļi and the Fire of Black Ceramics",
    category: "Partner Profile",
    excerpt: "Ingrīda Žagata's workshop near the Baltic Sea keeps Latvian ceramic traditions close to nature.",
    image: "https://www.cepli.lv/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-11.54.38-1024x681.jpeg",
    date: "July 6, 2026",
    readTime: "4 min read",
    body: [
      "Cepļi has been open since 1985 near the Vidzeme seacoast, surrounded by meadows, forest, and the rhythm of a working pottery.",
      "Founder Ingrīda Žagata describes ceramics as both work and way of life. The workshop's black pottery and stoneware carry Latvian ornament, local clay, and the drama of firing.",
      "These are not anonymous ceramics. Bowls, cups, vases, and serving plates all hold the marks of process: forming, drying, glazing, firing, and finishing by hand.",
    ],
  },
  {
    slug: "cerannic-slow-cup",
    title: "cerannic and the Slow Cup",
    category: "Partner Profile",
    excerpt: "Annija Kanska's porcelain mugs are built around the idea of a calmer everyday ritual.",
    image: "https://site-2141663.mozfiles.com/files/2141663/inlinepicturesbox/medium/215902030_10223384337911088_5391095339784461632_n-1.jpg",
    date: "July 6, 2026",
    readTime: "4 min read",
    body: [
      "cerannic is built around a simple idea: a cup can give someone a moment of peace in a hurried day.",
      "Annija Kanska's collections use lines, dots, checks, strokes, nature motifs, solid colour, animals, and graffiti as small visual personalities.",
      "The shop works as an ordering platform rather than a classic warehouse store, with pieces made on a slower rhythm and an expected fulfilment time.",
    ],
  },
  {
    slug: "marketplace-of-latvian-clay",
    title: "A Marketplace of Latvian Clay",
    category: "The Baltic",
    excerpt: "Latvijas Labumu Tirgus brings many ceramic voices into one clay catalog.",
    image: "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg",
    date: "July 6, 2026",
    readTime: "4 min read",
    body: [
      "The Māls section of Latvijas Labumu Tirgus is less a single studio than a shelf of many ceramic voices.",
      "There are black pottery cups, decorative bottles, fruit bowls, painted plates, vases, and everyday dishes from makers across Latvia.",
      "For a shop like ours, the marketplace is useful because it shows the range of local clay work: practical, symbolic, decorative, and sometimes wonderfully idiosyncratic.",
    ],
  },
] satisfies JournalPost[];

export const journalPostBySlug = Object.fromEntries(journalPosts.map((post) => [post.slug, post])) as Record<string, JournalPost>;
