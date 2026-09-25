export interface WorldColor {
  name: string;
  hex: string;
  category: string;
  family: string;
}

export const WORLD_COLOR_FAMILIES = [
  'All',
  'Blacks & Greys',
  'Whites & Creams',
  'Browns & Earth',
  'Greens & Olives',
  'Blues & Navies',
  'Reds & Burgundies',
  'Pinks & Roses',
  'Purples & Lilacs',
  'Yellows & Oranges',
  'Neons & Accents',
] as const;

export type WorldColorFamily = (typeof WORLD_COLOR_FAMILIES)[number];

export const WORLD_COLORS: WorldColor[] = [
  // --- BLACKS & GREYS ---
  { name: 'Onyx Black', hex: '#111111', category: 'Black', family: 'Blacks & Greys' },
  { name: 'Obsidian', hex: '#0B0B0E', category: 'Black', family: 'Blacks & Greys' },
  { name: 'Jet Black', hex: '#0A0A0A', category: 'Black', family: 'Blacks & Greys' },
  { name: 'Pitch Black', hex: '#000000', category: 'Black', family: 'Blacks & Greys' },
  { name: 'Midnight Black', hex: '#1A1A24', category: 'Black', family: 'Blacks & Greys' },
  { name: 'Raven Black', hex: '#1C1B22', category: 'Black', family: 'Blacks & Greys' },
  { name: 'Washed Charcoal', hex: '#374151', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Anthracite', hex: '#293133', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Graphite', hex: '#383838', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Gunmetal', hex: '#2A3439', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Dark Slate Grey', hex: '#2F4F4F', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Slate Grey', hex: '#708090', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Ash Grey', hex: '#B2BEB5', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Heather Grey', hex: '#9E9E9E', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Cement Grey', hex: '#8B8C89', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Concrete', hex: '#D2D1CD', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Smoke Grey', hex: '#738276', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Pewter', hex: '#8A9A9A', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Silver Foil', hex: '#AFB1B4', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Light Silver', hex: '#D8D8D8', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Platinum', hex: '#E5E4E2', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Cool Grey', hex: '#8C92AC', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Warm Charcoal', hex: '#403B38', category: 'Grey', family: 'Blacks & Greys' },
  { name: 'Iron Grey', hex: '#52595D', category: 'Grey', family: 'Blacks & Greys' },

  // --- WHITES & CREAMS ---
  { name: 'Chalk White', hex: '#F3F4F6', category: 'White', family: 'Whites & Creams' },
  { name: 'Pure White', hex: '#FFFFFF', category: 'White', family: 'Whites & Creams' },
  { name: 'Optic White', hex: '#FAFAFA', category: 'White', family: 'Whites & Creams' },
  { name: 'Bone Cream', hex: '#EFEBD9', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Off White', hex: '#F8F8F0', category: 'White', family: 'Whites & Creams' },
  { name: 'Ivory', hex: '#FFFFF0', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Alabaster', hex: '#F2F0EB', category: 'White', family: 'Whites & Creams' },
  { name: 'Eggshell', hex: '#F0EAD6', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Linen', hex: '#FAF0E6', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Ecru', hex: '#C2B280', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Vanilla Cream', hex: '#F3E5AB', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Seashell', hex: '#FFF5EE', category: 'White', family: 'Whites & Creams' },
  { name: 'Pearl White', hex: '#F8F6F0', category: 'White', family: 'Whites & Creams' },
  { name: 'Oatmeal', hex: '#E3DAC9', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Parchment', hex: '#F1E9D2', category: 'Cream', family: 'Whites & Creams' },
  { name: 'Snow White', hex: '#FFFAFA', category: 'White', family: 'Whites & Creams' },
  { name: 'Antique White', hex: '#FAEBD7', category: 'Cream', family: 'Whites & Creams' },

  // --- BROWNS & EARTH ---
  { name: 'Mocha Brown', hex: '#3B2F2F', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Espresso', hex: '#2B1B17', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Dark Chocolate', hex: '#3D1C02', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Coffee Bean', hex: '#4A2C2A', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Chestnut', hex: '#954535', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Walnut', hex: '#773F1A', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Terracotta', hex: '#E2725B', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Rust', hex: '#B7410E', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Burnt Sienna', hex: '#E97451', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Raw Umber', hex: '#826644', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Cinnamon', hex: '#D2691E', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Caramel', hex: '#AF6E4D', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Camel', hex: '#C19A6B', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Tan Khaki', hex: '#D2B48C', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Desert Sand', hex: '#EDC9AF', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Warm Beige', hex: '#F5F5DC', category: 'Beige', family: 'Browns & Earth' },
  { name: 'Taupe', hex: '#483C32', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Mushroom Taupe', hex: '#B39F8D', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Bronze Brown', hex: '#CD7F32', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Copper Rust', hex: '#944732', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Khaki Stone', hex: '#BDB76B', category: 'Earth', family: 'Browns & Earth' },
  { name: 'Cognac', hex: '#9E472A', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Sepia', hex: '#704214', category: 'Brown', family: 'Browns & Earth' },
  { name: 'Hazelnut', hex: '#BDA589', category: 'Brown', family: 'Browns & Earth' },

  // --- GREENS & OLIVES ---
  { name: 'Vintage Olive', hex: '#4D5340', category: 'Green', family: 'Greens & Olives' },
  { name: 'Military Olive', hex: '#3B443B', category: 'Green', family: 'Greens & Olives' },
  { name: 'Army Green', hex: '#4B5320', category: 'Green', family: 'Greens & Olives' },
  { name: 'Olive Drab', hex: '#6B8E23', category: 'Green', family: 'Greens & Olives' },
  { name: 'Forest Moss', hex: '#2E473B', category: 'Green', family: 'Greens & Olives' },
  { name: 'Hunter Green', hex: '#355E3B', category: 'Green', family: 'Greens & Olives' },
  { name: 'Pine Forest', hex: '#01796F', category: 'Green', family: 'Greens & Olives' },
  { name: 'Deep Cypress', hex: '#1C3B2B', category: 'Green', family: 'Greens & Olives' },
  { name: 'Emerald Green', hex: '#50C878', category: 'Green', family: 'Greens & Olives' },
  { name: 'Jade Green', hex: '#00A86B', category: 'Green', family: 'Greens & Olives' },
  { name: 'Sage Green', hex: '#9DC183', category: 'Green', family: 'Greens & Olives' },
  { name: 'Dusty Sage', hex: '#7A9A7E', category: 'Green', family: 'Greens & Olives' },
  { name: 'Eucalyptus', hex: '#5F8575', category: 'Green', family: 'Greens & Olives' },
  { name: 'Matcha Green', hex: '#8F9779', category: 'Green', family: 'Greens & Olives' },
  { name: 'Mint Green', hex: '#98FF98', category: 'Green', family: 'Greens & Olives' },
  { name: 'Seafoam Green', hex: '#9FE2BF', category: 'Green', family: 'Greens & Olives' },
  { name: 'Pistachio', hex: '#93C572', category: 'Green', family: 'Greens & Olives' },
  { name: 'Basil Green', hex: '#5E7D52', category: 'Green', family: 'Greens & Olives' },
  { name: 'Kelly Green', hex: '#4CBB17', category: 'Green', family: 'Greens & Olives' },
  { name: 'Jungle Green', hex: '#29AB87', category: 'Green', family: 'Greens & Olives' },
  { name: 'Chartreuse', hex: '#7FFF00', category: 'Green', family: 'Greens & Olives' },
  { name: 'Lime Green', hex: '#32CD32', category: 'Green', family: 'Greens & Olives' },
  { name: 'Olive Leaf', hex: '#716F42', category: 'Green', family: 'Greens & Olives' },
  { name: 'Dark Teal Green', hex: '#004953', category: 'Green', family: 'Greens & Olives' },

  // --- BLUES & NAVIES ---
  { name: 'Cobalt Blue', hex: '#1E40AF', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Midnight Navy', hex: '#0A192F', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Deep Space Navy', hex: '#0B132B', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Royal Navy', hex: '#002366', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Classic Navy', hex: '#1B263B', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Sapphire Blue', hex: '#0F52BA', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Royal Blue', hex: '#4169E1', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Electric Indigo', hex: '#4B0082', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Raw Indigo', hex: '#264369', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Washed Denim', hex: '#5D7999', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Ocean Blue', hex: '#0077BE', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Aegean Blue', hex: '#4E6E81', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Cerulean', hex: '#007BA7', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Steel Blue', hex: '#4682B4', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Deep Teal', hex: '#005F73', category: 'Teal', family: 'Blues & Navies' },
  { name: 'Dark Cyan', hex: '#008B8B', category: 'Cyan', family: 'Blues & Navies' },
  { name: 'Turquoise', hex: '#40E0D0', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Sky Blue', hex: '#87CEEB', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Baby Blue', hex: '#89CFF0', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Powder Blue', hex: '#B0E0E6', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Ice Blue', hex: '#D4F1F4', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Aqua Marine', hex: '#7FFFD4', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Slate Blue', hex: '#6A5ACD', category: 'Blue', family: 'Blues & Navies' },
  { name: 'Electric Cyan', hex: '#00FFFF', category: 'Cyan', family: 'Blues & Navies' },

  // --- REDS & BURGUNDIES ---
  { name: 'Crimson Red', hex: '#991B1B', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Scarlet', hex: '#FF2400', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Ruby Red', hex: '#E0115F', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Cherry Red', hex: '#D2042D', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Cardinal Red', hex: '#C41E3A', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Brick Red', hex: '#CB4154', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Burgundy', hex: '#800020', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Wine Red', hex: '#722F37', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Bordeaux', hex: '#5B0E2D', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Maroon', hex: '#800000', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Oxblood', hex: '#4A0404', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Merlot', hex: '#730039', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Garnet', hex: '#733635', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Cordovan', hex: '#893F45', category: 'Wine', family: 'Reds & Burgundies' },
  { name: 'Mahogany', hex: '#C04000', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Carmine', hex: '#960018', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Firebrick', hex: '#B22222', category: 'Red', family: 'Reds & Burgundies' },
  { name: 'Chili Pepper', hex: '#9B111E', category: 'Red', family: 'Reds & Burgundies' },

  // --- PINKS & ROSES ---
  { name: 'Dusty Rose', hex: '#DCAE96', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Blush Pink', hex: '#DE5D83', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Pastel Pink', hex: '#FFD1DC', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Baby Pink', hex: '#F4C2C2', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Millennial Pink', hex: '#F3C1C6', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Bubblegum Pink', hex: '#FFC1CC', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Rose Quartz', hex: '#F7CAC9', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Rose Gold', hex: '#B76E79', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Salmon Pink', hex: '#FF91A4', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Living Coral', hex: '#FF6F61', category: 'Coral', family: 'Pinks & Roses' },
  { name: 'Peach Fuzz', hex: '#FFBE98', category: 'Peach', family: 'Pinks & Roses' },
  { name: 'Soft Peach', hex: '#FFE5B4', category: 'Peach', family: 'Pinks & Roses' },
  { name: 'Apricot', hex: '#FBCEB1', category: 'Peach', family: 'Pinks & Roses' },
  { name: 'Flamingo', hex: '#FC8EAC', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Mauve Rose', hex: '#D8A0A6', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Fuchsia', hex: '#FF00FF', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Hot Magenta', hex: '#FF1DCE', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Hot Pink', hex: '#FF69B4', category: 'Pink', family: 'Pinks & Roses' },
  { name: 'Raspberry', hex: '#E30B5C', category: 'Pink', family: 'Pinks & Roses' },

  // --- PURPLES & LILACS ---
  { name: 'Lilac', hex: '#C8A2C8', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Lavender', hex: '#E6E6FA', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Thistle', hex: '#D8BFD8', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Wisteria', hex: '#C9A0DC', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Orchid', hex: '#DA70D6', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Amethyst', hex: '#9966CC', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Deep Violet', hex: '#8F00FF', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Royal Purple', hex: '#7851A9', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Plum', hex: '#8E4585', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Eggplant', hex: '#614051', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Mulberry', hex: '#C54B8C', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Periwinkle', hex: '#CCCCFF', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Mauve', hex: '#E0B0FF', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Boysenberry', hex: '#873260', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Grape Purple', hex: '#6F2DA8', category: 'Purple', family: 'Purples & Lilacs' },
  { name: 'Iris Blue-Violet', hex: '#5A4FCF', category: 'Purple', family: 'Purples & Lilacs' },

  // --- YELLOWS & ORANGES ---
  { name: 'Mustard Yellow', hex: '#FFDB58', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Dijon Mustard', hex: '#E1AD01', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Ochre Yellow', hex: '#CC7722', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Goldenrod', hex: '#DAA520', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Warm Amber', hex: '#FFBF00', category: 'Amber', family: 'Yellows & Oranges' },
  { name: 'Honey Gold', hex: '#EBA83A', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Marigold', hex: '#EAA221', category: 'Orange', family: 'Yellows & Oranges' },
  { name: 'Sunflower Yellow', hex: '#FFC512', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Canary Yellow', hex: '#FFEF00', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Lemon Chiffon', hex: '#FFFACD', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Pastel Butter', hex: '#FFFDD0', category: 'Yellow', family: 'Yellows & Oranges' },
  { name: 'Tangerine', hex: '#F28500', category: 'Orange', family: 'Yellows & Oranges' },
  { name: 'Sunset Orange', hex: '#FD5E53', category: 'Orange', family: 'Yellows & Oranges' },
  { name: 'Burnt Orange', hex: '#CC5500', category: 'Orange', family: 'Yellows & Oranges' },
  { name: 'Safety Orange', hex: '#FF5F1F', category: 'Orange', family: 'Yellows & Oranges' },
  { name: 'Bright Coral', hex: '#FF7F50', category: 'Coral', family: 'Yellows & Oranges' },
  { name: 'Amber Glow', hex: '#FF7E00', category: 'Orange', family: 'Yellows & Oranges' },
  { name: 'Papaya', hex: '#FFEFD5', category: 'Orange', family: 'Yellows & Oranges' },

  // --- NEONS & ACCENTS ---
  { name: 'Cyber Neon Cyan', hex: '#06B6D4', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Cyber Neon Green', hex: '#39FF14', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Acid Green', hex: '#B0BF1A', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Highlighter Yellow', hex: '#CCFF00', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Electric Purple', hex: '#BF00FF', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Hot Neon Pink', hex: '#FF1493', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Radioactive Lime', hex: '#76FF03', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Solar Flare Orange', hex: '#FF4500', category: 'Neon', family: 'Neons & Accents' },
  { name: 'Metallic Silver', hex: '#C0C0C0', category: 'Metallic', family: 'Neons & Accents' },
  { name: 'Brushed Gold', hex: '#D4AF37', category: 'Metallic', family: 'Neons & Accents' },
  { name: 'Antique Bronze', hex: '#8C7853', category: 'Metallic', family: 'Neons & Accents' },
  { name: 'Rose Bronze', hex: '#9E6761', category: 'Metallic', family: 'Neons & Accents' },
];

/**
 * Converts 3 or 6 digit hex to RGB {r, g, b}
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

/**
 * Finds the nearest world color name and closest color object using Euclidean distance in RGB space
 */
export function findNearestWorldColor(hex: string): { color: WorldColor; distance: number; isExact: boolean } {
  const targetRgb = hexToRgb(hex);
  if (!targetRgb) {
    return { color: WORLD_COLORS[0], distance: 9999, isExact: false };
  }

  let minDistance = Infinity;
  let closest = WORLD_COLORS[0];

  for (const c of WORLD_COLORS) {
    const rgb = hexToRgb(c.hex);
    if (!rgb) continue;

    // Euclidean distance
    const dist = Math.sqrt(
      Math.pow(targetRgb.r - rgb.r, 2) +
      Math.pow(targetRgb.g - rgb.g, 2) +
      Math.pow(targetRgb.b - rgb.b, 2)
    );

    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
      if (dist === 0) break;
    }
  }

  return {
    color: closest,
    distance: Math.round(minDistance),
    isExact: minDistance < 5,
  };
}

/**
 * Searches world colors by text query (fuzzy name, hex code, category, or family)
 */
export function searchWorldColors(query: string, familyFilter?: string): WorldColor[] {
  const q = query.trim().toLowerCase();

  return WORLD_COLORS.filter((color) => {
    // Family match
    if (familyFilter && familyFilter !== 'All' && color.family !== familyFilter) {
      return false;
    }

    if (!q) return true;

    // Query match
    return (
      color.name.toLowerCase().includes(q) ||
      color.hex.toLowerCase().includes(q) ||
      color.category.toLowerCase().includes(q) ||
      color.family.toLowerCase().includes(q)
    );
  });
}
