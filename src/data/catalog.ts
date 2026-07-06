export type Artisan = {
  slug: string;
  name: string;
  location: string;
  craft: string;
  bio: string;
  portrait: string;
  workshopImages: string[];
  website: string;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  images: string[];
  artisanSlug: string;
  artisanName: string;
  location: string;
  craft: string;
  materials: string;
  technique: string;
  story: string;
  sourceUrl: string;
};

export const artisans = [
  {
    "slug": "mara-ziedina",
    "name": "Māra Ziediņa",
    "location": "Riga, Latvia",
    "craft": "Linen textiles & natural dyes",
    "website": "",
    "portrait": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    "workshopImages": [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80"
    ],
    "bio": "Māra learned to weave from her grandmother in the Latvian countryside. Today she runs a small studio in Riga where she weaves linen on traditional looms and dyes with plants from the Baltic coast. Her work is slow, precise, and made to last."
  },
  {
    "slug": "jonas-kazlauskas",
    "name": "Jonas Kazlauskas",
    "location": "Vilnius, Lithuania",
    "craft": "Woodcraft & carving",
    "website": "",
    "portrait": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    "workshopImages": [
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80",
      "https://images.unsplash.com/photo-1565538420870-da08ff96a261?w=800&q=80"
    ],
    "bio": "Jonas sources oak and birch from sustainable forests in Lithuania. In his workshop outside Vilnius, he turns and carves each piece by hand. His bowls and objects honour the grain of the wood and the tradition of Baltic woodcraft."
  },
  {
    "slug": "kadri-tamm",
    "name": "Kadri Tamm",
    "location": "Tallinn, Estonia",
    "craft": "Amber jewelry",
    "website": "",
    "portrait": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    "workshopImages": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"
    ],
    "bio": "Kadri collects amber from the Estonian coast and sets it in silver in her Tallinn atelier. She believes each piece of amber carries the memory of the forest. Her jewelry is minimal, timeless, and made to be worn every day."
  },
  {
    "slug": "studio-natural",
    "name": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "Handwoven linen textiles",
    "website": "https://www.studionatural.lv",
    "portrait": "https://www.studionatural.lv/cdn/shop/files/1_6a42e69a-7033-4419-8dec-741c2f529db3_1600x.jpg?v=1652790117",
    "workshopImages": [
      "https://www.studionatural.lv/cdn/shop/files/2_b146d559-ba9c-4bb9-a1bf-30c3a067846b_1600x.jpg?v=1652790116",
      "https://www.studionatural.lv/cdn/shop/files/3.11jpg_effa5c9e-cb25-46b7-9f4f-523f56c07f53_1600x.jpg?v=1652790117"
    ],
    "bio": "Linen is a lifestyle has been the motto of Studio Natural since its establishment in 1990 by the acclaimed textile artist Laima Kaugure. Studio Natural hand crafted luxury linen is woven in Latvia on traditional wooden looms in limited quantities, endowing textiles with superior quality."
  },
  {
    "slug": "raibi-koki",
    "name": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain cutting boards and wooden objects",
    "website": "https://raibikoki.lv",
    "portrait": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "workshopImages": [
      "https://images.unsplash.com/photo-1565538420870-da08ff96a261?w=1200&q=80"
    ],
    "bio": "Raibi Koki makes colourful wooden kitchen boards, jewellery, care products and other wooden objects. Their shop is in Odukalns, Ķekava, where internet orders can be collected and the full product range can be seen by appointment."
  },
  {
    "slug": "latvijas-labumu-tirgus-mals",
    "name": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Latvian clay and ceramic marketplace",
    "website": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/",
    "portrait": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f2e4f650ec7d.jpg",
    "workshopImages": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-61a224ba01640.jpg",
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg"
    ],
    "bio": "Latvijas Labumu Tirgus gathers Latvian makers in one catalog. The Māls section includes clay, black pottery, serving pieces, vases, mugs and decorative ceramics from individual studios across Latvia."
  },
  {
    "slug": "cerannic",
    "name": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "Handmade porcelain mugs",
    "website": "https://www.cerannic.com/veikals/",
    "portrait": "https://site-2141663.mozfiles.com/files/2141663/inlinepicturesbox/medium/215902030_10223384337911088_5391095339784461632_n-1.jpg",
    "workshopImages": [
      "https://site-2141663.mozfiles.com/files/2141663/catcategories/thumb/9e52ff336db1672509972b1abadc259b.jpg?399991",
      "https://site-2141663.mozfiles.com/files/2141663/catcategories/thumb/0f29b1e8f1698558c7db6913f187147a.jpg?399807"
    ],
    "bio": "Mani sauc Annija Kanska. Esmu krūzīšu un zīmola cerannic radītājā. Zīmola cerannic stāsta pamatā ir ideja par bezsteigas dzīves veidu, and each cup is made as a small invitation to a calmer moment."
  },
  {
    "slug": "cepli",
    "name": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Black ceramics and stoneware",
    "website": "https://www.cepli.lv",
    "portrait": "https://www.cepli.lv/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-11.54.38-1024x681.jpeg",
    "workshopImages": [
      "https://www.cepli.lv/wp-content/uploads/2020/06/Keramikas_darbnica_Cepli_logo-1-1.png",
      "https://www.cepli.lv/wp-content/uploads/2019/07/output-onlinepngtools-5.png"
    ],
    "bio": "Mani sauc Ingrīda Žagata, un es ar mālu pirmo reizi satikos, kad man bija 12 gadi. Keramika no šī brīža ir ne tikai mans darbs, bet arī dzīvesveids. Kopš 1985. gada esmu izveidojusi savu keramikas darbnīcu tuvu Baltijas jūrai."
  },
  {
    "slug": "vaidava-ceramics",
    "name": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "Handcrafted Latvian ceramics",
    "website": "https://vaidava.com",
    "portrait": "https://vaidava.com/cdn/shop/files/01.07.2022_VAIDAVA_323_of_376.jpg?v=1739278644&width=1500",
    "workshopImages": [
      "https://vaidava.com/cdn/shop/files/clay-craftsman-working.jpg?v=1679904289&width=3840",
      "https://vaidava.com/cdn/shop/files/ceramic-bowl-sculpting.jpg?v=1681718822&width=3840"
    ],
    "bio": "Vaidava Ceramics is the story of how a small workshop in Northern Europe radiates its heritage, craftsmanship and devotion to embrace the world. For nearly 45 years, the team has produced artisanal creations made to enrich everyday life and celebration."
  }
] satisfies Artisan[];

export const products = [
  {
    "slug": "amber-pendant-sun",
    "name": "Amber Pendant — Sun",
    "description": "A single piece of Baltic amber, set in brushed silver.",
    "price": "€ 189",
    "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80"
    ],
    "artisanSlug": "kadri-tamm",
    "artisanName": "Kadri Tamm",
    "location": "Tallinn, Estonia",
    "craft": "Amber jewelry",
    "materials": "Baltic amber, sterling silver",
    "technique": "Hand-set, polished by hand",
    "story": "Each piece of Baltic amber is millions of years old, fossilised resin from ancient forests. Worn close to the skin, it carries the warmth and stillness of the forest. This pendant is set in brushed silver, designed to let the amber speak.",
    "sourceUrl": ""
  },
  {
    "slug": "linen-throw-dawn",
    "name": "Linen Throw — Dawn",
    "description": "Hand-woven linen in natural undyed tones.",
    "price": "€ 245",
    "image": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80"
    ],
    "artisanSlug": "mara-ziedina",
    "artisanName": "Māra Ziediņa",
    "location": "Riga, Latvia",
    "craft": "Linen textiles",
    "materials": "European flax linen, natural undyed",
    "technique": "Hand-woven on traditional loom",
    "story": "Woven on a traditional loom in Riga, this throw uses linen from European flax. Left in its natural tone, it ages beautifully and grows softer with use. A piece for generations.",
    "sourceUrl": ""
  },
  {
    "slug": "oak-bowl-forest",
    "name": "Oak Bowl — Forest",
    "description": "Turned from a single piece of Baltic oak.",
    "price": "€ 165",
    "image": "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=1200&q=80",
      "https://images.unsplash.com/photo-1565538420870-da08ff96a261?w=1200&q=80"
    ],
    "artisanSlug": "jonas-kazlauskas",
    "artisanName": "Jonas Kazlauskas",
    "location": "Vilnius, Lithuania",
    "craft": "Woodcraft",
    "materials": "Baltic oak, food-safe oil finish",
    "technique": "Hand-turned on a lathe",
    "story": "Turned from a single piece of Baltic oak, this bowl shows the grain of decades of growth. Finished with a food-safe oil, it is made for daily use and will develop a rich patina over time.",
    "sourceUrl": ""
  },
  {
    "slug": "studio-natural-double-layer-scarf-in-linengold-50x200cm",
    "name": "Double layer scarf in linengold 50x200cm",
    "description": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: Linengold Dimensions: width 50cm, length 200cm Composition: 100% linen Product reference: Dub",
    "price": "€ 120.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/StudioNatural-2_6c46eb3b-2c58-452a-90f7-612d05f8a0ae.jpg?v=1783330631",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/StudioNatural-2_6c46eb3b-2c58-452a-90f7-612d05f8a0ae.jpg?v=1783330631"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: Linengold Dimensions: width 50cm, length 200cm Composition: 100% linen Product reference: Duble Tinita flamingo+linengold+rospuder+fr Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumble dry. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Product color may slightly vary due to photographic lighting sources or your monitor settings. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/double-layer-scarf-in-linengold-50x200cm"
  },
  {
    "slug": "studio-natural-double-layer-linen-scarf",
    "name": "Double layer linen scarf",
    "description": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: pastel rose Dimensions:width 50cm, length 200cm Composition: 100% linen Product reference: Du",
    "price": "€ 120.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/Noformejumsbeznosaukuma_5.png?v=1780471285",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/Noformejumsbeznosaukuma_5.png?v=1780471285"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: pastel rose Dimensions:width 50cm, length 200cm Composition: 100% linen Product reference: Dubl Tinita w+grantr+ terracotta+FR Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumble dry. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Product color may slightly vary due to photographic lighting sources or your monitor settings. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/double-layer-linen-scarf-1"
  },
  {
    "slug": "studio-natural-double-layer-linen-scarf-2",
    "name": "Double layer linen scarf",
    "description": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: light gray Dimensions:width 30cm, length 170cm Composition: 100% linen Product reference: Dub",
    "price": "€ 96.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/Noformejums_bez_nosaukuma_3.png?v=1780320630",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/Noformejums_bez_nosaukuma_3.png?v=1780320630"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: light gray Dimensions:width 30cm, length 170cm Composition: 100% linen Product reference: Dubl Tinita w+blgr+lgrey+kfr Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumble dry. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Product color may slightly vary due to photographic lighting sources or your monitor settings. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/double-layer-linen-scarf"
  },
  {
    "slug": "studio-natural-kimono-dress-in-grey",
    "name": "Kimono Dress in grey",
    "description": "Hand woven linen kimono dress with pure highest quality silk lining. In grey color. Unique and highest quality designer's work. Limited edition. Color: Grey Size: Women's M / EU 40-42 / UK 12-14 Composition: 100 % linen, lining 100% silk Product reference: TR Mix Antr+W+Silk Care instructions: Dry clean only. Iron at different temperatures suitable for linen",
    "price": "€ 880.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-11at14.48.20.jpg?v=1778504883",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-11at14.48.20.jpg?v=1778504883"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Dresses",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Hand woven linen kimono dress with pure highest quality silk lining. In grey color. Unique and highest quality designer's work. Limited edition. Color: Grey Size: Women's M / EU 40-42 / UK 12-14 Composition: 100 % linen, lining 100% silk Product reference: TR Mix Antr+W+Silk Care instructions: Dry clean only. Iron at different temperatures suitable for linen and silk. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Product color may slightly vary due to photographic lighting sources or your monitor settings. Note: Products can be customized, please contact us! STUDIO NATURAL HANDMADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/kimono-dress-in-grey"
  },
  {
    "slug": "studio-natural-linen-coat-kazaku-m",
    "name": "Linen coat Kazaku M",
    "description": "Hand woven Kazaku style linen coat with wool crochet. This coat has special wool buttons. Natural crumpled linen plays beautifully with sequin ornaments. Unique and very high-quality designer's work. Limited edition. Color: Dark brown Size: Women's M / EU 40-42 / UK 12-14 Composition: 100% linen, lining 100% silk Product reference: Kazaku Ieva M Antr+Brown+t",
    "price": "€ 950.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-11at14.48.20_1.jpg?v=1778501108",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-11at14.48.20_1.jpg?v=1778501108"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.coat",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Hand woven Kazaku style linen coat with wool crochet. This coat has special wool buttons. Natural crumpled linen plays beautifully with sequin ornaments. Unique and very high-quality designer's work. Limited edition. Color: Dark brown Size: Women's M / EU 40-42 / UK 12-14 Composition: 100% linen, lining 100% silk Product reference: Kazaku Ieva M Antr+Brown+tamb+Silk Care instructions: D ry clean only. Do not iron to maintain the crease effect. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/linen-coat-kazak-m"
  },
  {
    "slug": "studio-natural-table-runner-primit-40x105cm",
    "name": "Table runner Primit 40x105cm",
    "description": "Dense hand woven linen table runner for a modern holiday table. It has a particularly timeless design. Color: Black Dimensions: width 40cm, l ength 105cm Composition: 100% linen Product reference: Primit Black +Dažw+zigsp Care instructions: Machine washed (max 30 ° C) using a gentle cycle, hand wash (max 30 ° C) or dry clean. Wash separately. Iron at maximum",
    "price": "€ 98.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at15.02.30_1.jpg?v=1777982797",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at15.02.30_1.jpg?v=1777982797"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Table runners",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Dense hand woven linen table runner for a modern holiday table. It has a particularly timeless design. Color: Black Dimensions: width 40cm, l ength 105cm Composition: 100% linen Product reference: Primit Black +Dažw+zigsp Care instructions: Machine washed (max 30 ° C) using a gentle cycle, hand wash (max 30 ° C) or dry clean. Wash separately. Iron at maximum (hi gh) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/table-runner-primit-40x105cm"
  },
  {
    "slug": "studio-natural-placemat-double-45x35cm",
    "name": "Placemat Double 45x35cm",
    "description": "Unique, reversible handwoven linen placemat created using a special author’s technique. Featuring a refined palette of powder, light blue, and grey tones, it is perfect for everyday use. Color: Puder, Light blue, Grey Dimensions: w idth 45cm, l ength 35cm Composition: 100% linen Product reference: Dubl w+puder+3colors+5mzigsp Care instructions: Hand wash (ma",
    "price": "€ 45.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at14.53.54_1.jpg?v=1777982387",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at14.53.54_1.jpg?v=1777982387"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Place mat",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Unique, reversible handwoven linen placemat created using a special author’s technique. Featuring a refined palette of powder, light blue, and grey tones, it is perfect for everyday use. Color: Puder, Light blue, Grey Dimensions: w idth 45cm, l ength 35cm Composition: 100% linen Product reference: Dubl w+puder+3colors+5mzigsp Care instructions: Hand wash (max 30°C) or dry clean. If hand washed, do not wring or twist - remove excess water by shaking it out. Do not tumble dry. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% hand made it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/placemat-double-45x35cm"
  },
  {
    "slug": "studio-natural-placemat-boucle-50x36cm",
    "name": "Placemat Boucle 50x36cm",
    "description": "A new approach to placemat weaving. The special boucle (linen thread forming a loop) linen creates a rough yet refined impression. This placemat has small fringes. Excellent for daily use. Color: White Dimensions: width 50cm, l ength 36cm Composition: 100% linen Product reference: PLACE w+w+buckle+g5 Care instructions: Machine wash (max 30°C) using a gentle ",
    "price": "€ 45.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-21at12.36.47_11.jpg?v=1776764382",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-21at12.36.47_11.jpg?v=1776764382"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Place mat",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "A new approach to placemat weaving. The special boucle (linen thread forming a loop) linen creates a rough yet refined impression. This placemat has small fringes. Excellent for daily use. Color: White Dimensions: width 50cm, l ength 36cm Composition: 100% linen Product reference: PLACE w+w+buckle+g5 Care instructions: Machine wash (max 30°C) using a gentle cycle, hand wash (max 30°C) or dry clean. Wash separately. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% handmade it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Note: Products can be customized, please contact us! STUDIO NATURAL HAND MADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/placemat-boucle-50x36cm"
  },
  {
    "slug": "studio-natural-linen-scarf-tinita-in-khaki-50x200-cm",
    "name": "Linen scarf Tinita in khaki 50x200 cm",
    "description": "Sheer handwoven linen scarf. Lightweight and sheer fabric - perfect for warm weather. This scarf is sure to make a fashionable statement. Excellent for everyday use or for an evening out. Color: Khaki, natural Dimensions: length 200cm, width 50cm Composition: 100% linen Product reference: Tinita w+nat+haki+seidg1 Care instructions: Hand wash (max 30°C) or dr",
    "price": "€ 150.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-14at13.57.01_1.jpg?v=1776164889",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-14at13.57.01_1.jpg?v=1776164889"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Sheer handwoven linen scarf. Lightweight and sheer fabric - perfect for warm weather. This scarf is sure to make a fashionable statement. Excellent for everyday use or for an evening out. Color: Khaki, natural Dimensions: length 200cm, width 50cm Composition: 100% linen Product reference: Tinita w+nat+haki+seidg1 Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumble dry. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% handmade it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Product color may slightly vary due to photographic lighting sources or your monitor settings. Note: Products can be customized, please contact us! STUDIO NATURAL HANDMADE IN LATVIA",
    "sourceUrl": "https://www.studionatural.lv/products/linen-scarf-tinita-in-khaki-50x200-cm"
  },
  {
    "slug": "studio-natural-linen-scarf-transparent-in-black-70x250-cm",
    "name": "Linen scarf Transparent in black 70x250 cm",
    "description": "Sheer handwoven linen scarf in black with hand-twisted fringes. Excellent for everyday use or an evening out. Color: Black Dimensions: width 70cm, length 250cm Composition: Linen Product reference: Transp black+lfr Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumbl",
    "price": "€ 170.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-14at16.17.27_1aefc79e-9e9a-4973-8f6c-477f7c302f48.jpg?v=1776327364",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-14at16.17.27_1aefc79e-9e9a-4973-8f6c-477f7c302f48.jpg?v=1776327364"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "dev.Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Sheer handwoven linen scarf in black with hand-twisted fringes. Excellent for everyday use or an evening out. Color: Black Dimensions: width 70cm, length 250cm Composition: Linen Product reference: Transp black+lfr Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumble dry. Iron at maximum (high) temperature. Cockle is the very special effect of this fabric. As this fabric is 100% handmade it may have some knots or natural unevenness. Warning: Direct sunlight and strong lighting may alter the color of the fabric. Product color may slightly vary due to photographic lighting sources or your monitor settings. Note: Products can be customized, please contact us! STUDIO NATURAL HANDMADE IN LATVIA 100% PRODUCED IN EUROPE",
    "sourceUrl": "https://www.studionatural.lv/products/linen-scarf-transparent-70x250-cm"
  },
  {
    "slug": "vaidava-ceramics-chopstick-holder",
    "name": "Chopstick holder",
    "description": "Give your chopsticks a place to rest. Crafted by hand from red and white clay, these holders bring the same quiet elegance to your table as the rest of the Vaidava Ceramics products. Small in size, but considered in every detail. The outside is left partially unglazed, revealing the natural texture and colour of the clay body, while the top is glazed in your",
    "price": "€ 3.00",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/20260531_175134_1_1_1_7b9b4e05-8170-416d-8eca-16b90d973afe.jpg?v=1781613539",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/20260531_175134_1_1_1_7b9b4e05-8170-416d-8eca-16b90d973afe.jpg?v=1781613539"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "plate",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Give your chopsticks a place to rest. Crafted by hand from red and white clay, these holders bring the same quiet elegance to your table as the rest of the Vaidava Ceramics products. Small in size, but considered in every detail. The outside is left partially unglazed, revealing the natural texture and colour of the clay body, while the top is glazed in your choice of white, black, or transparent, so you can find the one that fits your favourite collection.",
    "sourceUrl": "https://vaidava.com/products/candle-holder-eclipse-copy"
  },
  {
    "slug": "vaidava-ceramics-candle-holder-eclipse",
    "name": "Candle holder · Eclipse",
    "description": "Complement your evening rituals with the soft, subtle glow of candlelight, beautifully showcased on ceramic candle holder. Its simple, clean lines bring a natural, rustic charm to your home, and it is perfect for pillar candles.",
    "price": "€ 16.50",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/PillarcandleholderEclipse.jpg?v=1779709406",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/PillarcandleholderEclipse.jpg?v=1779709406"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "plate",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Complement your evening rituals with the soft, subtle glow of candlelight, beautifully showcased on ceramic candle holder. Its simple, clean lines bring a natural, rustic charm to your home, and it is perfect for pillar candles.",
    "sourceUrl": "https://vaidava.com/products/candle-holder-eclipse"
  },
  {
    "slug": "vaidava-ceramics-mug-glazed-moss-green-earth",
    "name": "Mug glazed moss green · Earth",
    "description": "Add a touch of comfort to your morning routine. Enjoy your solitary coffee moments or tea times with friends using our exquisite terracotta mug. A splendid and practical enhancement for any kitchen space. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is partially g",
    "price": "€ 14.50",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/untitled_008.jpg?v=1779709184",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/untitled_008.jpg?v=1779709184"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "mug",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Add a touch of comfort to your morning routine. Enjoy your solitary coffee moments or tea times with friends using our exquisite terracotta mug. A splendid and practical enhancement for any kitchen space. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is partially glazed with moss green coloured glaze. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/mug-glazed-moss-green-earth"
  },
  {
    "slug": "vaidava-ceramics-mug-glazed-white-earth",
    "name": "Mug glazed white · Earth",
    "description": "Add a touch of comfort to your morning routine. Enjoy your solitary coffee moments or tea times with friends using our exquisite terracotta mug. A splendid and practical enhancement for any kitchen space. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is partially g",
    "price": "€ 14.50",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/untitled_001.jpg?v=1779708931",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/untitled_001.jpg?v=1779708931"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "mug",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Add a touch of comfort to your morning routine. Enjoy your solitary coffee moments or tea times with friends using our exquisite terracotta mug. A splendid and practical enhancement for any kitchen space. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is partially glazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/mug-glazed-white-earth"
  },
  {
    "slug": "vaidava-ceramics-small-plate-set-x-2-earth",
    "name": "Small plate set x 2 · Earth",
    "description": "Whether you're serving up an appetizer or a scrumptious dessert, this duo is perfect for adding a touch of rustic elegance to any dining experience. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the",
    "price": "€ 16.50",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/products/Setof2smallterracottaplates1_63b4680e-3941-4ed2-9718-0cc4f12665b1.jpg?v=1679913443",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/products/Setof2smallterracottaplates1_63b4680e-3941-4ed2-9718-0cc4f12665b1.jpg?v=1679913443"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "plate",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Whether you're serving up an appetizer or a scrumptious dessert, this duo is perfect for adding a touch of rustic elegance to any dining experience. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/set-of-2-small-terracotta-plates"
  },
  {
    "slug": "vaidava-ceramics-centerpiece-bowl-earth-raw",
    "name": "Centerpiece bowl · Earth RAW",
    "description": "The Centrepiece bowl is a beautiful choice for those who love gathering family and friends around the table. Its generous size makes it perfect for serving large salads, fresh seasonal dishes, or sharing meals during special occasions. Designed to stand out, it also works wonderfully as an elegant table centerpiece or as a graceful bowl for displaying fresh ",
    "price": "€ 75.00",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/VaidavaCeramicsprodukcija24_10_2024_040.jpg?v=1777298026",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/VaidavaCeramicsprodukcija24_10_2024_040.jpg?v=1777298026"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "The Centrepiece bowl is a beautiful choice for those who love gathering family and friends around the table. Its generous size makes it perfect for serving large salads, fresh seasonal dishes, or sharing meals during special occasions. Designed to stand out, it also works wonderfully as an elegant table centerpiece or as a graceful bowl for displaying fresh fruit. The outside is left naturally raw, leveled, and slightly glazed. This product is glazed with lead-less glaze and tempered at 1000 C.",
    "sourceUrl": "https://vaidava.com/products/centrepiece-bowl-earth-raw"
  },
  {
    "slug": "vaidava-ceramics-bowl-4-0l-white-earth",
    "name": "Bowl 4.0L white · Earth",
    "description": "This bowl is a perfect choice for cooking lovers who enjoy preparing generous meals with care and style. Its spacious size makes it ideal for mixing dough, tossing salads, or presenting warm homemade dishes at the table. Whether you are cooking for a big family dinner or hosting friends for a special gathering, this bowl offers both practicality and timeless",
    "price": "€ 55.00",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/untitled_023.jpg?v=1777288533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/untitled_023.jpg?v=1777288533"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "This bowl is a perfect choice for cooking lovers who enjoy preparing generous meals with care and style. Its spacious size makes it ideal for mixing dough, tossing salads, or presenting warm homemade dishes at the table. Whether you are cooking for a big family dinner or hosting friends for a special gathering, this bowl offers both practicality and timeless charm. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/bowl-4-0l-white-earth"
  },
  {
    "slug": "vaidava-ceramics-bowl-2-0l-curved-moss-green-earth",
    "name": "Bowl 2.0L curved moss green · Earth",
    "description": "Meet a bowl where every leafy green and plump tomato is celebrated in a feast for the senses. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorptio",
    "price": "€ 26.00",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/products/Curvedmossgreenterracottasaladbowl24cm1_a6371808-45d8-4d85-8325-f0e041dfd75a.jpg?v=1679903839",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/products/Curvedmossgreenterracottasaladbowl24cm1_a6371808-45d8-4d85-8325-f0e041dfd75a.jpg?v=1679903839"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Meet a bowl where every leafy green and plump tomato is celebrated in a feast for the senses. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/curved-moss-green-terracotta-salad-bowl-24cm"
  },
  {
    "slug": "vaidava-ceramics-bowl-2-0l-salad-green-earth",
    "name": "Bowl 2.0L salad green · Earth",
    "description": "Let the bright colors and fresh flavors of crisp and juicy greens come together in a masterpiece of healthy indulgence. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and preven",
    "price": "€ 22.50",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/021V-bowl2l_green.jpg?v=1685607714",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/files/021V-bowl2l_green.jpg?v=1685607714"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Let the bright colors and fresh flavors of crisp and juicy greens come together in a masterpiece of healthy indulgence. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/bowl-2-0l-salad-green-earth"
  },
  {
    "slug": "vaidava-ceramics-bowl-3-0l-moss-green-earth",
    "name": "Bowl 3.0L moss green · Earth",
    "description": "This large terracotta fruit bowl is the perfect display for an abundance of colorful fruit or veggies. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt ",
    "price": "€ 49.00",
    "image": "https://cdn.shopify.com/s/files/1/0729/2370/9747/products/Largemossgreenterracottabowl30cm1.jpg?v=1679928024",
    "images": [
      "https://cdn.shopify.com/s/files/1/0729/2370/9747/products/Largemossgreenterracottabowl30cm1.jpg?v=1679928024"
    ],
    "artisanSlug": "vaidava-ceramics",
    "artisanName": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "This large terracotta fruit bowl is the perfect display for an abundance of colorful fruit or veggies. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "sourceUrl": "https://vaidava.com/products/large-moss-green-terracotta-bowl-30cm"
  },
  {
    "slug": "cepli-salatu-blodas",
    "name": "Salātu bļodas",
    "description": "Veidotas ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1250°C. No kolekcijas “Monohroms”. Glazētas ar melni matētu glazūru. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 17 cm Augstums – 10 cm Tilpu",
    "price": "€ 42.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0822.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0822.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidotas ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1250°C. No kolekcijas “Monohroms”. Glazētas ar melni matētu glazūru. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 17 cm Augstums – 10 cm Tilpums – 0.8L Svars – 0.53kg",
    "sourceUrl": "https://www.cepli.lv/product/salatu-blodas/"
  },
  {
    "slug": "cepli-skivis-24-5-cm",
    "name": "Šķīvis 24,5 cm",
    "description": "Veidots ar rokām plastu tehnikā no baltās akmens masas . Apdedzināšanas temperatūra – 1250°C. Glazēts ar smilšu krāsas glazūru, kas apdedzināšanas temperatūrā spēlē toņos no bēšīgi dzeltena līdz zilganiem. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā.",
    "price": "€ 36.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0769.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0769.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidots ar rokām plastu tehnikā no baltās akmens masas . Apdedzināšanas temperatūra – 1250°C. Glazēts ar smilšu krāsas glazūru, kas apdedzināšanas temperatūrā spēlē toņos no bēšīgi dzeltena līdz zilganiem. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 24,5 cm Augstums – 2 cm Svars – 0,7 kg",
    "sourceUrl": "https://www.cepli.lv/product/skivis-245-cm-2/"
  },
  {
    "slug": "cepli-skivis-24-5-cm-2",
    "name": "Šķīvis 24,5 cm",
    "description": "Veidots ar rokām plastu tehnikā no baltās akmens masas ar lāsumiem. Apdedzināšanas temperatūra 1250 °C . Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diam.: 24,5 cm Augstums: 2 cm Svars: 0,7 kg",
    "price": "€ 42.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0774.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0774.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidots ar rokām plastu tehnikā no baltās akmens masas ar lāsumiem. Apdedzināšanas temperatūra 1250 °C . Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diam.: 24,5 cm Augstums: 2 cm Svars: 0,7 kg",
    "sourceUrl": "https://www.cepli.lv/product/skivis-245-cm/"
  },
  {
    "slug": "cepli-bloda-2l",
    "name": "Bļoda 2L",
    "description": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra 1250 °C. No kolekcijas SILTUMS. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diam.: 24 cm Augstums: 12 cm Tilpums: 2 L Svars: 0,85 kg",
    "price": "€ 82.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0757.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0757.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra 1250 °C. No kolekcijas SILTUMS. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diam.: 24 cm Augstums: 12 cm Tilpums: 2 L Svars: 0,85 kg",
    "sourceUrl": "https://www.cepli.lv/product/bloda-2l-3/"
  },
  {
    "slug": "cepli-vaze",
    "name": "Vāze",
    "description": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1260°C. Glazēta ar caurspīdīgi matētu glazūru. Dekorēta ar sudraba krāsas zīmējumiem, izmantojot dekolu tehniku. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 9,5 cm Augs",
    "price": "€ 62.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0751.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0751.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1260°C. Glazēta ar caurspīdīgi matētu glazūru. Dekorēta ar sudraba krāsas zīmējumiem, izmantojot dekolu tehniku. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 9,5 cm Augstums – 19,5 cm Svars – 0,65 kg",
    "sourceUrl": "https://www.cepli.lv/product/vaze-19/"
  },
  {
    "slug": "cepli-vaze-2",
    "name": "Vāze",
    "description": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1260°C. Glazēta ar caurspīdīgi matētu glazūru. Dekorēta ar sudraba krāsas zīmējumiem, izmantojot dekolu tehniku. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 9,5 cm Augs",
    "price": "€ 70.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0747.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0747.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1260°C. Glazēta ar caurspīdīgi matētu glazūru. Dekorēta ar sudraba krāsas zīmējumiem, izmantojot dekolu tehniku. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 9,5 cm Augstums – 20 cm Svars – 0,70 kg",
    "sourceUrl": "https://www.cepli.lv/product/vaze-18/"
  },
  {
    "slug": "cepli-vaze-3",
    "name": "Vāze",
    "description": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1260°C. Glazēta ar caurspīdīgi matētu glazūru. Dekorēta ar sudraba krāsas zīmējumiem, izmantojot dekolu tehniku. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 10 cm Augst",
    "price": "€ 54.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0744.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0744.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidota ar rokām uz podnieka ripas no baltās akmens masas. Apdedzināšanas temperatūra – 1260°C. Glazēta ar caurspīdīgi matētu glazūru. Dekorēta ar sudraba krāsas zīmējumiem, izmantojot dekolu tehniku. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 10 cm Augstums – 14 cm Svars – 0,49 kg",
    "sourceUrl": "https://www.cepli.lv/product/vaze-17/"
  },
  {
    "slug": "cepli-servejamais-skivis-uz-kajinam-davanu-kaste",
    "name": "Servējamais šķīvis uz kājiņām dāvanu kastē",
    "description": "Veidots ar rokām plastu tehnikā no Latvijas māla un apdedzināts atklātās uguns krāsnī melnajā/svēpētajā tehnikā. Apdedzināšanas temperatūra 1050 °C. Dekorēts gravēšanas tehnikā, izmantojot dabas rakstu motīvus. Drīkst izmantot saskarē ar pārtikas produktiem, tai skaitā slapjiem, mikroviļņu krāsnī un cepeškrāsnī. Ilgstošai lietošanai ieteicama mazgāšana ar ro",
    "price": "€ 72.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0613.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0613.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidots ar rokām plastu tehnikā no Latvijas māla un apdedzināts atklātās uguns krāsnī melnajā/svēpētajā tehnikā. Apdedzināšanas temperatūra 1050 °C. Dekorēts gravēšanas tehnikā, izmantojot dabas rakstu motīvus. Drīkst izmantot saskarē ar pārtikas produktiem, tai skaitā slapjiem, mikroviļņu krāsnī un cepeškrāsnī. Ilgstošai lietošanai ieteicama mazgāšana ar rokām. Izmēri: 35 cm * 20 cm Augstums: 3 cm Svars: 0,83 kg",
    "sourceUrl": "https://www.cepli.lv/product/servejamais-skivis-uz-kajinam-davanu-kaste-2/"
  },
  {
    "slug": "cepli-servejamais-skivis-uz-kajinam-davanu-kaste-2",
    "name": "Servējamais šķīvis uz kājiņām dāvanu kastē",
    "description": "Veidots ar rokām plastu tehnikā no Latvijas māla un apdedzināts atklātās uguns krāsnī melnajā/svēpētajā tehnikā. Apdedzināšanas temperatūra 1050 °C. Dekorēts gravēšanas tehnikā, izmantojot dabas rakstu motīvus. Drīkst izmantot saskarē ar pārtikas produktiem, tai skaitā slapjiem, mikroviļņu krāsnī un cepeškrāsnī. Ilgstošai lietošanai ieteicama mazgāšana ar ro",
    "price": "€ 72.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0615.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0615.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidots ar rokām plastu tehnikā no Latvijas māla un apdedzināts atklātās uguns krāsnī melnajā/svēpētajā tehnikā. Apdedzināšanas temperatūra 1050 °C. Dekorēts gravēšanas tehnikā, izmantojot dabas rakstu motīvus. Drīkst izmantot saskarē ar pārtikas produktiem, tai skaitā slapjiem, mikroviļņu krāsnī un cepeškrāsnī. Ilgstošai lietošanai ieteicama mazgāšana ar rokām. Izmēri: 35 cm * 20 cm Augstums: 3 cm Svars: 0,83 kg",
    "sourceUrl": "https://www.cepli.lv/product/servejamais-skivis-uz-kajinam-davanu-kaste/"
  },
  {
    "slug": "cepli-cukurtrauks",
    "name": "Cukurtrauks",
    "description": "Veidots ar rokām uz podnieka ripas no pelēkas akmens masas. Apdedzināšanas temperatūra – 1250°C. No kolekcijas “Monohroms”. Glazēts ar melni matētu glazūru. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 10 cm Augstums – 18 cm Tilpum",
    "price": "€ 47.00",
    "image": "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0580-scaled.jpg",
    "images": [
      "https://www.cepli.lv/wp-content/uploads/2026/03/IMG_0580-scaled.jpg"
    ],
    "artisanSlug": "cepli",
    "artisanName": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Ceramics",
    "materials": "Clay or stoneware, glaze",
    "technique": "Hand-formed, wheel-thrown or slab-built",
    "story": "Veidots ar rokām uz podnieka ripas no pelēkas akmens masas. Apdedzināšanas temperatūra – 1250°C. No kolekcijas “Monohroms”. Glazēts ar melni matētu glazūru. Izmantotā glazūra ir videi un cilvēka veselībai draudzīga bez kaitīgiem piemaisījumiem. Drīkst lietot mikroviļņu krāsnī, mazgāt trauku mazgājamajā mašīnā. Izmēri: Diametrs – 10 cm Augstums – 18 cm Tilpums – 0.3L Svars – 0.37 kg",
    "sourceUrl": "https://www.cepli.lv/product/cukurtrauks-13/"
  },
  {
    "slug": "cerannic-leo",
    "name": "Leo",
    "description": "Leo from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/WhatsApp_Image_2024-01-27_at_16_42_57-751b5dbdd8abb5271e98ed063d0407b0.jpeg?5897235",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/WhatsApp_Image_2024-01-27_at_16_42_57-751b5dbdd8abb5271e98ed063d0407b0.jpeg?5897235"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar līnijām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Leo from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/399807/leo/"
  },
  {
    "slug": "cerannic-reinis",
    "name": "Reinis",
    "description": "Reinis from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0004-dd78b5aea0c7c81fa259574626694482.jpg?5903378",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0004-dd78b5aea0c7c81fa259574626694482.jpg?5903378"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar līnijām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Reinis from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/399807/reinis/"
  },
  {
    "slug": "cerannic-hugo",
    "name": "Hugo",
    "description": "Hugo from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01258-Edit-9507aada49831846aa65246fba89dc63.jpg?5902527",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01258-Edit-9507aada49831846aa65246fba89dc63.jpg?5902527"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar līnijām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Hugo from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/399807/hugo/"
  },
  {
    "slug": "cerannic-oskars",
    "name": "Oskars",
    "description": "Oskars from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0005-154c4d70209ff908356390429d134369.jpg?5903388",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0005-154c4d70209ff908356390429d134369.jpg?5903388"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar līnijām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Oskars from the krūze ar līnijām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/399807/oskars/"
  },
  {
    "slug": "cerannic-sarlote",
    "name": "Šarlote",
    "description": "Šarlote from the krūze ar pumpiņām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00854-7b26a9dadaee4e1f5a4f15c3ffe3c9cb.jpg?5903074",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00854-7b26a9dadaee4e1f5a4f15c3ffe3c9cb.jpg?5903074"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar pumpiņām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Šarlote from the krūze ar pumpiņām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/punkti/sarlote/"
  },
  {
    "slug": "cerannic-jasmina",
    "name": "Jasmīna",
    "description": "Jasmīna from the krūze ar pumpiņām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00870-338dfb788bda4514f3c03e92d0f04a67.jpg?5903367",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00870-338dfb788bda4514f3c03e92d0f04a67.jpg?5903367"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar pumpiņām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Jasmīna from the krūze ar pumpiņām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/punkti/jasmina/"
  },
  {
    "slug": "cerannic-sibilla",
    "name": "Sibilla",
    "description": "Sibilla from the krūze ar pumpiņām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01356-Edit-f4428a95724cd07cb41ab00d02e46e43.jpg?5903168",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01356-Edit-f4428a95724cd07cb41ab00d02e46e43.jpg?5903168"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūze ar pumpiņām",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Sibilla from the krūze ar pumpiņām collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/punkti/sibilla/"
  },
  {
    "slug": "cerannic-amanda",
    "name": "Amanda",
    "description": "Amanda from the krūzes ar triepieniem collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00919-Edit-da5e540a723cbf624e9bcb90bfee9923.jpg?5903479",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00919-Edit-da5e540a723cbf624e9bcb90bfee9923.jpg?5903479"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūzes ar triepieniem",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Amanda from the krūzes ar triepieniem collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/triepieni/amanda/"
  },
  {
    "slug": "cerannic-dace",
    "name": "Dace",
    "description": "Dace from the krūzes ar triepieniem collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/20240119_122716-69083039f0d9a52ede4d9664f8d45009.jpg?5908563",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/20240119_122716-69083039f0d9a52ede4d9664f8d45009.jpg?5908563"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūzes ar triepieniem",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Dace from the krūzes ar triepieniem collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/triepieni/dace/"
  },
  {
    "slug": "cerannic-una",
    "name": "Una",
    "description": "Una from the krūzes ar triepieniem collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01137-66460cb77fc68dfaeaabff7a7a86f11c.jpg?5903580",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01137-66460cb77fc68dfaeaabff7a7a86f11c.jpg?5903580"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "krūzes ar triepieniem",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Una from the krūzes ar triepieniem collection. Šī ir pasūtījumu veikšanas platforma, nevis klasisks e-veikals; pasūtījumu izpildes termiņš līdz 3 nedēļām.",
    "sourceUrl": "https://www.cerannic.com/veikals/item/triepieni/una/"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-dekorativa-pudele-solvita-zale",
    "name": "Dekoratīva pudele Solvita Zāle",
    "description": "Dekoratīva pudelīte māls lustras glazūra izmēri cm 20×9×4",
    "price": "25,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fa6f463d621a.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fa6f463d621a.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Clay, luster glaze",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Dekoratīva pudelīte māls lustras glazūra izmēri cm 20×9×4",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/dekorativa-pudele-3565.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-melnas-keramikas-kruze-draudzens-anda-biez",
    "name": "Melnās keramikas krūze ''draudzens'' Anda Biezā - Biezaart",
    "description": "Ar rokām lipināti, apdedzināti bedres tipa malkas ceplī. Nav izmantotas glazūras. Mūsu trauku melnā, sudrabotā, bronzīgā nokrāsa tiek panākta kuršanas - reducēšanas procesā.",
    "price": "35,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-61a224ba01640.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-61a224ba01640.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Black pottery",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Ar rokām lipināti, apdedzināti bedres tipa malkas ceplī. Nav izmantotas glazūras. Mūsu trauku melnā, sudrabotā, bronzīgā nokrāsa tiek panākta kuršanas - reducēšanas procesā.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/melnas-keramikas-kruze-draudzens.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-dekorativs-auglu-trauks-solvita-zale",
    "name": "Dekoratīvs augļu trauks Solvita Zāle",
    "description": "Trauks veidots akmens masā (pīts), izmēri 6,5×32, apdedzināšanas temperatūra 1200 gr.",
    "price": "40,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Stoneware",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Trauks veidots akmens masā (pīts), izmēri 6,5×32, apdedzināšanas temperatūra 1200 gr.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/dekorativs-auglu-trauks.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-vaze-nellijas-keramika",
    "name": "Vāze NELLIJAS KERAMIKA",
    "description": "Vāze 31 cm augstumā. Baltais māls, balta glazūra.",
    "price": "70,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-67327ce2c23fa.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-67327ce2c23fa.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Ceramics",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Vāze 31 cm augstumā. Baltais māls, balta glazūra.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/vaze-13515.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-ovals-servejamais-skivis-1-podvaze",
    "name": "Ovāls servējamais šķīvis #1 PodVāze",
    "description": "No baltā māla veidots, ovāls šķīvis ar zemglazūras, zilu, zivs gleznojumu. Trauks pārklāts ar spožu, caurspīdīgu, svinu nesaturošu glazūru un apdedzināts 1050C temperatūrā.",
    "price": "22,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f3afb0b5d904.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f3afb0b5d904.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Serving plate",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "No baltā māla veidots, ovāls šķīvis ar zemglazūras, zilu, zivs gleznojumu. Trauks pārklāts ar spožu, caurspīdīgu, svinu nesaturošu glazūru un apdedzināts 1050C temperatūrā.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/ovals-servejamais-skivis-1.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-apgleznots-skivis-kakitis-ilona-sausa",
    "name": "Apgleznots šķīvis \"Kaķītis\" Ilona Šauša",
    "description": "Skaists apdedzinājums. Gleznots ar keramikas glazūrām un pigmentiem. Iespēja piekārt pie sienas vai turēt uz galda. 34x28 cm.",
    "price": "46,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fce2e9f7b5aa.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fce2e9f7b5aa.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Painted plate",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Skaists apdedzinājums. Gleznots ar keramikas glazūrām un pigmentiem. Iespēja piekārt pie sienas vai turēt uz galda. 34x28 cm.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/apgleznots-skivis-kakitis.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-studija-om-mezginu-skivis",
    "name": "Studija OM Mežģīņu šķīvis",
    "description": "Mežģīņu šķīvis. Balts māls, glazūra. H=5 cm, d=27,5 cm.",
    "price": "20,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fd0a03eef365.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fd0a03eef365.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Ceramics",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Mežģīņu šķīvis. Balts māls, glazūra. H=5 cm, d=27,5 cm.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/studija-om-4458.html"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-trauks-saulespuke-saulaina-ieleja",
    "name": "TRauks - Saulespuķe Saulainā ieleja",
    "description": "Saulespuķes bieži tiek saistītas ar siltumu, laipnību un pozitīvu enerģiju, tās dāvā prieku. Melnā/Svēpētā keramika. Sarkanā māla masa d-27cm, h-3cm. Roku darbs.",
    "price": "45,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-656d055716782.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-656d055716782.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Māls",
    "location": "Latvia",
    "craft": "Black pottery",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Saulespuķes bieži tiek saistītas ar siltumu, laipnību un pozitīvu enerģiju, tās dāvā prieku. Melnā/Svēpētā keramika. Sarkanā māla masa d-27cm, h-3cm. Roku darbs.",
    "sourceUrl": "https://www.latvijaslabumstirgus.lv/lv/prechu-katalogs/keramika/mals/trauks--saulespuke-11869.html"
  },
  {
    "slug": "raibi-koki-galda-spele-marble-solitaire",
    "name": "Galda spēle “Marble solitaire”",
    "description": "Marble Solitaire - klasika, kas attīsta prātu. Iepazīsties ar “Marble Solitaire” - elegantu koka galda spēli.",
    "price": "€ 48,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Citas raibas lietas",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Marble Solitaire - klasika, kas attīsta prātu. Iepazīsties ar “Marble Solitaire” - elegantu koka galda spēli.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-riekstkoka-salvesu-gredzeni",
    "name": "Riekstkoka salvešu gredzeni",
    "description": "Riekstkoka salvešu gredzeni.",
    "price": "€ 3,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Citas raibas lietas",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Riekstkoka salvešu gredzeni.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-mazais-triskasu-virtuves-gala-skiedru-delitis-3223-cm",
    "name": "Mazais “Trīskāsu” virtuves gala sķiedru dēlītis 32×23 cm",
    "description": "Gala šķiedru virtuves dēlītis. Materiāls - ozols, sapelli un dažādas koku sugas. Apdare - minerāleļļa, bišu vasks.",
    "price": "€ 60,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Gala šķiedru virtuves dēlītis. Materiāls - ozols, sapelli un dažādas koku sugas. Apdare - minerāleļļa, bišu vasks.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-liels-triskrasu-vienpuseji-lietojams-virtuves-delis-40x26cm",
    "name": "Liels “Trīskrāsu” vienpusēji lietojams virtuves dēlis 40x26cm",
    "description": "Vienpusēji lietojams virtuves gala šķiedru dēlis sarkankoka rāmī uz silikona kājiņām. Materiāls - Ozols, sapelli un dažādas koku sugas.",
    "price": "€ 126,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Vienpusēji lietojams virtuves gala šķiedru dēlis sarkankoka rāmī uz silikona kājiņām. Materiāls - Ozols, sapelli un dažādas koku sugas.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-triskrasu-divpusejs-gala-skiedru-delis-40x26cm",
    "name": "“Trīskrāsu” divpusējs gala šķiedru dēlis 40x26cm",
    "description": "Divpusēji lietojams virtuves gala šķiedru dēlis sarkankoka rāmī. Materiāls - Ozols, sapelli un dažādas koku sugas. Apdare - Minerāleļļa, bišu vasks.",
    "price": "€ 126,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Divpusēji lietojams virtuves gala šķiedru dēlis sarkankoka rāmī. Materiāls - Ozols, sapelli un dažādas koku sugas. Apdare - Minerāleļļa, bišu vasks.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-liels-divpusejs-ozolkoka-gala-skiedru-delis-ar-sarkankoka-m",
    "name": "Liels divpusējs ozolkoka gala šķiedru dēlis ar sarkankoka malām 40x27cm",
    "description": "Divpusēji lietojams ozolkoka virtuves gala šķiedru dēlis ar sarkankoka sānu malām. Materiāls - Ozols, sapelli. Apdare - Minerāleļļa, bišu vasks.",
    "price": "€ 90,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Divpusēji lietojams ozolkoka virtuves gala šķiedru dēlis ar sarkankoka sānu malām. Materiāls - Ozols, sapelli. Apdare - Minerāleļļa, bišu vasks.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-gala-skiedru-delitis-mozaika-3323-cm",
    "name": "Gala šķiedru dēlītis “Mozaīka” 33×23 cm",
    "description": "Šī dēlīša izgatavošanā izmantotas ļoti daudz un dažādas koku sugas, lai panāktu krāsainu mozaīku, kas iekļauta ozolkoka rāmī.",
    "price": "€ 62,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Šī dēlīša izgatavošanā izmantotas ļoti daudz un dažādas koku sugas, lai panāktu krāsainu mozaīku, kas iekļauta ozolkoka rāmī.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-afrikas-dzelzskoka-gala-skiedru-delitis-3324-cm",
    "name": "Āfrikas dzelzskoka gala škiedru dēlītis 33×24 cm",
    "description": "Divpusēji lietojams ļoti cietas Ārikas dzelzskoka koksnes gala škiedru dēlītis. Šī dēlīša svars ir ap 2,00 kg.",
    "price": "€ 58,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Divpusēji lietojams ļoti cietas Ārikas dzelzskoka koksnes gala škiedru dēlītis. Šī dēlīša svars ir ap 2,00 kg.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  },
  {
    "slug": "raibi-koki-tumss-riekstkoka-virtuves-gala-skiedru-delis-tumsais-3323-c",
    "name": "Tumšs riekstkoka virtuves gala škīedru dēlis “Tumšais” 33×23 cm",
    "description": "Tumšs riekstkoka gala šķiedru dēlis ar baltā oša ornamentiem. Materiāls - Riekstkoks, baltais osis. Apdare - Minerāleļļa, bišu vasks.",
    "price": "€ 65,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Gala šķiedru dēlīši",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Tumšs riekstkoka gala šķiedru dēlis ar baltā oša ornamentiem. Materiāls - Riekstkoks, baltais osis. Apdare - Minerāleļļa, bišu vasks.",
    "sourceUrl": "https://raibikoki.lv/product-category/virtuves-delisi/"
  }
] satisfies CatalogProduct[];

export const artisanBySlug = Object.fromEntries(artisans.map((artisan) => [artisan.slug, artisan])) as Record<string, Artisan>;
export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<string, CatalogProduct>;

export function getProductsByArtisan(artisanSlug: string) {
  return products.filter((product) => product.artisanSlug === artisanSlug);
}
