export type ServerMenuItem = {
  id: string;
  name: string;
  price: number;
};

// The server owns these prices so checkout totals never depend on browser data.
export const serverMenu: ServerMenuItem[] = [
  ['savorelle-burger', 'Savorelle Burger', 16], ['cheese-explosion', 'Cheese Explosion', 17.5], ['garden-burger', 'Garden Burger', 15.5], ['chef-burger', 'Chef’s Burger', 18],
  ['bavarian-breakfast', 'Bavarski doručak', 15], ['greek-breakfast', 'Grčki doručak', 15], ['mexican-breakfast', 'Meksički doručak', 15], ['sweet-breakfast', 'Slatki doručak', 12],
  ['chicken-wrap', 'Pileći wrap', 12.5], ['veal-wrap', 'Teleći wrap', 14], ['mexico-wrap', 'Mexico wrap', 13.5], ['tuna-wrap', 'Tuna wrap', 13],
  ['frutti-risotto', 'Rižoto Frutti di Mare', 19], ['chicken-risotto', 'Pileći rižoto', 17.5], ['mushroom-risotto', 'Rižoto s gljivama', 16.5], ['pasta-curry', 'Pasta Curry', 16.5], ['pasta-quattro', 'Pasta Quattro Formaggi', 16], ['pasta-carbonara', 'Pasta Carbonara', 16.5],
  ['margherita', 'Pizza Margherita', 14], ['capricciosa', 'Pizza Capricciosa', 16], ['quattro-pizza', 'Pizza Quattro Formaggi', 16.5], ['mexicana-pizza', 'Pizza Mexicana', 17],
  ['chicken-main', 'Kremasta piletina s gljivama', 18.5], ['spinach-main', 'Piletina sa špinatom', 18.5], ['steak-salad', 'Salata s grilovanom teletinom', 18], ['veggie-salad', 'Mediteranska salata', 13.5],
  ['lava-cake', 'Čokoladni lava kolač', 9.5], ['tiramisu', 'Tiramisu', 8.5], ['cheesecake', 'Cheesecake s voćem', 8.5],
  ['espresso', 'Espresso', 3], ['cappuccino', 'Cappuccino', 4.5], ['fresh-orange', 'Svježe cijeđena narandža', 5.5], ['savorelle-tonic', 'Savorelle tonic', 7],
].map(([id, name, price]) => ({ id: id as string, name: name as string, price: price as number }));

export const menuById = new Map(serverMenu.map((item) => [item.id, item]));

export const deliveryFees = {
  central: 2.5,
  outer: 4.5,
  extended: 6.5,
} as const;
