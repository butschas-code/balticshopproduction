export type Artisan = {
  slug: string;
  name: string;
  location: string;
  craft: string;
  craftDe: string;
  bio: string;
  bioDe: string;
  portrait: string;
  workshopImages: string[];
  isPartner: boolean;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  nameDe: string;
  description: string;
  descriptionDe: string;
  price: string;
  image: string;
  images: string[];
  artisanSlug: string;
  artisanName: string;
  location: string;
  craft: string;
  craftDe: string;
  materials: string;
  materialsDe: string;
  technique: string;
  techniqueDe: string;
  story: string;
  storyDe: string;
  isPartnerProduct: boolean;
};

export const artisans = [
  {
    "slug": "studio-natural",
    "name": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "Handwoven linen textiles",
    "isPartner": true,
    "portrait": "https://www.studionatural.lv/cdn/shop/files/1_6a42e69a-7033-4419-8dec-741c2f529db3_1600x.jpg?v=1652790117",
    "workshopImages": [
      "https://www.studionatural.lv/cdn/shop/files/2_b146d559-ba9c-4bb9-a1bf-30c3a067846b_1600x.jpg?v=1652790116",
      "https://www.studionatural.lv/cdn/shop/files/3.11jpg_effa5c9e-cb25-46b7-9f4f-523f56c07f53_1600x.jpg?v=1652790117"
    ],
    "bio": "Linen is a lifestyle has been the motto of Studio Natural since its establishment in 1990 by the acclaimed textile artist Laima Kaugure. Studio Natural hand crafted luxury linen is woven in Latvia on traditional wooden looms in limited quantities, endowing textiles with superior quality.",
    "craftDe": "Handgewebte Leinentextilien",
    "bioDe": "Seit der Gründung 1990 durch die renommierte Textilkünstlerin Laima Kaugure steht Studio Natural für Leinen als Lebensstil. Die luxuriösen Leinentextilien werden in Lettland in kleinen Mengen auf traditionellen Holzwebstühlen von Hand gewebt und erhalten dadurch eine besondere Qualität."
  },
  {
    "slug": "raibi-koki",
    "name": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain cutting boards and wooden objects",
    "isPartner": true,
    "portrait": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "workshopImages": [
      "https://images.unsplash.com/photo-1565538420870-da08ff96a261?w=1200&q=80"
    ],
    "bio": "Raibi Koki makes colourful wooden kitchen boards, jewellery, care products and other wooden objects. Their shop is in Odukalns, Ķekava, where internet orders can be collected and the full product range can be seen by appointment.",
    "craftDe": "Hirnholz-Schneidebretter und Holzobjekte",
    "bioDe": "Raibi Koki fertigt farbenreiche Küchenbretter aus Holz, Schmuck, Pflegeprodukte und weitere Holzobjekte. Die Werkstatt arbeitet in Odukalns bei Ķekava und konzentriert sich auf langlebige Stücke für Küche und Tisch."
  },
  {
    "slug": "latvijas-labumu-tirgus-mals",
    "name": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Latvian clay and ceramic marketplace",
    "isPartner": true,
    "portrait": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f2e4f650ec7d.jpg",
    "workshopImages": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-61a224ba01640.jpg",
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg"
    ],
    "bio": "Latvijas Labumu Tirgus gathers Latvian makers in one catalog. The clay section includes pottery, black ceramics, serving pieces, vases, mugs and decorative ceramics from individual studios across Latvia.",
    "craftDe": "Lettischer Ton und Keramikmarktplatz",
    "bioDe": "Latvijas Labumu Tirgus versammelt lettische Hersteller in einem gemeinsamen Katalog. Der Bereich Ton umfasst Tonkeramik, schwarze Keramik, Servierstücke, Vasen, Becher und dekorative Keramik aus Werkstätten in ganz Lettland."
  },
  {
    "slug": "cerannic",
    "name": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "Handmade porcelain mugs",
    "isPartner": true,
    "portrait": "https://site-2141663.mozfiles.com/files/2141663/inlinepicturesbox/medium/215902030_10223384337911088_5391095339784461632_n-1.jpg",
    "workshopImages": [
      "https://site-2141663.mozfiles.com/files/2141663/catcategories/thumb/9e52ff336db1672509972b1abadc259b.jpg?399991",
      "https://site-2141663.mozfiles.com/files/2141663/catcategories/thumb/0f29b1e8f1698558c7db6913f187147a.jpg?399807"
    ],
    "bio": "Annija Kanska is the maker behind cerannic, a porcelain cup studio built around the idea of a slower way of life. Each cup is made as a small invitation to a calmer everyday moment.",
    "craftDe": "Handgemachte Porzellantassen",
    "bioDe": "Annija Kanska ist die Gestalterin hinter cerannic, einem Porzellantassen-Studio, das auf der Idee eines langsameren Alltags beruht. Jede Tasse entsteht als kleine Einladung zu einem ruhigeren Moment."
  },
  {
    "slug": "cepli",
    "name": "Cepļi",
    "location": "Skulte parish, Limbaži region, Latvia",
    "craft": "Black ceramics and stoneware",
    "isPartner": true,
    "portrait": "https://www.cepli.lv/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-11.54.38-1024x681.jpeg",
    "workshopImages": [
      "https://www.cepli.lv/wp-content/uploads/2020/06/Keramikas_darbnica_Cepli_logo-1-1.png",
      "https://www.cepli.lv/wp-content/uploads/2019/07/output-onlinepngtools-5.png"
    ],
    "bio": "My name is Ingrīda Žagata, and I first encountered clay when I was 12 years old. Since then, ceramics have been not only my work but also my way of life. Since 1985 I have run my ceramics workshop close to the Baltic Sea.",
    "craftDe": "Schwarze Keramik und Steinzeug",
    "bioDe": "Mein Name ist Ingrīda Žagata, und ich bin Ton zum ersten Mal mit 12 Jahren begegnet. Seitdem ist Keramik nicht nur meine Arbeit, sondern auch meine Lebensweise. Seit 1985 führe ich meine Keramikwerkstatt nahe der Ostsee."
  },
  {
    "slug": "vaidava-ceramics",
    "name": "VAIDAVA CERAMICS",
    "location": "Vaidava, Latvia",
    "craft": "Handcrafted Latvian ceramics",
    "isPartner": true,
    "portrait": "https://vaidava.com/cdn/shop/files/01.07.2022_VAIDAVA_323_of_376.jpg?v=1739278644&width=1500",
    "workshopImages": [
      "https://vaidava.com/cdn/shop/files/clay-craftsman-working.jpg?v=1679904289&width=3840",
      "https://vaidava.com/cdn/shop/files/ceramic-bowl-sculpting.jpg?v=1681718822&width=3840"
    ],
    "bio": "Vaidava Ceramics is the story of how a small workshop in Northern Europe radiates its heritage, craftsmanship and devotion to embrace the world. For nearly 45 years, the team has produced artisanal creations made to enrich everyday life and celebration.",
    "craftDe": "Handgefertigte lettische Keramik",
    "bioDe": "Vaidava Ceramics erzählt davon, wie eine kleine Werkstatt in Nordeuropa ihr Erbe, ihr Handwerk und ihre Hingabe in die Welt trägt. Seit fast 45 Jahren entstehen dort handwerkliche Stücke für Alltag und festliche Momente."
  }
] satisfies Artisan[];

export const products = [
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
    "craft": "Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: Linengold Dimensions: width 50cm, length 200cm Composition: 100% linen Product reference: Dub",
    "isPartnerProduct": true,
    "nameDe": "Doppellagiger scarf in linengold 50x200cm",
    "descriptionDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenschal",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: pastel rose Dimensions:width 50cm, length 200cm Composition: 100% linen Product reference: Du",
    "isPartnerProduct": true,
    "nameDe": "Doppellagiger Leinenschal",
    "descriptionDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenschal",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "This handwoven double layer linen scarf is the perfect accessory for any look. Crafted from natural material and detailed with hand-twisted fringes, it is both stylish and sustainable accessory. Its unique chameleon color will make you stand out in the crowd. Color: light gray Dimensions:width 30cm, length 170cm Composition: 100% linen Product reference: Dub",
    "isPartnerProduct": true,
    "nameDe": "Doppellagiger Leinenschal",
    "descriptionDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenschal",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Dresses",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Hand woven linen kimono dress with pure highest quality silk lining. In grey color. Unique and highest quality designer's work. Limited edition. Color: Grey Size: Women's M / EU 40-42 / UK 12-14 Composition: 100 % linen, lining 100% silk Product reference: TR Mix Antr+W+Silk Care instructions: Dry clean only. Iron at different temperatures suitable for linen",
    "isPartnerProduct": true,
    "nameDe": "Kimono-Kleid in grey",
    "descriptionDe": "Ein handgewebtes Leinenkleid von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebtes Leinenkleid von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenkleid",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Coat",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Hand woven Kazaku style linen coat with wool crochet. This coat has special wool buttons. Natural crumpled linen plays beautifully with sequin ornaments. Unique and very high-quality designer's work. Limited edition. Color: Dark brown Size: Women's M / EU 40-42 / UK 12-14 Composition: 100% linen, lining 100% silk Product reference: Kazaku Ieva M Antr+Brown+t",
    "isPartnerProduct": true,
    "nameDe": "Leinenmantel Kazaku M",
    "descriptionDe": "Ein handgewebter Leinenmantel von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Leinenmantel von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenmantel",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
  },
  {
    "slug": "studio-natural-table-runner-primit-40x105cm",
    "name": "Table runner Primit 40x105cm",
    "description": "Dense hand woven linen table runner for a modern holiday table. It has a particularly timeless design. Color: Black Dimensions: width 40cm, length 105cm Composition: 100% linen Product reference: Primit Black +Dažw+zigsp Care instructions: Machine washed (max 30 ° C) using a gentle cycle, hand wash (max 30 ° C) or dry clean. Wash separately. Iron at maximum",
    "price": "€ 98.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at15.02.30_1.jpg?v=1777982797",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at15.02.30_1.jpg?v=1777982797"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "Table runners",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Dense hand woven linen table runner for a modern holiday table. It has a particularly timeless design. Color: Black Dimensions: width 40cm, length 105cm Composition: 100% linen Product reference: Primit Black +Dažw+zigsp Care instructions: Machine washed (max 30 ° C) using a gentle cycle, hand wash (max 30 ° C) or dry clean. Wash separately. Iron at maximum",
    "isPartnerProduct": true,
    "nameDe": "Tischläufer Primit 40x105cm",
    "descriptionDe": "Ein handgewebter Tischläufer aus Leinen von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Tischläufer aus Leinen von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Tischtextilien",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
  },
  {
    "slug": "studio-natural-placemat-double-45x35cm",
    "name": "Placemat Double 45x35cm",
    "description": "Unique, reversible handwoven linen placemat created using a special author’s technique. Featuring a refined palette of powder, light blue, and grey tones, it is perfect for everyday use. Color: Puder, Light blue, Grey Dimensions: width 45cm, length 35cm Composition: 100% linen Product reference: Dubl w+puder+3colors+5mzigsp Care instructions: Hand wash (ma",
    "price": "€ 45.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at14.53.54_1.jpg?v=1777982387",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-05-05at14.53.54_1.jpg?v=1777982387"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "Placemat",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Unique, reversible handwoven linen placemat created using a special author’s technique. Featuring a refined palette of powder, light blue, and grey tones, it is perfect for everyday use. Color: Puder, Light blue, Grey Dimensions: width 45cm, length 35cm Composition: 100% linen Product reference: Dubl w+puder+3colors+5mzigsp Care instructions: Hand wash (ma",
    "isPartnerProduct": true,
    "nameDe": "Platzset Double 45x35cm",
    "descriptionDe": "Ein handgewebtes Platzset aus Leinen von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebtes Platzset aus Leinen von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Handgewebtes Leinen",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
  },
  {
    "slug": "studio-natural-placemat-boucle-50x36cm",
    "name": "Placemat Boucle 50x36cm",
    "description": "A new approach to placemat weaving. The special boucle (linen thread forming a loop) linen creates a rough yet refined impression. This placemat has small fringes. Excellent for daily use. Color: White Dimensions: width 50cm, length 36cm Composition: 100% linen Product reference: PLACE w+w+buckle+g5 Care instructions: Machine wash (max 30°C) using a gentle ",
    "price": "€ 45.00",
    "image": "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-21at12.36.47_11.jpg?v=1776764382",
    "images": [
      "https://cdn.shopify.com/s/files/1/0506/6516/0878/files/WhatsAppImage2026-04-21at12.36.47_11.jpg?v=1776764382"
    ],
    "artisanSlug": "studio-natural",
    "artisanName": "Studio Natural",
    "location": "Riga, Latvia",
    "craft": "Placemat",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "A new approach to placemat weaving. The special boucle (linen thread forming a loop) linen creates a rough yet refined impression. This placemat has small fringes. Excellent for daily use. Color: White Dimensions: width 50cm, length 36cm Composition: 100% linen Product reference: PLACE w+w+buckle+g5 Care instructions: Machine wash (max 30°C) using a gentle ",
    "isPartnerProduct": true,
    "nameDe": "Platzset Boucle 50x36cm",
    "descriptionDe": "Ein handgewebtes Platzset aus Leinen von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebtes Platzset aus Leinen von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Handgewebtes Leinen",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Sheer handwoven linen scarf. Lightweight and sheer fabric - perfect for warm weather. This scarf is sure to make a fashionable statement. Excellent for everyday use or for an evening out. Color: Khaki, natural Dimensions: length 200cm, width 50cm Composition: 100% linen Product reference: Tinita w+nat+haki+seidg1 Care instructions: Hand wash (max 30°C) or dr",
    "isPartnerProduct": true,
    "nameDe": "Leinenschal Tinita in khaki 50x200 cm",
    "descriptionDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenschal",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Scarf",
    "materials": "Linen",
    "technique": "Handwoven on traditional looms",
    "story": "Sheer handwoven linen scarf in black with hand-twisted fringes. Excellent for everyday use or an evening out. Color: Black Dimensions: width 70cm, length 250cm Composition: Linen Product reference: Transp black+lfr Care instructions: Hand wash (max 30°C) or dry clean. If hand-washed, do not wring or twist - remove excess water by shaking it out. Do not tumbl",
    "isPartnerProduct": true,
    "nameDe": "Leinenschal Transparent in black 70x250 cm",
    "descriptionDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "storyDe": "Ein handgewebter Leinenschal von Studio Natural. Das Stück wird in Lettland auf traditionellen Webstühlen gefertigt und verbindet natürliche Materialien mit sorgfältiger Verarbeitung.",
    "craftDe": "Leinenschal",
    "materialsDe": "Leinen",
    "techniqueDe": "Auf traditionellen Webstühlen von Hand gewebt"
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
    "craft": "Ceramic plate",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Give your chopsticks a place to rest. Crafted by hand from red and white clay, these holders bring the same quiet elegance to your table as the rest of the Vaidava Ceramics products. Small in size, but considered in every detail. The outside is left partially unglazed, revealing the natural texture and colour of the clay body, while the top is glazed in your choice of white, black, or transparent, so you can find the one that fits your favourite collection.",
    "isPartnerProduct": true,
    "nameDe": "Essstäbchenhalter",
    "descriptionDe": "Chopstick holder von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Chopstick holder von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikteller",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic plate",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Complement your evening rituals with the soft, subtle glow of candlelight, beautifully showcased on ceramic candle holder. Its simple, clean lines bring a natural, rustic charm to your home, and it is perfect for pillar candles.",
    "isPartnerProduct": true,
    "nameDe": "Kerzenhalter · Eclipse",
    "descriptionDe": "Candle holder · Eclipse von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Candle holder · Eclipse von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikteller",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic mug",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Add a touch of comfort to your morning routine. Enjoy your solitary coffee moments or tea times with friends using our exquisite terracotta mug. A splendid and practical enhancement for any kitchen space. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is partially glazed with moss green coloured glaze. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Tasse glazed moosgrün · Earth",
    "descriptionDe": "Mug glazed moss green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Mug glazed moss green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramiktasse",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic mug",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Add a touch of comfort to your morning routine. Enjoy your solitary coffee moments or tea times with friends using our exquisite terracotta mug. A splendid and practical enhancement for any kitchen space. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is partially glazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Tasse glazed weiß · Earth",
    "descriptionDe": "Mug glazed white · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Mug glazed white · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramiktasse",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic plate",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Whether you're serving up an appetizer or a scrumptious dessert, this duo is perfect for adding a touch of rustic elegance to any dining experience. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Set aus 2 kleinen Tellern · Earth",
    "descriptionDe": "Small plate set x 2 · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Small plate set x 2 · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikteller",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "The Centrepiece bowl is a beautiful choice for those who love gathering family and friends around the table. Its generous size makes it perfect for serving large salads, fresh seasonal dishes, or sharing meals during special occasions. Designed to stand out, it also works wonderfully as an elegant table centerpiece or as a graceful bowl for displaying fresh fruit. The outside is left naturally raw, leveled, and slightly glazed. This product is glazed with lead-less glaze and tempered at 1000 C.",
    "isPartnerProduct": true,
    "nameDe": "Große Schale · Earth RAW",
    "descriptionDe": "Centerpiece bowl · Earth RAW von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Centerpiece bowl · Earth RAW von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikschale",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "This bowl is a perfect choice for cooking lovers who enjoy preparing generous meals with care and style. Its spacious size makes it ideal for mixing dough, tossing salads, or presenting warm homemade dishes at the table. Whether you are cooking for a big family dinner or hosting friends for a special gathering, this bowl offers both practicality and timeless charm. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Schale 4.0L weiß · Earth",
    "descriptionDe": "Bowl 4.0L white · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Bowl 4.0L white · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikschale",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Meet a bowl where every leafy green and plump tomato is celebrated in a feast for the senses. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Schale 2.0L curved moosgrün · Earth",
    "descriptionDe": "Bowl 2.0L curved moss green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Bowl 2.0L curved moss green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikschale",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "Let the bright colors and fresh flavors of crisp and juicy greens come together in a masterpiece of healthy indulgence. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Schale 2.0L salatgrün · Earth",
    "descriptionDe": "Bowl 2.0L salad green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Bowl 2.0L salad green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikschale",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
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
    "craft": "Ceramic bowl",
    "materials": "Clay, glaze",
    "technique": "Handcrafted ceramic production",
    "story": "This large terracotta fruit bowl is the perfect display for an abundance of colorful fruit or veggies. Designed by our team of artisans. Simplicity and clean lines make any piece in this collection a masterpiece of timeless design. The outside is left unglazed. It's leveled and thoroughly polished to disclose the clay's smoothness and prevent water and dirt absorption.",
    "isPartnerProduct": true,
    "nameDe": "Schale 3.0L moosgrün · Earth",
    "descriptionDe": "Bowl 3.0L moss green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "storyDe": "Bowl 3.0L moss green · Earth von VAIDAVA CERAMICS. Das Stück wird aus Ton gefertigt und verbindet klare Form, handwerkliche Herstellung und Alltagstauglichkeit für den gedeckten Tisch.",
    "craftDe": "Keramikschale",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgefertigte Keramikproduktion"
  },
  {
    "slug": "cepli-salatu-blodas",
    "name": "Salad bowls",
    "description": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1250°C. From the Monohroms collection, finished with a matte black glaze that is safe for people and the environment.",
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
    "story": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1250°C. From the Monohroms collection, finished with a matte black glaze that is safe for people and the environment.",
    "isPartnerProduct": true,
    "nameDe": "Salatschalen",
    "descriptionDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1250 °C gebrannt. Aus der Kollektion Monohroms, mit matter schwarzer Glasur, die für Mensch und Umwelt unbedenklich ist.",
    "storyDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1250 °C gebrannt. Aus der Kollektion Monohroms, mit matter schwarzer Glasur, die für Mensch und Umwelt unbedenklich ist.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-skivis-24-5-cm",
    "name": "Plate 24.5 cm",
    "description": "Hand-built from white stoneware using slab technique and fired at 1250°C. The glaze plays in tones from sandy beige to bluish shades and is safe for everyday table use.",
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
    "story": "Hand-built from white stoneware using slab technique and fired at 1250°C. The glaze plays in tones from sandy beige to bluish shades and is safe for everyday table use.",
    "isPartnerProduct": true,
    "nameDe": "Teller 24,5 cm",
    "descriptionDe": "Aus weißem Steinzeug in Plattentechnik von Hand geformt und bei 1250 °C gebrannt. Die Glasur spielt von sandigem Beige bis zu bläulichen Tönen und ist für den täglichen Gebrauch geeignet.",
    "storyDe": "Aus weißem Steinzeug in Plattentechnik von Hand geformt und bei 1250 °C gebrannt. Die Glasur spielt von sandigem Beige bis zu bläulichen Tönen und ist für den täglichen Gebrauch geeignet.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-skivis-24-5-cm-2",
    "name": "Plate 24.5 cm",
    "description": "Hand-built from white stoneware using slab technique and fired at 1250°C. The glaze plays in tones from sandy beige to bluish shades and is safe for everyday table use.",
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
    "story": "Hand-built from white stoneware using slab technique and fired at 1250°C. The glaze plays in tones from sandy beige to bluish shades and is safe for everyday table use.",
    "isPartnerProduct": true,
    "nameDe": "Teller 24,5 cm",
    "descriptionDe": "Aus weißem Steinzeug in Plattentechnik von Hand geformt und bei 1250 °C gebrannt. Die Glasur spielt von sandigem Beige bis zu bläulichen Tönen und ist für den täglichen Gebrauch geeignet.",
    "storyDe": "Aus weißem Steinzeug in Plattentechnik von Hand geformt und bei 1250 °C gebrannt. Die Glasur spielt von sandigem Beige bis zu bläulichen Tönen und ist für den täglichen Gebrauch geeignet.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-bloda-2l",
    "name": "Bowl 2L",
    "description": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1250°C. From the Siltums collection, made for serving and everyday use.",
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
    "story": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1250°C. From the Siltums collection, made for serving and everyday use.",
    "isPartnerProduct": true,
    "nameDe": "Schale 2 l",
    "descriptionDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1250 °C gebrannt. Aus der Kollektion Siltums, für Servieren und Alltag gemacht.",
    "storyDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1250 °C gebrannt. Aus der Kollektion Siltums, für Servieren und Alltag gemacht.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-vaze",
    "name": "Vase",
    "description": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1260°C. Finished with a transparent matte glaze and decorated with silver-coloured decal drawings.",
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
    "story": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1260°C. Finished with a transparent matte glaze and decorated with silver-coloured decal drawings.",
    "isPartnerProduct": true,
    "nameDe": "Vase",
    "descriptionDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1260 °C gebrannt. Mit transparenter matter Glasur und silberfarbenem Dekor versehen.",
    "storyDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1260 °C gebrannt. Mit transparenter matter Glasur und silberfarbenem Dekor versehen.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-vaze-2",
    "name": "Vase",
    "description": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1260°C. Finished with a transparent matte glaze and decorated with silver-coloured decal drawings.",
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
    "story": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1260°C. Finished with a transparent matte glaze and decorated with silver-coloured decal drawings.",
    "isPartnerProduct": true,
    "nameDe": "Vase",
    "descriptionDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1260 °C gebrannt. Mit transparenter matter Glasur und silberfarbenem Dekor versehen.",
    "storyDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1260 °C gebrannt. Mit transparenter matter Glasur und silberfarbenem Dekor versehen.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-vaze-3",
    "name": "Vase",
    "description": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1260°C. Finished with a transparent matte glaze and decorated with silver-coloured decal drawings.",
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
    "story": "Hand-thrown on a potter’s wheel from white stoneware and fired at 1260°C. Finished with a transparent matte glaze and decorated with silver-coloured decal drawings.",
    "isPartnerProduct": true,
    "nameDe": "Vase",
    "descriptionDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1260 °C gebrannt. Mit transparenter matter Glasur und silberfarbenem Dekor versehen.",
    "storyDe": "Auf der Töpferscheibe aus weißem Steinzeug von Hand gedreht und bei 1260 °C gebrannt. Mit transparenter matter Glasur und silberfarbenem Dekor versehen.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-servejamais-skivis-uz-kajinam-davanu-kaste",
    "name": "Serving plate on feet in gift box",
    "description": "Hand-built from Latvian clay and fired in an open-flame kiln using black pottery technique. Decorated by engraving with natural pattern motifs.",
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
    "story": "Hand-built from Latvian clay and fired in an open-flame kiln using black pottery technique. Decorated by engraving with natural pattern motifs.",
    "isPartnerProduct": true,
    "nameDe": "Servierteller auf Füßen in Geschenkbox",
    "descriptionDe": "Aus lettischem Ton von Hand in Plattentechnik geformt und im offenen Feuer in schwarzer Keramiktechnik gebrannt. Mit Naturmotiven graviert.",
    "storyDe": "Aus lettischem Ton von Hand in Plattentechnik geformt und im offenen Feuer in schwarzer Keramiktechnik gebrannt. Mit Naturmotiven graviert.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-servejamais-skivis-uz-kajinam-davanu-kaste-2",
    "name": "Serving plate on feet in gift box",
    "description": "Hand-built from Latvian clay and fired in an open-flame kiln using black pottery technique. Decorated by engraving with natural pattern motifs.",
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
    "story": "Hand-built from Latvian clay and fired in an open-flame kiln using black pottery technique. Decorated by engraving with natural pattern motifs.",
    "isPartnerProduct": true,
    "nameDe": "Servierteller auf Füßen in Geschenkbox",
    "descriptionDe": "Aus lettischem Ton von Hand in Plattentechnik geformt und im offenen Feuer in schwarzer Keramiktechnik gebrannt. Mit Naturmotiven graviert.",
    "storyDe": "Aus lettischem Ton von Hand in Plattentechnik geformt und im offenen Feuer in schwarzer Keramiktechnik gebrannt. Mit Naturmotiven graviert.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cepli-cukurtrauks",
    "name": "Sugar bowl",
    "description": "Hand-thrown on a potter’s wheel from grey stoneware and fired at 1250°C. From the Monohroms collection, finished with a matte black glaze.",
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
    "story": "Hand-thrown on a potter’s wheel from grey stoneware and fired at 1250°C. From the Monohroms collection, finished with a matte black glaze.",
    "isPartnerProduct": true,
    "nameDe": "Zuckerdose",
    "descriptionDe": "Auf der Töpferscheibe aus grauem Steinzeug von Hand gedreht und bei 1250 °C gebrannt. Aus der Kollektion Monohroms, mit matter schwarzer Glasur.",
    "storyDe": "Auf der Töpferscheibe aus grauem Steinzeug von Hand gedreht und bei 1250 °C gebrannt. Aus der Kollektion Monohroms, mit matter schwarzer Glasur.",
    "craftDe": "Keramik",
    "materialsDe": "Ton oder Steinzeug, Glasur",
    "techniqueDe": "Von Hand geformt, gedreht oder in Plattentechnik aufgebaut"
  },
  {
    "slug": "cerannic-leo",
    "name": "Leo",
    "description": "Leo from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/WhatsApp_Image_2024-01-27_at_16_42_57-751b5dbdd8abb5271e98ed063d0407b0.jpeg?5897235",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/WhatsApp_Image_2024-01-27_at_16_42_57-751b5dbdd8abb5271e98ed063d0407b0.jpeg?5897235"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with lines",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Leo from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Linien",
    "nameDe": "Leo",
    "descriptionDe": "Leo aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Leo aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-reinis",
    "name": "Reinis",
    "description": "Reinis from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0004-dd78b5aea0c7c81fa259574626694482.jpg?5903378",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0004-dd78b5aea0c7c81fa259574626694482.jpg?5903378"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with lines",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Reinis from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Linien",
    "nameDe": "Reinis",
    "descriptionDe": "Reinis aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Reinis aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-hugo",
    "name": "Hugo",
    "description": "Hugo from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01258-Edit-9507aada49831846aa65246fba89dc63.jpg?5902527",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01258-Edit-9507aada49831846aa65246fba89dc63.jpg?5902527"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with lines",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Hugo from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Linien",
    "nameDe": "Hugo",
    "descriptionDe": "Hugo aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Hugo aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-oskars",
    "name": "Oskars",
    "description": "Oskars from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0005-154c4d70209ff908356390429d134369.jpg?5903388",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/IMG-20231208-WA0005-154c4d70209ff908356390429d134369.jpg?5903388"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with lines",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Oskars from the mug with lines collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Linien",
    "nameDe": "Oskars",
    "descriptionDe": "Oskars aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Oskars aus der Kollektion Tasse mit Linien. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-sarlote",
    "name": "Šarlote",
    "description": "Šarlote from the mug with raised dots collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00854-7b26a9dadaee4e1f5a4f15c3ffe3c9cb.jpg?5903074",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00854-7b26a9dadaee4e1f5a4f15c3ffe3c9cb.jpg?5903074"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with raised dots",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Šarlote from the mug with raised dots collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit erhabenen Punkten",
    "nameDe": "Šarlote",
    "descriptionDe": "Šarlote aus der Kollektion Tasse mit erhabenen Punkten. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Šarlote aus der Kollektion Tasse mit erhabenen Punkten. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-jasmina",
    "name": "Jasmīna",
    "description": "Jasmīna from the mug with raised dots collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00870-338dfb788bda4514f3c03e92d0f04a67.jpg?5903367",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00870-338dfb788bda4514f3c03e92d0f04a67.jpg?5903367"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with raised dots",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Jasmīna from the mug with raised dots collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit erhabenen Punkten",
    "nameDe": "Jasmīna",
    "descriptionDe": "Jasmīna aus der Kollektion Tasse mit erhabenen Punkten. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Jasmīna aus der Kollektion Tasse mit erhabenen Punkten. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-sibilla",
    "name": "Sibilla",
    "description": "Sibilla from the mug with raised dots collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01356-Edit-f4428a95724cd07cb41ab00d02e46e43.jpg?5903168",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01356-Edit-f4428a95724cd07cb41ab00d02e46e43.jpg?5903168"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with raised dots",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Sibilla from the mug with raised dots collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit erhabenen Punkten",
    "nameDe": "Sibilla",
    "descriptionDe": "Sibilla aus der Kollektion Tasse mit erhabenen Punkten. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Sibilla aus der Kollektion Tasse mit erhabenen Punkten. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-amanda",
    "name": "Amanda",
    "description": "Amanda from the mug with brushstrokes collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00919-Edit-da5e540a723cbf624e9bcb90bfee9923.jpg?5903479",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC00919-Edit-da5e540a723cbf624e9bcb90bfee9923.jpg?5903479"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with brushstrokes",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Amanda from the mug with brushstrokes collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Pinselstrichen",
    "nameDe": "Amanda",
    "descriptionDe": "Amanda aus der Kollektion Tasse mit Pinselstrichen. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Amanda aus der Kollektion Tasse mit Pinselstrichen. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-dace",
    "name": "Dace",
    "description": "Dace from the mug with brushstrokes collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/20240119_122716-69083039f0d9a52ede4d9664f8d45009.jpg?5908563",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/20240119_122716-69083039f0d9a52ede4d9664f8d45009.jpg?5908563"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with brushstrokes",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Dace from the mug with brushstrokes collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Pinselstrichen",
    "nameDe": "Dace",
    "descriptionDe": "Dace aus der Kollektion Tasse mit Pinselstrichen. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Dace aus der Kollektion Tasse mit Pinselstrichen. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "cerannic-una",
    "name": "Una",
    "description": "Una from the mug with brushstrokes collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "price": "€ 25,00",
    "image": "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01137-66460cb77fc68dfaeaabff7a7a86f11c.jpg?5903580",
    "images": [
      "https://site-2141663.mozfiles.com/files/2141663/catitems/thumb/DSC01137-66460cb77fc68dfaeaabff7a7a86f11c.jpg?5903580"
    ],
    "artisanSlug": "cerannic",
    "artisanName": "cerannic",
    "location": "Tukums, Latvia",
    "craft": "mug with brushstrokes",
    "materials": "Porcelain, glaze",
    "technique": "Handmade porcelain cup",
    "story": "Una from the mug with brushstrokes collection. This is a made-to-order platform rather than a classic online shop; production time is up to three weeks.",
    "isPartnerProduct": true,
    "craftDe": "Tasse mit Pinselstrichen",
    "nameDe": "Una",
    "descriptionDe": "Una aus der Kollektion Tasse mit Pinselstrichen. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "storyDe": "Una aus der Kollektion Tasse mit Pinselstrichen. Die Stücke werden auf Bestellung gefertigt; die Produktionszeit beträgt bis zu drei Wochen.",
    "materialsDe": "Porzellan, Glasur",
    "techniqueDe": "Handgemachte Porzellantasse"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-dekorativa-pudele-solvita-zale",
    "name": "Decorative bottle by Solvita Zāle",
    "description": "Small decorative clay bottle with luster glaze. Approximate dimensions: 20 × 9 × 4 cm.",
    "price": "25,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fa6f463d621a.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fa6f463d621a.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Decorative ceramic bottle",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Small decorative clay bottle with luster glaze. Approximate dimensions: 20 × 9 × 4 cm.",
    "isPartnerProduct": true,
    "nameDe": "Dekorative Flasche von Solvita Zāle",
    "descriptionDe": "Kleine dekorative Tonflasche mit Lüster-Glasur. Maße ca. 20 × 9 × 4 cm.",
    "storyDe": "Kleine dekorative Tonflasche mit Lüster-Glasur. Maße ca. 20 × 9 × 4 cm.",
    "craftDe": "Dekorative Keramikflasche",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-melnas-keramikas-kruze-draudzens-anda-biez",
    "name": "Black pottery mug by Anda Biezā",
    "description": "Hand-built and fired in a pit-style wood kiln. No glaze is used; the black, silvery and bronze tones come from the firing and reduction process.",
    "price": "35,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-61a224ba01640.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-61a224ba01640.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Black pottery",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Hand-built and fired in a pit-style wood kiln. No glaze is used; the black, silvery and bronze tones come from the firing and reduction process.",
    "isPartnerProduct": true,
    "nameDe": "Schwarze Keramiktasse von Anda Biezā",
    "descriptionDe": "Von Hand aufgebaut und in einem grubenartigen Holzofen gebrannt. Ohne Glasur; die schwarzen, silbrigen und bronzenen Töne entstehen im Reduktionsbrand.",
    "storyDe": "Von Hand aufgebaut und in einem grubenartigen Holzofen gebrannt. Ohne Glasur; die schwarzen, silbrigen und bronzenen Töne entstehen im Reduktionsbrand.",
    "craftDe": "Schwarze Keramik",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-dekorativs-auglu-trauks-solvita-zale",
    "name": "Decorative fruit bowl by Solvita Zāle",
    "description": "Decorative stoneware fruit bowl with a woven form. Approximate dimensions: 6.5 × 32 cm, fired at 1200°C.",
    "price": "40,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f8e062de95c2.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Stoneware",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Decorative stoneware fruit bowl with a woven form. Approximate dimensions: 6.5 × 32 cm, fired at 1200°C.",
    "isPartnerProduct": true,
    "nameDe": "Dekorative Obstschale von Solvita Zāle",
    "descriptionDe": "Dekorative Obstschale aus Steinzeug in geflochtener Form. Maße ca. 6,5 × 32 cm, bei 1200 °C gebrannt.",
    "storyDe": "Dekorative Obstschale aus Steinzeug in geflochtener Form. Maße ca. 6,5 × 32 cm, bei 1200 °C gebrannt.",
    "craftDe": "Steinzeug",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-vaze-nellijas-keramika",
    "name": "Vase by NELLIJAS KERAMIKA",
    "description": "White clay vase with white glaze, 31 cm high.",
    "price": "70,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-67327ce2c23fa.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-67327ce2c23fa.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Ceramics",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "White clay vase with white glaze, 31 cm high.",
    "isPartnerProduct": true,
    "nameDe": "Vase von NELLIJAS KERAMIKA",
    "descriptionDe": "Vase aus weißem Ton mit weißer Glasur, 31 cm hoch.",
    "storyDe": "Vase aus weißem Ton mit weißer Glasur, 31 cm hoch.",
    "craftDe": "Keramik",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-ovals-servejamais-skivis-1-podvaze",
    "name": "Oval serving plate by PodVāze",
    "description": "Oval white-clay plate painted under the glaze with a blue fish motif, covered with a glossy transparent lead-free glaze and fired at 1050°C.",
    "price": "22,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f3afb0b5d904.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5f3afb0b5d904.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Serving plate",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Oval white-clay plate painted under the glaze with a blue fish motif, covered with a glossy transparent lead-free glaze and fired at 1050°C.",
    "isPartnerProduct": true,
    "nameDe": "Ovaler Servierteller von PodVāze",
    "descriptionDe": "Ovaler Teller aus weißem Ton mit blauem Fischmotiv unter der Glasur, transparenter bleifreier Glanzglasur und Brand bei 1050 °C.",
    "storyDe": "Ovaler Teller aus weißem Ton mit blauem Fischmotiv unter der Glasur, transparenter bleifreier Glanzglasur und Brand bei 1050 °C.",
    "craftDe": "Servierteller",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-apgleznots-skivis-kakitis-ilona-sausa",
    "name": "Painted plate by Ilona Šauša",
    "description": "Decorative plate painted with ceramic glazes and pigments. Can be hung on a wall or displayed on a table. 34 × 28 cm.",
    "price": "46,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fce2e9f7b5aa.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fce2e9f7b5aa.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Painted plate",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Decorative plate painted with ceramic glazes and pigments. Can be hung on a wall or displayed on a table. 34 × 28 cm.",
    "isPartnerProduct": true,
    "nameDe": "Bemalter Teller von Ilona Šauša",
    "descriptionDe": "Dekorativer Teller, mit Keramikglasuren und Pigmenten bemalt. Zum Aufhängen oder Aufstellen geeignet. 34 × 28 cm.",
    "storyDe": "Dekorativer Teller, mit Keramikglasuren und Pigmenten bemalt. Zum Aufhängen oder Aufstellen geeignet. 34 × 28 cm.",
    "craftDe": "Bemalter Teller",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-studija-om-mezginu-skivis",
    "name": "Lace plate by Studija OM",
    "description": "White-clay lace plate with glaze. Height 5 cm, diameter 27.5 cm.",
    "price": "20,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fd0a03eef365.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-5fd0a03eef365.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Ceramics",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "White-clay lace plate with glaze. Height 5 cm, diameter 27.5 cm.",
    "isPartnerProduct": true,
    "nameDe": "Spitzenteller von Studija OM",
    "descriptionDe": "Spitzenteller aus weißem Ton mit Glasur. Höhe 5 cm, Durchmesser 27,5 cm.",
    "storyDe": "Spitzenteller aus weißem Ton mit Glasur. Höhe 5 cm, Durchmesser 27,5 cm.",
    "craftDe": "Keramik",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "latvijas-labumu-tirgus-mals-trauks-saulespuke-saulaina-ieleja",
    "name": "Sunflower dish by Saulainā ieleja",
    "description": "Handmade black pottery dish in red clay, inspired by the warmth and positive energy of sunflowers. Diameter 27 cm, height 3 cm.",
    "price": "45,00 €",
    "image": "https://www.latvijaslabumstirgus.lv/pictures/scsd-656d055716782.jpg",
    "images": [
      "https://www.latvijaslabumstirgus.lv/pictures/scsd-656d055716782.jpg"
    ],
    "artisanSlug": "latvijas-labumu-tirgus-mals",
    "artisanName": "Latvijas Labumu Tirgus: Clay",
    "location": "Latvia",
    "craft": "Black pottery",
    "materials": "Clay, glaze",
    "technique": "Handmade ceramics",
    "story": "Handmade black pottery dish in red clay, inspired by the warmth and positive energy of sunflowers. Diameter 27 cm, height 3 cm.",
    "isPartnerProduct": true,
    "nameDe": "Sonnenblumen-Schale von Saulainā ieleja",
    "descriptionDe": "Handgemachte schwarze Keramikschale aus rotem Ton, inspiriert von Wärme und positiver Energie der Sonnenblume. Durchmesser 27 cm, Höhe 3 cm.",
    "storyDe": "Handgemachte schwarze Keramikschale aus rotem Ton, inspiriert von Wärme und positiver Energie der Sonnenblume. Durchmesser 27 cm, Höhe 3 cm.",
    "craftDe": "Schwarze Keramik",
    "materialsDe": "Ton, Glasur",
    "techniqueDe": "Handgemachte Keramik"
  },
  {
    "slug": "raibi-koki-galda-spele-marble-solitaire",
    "name": "Marble solitaire board game",
    "description": "Marble Solitaire is an elegant wooden table game and a classic puzzle for training focus and strategy.",
    "price": "€ 48,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Wooden table objects",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Marble Solitaire is an elegant wooden table game and a classic puzzle for training focus and strategy.",
    "isPartnerProduct": true,
    "nameDe": "Brettspiel Marble Solitaire",
    "descriptionDe": "Marble Solitaire ist ein elegantes Holzspiel und ein klassisches Denkspiel für Konzentration und Strategie.",
    "storyDe": "Marble Solitaire ist ein elegantes Holzspiel und ein klassisches Denkspiel für Konzentration und Strategie.",
    "craftDe": "Holzobjekte für den Tisch",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-riekstkoka-salvesu-gredzeni",
    "name": "Walnut napkin rings",
    "description": "Napkin rings made from walnut wood for a warm, natural table setting.",
    "price": "€ 3,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "Wooden table objects",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Napkin rings made from walnut wood for a warm, natural table setting.",
    "isPartnerProduct": true,
    "nameDe": "Serviettenringe aus Walnussholz",
    "descriptionDe": "Serviettenringe aus Walnussholz für einen warmen, natürlichen Tisch.",
    "storyDe": "Serviettenringe aus Walnussholz für einen warmen, natürlichen Tisch.",
    "craftDe": "Holzobjekte für den Tisch",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-mazais-triskasu-virtuves-gala-skiedru-delitis-3223-cm",
    "name": "Small three-colour end-grain kitchen board 32 × 23 cm",
    "description": "End-grain kitchen board made from oak, sapelli and assorted wood species, finished with mineral oil and beeswax.",
    "price": "€ 60,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "End-grain kitchen board made from oak, sapelli and assorted wood species, finished with mineral oil and beeswax.",
    "isPartnerProduct": true,
    "nameDe": "Kleines dreifarbiges Hirnholz-Küchenbrett 32 × 23 cm",
    "descriptionDe": "Hirnholz-Küchenbrett aus Eiche, Sapelli und weiteren Holzarten, mit Mineralöl und Bienenwachs behandelt.",
    "storyDe": "Hirnholz-Küchenbrett aus Eiche, Sapelli und weiteren Holzarten, mit Mineralöl und Bienenwachs behandelt.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-liels-triskrasu-vienpuseji-lietojams-virtuves-delis-40x26cm",
    "name": "Large three-colour one-sided kitchen board 40 × 26 cm",
    "description": "One-sided end-grain kitchen board with a mahogany frame and silicone feet, made from oak, sapelli and assorted wood species.",
    "price": "€ 126,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "One-sided end-grain kitchen board with a mahogany frame and silicone feet, made from oak, sapelli and assorted wood species.",
    "isPartnerProduct": true,
    "nameDe": "Großes dreifarbiges einseitiges Küchenbrett 40 × 26 cm",
    "descriptionDe": "Einseitiges Hirnholz-Küchenbrett mit Mahagonirahmen und Silikonfüßen, aus Eiche, Sapelli und weiteren Holzarten.",
    "storyDe": "Einseitiges Hirnholz-Küchenbrett mit Mahagonirahmen und Silikonfüßen, aus Eiche, Sapelli und weiteren Holzarten.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-triskrasu-divpusejs-gala-skiedru-delis-40x26cm",
    "name": "Three-colour double-sided end-grain board 40 × 26 cm",
    "description": "Double-sided end-grain kitchen board in a mahogany frame, made from oak, sapelli and assorted wood species, finished with mineral oil and beeswax.",
    "price": "€ 126,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Double-sided end-grain kitchen board in a mahogany frame, made from oak, sapelli and assorted wood species, finished with mineral oil and beeswax.",
    "isPartnerProduct": true,
    "nameDe": "Dreifarbiges zweiseitiges Hirnholzbrett 40 × 26 cm",
    "descriptionDe": "Zweiseitiges Hirnholz-Küchenbrett im Mahagonirahmen, aus Eiche, Sapelli und weiteren Holzarten, mit Mineralöl und Bienenwachs behandelt.",
    "storyDe": "Zweiseitiges Hirnholz-Küchenbrett im Mahagonirahmen, aus Eiche, Sapelli und weiteren Holzarten, mit Mineralöl und Bienenwachs behandelt.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-liels-divpusejs-ozolkoka-gala-skiedru-delis-ar-sarkankoka-m",
    "name": "Large double-sided oak end-grain board with mahogany edges 40 × 27 cm",
    "description": "Double-sided oak end-grain kitchen board with mahogany side edges, finished with mineral oil and beeswax.",
    "price": "€ 90,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Double-sided oak end-grain kitchen board with mahogany side edges, finished with mineral oil and beeswax.",
    "isPartnerProduct": true,
    "nameDe": "Großes zweiseitiges Eichen-Hirnholzbrett mit Mahagonikanten 40 × 27 cm",
    "descriptionDe": "Zweiseitiges Eichen-Hirnholzbrett mit Mahagonikanten, mit Mineralöl und Bienenwachs behandelt.",
    "storyDe": "Zweiseitiges Eichen-Hirnholzbrett mit Mahagonikanten, mit Mineralöl und Bienenwachs behandelt.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-gala-skiedru-delitis-mozaika-3323-cm",
    "name": "End-grain board “Mosaic” 33 × 23 cm",
    "description": "Colourful mosaic-style end-grain board made from many wood species and set in an oak frame.",
    "price": "€ 62,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Colourful mosaic-style end-grain board made from many wood species and set in an oak frame.",
    "isPartnerProduct": true,
    "nameDe": "Hirnholzbrett „Mosaik“ 33 × 23 cm",
    "descriptionDe": "Farbiges Hirnholzbrett im Mosaikstil aus vielen Holzarten, eingefasst in einen Eichenrahmen.",
    "storyDe": "Farbiges Hirnholzbrett im Mosaikstil aus vielen Holzarten, eingefasst in einen Eichenrahmen.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-afrikas-dzelzskoka-gala-skiedru-delitis-3324-cm",
    "name": "African ironwood end-grain board 33 × 24 cm",
    "description": "Double-sided end-grain board made from very hard African ironwood. The board weighs around 2 kg.",
    "price": "€ 58,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Double-sided end-grain board made from very hard African ironwood. The board weighs around 2 kg.",
    "isPartnerProduct": true,
    "nameDe": "Hirnholzbrett aus afrikanischem Eisenholz 33 × 24 cm",
    "descriptionDe": "Zweiseitiges Hirnholzbrett aus sehr hartem afrikanischem Eisenholz. Das Brett wiegt etwa 2 kg.",
    "storyDe": "Zweiseitiges Hirnholzbrett aus sehr hartem afrikanischem Eisenholz. Das Brett wiegt etwa 2 kg.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  },
  {
    "slug": "raibi-koki-tumss-riekstkoka-virtuves-gala-skiedru-delis-tumsais-3323-c",
    "name": "Dark walnut end-grain kitchen board “Dark” 33 × 23 cm",
    "description": "Dark walnut end-grain board with white ash ornaments, finished with mineral oil and beeswax.",
    "price": "€ 65,00",
    "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&q=80"
    ],
    "artisanSlug": "raibi-koki",
    "artisanName": "Raibi Koki",
    "location": "Odukalns, Ķekava, Latvia",
    "craft": "End-grain boards",
    "materials": "Wood, mineral oil, beeswax",
    "technique": "End-grain woodworking",
    "story": "Dark walnut end-grain board with white ash ornaments, finished with mineral oil and beeswax.",
    "isPartnerProduct": true,
    "nameDe": "Dunkles Walnuss-Hirnholzbrett „Dark“ 33 × 23 cm",
    "descriptionDe": "Dunkles Hirnholzbrett aus Walnuss mit Ornamenten aus weißer Esche, mit Mineralöl und Bienenwachs behandelt.",
    "storyDe": "Dunkles Hirnholzbrett aus Walnuss mit Ornamenten aus weißer Esche, mit Mineralöl und Bienenwachs behandelt.",
    "craftDe": "Hirnholzbretter",
    "materialsDe": "Holz, Mineralöl, Bienenwachs",
    "techniqueDe": "Hirnholzverarbeitung"
  }
] satisfies CatalogProduct[];

export const artisanBySlug = Object.fromEntries(artisans.map((artisan) => [artisan.slug, artisan])) as Record<string, Artisan>;
export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<string, CatalogProduct>;

export function getProductsByArtisan(artisanSlug: string) {
  return products.filter((product) => product.artisanSlug === artisanSlug);
}
