export type Product = {
  id: string
  name: string
  category: 'footwear' | 'backpacks' | 'clothing' | 'accessories'
  price: number
  originalPrice?: number
  badge?: 'Sale' | 'New' | 'Best Seller'
  description: string
  images: string[]
  sizes: string[]
  colors: string[]
}

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const products: Product[] = [
  // ─── FOOTWEAR ────────────────────────────────────────────────────────────────
  {
    id: 'trail-runner-pro',
    name: 'Trail Runner Pro',
    category: 'footwear',
    price: 139,
    badge: 'Best Seller',
    description:
      'Lightweight and responsive trail runner engineered for technical terrain. Vibram outsole provides superior grip on wet rock and loose dirt. Zero-drop platform promotes natural foot strike.',
    images: [
      '/images/products/footwear_nano.png',
      u('1711466084162-a2d716817c81'),
      u('1580058572462-98e2c0e0e2f0'),
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['Forest Green', 'Slate Grey', 'Rust Orange'],
  },
  {
    id: 'alpine-boot-gtx',
    name: 'Alpine Boot GTX',
    category: 'footwear',
    price: 229,
    originalPrice: 279,
    badge: 'Sale',
    description:
      'Full-grain leather mountaineering boot with GORE-TEX lining. Crampon-compatible welt, ankle stabilisation system, and a stiff midsole rated for mixed alpine routes.',
    images: [
      '/images/products/alpine_boot_nano.png',
      u('1648027286072-fb339b0d0c06'),
      u('1663000126027-489944d0086b'),
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Brown', 'Black'],
  },
  {
    id: 'summit-sandal',
    name: 'Summit Camp Sandal',
    category: 'footwear',
    price: 79,
    badge: 'New',
    description:
      'Cushioned recovery sandal built for camp comfort and river crossings. EVA footbed, adjustable webbing straps, and a grippy rubber outsole that handles wet surfaces.',
    images: [
      u('1631287381310-925554130169'),
      u('1575987116913-e96e7d490b8a'),
      u('1559506026-181ed433f0b0'),
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Tan', 'Dark Brown', 'Black'],
  },
  {
    id: 'approach-shoe-x',
    name: 'Approach Shoe X',
    category: 'footwear',
    price: 159,
    description:
      'Half shoe, half climbing slipper. Sticky rubber toe for technical footwork on scrambles and multi-pitch approaches, with enough cushioning for long walk-ins.',
    images: [
      u('1698763954905-c9b24f40134f'),
      u('1711466093648-1adfe1664678'),
      u('1582898967731-b5834427fd66'),
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Olive', 'Charcoal'],
  },
  {
    id: 'waterproof-mid-hiker',
    name: 'Waterproof Mid Hiker',
    category: 'footwear',
    price: 189,
    badge: 'Best Seller',
    description:
      'Ankle-height hiking boot with waterproof membrane and a supportive nylon shank. Lug outsole sheds mud efficiently on wet trail days.',
    images: [
      u('1635924210685-d1e81cad5fb8'),
      u('1498082352534-00214cbeb658'),
      u('1517519610343-021766b185c1'),
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['Dark Brown', 'Forest Green', 'Grey'],
  },
  {
    id: 'winter-mountaineering-boot',
    name: 'Winter Mountaineering Boot',
    category: 'footwear',
    price: 349,
    originalPrice: 419,
    badge: 'Sale',
    description:
      'Double-layered insulated boot rated to -40 °C. Rigid sole compatible with step-in crampons. Ideal for ice climbing and high-altitude winter expeditions.',
    images: [
      u('1600100315760-ac46b65f6fdd'),
      u('1606036525923-525fa3b35465'),
      u('1617179395455-101d786b4b7d'),
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'Dark Grey'],
  },
  {
    id: 'minimalist-trail-trainer',
    name: 'Minimalist Trail Trainer',
    category: 'footwear',
    price: 109,
    badge: 'New',
    description:
      'Ground-feel barefoot runner with a 4 mm drop and wide toe box. Encourages natural running mechanics on groomed trails and compacted dirt paths.',
    images: [
      u('1739132268693-8ba353f0959c'),
      u('1739132268718-53d64165d29a'),
      u('1724280985069-1f7ba60ab80d'),
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['Forest Green', 'Rust Orange', 'Black'],
  },
  {
    id: 'lightweight-approach-sandal',
    name: 'Lightweight Approach Sandal',
    category: 'footwear',
    price: 95,
    description:
      'Open-toe sandal with a lugged trail outsole and quick-dry straps. Transitions effortlessly from canyon hikes to creek wading — no sock needed.',
    images: [
      u('1645238426817-8c3e7d1396cf'),
      u('1739138053507-0f312a938451'),
      u('1530792271526-7ddf516473b3'),
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Tan', 'Slate Grey'],
  },

  // ─── BACKPACKS ────────────────────────────────────────────────────────────────
  {
    id: 'daypack-28l',
    name: '28L Trail Daypack',
    category: 'backpacks',
    price: 119,
    badge: 'Best Seller',
    description:
      'Streamlined 28 L daypack with hydration sleeve, trekking pole loops, and a ventilated trampoline back panel. The go-to for long day hikes and overnights.',
    images: [
      '/images/products/backpacks_nano.png',
      u('1622260614153-03223fb72052'),
      u('1565076633790-b0deb5d527c7'),
    ],
    sizes: ['One Size'],
    colors: ['Forest Green', 'Slate', 'Black'],
  },
  {
    id: 'expedition-55l',
    name: '55L Expedition Pack',
    category: 'backpacks',
    price: 269,
    originalPrice: 319,
    badge: 'Sale',
    description:
      'Multi-day pack with load-transfer hip belt, sleeping bag compartment, and included rain cover. Adjustable torso length fits a wide range of body types.',
    images: [
      '/images/products/expedition_55l_nano.png',
      u('1501555088652-021faa106b9b'),
      u('1586022045497-31fcf76fa6cc'),
    ],
    sizes: ['S/M', 'M/L'],
    colors: ['Deep Navy', 'Burnt Orange', 'Olive'],
  },
  {
    id: 'trail-hip-pack',
    name: 'Trail Hip Pack 5L',
    category: 'backpacks',
    price: 59,
    badge: 'New',
    description:
      'Ultra-light 5 L hip pack for fast-and-light days. Carries your phone, snacks, and a soft flask without slowing you down on technical terrain.',
    images: [
      u('1570630358718-4fb324824b3d'),
      u('1476979735039-2fdea9e9e407'),
      u('1509762774605-f07235a08f1f'),
    ],
    sizes: ['One Size'],
    colors: ['Tan', 'Black', 'Forest Green'],
  },
  {
    id: 'hydration-vest-12l',
    name: 'Race Hydration Vest 12L',
    category: 'backpacks',
    price: 149,
    description:
      'Low-profile 12 L race vest with two included 500 ml soft flasks. Bouncy-free fit system, front pockets for nutrition, and a breathable mesh back.',
    images: [
      u('1622260614927-208cfe3f5cfd'),
      u('1499803270242-467f7311582d'),
      u('1537430802614-118bf14be50c'),
    ],
    sizes: ['XS/S', 'M/L', 'XL'],
    colors: ['Black', 'Cobalt'],
  },
  {
    id: 'technical-daypack-15l',
    name: 'Technical Daypack 15L',
    category: 'backpacks',
    price: 89,
    badge: 'New',
    description:
      'Minimalist 15 L pack designed for via ferrata and scrambling. Low-profile harness, ice-axe loop, and a helmet-carry bungee on the lid.',
    images: [
      u('1602845860431-35374f24f48d'),
      u('1586022045076-aee0a185180b'),
      u('1622260614153-03223fb72052'),
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Forest Green'],
  },
  {
    id: 'alpine-hauler-75l',
    name: 'Alpine Hauler 75L',
    category: 'backpacks',
    price: 329,
    description:
      'Bomber 75 L expedition pack for base-camp-style trips. External crampon pouch, ice-axe holder, and a full front-panel zip for easy access at camp.',
    images: [
      u('1678084559483-65e6ba4d9aba'),
      u('1501555088652-021faa106b9b'),
      u('1565076633790-b0deb5d527c7'),
    ],
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Burnt Orange', 'Black', 'Forest Green'],
  },
  {
    id: 'ultralight-38l',
    name: 'Ultralight 38L Frameless',
    category: 'backpacks',
    price: 179,
    badge: 'Best Seller',
    description:
      'Cuben fibre frameless pack weighing just 485 g. Built for thru-hikers who count every gram. Roll-top closure and side bottle pockets.',
    images: [
      u('1592388748465-8c4dca8dd703'),
      u('1570630358718-4fb324824b3d'),
      u('1586022045497-31fcf76fa6cc'),
    ],
    sizes: ['One Size'],
    colors: ['Tan', 'Grey', 'Black'],
  },
  {
    id: 'camera-hiking-pack',
    name: 'Photo Trekker 30L',
    category: 'backpacks',
    price: 199,
    originalPrice: 239,
    badge: 'Sale',
    description:
      'Hybrid camera-hiking pack with padded DSLR compartment, side-access panel, and a full hiking harness. Fits a full mirrorless kit plus two days of gear.',
    images: [
      u('1476979735039-2fdea9e9e407'),
      u('1622260614927-208cfe3f5cfd'),
      u('1509762774605-f07235a08f1f'),
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Slate Grey'],
  },

  // ─── CLOTHING ────────────────────────────────────────────────────────────────
  {
    id: 'shell-jacket',
    name: 'Waterproof Shell Jacket',
    category: 'clothing',
    price: 299,
    badge: 'Best Seller',
    description:
      '3-layer GORE-TEX shell that packs into its own chest pocket. Helmet-compatible hood, pit-zip vents, and fully taped seams for all-day storm protection.',
    images: [
      '/images/products/clothing_nano.png',
      u('1511788723729-43239f0caac8'),
      u('1641126325964-8d32008f65e2'),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Forest Green', 'Crimson', 'Slate Grey', 'Black'],
  },
  {
    id: 'merino-base-layer',
    name: 'Merino Base Layer LS',
    category: 'clothing',
    price: 99,
    description:
      '18.5-micron Merino wool long-sleeve. Naturally odour-resistant and temperature-regulating — wear it for multiple days between washes without complaint.',
    images: [
      u('1550807413-bfd05e7247bc'),
      u('1603920351464-8f79cb4e5dcc'),
      u('1547037808-df066106fae5'),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Natural', 'Dark Brown', 'Charcoal'],
  },
  {
    id: 'convertible-pants',
    name: 'Convertible Trekking Pants',
    category: 'clothing',
    price: 79,
    originalPrice: 99,
    badge: 'Sale',
    description:
      'Zip-off pants that convert to shorts in seconds. DWR-coated nylon with articulated knees, a gusseted crotch, and six pockets — two of them zipped.',
    images: [
      u('1638648388743-6108e2720489'),
      u('1615143277496-f7fb0b1878d8'),
      u('1604928106847-96c6f306b722'),
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Khaki', 'Olive', 'Dark Grey'],
  },
  {
    id: 'grid-fleece-midlayer',
    name: 'Grid Fleece Mid-layer',
    category: 'clothing',
    price: 119,
    badge: 'New',
    description:
      'Lightweight grid-pattern Polartec® fleece that traps warmth while remaining highly breathable. Pairs over a base layer or under a shell in variable conditions.',
    images: [
      u('1627348237251-5d364153e1ad'),
      u('1480358074177-c2f76f7e00d3'),
      u('1537516093910-f668ca5dd2f8'),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Forest Green', 'Navy', 'Tan'],
  },
  {
    id: 'down-puffer-jacket',
    name: 'Down Puffer Jacket 800-fill',
    category: 'clothing',
    price: 249,
    description:
      '800-fill-power goose down jacket that packs to fist-size. Hydrophobic down treatment maintains loft even in damp conditions at altitude.',
    images: [
      '/images/products/puffer_jacket_nano.png',
      u('1601699165318-9bcb571c72d7'),
      u('1511788723729-43239f0caac8'),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Deep Navy', 'Crimson'],
  },
  {
    id: 'sun-hoody',
    name: 'UPF 50+ Sun Hoody',
    category: 'clothing',
    price: 69,
    badge: 'New',
    description:
      'Lightweight UPF 50+ hoody with a face-protecting brim and thumbholes. Built from moisture-wicking polyester that dries in under 30 minutes.',
    images: [
      u('1722620602400-49bf975b658c'),
      u('1668240669760-888b27095eb0'),
      u('1706658095981-743c14be568c'),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Natural', 'Slate Grey', 'Forest Green'],
  },
  {
    id: 'hiking-shorts',
    name: 'Trekking Shorts 7"',
    category: 'clothing',
    price: 59,
    originalPrice: 79,
    badge: 'Sale',
    description:
      '7-inch inseam shorts with a built-in liner, four zippered pockets, and a DWR finish that repels light rain. Articulated for unrestricted stride.',
    images: [
      u('1722620602389-1906fe23959d'),
      u('1668240669517-040f41a4bcf0'),
      u('1722620602115-26ca46f01a35'),
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Khaki', 'Olive', 'Charcoal'],
  },
  {
    id: 'softshell-jacket',
    name: 'Alpine Softshell Jacket',
    category: 'clothing',
    price: 189,
    badge: 'Best Seller',
    description:
      'Four-way stretch softshell with a DWR coating and fleece backer. Wind-resistant to 50 km/h, warm enough for shoulder-season mountain use, quiet enough for stalking wildlife.',
    images: [
      u('1641126325964-8d32008f65e2'),
      u('1638648388743-6108e2720489'),
      u('1601784078932-3df91e0b3c7d'),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Forest Green', 'Black', 'Slate Grey'],
  },

  // ─── ACCESSORIES ─────────────────────────────────────────────────────────────
  {
    id: 'carbon-trekking-poles',
    name: 'Carbon Trekking Poles',
    category: 'accessories',
    price: 169,
    badge: 'Best Seller',
    description:
      'Ultra-light 3-section carbon poles with cork grips and flip-lock adjustment. Folds to 60 cm for pack attachment. Tungsten tip and baskets included.',
    images: [
      u('1698521633875-662175c1654b'),
      u('1768574004241-48de72ad75ae'),
      u('1662109141645-55e2c004acff'),
    ],
    sizes: ['One Size'],
    colors: ['Graphite', 'Forest Green'],
  },
  {
    id: 'headlamp-1000',
    name: '1000 Lumen Headlamp',
    category: 'accessories',
    price: 69,
    description:
      '1000-lumen rechargeable headlamp with red-light preservation mode, zoom-beam focus, and 120-hour runtime on low. IPX8 waterproof rated.',
    images: [
      u('1593739742226-5e5e2fdb1f1c'),
      u('1635745488837-ffa006eaf9cf'),
      u('1690821934843-64806644c1d7'),
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Red'],
  },
  {
    id: 'titanium-bottle',
    name: '1L Titanium Bottle',
    category: 'accessories',
    price: 49,
    badge: 'New',
    description:
      'Single-wall titanium water bottle at just 110 g. Food-safe, BPA-free, and can be used directly over a camp stove. Will outlast everything else in your kit.',
    images: [
      '/images/products/titanium_bottle_nano.png',
      u('1619035226152-81e29823b8d9'),
      u('1596055746427-d5f61aa5df99'),
    ],
    sizes: ['750ml', '1L'],
    colors: ['Titanium Natural'],
  },
  {
    id: 'trail-gaiters',
    name: 'Trail Gaiters',
    category: 'accessories',
    price: 39,
    originalPrice: 55,
    badge: 'Sale',
    description:
      'Low-profile gaiters that block debris, mud, and snow from entering your footwear. Instep strap and hook system fits most trail shoes and boots.',
    images: [
      u('1485809052957-5113b0ff51af'),
      u('1493244040629-496f6d136cc4'),
      u('1570512431473-7345c8dbfa4c'),
    ],
    sizes: ['S/M', 'L/XL'],
    colors: ['Black', 'Olive'],
  },
  {
    id: 'gps-watch',
    name: 'Summit GPS Watch',
    category: 'accessories',
    price: 399,
    badge: 'New',
    description:
      'Rugged GPS watch with topographic maps, barometric altimeter, and 60-hour battery in GPS mode. Multi-GNSS support for accurate tracking in deep valleys.',
    images: [
      '/images/products/accessories_nano.png',
      u('1596055747042-731a269d208f'),
      u('1414016642750-7fdd78dc33d9'),
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Slate Grey', 'Forest Green'],
  },
  {
    id: 'dry-bag-set',
    name: 'Dry Bag Set (5L / 10L / 20L)',
    category: 'accessories',
    price: 59,
    description:
      'Set of three roll-top dry bags in 5, 10, and 20 L sizes. 210D ripstop nylon with welded seams rated to 3 m submersion. Colour-coded for quick organisation.',
    images: [
      u('1761846786593-80de9fe31ce3'),
      u('1768145488790-185e20abfd08'),
      u('1602079108581-4c5071154299'),
    ],
    sizes: ['Set of 3'],
    colors: ['Orange / Yellow / Blue', 'Black / Grey / Red'],
  },
  {
    id: 'merino-buff',
    name: 'Merino Neck Gaiter',
    category: 'accessories',
    price: 35,
    badge: 'New',
    description:
      'Seamless Merino wool neck gaiter that works as a balaclava, beanie, or face mask. 18.5-micron fibre stays itch-free in direct contact with skin.',
    images: [
      u('1619035226152-81e29823b8d9'),
      u('1596055746427-d5f61aa5df99'),
      u('1485809052957-5113b0ff51af'),
    ],
    sizes: ['One Size'],
    colors: ['Natural', 'Charcoal', 'Forest Green'],
  },
  {
    id: 'packable-sun-hat',
    name: 'Packable Sun Hat',
    category: 'accessories',
    price: 45,
    description:
      'Wide-brim UPF 50+ sun hat that crushes flat and bounces back into shape. Adjustable chin strap for windy ridgelines. Wicking sweatband inside.',
    images: [
      u('1570512431473-7345c8dbfa4c'),
      u('1596055747042-731a269d208f'),
      u('1493244040629-496f6d136cc4'),
    ],
    sizes: ['S/M', 'L/XL'],
    colors: ['Tan', 'Olive', 'Charcoal'],
  },
]

export const categories = [
  {
    id: 'footwear',
    label: 'Footwear',
    image: '/images/products/footwear_nano.png',
  },
  {
    id: 'backpacks',
    label: 'Backpacks',
    image: '/images/products/backpacks_nano.png',
  },
  {
    id: 'clothing',
    label: 'Clothing',
    image: '/images/products/clothing_nano.png',
  },
  {
    id: 'accessories',
    label: 'Accessories',
    image: '/images/products/accessories_nano.png',
  },
] as const
