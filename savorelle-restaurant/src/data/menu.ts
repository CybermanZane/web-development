import { images } from './restaurant';
import type { Localized, Locale } from '../i18n';

export type MenuCategory = { id: string; label: Localized };
export type MenuItem = { id: string; category: string; name: Localized; description: Localized; price: number; dietary?: string; image?: string };

export const menuCategories: MenuCategory[] = [
  { id: 'burgers', label: { bs: 'Burgeri', en: 'Burgers' } },
  { id: 'breakfast', label: { bs: 'Doručak', en: 'Breakfast' } },
  { id: 'wraps', label: { bs: 'Wrapovi', en: 'Wraps' } },
  { id: 'risotto-pasta', label: { bs: 'Rižoto i pasta', en: 'Risotto and pasta' } },
  { id: 'pizza', label: { bs: 'Pizza', en: 'Pizza' } },
  { id: 'mains', label: { bs: 'Glavna jela i salate', en: 'Mains and salads' } },
  { id: 'desserts', label: { bs: 'Deserti', en: 'Desserts' } },
  { id: 'coffee', label: { bs: 'Kafa i napici', en: 'Coffee and drinks' } },
];

const both = (bs: string, en: string): Localized => ({ bs, en });
export const menuItems: MenuItem[] = [
  { id: 'savorelle-burger', category: 'burgers', name: both('Savorelle Burger', 'Savorelle Burger'), description: both('Junetina, brioche pecivo, cheddar, karamelizirani luk, Savorelle sos i pomfrit.', 'Beef, brioche bun, cheddar, caramelized onion, Savorelle sauce, and fries.'), price: 16, image: '/images/menu/savorelle-burger.png' },
  { id: 'cheese-explosion', category: 'burgers', name: both('Cheese Explosion', 'Cheese Explosion'), description: both('Junetina, pohovani sir, chutney od luka, salata i hrskavi luk.', 'Beef, fried cheese, onion chutney, salad, and crispy onion.'), price: 17.5, image: '/images/menu/cheese-explosion.png' },
  { id: 'garden-burger', category: 'burgers', name: both('Garden Burger', 'Garden Burger'), description: both('Veganski burger, salsa od povrća, iceberg salata i pomfrit.', 'Vegan burger, vegetable salsa, iceberg lettuce, and fries.'), price: 15.5, dietary: 'VG', image: '/images/menu/garden-burger.png' },
  { id: 'chef-burger', category: 'burgers', name: both('Chef’s Burger', 'Chef’s Burger'), description: both('Junetina, krema od tartufa, karamelizirane gljive, sir i domaći sos.', 'Beef, truffle cream, caramelized mushrooms, cheese, and house sauce.'), price: 18, image: '/images/menu/chefs-burger.png' },
  { id: 'bavarian-breakfast', category: 'breakfast', name: both('Bavarski doručak', 'Bavarian Breakfast'), description: both('Jaja na oko, roštilj kobasica, sir, povrće, domaće pecivo i svježi sok.', 'Fried eggs, grilled sausage, cheese, vegetables, house bread, and fresh juice.'), price: 15, image: '/images/menu/bavarian-breakfast.png' },
  { id: 'greek-breakfast', category: 'breakfast', name: both('Grčki doručak', 'Greek Breakfast'), description: both('Omlet, feta, masline, povrće, grčki jogurt i domaće pecivo.', 'Omelette, feta, olives, vegetables, Greek yogurt, and house bread.'), price: 15, dietary: 'V', image: '/images/menu/greek-breakfast.png' },
  { id: 'mexican-breakfast', category: 'breakfast', name: both('Meksički doručak', 'Mexican Breakfast'), description: both('Jaja, grah, kukuruz, gljive, kobasica, sir i pekarski krompir.', 'Eggs, beans, corn, mushrooms, sausage, cheese, and roasted potatoes.'), price: 15, dietary: 'SP', image: '/images/menu/mexican-breakfast.png' },
  { id: 'sweet-breakfast', category: 'breakfast', name: both('Slatki doručak', 'Sweet Breakfast'), description: both('Waffle, lješnjak krema, med, marmelada i sezonsko voće.', 'Waffles, hazelnut cream, honey, jam, and seasonal fruit.'), price: 12, dietary: 'V', image: '/images/menu/sweet-breakfast.png' },
  { id: 'chicken-wrap', category: 'wraps', name: both('Pileći wrap', 'Chicken Wrap'), description: both('Tortilja, pileći file, salata, paradajz, krastavac, kupus i Savorelle sos.', 'Tortilla, chicken fillet, lettuce, tomato, cucumber, cabbage, and Savorelle sauce.'), price: 12.5, image: '/images/menu/chicken-wrap.png' },
  { id: 'veal-wrap', category: 'wraps', name: both('Teleći wrap', 'Veal Wrap'), description: both('Grilovana teletina, kupus, zelena salata, kiseli krastavac i ljubičasti luk.', 'Grilled veal, cabbage, lettuce, pickles, and red onion.'), price: 14, image: '/images/menu/veal-wrap.png' },
  { id: 'mexico-wrap', category: 'wraps', name: both('Mexico wrap', 'Mexico Wrap'), description: both('Piletina, grah, kukuruz, paprika, svježa salata i ljuti sos.', 'Chicken, beans, corn, peppers, fresh greens, and spicy sauce.'), price: 13.5, dietary: 'SP', image: '/images/menu/mexico-wrap.png' },
  { id: 'tuna-wrap', category: 'wraps', name: both('Tuna wrap', 'Tuna Wrap'), description: both('Tuna, masline, kukuruz, povrće, majoneza i svježa salata.', 'Tuna, olives, corn, vegetables, mayonnaise, and fresh greens.'), price: 13, image: '/images/menu/tuna-wrap.png' },
  { id: 'frutti-risotto', category: 'risotto-pasta', name: both('Rižoto Frutti di Mare', 'Frutti di Mare Risotto'), description: both('Kremasti rižoto, plodovi mora, parmezan, luk i začinsko bilje.', 'Creamy risotto, seafood, parmesan, onion, and herbs.'), price: 19, image: '/images/menu/frutti-risotto.png' },
  { id: 'chicken-risotto', category: 'risotto-pasta', name: both('Pileći rižoto', 'Chicken Risotto'), description: both('Piletina, riža, paprika, tikvice, parmezan i blagi kremasti sos.', 'Chicken, rice, peppers, zucchini, parmesan, and a gentle cream sauce.'), price: 17.5, image: '/images/menu/chicken-risotto.png' },
  { id: 'mushroom-risotto', category: 'risotto-pasta', name: both('Rižoto s gljivama', 'Mushroom Risotto'), description: both('Mix gljiva, riža, parmezan, puter i svježi timijan.', 'Mixed mushrooms, rice, parmesan, butter, and fresh thyme.'), price: 16.5, dietary: 'V GF', image: '/images/menu/mushroom-risotto.png' },
  { id: 'pasta-curry', category: 'risotto-pasta', name: both('Pasta Curry', 'Curry Pasta'), description: both('Penne, pileći file, povrće, indijski orah i kremasti curry sos.', 'Penne, chicken fillet, vegetables, cashews, and a creamy curry sauce.'), price: 16.5, image: '/images/menu/pasta-curry.png' },
  { id: 'pasta-quattro', category: 'risotto-pasta', name: both('Pasta Quattro Formaggi', 'Quattro Formaggi Pasta'), description: both('Penne, četiri vrste sira i svježe mljeveni biber.', 'Penne, four cheeses, and freshly ground pepper.'), price: 16, dietary: 'V', image: '/images/menu/pasta-quattro.png' },
  { id: 'pasta-carbonara', category: 'risotto-pasta', name: both('Pasta Carbonara', 'Carbonara Pasta'), description: both('Penne, suho meso, šunka, bijeli luk i kremasti sos.', 'Penne, smoked meat, ham, garlic, and cream sauce.'), price: 16.5, image: '/images/menu/pasta-carbonara.png' },
  { id: 'margherita', category: 'pizza', name: both('Pizza Margherita', 'Pizza Margherita'), description: both('Paradajz sos, mozzarella i emmentaler.', 'Tomato sauce, mozzarella, and emmental.'), price: 14, dietary: 'V', image: '/images/menu/pizza-margherita.png' },
  { id: 'capricciosa', category: 'pizza', name: both('Pizza Capricciosa', 'Pizza Capricciosa'), description: both('Pureća šunka, gljive, mozzarella, emmentaler i paradajz sos.', 'Turkey ham, mushrooms, mozzarella, emmental, and tomato sauce.'), price: 16, image: '/images/menu/pizza-capricciosa.png' },
  { id: 'quattro-pizza', category: 'pizza', name: both('Pizza Quattro Formaggi', 'Pizza Quattro Formaggi'), description: both('Dimljeni sir, gorgonzola, mozzarella, emmentaler i paradajz sos.', 'Smoked cheese, gorgonzola, mozzarella, emmental, and tomato sauce.'), price: 16.5, dietary: 'V', image: '/images/menu/pizza-quattro-formaggi.png' },
  { id: 'mexicana-pizza', category: 'pizza', name: both('Pizza Mexicana', 'Pizza Mexicana'), description: both('Sudžuka, paprika, kukuruz, grah, mozzarella i ljuti sos.', 'Spiced sausage, peppers, corn, beans, mozzarella, and spicy sauce.'), price: 17, dietary: 'SP', image: '/images/menu/pizza-mexicana.png' },
  { id: 'chicken-main', category: 'mains', name: both('Kremasta piletina s gljivama', 'Creamy Mushroom Chicken'), description: both('Pileći file, gljive, domaći krem sos, začinjeni krompir i onion rings.', 'Chicken fillet, mushrooms, house cream sauce, seasoned potatoes, and onion rings.'), price: 18.5, image: images.story },
  { id: 'spinach-main', category: 'mains', name: both('Piletina sa špinatom', 'Spinach Chicken'), description: both('Piletina, špinat, sušeni paradajz, parmezan i krompir iz pećnice.', 'Chicken, spinach, sun-dried tomato, parmesan, and roasted potatoes.'), price: 18.5, image: '/images/menu/spinach-chicken.png' },
  { id: 'steak-salad', category: 'mains', name: both('Salata s grilovanom teletinom', 'Grilled Veal Salad'), description: both('Teletina, miješana salata, cherry paradajz, krastavac i lagani preliv.', 'Veal, mixed greens, cherry tomatoes, cucumber, and a light dressing.'), price: 18, dietary: 'GF', image: '/images/menu/veal-salad.png' },
  { id: 'veggie-salad', category: 'mains', name: both('Mediteranska salata', 'Mediterranean Salad'), description: both('Zelena salata, feta, masline, povrće, sjemenke i limunov preliv.', 'Leafy greens, feta, olives, vegetables, seeds, and lemon dressing.'), price: 13.5, dietary: 'V GF', image: '/images/menu/mediterranean-salad.png' },
  { id: 'lava-cake', category: 'desserts', name: both('Čokoladni lava kolač', 'Chocolate Lava Cake'), description: both('Topla čokoladna sredina, vanilija krema i sezonsko voće.', 'Warm chocolate center, vanilla cream, and seasonal fruit.'), price: 9.5, image: images.dishThree, dietary: 'V' },
  { id: 'tiramisu', category: 'desserts', name: both('Tiramisu', 'Tiramisu'), description: both('Mascarpone krema, espresso, kakao i nježni biskvit.', 'Mascarpone cream, espresso, cocoa, and delicate sponge.'), price: 8.5, dietary: 'V', image: '/images/menu/tiramisu.png' },
  { id: 'cheesecake', category: 'desserts', name: both('Cheesecake s voćem', 'Berry Cheesecake'), description: both('Kremasti sir, keks podloga i umak od šumskog voća.', 'Cream cheese, biscuit base, and forest berry sauce.'), price: 8.5, dietary: 'V', image: '/images/menu/berry-cheesecake.png' },
  { id: 'espresso', category: 'coffee', name: both('Espresso', 'Espresso'), description: both('Kratka, intenzivna kafa iz pažljivo biranog zrna.', 'A short, intense coffee from carefully selected beans.'), price: 3, image: '/images/menu/espresso.png' },
  { id: 'cappuccino', category: 'coffee', name: both('Cappuccino', 'Cappuccino'), description: both('Dupli espresso i svilenkasta mliječna pjena.', 'Double espresso and silky milk foam.'), price: 4.5, image: '/images/menu/cappuccino.png' },
  { id: 'fresh-orange', category: 'coffee', name: both('Svježe cijeđena narandža', 'Fresh Orange Juice'), description: both('Svježe cijeđeni sok od narandže, 0,2 l.', 'Freshly pressed orange juice, 0.2 l.'), price: 5.5, dietary: 'VG GF', image: '/images/menu/fresh-orange.png' },
  { id: 'savorelle-tonic', category: 'coffee', name: both('Savorelle tonic', 'Savorelle Tonic'), description: both('Citrus, ružmarin, tonik i bezalkoholni aperitiv.', 'Citrus, rosemary, tonic, and a non-alcoholic aperitif.'), price: 7, dietary: 'VG GF', image: '/images/menu/savorelle-tonic.png' },
];

const categoryImages: Record<string, string> = {
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=86',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=86',
  wraps: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=86',
  'risotto-pasta': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=86',
  pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=86',
  mains: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=86',
  desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=86',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=86',
};

export function getMenuImage(item: MenuItem) {
  return item.image ?? categoryImages[item.category];
}

export function formatPrice(price: number, locale: Locale) {
  return `${price.toLocaleString(locale === 'bs' ? 'bs-BA' : 'en-GB', { minimumFractionDigits: price % 1 ? 2 : 0, maximumFractionDigits: 2 })} KM`;
}
