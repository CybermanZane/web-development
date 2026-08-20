insert into reservations (
  reservation_date,
  reservation_time,
  guests,
  name,
  email,
  phone,
  status,
  source,
  notes
) values
  ('2026-09-12', '20:00', 4, 'Amira Hadzic', 'amira@example.com', '+387 61 555 112', 'pending', 'website', 'Window table if available.'),
  ('2026-09-13', '18:30', 2, 'Daniel Morgan', 'daniel@example.com', '+1 212 555 0198', 'confirmed', 'website', 'Anniversary dinner.'),
  ('2026-09-14', '21:00', 6, 'Lina Mercer', 'lina@example.com', '+44 20 5555 0142', 'pending', 'website', null)
on conflict do nothing;
