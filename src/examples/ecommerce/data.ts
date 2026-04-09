export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ProductBadge = 'bestseller' | 'new' | 'sale' | null
export type Category = 'Headphones' | 'Keyboards' | 'Monitors'

export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  stock: StockStatus
  badge: ProductBadge
  description: string
  specs: { label: string; value: string }[]
  reviews: Review[]
  relatedIds: string[]
}

export const products: Product[] = [
  {
    id: 'wh-1000xm5',
    name: 'WH-1000XM5',
    brand: 'Sony',
    category: 'Headphones',
    price: 279,
    originalPrice: 349,
    rating: 4.8,
    reviewCount: 2341,
    stock: 'in_stock',
    badge: 'sale',
    description:
      'Industry-leading noise cancellation with two processors and eight microphones. Up to 30 hours of battery life with quick charging support and a lightweight, foldable design.',
    specs: [
      { label: 'Driver size', value: '30mm' },
      { label: 'Frequency response', value: '4 Hz – 40,000 Hz' },
      { label: 'Battery life', value: '30 hrs (ANC on)' },
      { label: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm' },
      { label: 'Weight', value: '250 g' },
      { label: 'Noise cancellation', value: 'Active (dual processor)' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Alex M.',
        rating: 5,
        comment: 'Best ANC headphones I\'ve ever owned. The noise cancellation is absolutely incredible for flights.',
        date: 'Mar 18, 2025',
      },
      {
        id: 'r2',
        author: 'Priya K.',
        rating: 5,
        comment: 'Sound quality is phenomenal. Worth every penny, especially at this sale price.',
        date: 'Feb 4, 2025',
      },
      {
        id: 'r3',
        author: 'Jordan T.',
        rating: 4,
        comment: 'Excellent headphones. Slightly less comfortable than the XM4 for extended sessions but the ANC upgrade is noticeable.',
        date: 'Jan 22, 2025',
      },
    ],
    relatedIds: ['bose-qc45', 'ath-m50x'],
  },
  {
    id: 'bose-qc45',
    name: 'QuietComfort 45',
    brand: 'Bose',
    category: 'Headphones',
    price: 329,
    rating: 4.6,
    reviewCount: 1872,
    stock: 'low_stock',
    badge: 'bestseller',
    description:
      'Signature Bose sound with TriPort acoustic architecture and high-fidelity audio. Adjustable EQ modes let you switch between full noise cancellation and Aware mode.',
    specs: [
      { label: 'Driver size', value: '40mm' },
      { label: 'Frequency response', value: '20 Hz – 20,000 Hz' },
      { label: 'Battery life', value: '24 hrs (ANC on)' },
      { label: 'Connectivity', value: 'Bluetooth 5.1, 3.5mm' },
      { label: 'Weight', value: '238 g' },
      { label: 'Noise cancellation', value: 'Active (Quiet & Aware modes)' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Sam R.',
        rating: 5,
        comment: 'Bose sound signature is unmatched. These are incredibly comfortable for all-day wear.',
        date: 'Mar 5, 2025',
      },
      {
        id: 'r2',
        author: 'Mei L.',
        rating: 4,
        comment: 'Great comfort and good ANC. The Sony XM5 has slightly better noise cancellation but these win on comfort.',
        date: 'Feb 14, 2025',
      },
    ],
    relatedIds: ['wh-1000xm5', 'ath-m50x'],
  },
  {
    id: 'ath-m50x',
    name: 'ATH-M50x',
    brand: 'Audio-Technica',
    category: 'Headphones',
    price: 149,
    rating: 4.7,
    reviewCount: 5621,
    stock: 'out_of_stock',
    badge: null,
    description:
      'Professional studio monitor headphones with exceptional clarity across the full frequency range. Collapsible design, detachable cables, and 90° swiveling earcups for one-ear monitoring.',
    specs: [
      { label: 'Driver size', value: '45mm' },
      { label: 'Frequency response', value: '15 Hz – 28,000 Hz' },
      { label: 'Impedance', value: '38 Ω' },
      { label: 'Connectivity', value: '3.5mm (detachable)' },
      { label: 'Weight', value: '285 g' },
      { label: 'Type', value: 'Closed-back, wired' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Chris D.',
        rating: 5,
        comment: 'Studio standard for a reason. Flat response is perfect for mixing. These never leave my desk.',
        date: 'Jan 30, 2025',
      },
      {
        id: 'r2',
        author: 'Nadia V.',
        rating: 4,
        comment: 'Excellent for the price. The clamping force is a bit strong at first but loosens up after a few weeks.',
        date: 'Dec 10, 2024',
      },
    ],
    relatedIds: ['wh-1000xm5', 'bose-qc45'],
  },
  {
    id: 'mx-keys-s',
    name: 'MX Keys S',
    brand: 'Logitech',
    category: 'Keyboards',
    price: 109,
    originalPrice: 129,
    rating: 4.5,
    reviewCount: 3104,
    stock: 'in_stock',
    badge: 'sale',
    description:
      'Advanced wireless keyboard with smart backlighting that adjusts to your ambient light. Spherically dished keys perfectly match your fingertips for a satisfying, precise typing experience.',
    specs: [
      { label: 'Switch type', value: 'Scissor (low-profile)' },
      { label: 'Connectivity', value: 'Bluetooth 5, USB receiver' },
      { label: 'Battery life', value: 'Up to 10 days (backlit)' },
      { label: 'Multi-device', value: 'Up to 3 devices' },
      { label: 'Backlight', value: 'Smart adaptive' },
      { label: 'Layout', value: 'Full-size, US ANSI' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Tom W.',
        rating: 5,
        comment: 'Best typing experience on a wireless keyboard. The key feel is incredibly satisfying and it pairs across 3 devices seamlessly.',
        date: 'Mar 22, 2025',
      },
      {
        id: 'r2',
        author: 'Aisha B.',
        rating: 4,
        comment: 'Great keyboard for the price. The smart backlighting is a nice touch. Wish the battery lasted longer.',
        date: 'Feb 27, 2025',
      },
    ],
    relatedIds: ['keychron-q1', 'ducky-one-3'],
  },
  {
    id: 'keychron-q1',
    name: 'Q1 Pro',
    brand: 'Keychron',
    category: 'Keyboards',
    price: 199,
    rating: 4.9,
    reviewCount: 1487,
    stock: 'low_stock',
    badge: 'new',
    description:
      'Fully customizable wireless mechanical keyboard with a solid aluminum body. Hot-swappable Gateron G Pro switches, QMK/VIA support, and a gasket-mounted plate for premium typing sound.',
    specs: [
      { label: 'Switch type', value: 'Gateron G Pro Red (hot-swap)' },
      { label: 'Connectivity', value: 'Bluetooth 5.1, USB-C' },
      { label: 'Battery life', value: 'Up to 4000 mAh' },
      { label: 'Body material', value: 'CNC aluminum' },
      { label: 'Firmware', value: 'QMK / VIA' },
      { label: 'Layout', value: '75%, US ANSI' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Ryan H.',
        rating: 5,
        comment: 'This is my endgame keyboard. The thock is real and QMK support is a game-changer for customization.',
        date: 'Mar 30, 2025',
      },
      {
        id: 'r2',
        author: 'Fatima N.',
        rating: 5,
        comment: 'Premium feel in every way. The aluminum body makes it feel like a $400 board. Stock switches are great too.',
        date: 'Mar 1, 2025',
      },
    ],
    relatedIds: ['mx-keys-s', 'ducky-one-3'],
  },
  {
    id: 'ducky-one-3',
    name: 'One 3 TKL',
    brand: 'Ducky',
    category: 'Keyboards',
    price: 109,
    rating: 4.6,
    reviewCount: 892,
    stock: 'in_stock',
    badge: null,
    description:
      'Tenkeyless mechanical keyboard with hot-swappable PCB, per-key RGB, and triple-layer sound dampening foam. Compatible with MX-style switches and PBT double-shot keycaps.',
    specs: [
      { label: 'Switch type', value: 'Cherry MX Red (hot-swap)' },
      { label: 'Connectivity', value: 'USB-C (detachable)' },
      { label: 'RGB', value: 'Per-key RGB' },
      { label: 'Keycaps', value: 'PBT double-shot' },
      { label: 'Sound foam', value: 'Triple-layer dampening' },
      { label: 'Layout', value: 'TKL, US ANSI' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Lena P.',
        rating: 5,
        comment: 'Incredible value. The typing sound is better than boards twice the price.',
        date: 'Feb 19, 2025',
      },
    ],
    relatedIds: ['keychron-q1', 'mx-keys-s'],
  },
  {
    id: 'lg-27gp850',
    name: '27GP850-B',
    brand: 'LG',
    category: 'Monitors',
    price: 349,
    originalPrice: 449,
    rating: 4.7,
    reviewCount: 2198,
    stock: 'in_stock',
    badge: 'sale',
    description:
      '27-inch QHD Nano IPS panel with 165Hz refresh rate and 1ms response time. G-Sync compatible with HDR400 support, ideal for competitive gaming and creative work.',
    specs: [
      { label: 'Panel', value: 'Nano IPS' },
      { label: 'Resolution', value: '2560 × 1440 (QHD)' },
      { label: 'Refresh rate', value: '165 Hz (OC to 180 Hz)' },
      { label: 'Response time', value: '1ms (GtG)' },
      { label: 'HDR', value: 'VESA DisplayHDR 400' },
      { label: 'Ports', value: 'HDMI 2.0 ×2, DP 1.4 ×1' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Kai S.',
        rating: 5,
        comment: 'Stunning colors for a gaming monitor. The Nano IPS makes a huge difference compared to regular IPS at this price.',
        date: 'Mar 14, 2025',
      },
      {
        id: 'r2',
        author: 'Olga M.',
        rating: 4,
        comment: 'Great monitor overall. Colors are vivid and the 165Hz is very smooth. The stand could be better.',
        date: 'Jan 29, 2025',
      },
    ],
    relatedIds: ['samsung-odyssey-g7', 'dell-u2723d'],
  },
  {
    id: 'samsung-odyssey-g7',
    name: 'Odyssey G7 27"',
    brand: 'Samsung',
    category: 'Monitors',
    price: 499,
    rating: 4.5,
    reviewCount: 1643,
    stock: 'in_stock',
    badge: 'bestseller',
    description:
      '27-inch curved QLED gaming monitor with 240Hz refresh rate and 1ms response time. 1000R curvature wraps around your field of view for an immersive gaming experience.',
    specs: [
      { label: 'Panel', value: 'VA (QLED)' },
      { label: 'Resolution', value: '2560 × 1440 (QHD)' },
      { label: 'Refresh rate', value: '240 Hz' },
      { label: 'Response time', value: '1ms (MPRT)' },
      { label: 'Curvature', value: '1000R' },
      { label: 'HDR', value: 'VESA DisplayHDR 600' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Marco R.',
        rating: 5,
        comment: 'The 240Hz curve is insane for FPS games. Colors pop and the curve feels natural, not gimmicky.',
        date: 'Mar 2, 2025',
      },
      {
        id: 'r2',
        author: 'Diane C.',
        rating: 4,
        comment: 'Excellent gaming monitor. VA panel has better contrast than IPS. Minor ghosting in very dark scenes.',
        date: 'Feb 8, 2025',
      },
    ],
    relatedIds: ['lg-27gp850', 'dell-u2723d'],
  },
  {
    id: 'dell-u2723d',
    name: 'UltraSharp U2723D',
    brand: 'Dell',
    category: 'Monitors',
    price: 589,
    rating: 4.8,
    reviewCount: 976,
    stock: 'low_stock',
    badge: 'new',
    description:
      '27-inch 4K IPS Black panel monitor with exceptional color accuracy (100% sRGB, 98% DCI-P3). Designed for creative professionals who demand precision.',
    specs: [
      { label: 'Panel', value: 'IPS Black' },
      { label: 'Resolution', value: '3840 × 2160 (4K UHD)' },
      { label: 'Refresh rate', value: '60 Hz' },
      { label: 'Color coverage', value: '100% sRGB, 98% DCI-P3' },
      { label: 'HDR', value: 'VESA DisplayHDR 400' },
      { label: 'Ports', value: 'Thunderbolt 4, USB-C, HDMI, DP' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Elena W.',
        rating: 5,
        comment: 'Perfect for photo and video editing. The color accuracy out of the box is incredible. Every designer needs this.',
        date: 'Mar 25, 2025',
      },
      {
        id: 'r2',
        author: 'James F.',
        rating: 5,
        comment: 'IPS Black panel is a revelation. The contrast ratio destroys regular IPS at this price range.',
        date: 'Mar 10, 2025',
      },
    ],
    relatedIds: ['lg-27gp850', 'samsung-odyssey-g7'],
  },
]

export const categories: Category[] = ['Headphones', 'Keyboards', 'Monitors']
