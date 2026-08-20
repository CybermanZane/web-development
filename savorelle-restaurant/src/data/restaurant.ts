export const navItems = [
  ['Home', '/'],
  ['Menu', '/menu'],
  ['About Us', '/about'],
  ['Gallery', '/gallery'],
  ['Reservations', '/reservations'],
  ['Contact', '/contact'],
] as const;

export const images = {
  hero:
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1500&q=88',
  story:
    'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1300&q=86',
  chef:
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=86',
  experience:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=86',
  dishOne:
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1100&q=86',
  dishTwo:
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1100&q=86',
  dishThree:
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1100&q=86',
  galleryA:
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1100&q=86',
  galleryB:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=86',
  galleryC:
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1100&q=86',
  galleryD:
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1100&q=86',
};

export const signatureDishes = [
  {
    name: 'Teriyaki Wings',
    description: 'Crisp glazed wings, toasted sesame, charred scallion, citrus heat.',
    price: '$28',
    image: images.hero,
  },
  {
    name: 'Truffle Pasta',
    description: 'Silken noodles, aged pecorino, black truffle, egg yolk emulsion.',
    price: '$65',
    image: images.dishTwo,
  },
  {
    name: 'Sea Urchin Risotto',
    description: 'Creamy carnaroli rice, coastal herbs, saffron butter, lemon oil.',
    price: '$90',
    image: images.dishOne,
  },
  {
    name: 'Matcha Lava Cake',
    description: 'Warm matcha sponge, vanilla cream, white chocolate, fresh berries.',
    price: '$35',
    image: images.dishThree,
  },
];

export const menuPreview = {
  Starters: [
    ['Coal Roasted Beets', 'Whipped labneh, pistachio, sorrel', '$18'],
    ['Oyster & Smoke', 'Champagne mignonette, ember oil', '$24'],
    ['Sourdough Service', 'Cultured butter, bitter honey', '$12'],
  ],
  'Main Courses': [
    ['Short Rib Terrine', 'Celeriac, marrow glaze, winter herbs', '$42'],
    ['Fire-Kissed Chicken', 'Chestnut cream, jus gras, endive', '$34'],
    ['Truffle Pappardelle', 'Egg yolk, pecorino, black truffle', '$36'],
  ],
  Seafood: [
    ['Line-Caught Halibut', 'Fennel pollen, mussel saffron broth', '$44'],
    ['Scallop & Citrus', 'Burnt orange, almond, basil oil', '$39'],
    ['Lobster Charcoal', 'Brown butter, tarragon, sea lettuce', '$58'],
  ],
  Desserts: [
    ['Dark Chocolate Torte', 'Miso caramel, creme fraiche', '$16'],
    ['Pear Mille-Feuille', 'Vanilla, salted almond, pear brandy', '$17'],
    ['Citrus Sorbet', 'Olive oil, basil, candied peel', '$13'],
  ],
  Drinks: [
    ['Velora Martini', 'Vodka, vermouth, smoked olive', '$18'],
    ['Amber Negroni', 'Gin, bitter orange, aged amaro', '$17'],
    ['Reserve Pairing', 'Four-course sommelier selection', '$64'],
  ],
};

export const testimonials = [
  {
    quote:
      'Quietly theatrical, deeply delicious, and paced with the confidence of a restaurant that knows exactly who it is.',
    author: 'Lina Mercer',
    publication: 'Table Review',
  },
  {
    quote:
      'Maison Velora turns dinner into a slow-burning composition of light, texture, smoke, and precision.',
    author: 'Adrien Cole',
    publication: 'The City Ledger',
  },
];

export const galleryImages = [
  [images.hero, 'Signature glazed wings on a dark plate'],
  [images.story, 'Pasta served with herbs and warm sauce'],
  [images.dishOne, 'Risotto and seafood course'],
  [images.dishTwo, 'Fresh handmade pasta with truffle'],
  [images.dishThree, 'Dessert and sweet course presentation'],
  [images.galleryA, 'Restaurant table filled with seasonal dishes'],
  [images.galleryB, 'Chef plating a colorful meal'],
  [images.galleryC, 'Dining room details and evening atmosphere'],
  [images.galleryD, 'Guests enjoying a restaurant service'],
] as const;

export const contactDetails = {
  address: 'Kovačići 12, Sarajevo, BiH',
  phone: '+387 33 555 198',
  email: 'hello@savorelle.com',
  reservationEmail: 'reservations@savorelle.com',
  hours: ['Utorak - četvrtak, 18:00-23:00', 'Petak - subota, 17:30-00:00', 'Nedjelja, 17:00-22:00'],
};

export type MenuDish = {
  name: string;
  description: string;
  price: string;
  dietary?: string;
  image?: string;
};

export const fullMenu: Record<string, MenuDish[]> = {
  "Chef's Signature": signatureDishes.map((dish, index) => ({ ...dish, dietary: index === 0 ? 'SP' : index === 3 ? 'V' : undefined })),
  Starters: [
    { name: 'Coal Roasted Beets', description: 'Whipped labneh, pistachio, sorrel.', price: '$18', dietary: 'V GF' },
    { name: 'Oyster & Smoke', description: 'Champagne mignonette, ember oil, preserved lemon.', price: '$24', dietary: 'GF' },
    { name: 'Sourdough Service', description: 'Cultured butter, bitter honey, black salt.', price: '$12', dietary: 'V' },
  ],
  'Main Courses': [
    { name: 'Short Rib Terrine', description: 'Celeriac, marrow glaze, winter herbs.', price: '$42', image: images.story },
    { name: 'Fire-Kissed Chicken', description: 'Chestnut cream, jus gras, endive.', price: '$34', dietary: 'GF' },
    { name: 'Ember Carrot', description: 'Hazelnut miso, smoked yogurt, coriander seed.', price: '$29', dietary: 'VG GF' },
  ],
  Seafood: [
    { name: 'Line-Caught Halibut', description: 'Fennel pollen, mussel saffron broth.', price: '$44', dietary: 'GF' },
    { name: 'Scallop & Citrus', description: 'Burnt orange, almond, basil oil.', price: '$39', dietary: 'GF' },
    { name: 'Lobster Charcoal', description: 'Brown butter, tarragon, sea lettuce.', price: '$58', dietary: 'GF' },
  ],
  Pasta: [
    { name: 'Truffle Pappardelle', description: 'Egg yolk, pecorino, black truffle.', price: '$36', dietary: 'V', image: images.dishTwo },
    { name: 'Sea Urchin Risotto', description: 'Carnaroli rice, coastal herbs, lemon oil.', price: '$38', dietary: 'GF' },
    { name: 'Wild Mushroom Agnolotti', description: 'Porcini broth, aged parmesan, thyme.', price: '$32', dietary: 'V' },
  ],
  Desserts: [
    { name: 'Dark Chocolate Torte', description: 'Miso caramel, creme fraiche.', price: '$16', dietary: 'GF' },
    { name: 'Pear Mille-Feuille', description: 'Vanilla, salted almond, pear brandy.', price: '$17', dietary: 'V' },
    { name: 'Citrus Sorbet', description: 'Olive oil, basil, candied peel.', price: '$13', dietary: 'VG GF' },
  ],
  Cocktails: [
    { name: 'Velora Martini', description: 'Vodka, vermouth, smoked olive.', price: '$18' },
    { name: 'Amber Negroni', description: 'Gin, bitter orange, aged amaro.', price: '$17' },
    { name: 'Garden Highball', description: 'Cucumber, elderflower, sparkling wine.', price: '$16' },
  ],
  Wine: [
    { name: 'Sommelier Selection', description: 'A four-course pairing chosen for your table.', price: '$64' },
    { name: 'Loire Chenin Blanc', description: 'Mineral, citrus and a delicate savory finish.', price: '$16' },
    { name: 'Etna Rosso', description: 'Bright red fruit, smoke and fine tannin.', price: '$18' },
  ],
};

export const galleryEntries = [
  { image: images.hero, alt: { bs: 'Savorelle jelo s glazurom na tamnom tanjiru', en: 'Savorelle glazed dish on a dark plate' }, category: 'cuisine', title: { bs: 'Vatra i glazura', en: 'Fire and glaze' } },
  { image: images.story, alt: { bs: 'Pasta završena na vatri u Savorelle kuhinji', en: 'Pasta finished over heat in the Savorelle kitchen' }, category: 'cuisine', title: { bs: 'Pasta u sumrak', en: 'Pasta at dusk' } },
  { image: images.galleryC, alt: { bs: 'Atmosferski enterijer restorana', en: 'Atmospheric restaurant interior' }, category: 'interior', title: { bs: 'Prigušeno svjetlo, duga večer', en: 'Low light, long evening' } },
  { image: images.chef, alt: { bs: 'Chef u Savorelle kuhinji', en: 'Chef in the Savorelle kitchen' }, category: 'chef', title: { bs: 'Ruke kuhinje', en: 'Hands of the kitchen' } },
  { image: images.galleryB, alt: { bs: 'Šareno jelo u pripremi', en: 'Colorful dish being prepared' }, category: 'cuisine', title: { bs: 'Posljednji detalj', en: 'The final detail' } },
  { image: images.experience, alt: { bs: 'Savorelle sala i bar', en: 'Savorelle dining room and bar' }, category: 'interior', title: { bs: 'Prostor oživi', en: 'The room comes alive' } },
  { image: images.dishOne, alt: { bs: 'Sezonski morski slijed', en: 'Seasonal seafood course' }, category: 'cuisine', title: { bs: 'Note obale', en: 'Coastal notes' } },
  { image: images.galleryD, alt: { bs: 'Gosti dijele sto u restoranu', en: 'Guests sharing a restaurant table' }, category: 'atmosphere', title: { bs: 'Sto među prijateljima', en: 'The table between friends' } },
  { image: images.dishThree, alt: { bs: 'Slatki slijed za kraj večeri', en: 'Sweet course for the end of the evening' }, category: 'cuisine', title: { bs: 'Slatki završetak', en: 'A sweet finish' } },
] as const;

export const reservationFaqs = [
  { question: { bs: 'Mogu li izmijeniti rezervaciju?', en: 'Can I modify my reservation?' }, answer: { bs: 'Kontaktirajte nas što ranije i rado ćemo pomoći prema dostupnosti.', en: 'Contact us as early as possible and we will gladly help based on availability.' } },
  { question: { bs: 'Prilagođavate li se alergijama?', en: 'Do you accommodate allergies?' }, answer: { bs: 'Da. Napišite prehrambene potrebe pri rezervaciji i recite ih osoblju po dolasku.', en: 'Yes. Add dietary requirements to your reservation and tell your server on arrival.' } },
  { question: { bs: 'Postoji li dress code?', en: 'Is there a dress code?' }, answer: { bs: 'Dobrodošao je elegantan, opušten stil.', en: 'Smart, relaxed attire is welcome.' } },
  { question: { bs: 'Mogu li doći s djecom?', en: 'Can I bring children?' }, answer: { bs: 'Djeca su dobrodošla. Uključite ih u broj gostiju da pripremimo pravi sto.', en: 'Children are warmly welcome. Include them in your guest count so we can prepare the right table.' } },
  { question: { bs: 'Primате li veće grupe?', en: 'Do you accept large groups?' }, answer: { bs: 'Za sedam ili više gostiju pošaljite upit našem timu za privatne događaje.', en: 'For seven or more guests, send an inquiry to our private events team.' } },
] as const;
