// The product "database". Swap this for Prisma/Postgres later (see README) —
// everything else in the app only talks to the helpers at the bottom.

export type Kind =
  | "sofa"
  | "armchair"
  | "coffeeTable"
  | "diningTable"
  | "chair"
  | "bed"
  | "nightstand"
  | "wardrobe"
  | "tvStand"
  | "shelf"
  | "floorLamp"
  | "rug"
  | "desk";

export type Room =
  | "living"
  | "bedroom"
  | "dining"
  | "office"
  | "studio"
  | "reading"
  | "outdoor";

export type Mood =
  | "calm"
  | "warm"
  | "bold"
  | "cozy"
  | "minimal"
  | "luxurious"
  | "natural"
  | "creative";

export type Style =
  | "scandinavian"
  | "minimalist"
  | "modern"
  | "industrial"
  | "japandi"
  | "mid-century"
  | "contemporary"
  | "ethiopian";

export type Swatch = { name: string; hex: string };
export type Material = { name: string; note: string; priceDelta: number };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  kind: Kind;
  price: number;
  // centimetres: width (x), depth (z), height (y)
  w: number;
  d: number;
  h: number;
  seats?: number;
  colors: Swatch[];
  materials: Material[];
  rooms: Room[];
  moods: Mood[];
  styles: Style[];
  deliveryDays: number;
  stock: number;
  eco: boolean;
  description: string;
};

const sand = { name: "Sand", hex: "#D8C9B3" };
const ivory = { name: "Ivory", hex: "#EDE6D6" };
const olive = { name: "Olive", hex: "#7A7A4F" };
const charcoal = { name: "Charcoal", hex: "#3B3834" };
const clay = { name: "Clay", hex: "#B76E50" };
const oak = { name: "Oak", hex: "#C9A27A" };
const walnut = { name: "Walnut", hex: "#6B4A33" };
const ash = { name: "Ash", hex: "#DCCFB8" };
const sage = { name: "Sage", hex: "#9AA38A" };
const ink = { name: "Ink", hex: "#2B3A42" };

const linen: Material = { name: "Belgian linen", note: "Breathable, softens with age.", priceDelta: 0 };
const boucle: Material = { name: "Bouclé", note: "Chunky woven loops, very tactile.", priceDelta: 160 };
const velvet: Material = { name: "Cotton velvet", note: "Dense pile with a quiet sheen.", priceDelta: 220 };
const leather: Material = { name: "Vegetable-tanned leather", note: "Develops a patina over years.", priceDelta: 480 };
const solidOak: Material = { name: "Solid oak", note: "FSC certified, oiled finish.", priceDelta: 0 };
const solidWalnut: Material = { name: "Solid walnut", note: "Deep grain, hand-rubbed oil.", priceDelta: 190 };
const veneer: Material = { name: "Ash veneer", note: "Light and stable, great value.", priceDelta: -90 };
const wool: Material = { name: "Hand-knotted wool", note: "Dense, durable, naturally stain resistant.", priceDelta: 0 };
const jute: Material = { name: "Woven jute", note: "Earthy texture, plant-based fibre.", priceDelta: -40 };

export const products: Product[] = [
  {
    slug: "solen-sofa",
    name: "The Solen Sofa",
    tagline: "A softer approach to modern living.",
    kind: "sofa",
    price: 1840,
    w: 245, d: 94, h: 82, seats: 3,
    colors: [sand, olive, charcoal, ivory],
    materials: [linen, boucle, velvet],
    rooms: ["living", "studio"],
    moods: ["calm", "warm", "cozy"],
    styles: ["modern", "japandi", "contemporary"],
    deliveryDays: 10, stock: 14, eco: true,
    description:
      "Low, deep and generous. Solen has a kiln-dried beech frame, feather-wrapped cushions and a quietly curved back that makes the whole room feel calmer.",
  },
  {
    slug: "tegu-loveseat",
    name: "The Tegu Loveseat",
    tagline: "Big comfort, small footprint.",
    kind: "sofa",
    price: 990,
    w: 168, d: 86, h: 80, seats: 2,
    colors: [sand, sage, clay, charcoal],
    materials: [linen, boucle],
    rooms: ["living", "studio", "reading"],
    moods: ["cozy", "warm", "creative"],
    styles: ["scandinavian", "mid-century", "contemporary"],
    deliveryDays: 7, stock: 22, eco: false,
    description:
      "Designed for apartments where every centimetre counts. Tegu fits through a standard 70 cm door fully assembled.",
  },
  {
    slug: "marlo-armchair",
    name: "The Marlo Armchair",
    tagline: "Sit like you mean it.",
    kind: "armchair",
    price: 640,
    w: 78, d: 80, h: 76,
    colors: [clay, ivory, olive, ink],
    materials: [boucle, velvet, leather],
    rooms: ["living", "reading", "bedroom"],
    moods: ["bold", "cozy", "luxurious"],
    styles: ["mid-century", "contemporary", "modern"],
    deliveryDays: 8, stock: 31, eco: false,
    description:
      "A sculpted shell on a solid wood base. Marlo is the kind of chair people fight over at parties.",
  },
  {
    slug: "kora-coffee-table",
    name: "The Kora Coffee Table",
    tagline: "Round edges, grounded presence.",
    kind: "coffeeTable",
    price: 520,
    w: 90, d: 90, h: 38,
    colors: [oak, walnut, ash],
    materials: [solidOak, solidWalnut, veneer],
    rooms: ["living", "studio"],
    moods: ["natural", "warm", "minimal"],
    styles: ["japandi", "scandinavian", "modern"],
    deliveryDays: 6, stock: 40, eco: true,
    description:
      "A single drum of solid timber with a soft eased edge. Wide enough for books, small enough to walk around.",
  },
  {
    slug: "aden-dining-table",
    name: "The Aden Dining Table",
    tagline: "Long dinners, short distances.",
    kind: "diningTable",
    price: 1390,
    w: 200, d: 95, h: 75, seats: 6,
    colors: [oak, walnut, ash],
    materials: [solidOak, solidWalnut, veneer],
    rooms: ["dining"],
    moods: ["natural", "warm", "luxurious"],
    styles: ["japandi", "ethiopian", "contemporary"],
    deliveryDays: 14, stock: 9, eco: true,
    description:
      "Seats six comfortably, eight when you squeeze. Chunky mortise-and-tenon legs, no screws you can see.",
  },
  {
    slug: "pello-chair",
    name: "The Pello Dining Chair",
    tagline: "Quiet curves, honest joinery.",
    kind: "chair",
    price: 210,
    w: 48, d: 52, h: 82, seats: 1,
    colors: [oak, walnut, ink],
    materials: [solidOak, solidWalnut],
    rooms: ["dining", "office", "reading"],
    moods: ["minimal", "natural", "calm"],
    styles: ["scandinavian", "japandi", "minimalist"],
    deliveryDays: 6, stock: 80, eco: true,
    description:
      "A steam-bent back rail and a woven paper-cord seat. Light enough to move with one finger.",
  },
  {
    slug: "luma-bed",
    name: "The Luma Bed",
    tagline: "Low, wide and ready for slow mornings.",
    kind: "bed",
    price: 1490,
    w: 190, d: 215, h: 95,
    colors: [oak, walnut, ivory, sage],
    materials: [linen, boucle, velvet],
    rooms: ["bedroom"],
    moods: ["calm", "cozy", "luxurious"],
    styles: ["japandi", "modern", "scandinavian"],
    deliveryDays: 12, stock: 11, eco: true,
    description:
      "An upholstered headboard that hugs the pillows, on a low platform base. Fits a 160 x 200 cm mattress.",
  },
  {
    slug: "nell-nightstand",
    name: "The Nell Nightstand",
    tagline: "Just enough storage, nothing more.",
    kind: "nightstand",
    price: 260,
    w: 45, d: 38, h: 50,
    colors: [oak, walnut, clay],
    materials: [solidOak, veneer],
    rooms: ["bedroom"],
    moods: ["minimal", "cozy"],
    styles: ["scandinavian", "minimalist", "mid-century"],
    deliveryDays: 5, stock: 55, eco: true,
    description: "One soft-close drawer and an open shelf. Pairs happily with the Luma Bed.",
  },
  {
    slug: "tola-wardrobe",
    name: "The Tola Wardrobe",
    tagline: "Hide everything. Beautifully.",
    kind: "wardrobe",
    price: 1120,
    w: 150, d: 58, h: 210,
    colors: [oak, ash, ink],
    materials: [veneer, solidOak],
    rooms: ["bedroom"],
    moods: ["minimal", "calm"],
    styles: ["minimalist", "modern", "scandinavian"],
    deliveryDays: 16, stock: 7, eco: false,
    description: "Fluted doors, felt-lined drawers and an adjustable interior. Ships flat-packed with an install crew option.",
  },
  {
    slug: "veda-tv-stand",
    name: "The Veda Media Console",
    tagline: "Low profile, high order.",
    kind: "tvStand",
    price: 780,
    w: 180, d: 40, h: 48,
    colors: [walnut, oak, charcoal],
    materials: [solidWalnut, solidOak, veneer],
    rooms: ["living", "studio"],
    moods: ["minimal", "luxurious", "warm"],
    styles: ["mid-century", "modern", "contemporary"],
    deliveryDays: 9, stock: 18, eco: false,
    description: "Slatted doors hide the cables and let the remote through. Ready for a 65 inch screen.",
  },
  {
    slug: "sela-shelf",
    name: "The Sela Open Shelf",
    tagline: "Books, plants, and breathing room.",
    kind: "shelf",
    price: 590,
    w: 100, d: 36, h: 180,
    colors: [oak, charcoal, ash],
    materials: [solidOak, veneer],
    rooms: ["living", "office", "reading", "studio"],
    moods: ["creative", "natural", "minimal"],
    styles: ["industrial", "scandinavian", "japandi"],
    deliveryDays: 8, stock: 26, eco: true,
    description: "Five adjustable shelves held by a slim frame. It looks lighter than it is — it carries 25 kg per shelf.",
  },
  {
    slug: "ember-floor-lamp",
    name: "The Ember Floor Lamp",
    tagline: "Light that feels like late afternoon.",
    kind: "floorLamp",
    price: 240,
    w: 38, d: 38, h: 165,
    colors: [clay, ivory, charcoal],
    materials: [linen, { name: "Rice paper", note: "Diffuses warm, even light.", priceDelta: -20 }],
    rooms: ["living", "bedroom", "reading", "studio"],
    moods: ["warm", "cozy", "calm"],
    styles: ["japandi", "mid-century", "contemporary"],
    deliveryDays: 4, stock: 60, eco: true,
    description: "A hand-rolled shade over a slim brass stem. Dimmable, warm 2200K bulb included.",
  },
  {
    slug: "dune-rug",
    name: "The Dune Rug",
    tagline: "A landscape for your feet.",
    kind: "rug",
    price: 460,
    w: 240, d: 170, h: 2,
    colors: [sand, ivory, clay, sage],
    materials: [wool, jute],
    rooms: ["living", "bedroom", "studio", "dining"],
    moods: ["warm", "natural", "cozy"],
    styles: ["ethiopian", "japandi", "scandinavian"],
    deliveryDays: 7, stock: 33, eco: true,
    description: "Hand-knotted by weaver cooperatives with a subtle ribbed texture that catches light like sand.",
  },
  {
    slug: "atlas-desk",
    name: "The Atlas Desk",
    tagline: "A calm place to do hard things.",
    kind: "desk",
    price: 830,
    w: 140, d: 70, h: 74,
    colors: [oak, walnut, ink],
    materials: [solidOak, solidWalnut, veneer],
    rooms: ["office", "studio"],
    moods: ["minimal", "creative", "calm"],
    styles: ["minimalist", "industrial", "scandinavian"],
    deliveryDays: 9, stock: 19, eco: true,
    description: "A broad top with a hidden cable tray and a modesty panel. Built to be leaned on.",
  },
];

// ---------- the lookups the rest of the app uses ----------

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const byRoom = (r: Room) => products.filter((p) => p.rooms.includes(r));
export const byMood = (m: Mood) => products.filter((p) => p.moods.includes(m));

export function priceFor(p: Product, materialName?: string): number {
  const m = p.materials.find((x) => x.name === materialName);
  return p.price + (m?.priceDelta ?? 0);
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const roomLabels: Record<Room, string> = {
  living: "Living Room",
  bedroom: "Bedroom",
  dining: "Dining Room",
  office: "Home Office",
  studio: "Studio Apartment",
  reading: "Reading Room",
  outdoor: "Outdoor Space",
};

export const moodMeta: Record<Mood, { line: string; hex: string }> = {
  calm: { line: "Soft light, low contrast, a deep breath.", hex: "#C9D1C2" },
  warm: { line: "Wood, linen and the glow of a lamp.", hex: "#E3B592" },
  bold: { line: "Strong shapes with something to say.", hex: "#B76E50" },
  cozy: { line: "Deep seats and things you sink into.", hex: "#D8C9B3" },
  minimal: { line: "Nothing extra. Everything considered.", hex: "#EDE6D6" },
  luxurious: { line: "Rich materials and quiet confidence.", hex: "#8A6A4B" },
  natural: { line: "Raw timber, plant fibre, honest texture.", hex: "#A9B38F" },
  creative: { line: "Flexible pieces for people who make things.", hex: "#E6A77F" },
};

export const styleLabels: Record<Style, string> = {
  scandinavian: "Scandinavian",
  minimalist: "Minimalist",
  modern: "Modern",
  industrial: "Industrial",
  japandi: "Japandi",
  "mid-century": "Mid-century",
  contemporary: "Contemporary",
  ethiopian: "Ethiopian-inspired",
};

export const collections = [
  {
    slug: "slow-morning",
    title: "The Slow Morning Collection",
    blurb: "Furniture designed for peaceful mornings.",
    items: ["luma-bed", "nell-nightstand", "ember-floor-lamp", "dune-rug"],
  },
  {
    slug: "small-space",
    title: "Small Space, Big Energy",
    blurb: "Furniture for compact spaces.",
    items: ["tegu-loveseat", "kora-coffee-table", "sela-shelf", "pello-chair"],
  },
  {
    slug: "empty-space",
    title: "The Art of Empty Space",
    blurb: "Minimal furniture for people who appreciate simplicity.",
    items: ["tola-wardrobe", "atlas-desk", "veda-tv-stand", "pello-chair"],
  },
  {
    slug: "warm-materials",
    title: "Warm Materials",
    blurb: "Wood, linen, soft textures and warm lighting.",
    items: ["solen-sofa", "aden-dining-table", "ember-floor-lamp", "dune-rug"],
  },
];
