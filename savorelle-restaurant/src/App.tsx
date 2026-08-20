import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { GalleryLightbox } from './components/GalleryLightbox';
import { DishLightbox } from './components/DishLightbox';
import { CheckoutFlow } from './components/CheckoutFlow';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { PageHero } from './components/PageHero';
import { ReservationForm } from './components/ReservationForm';
import { Eyebrow, Reveal } from './components/Section';
import { contactDetails, images, reservationFaqs } from './data/restaurant';
import { formatPrice, getMenuImage, menuCategories, menuItems, type MenuItem } from './data/menu';
import { localize, useLanguage } from './i18n';

const pageMotion = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } } as const;
const categoryMap = Object.fromEntries(menuCategories.map((item) => [item.id, item]));
const featuredDishIds = ['savorelle-burger', 'frutti-risotto', 'chicken-main', 'tiramisu'];
const menuGalleryEntries = menuItems.map((item) => ({ image: getMenuImage(item), alt: item.name, category: item.category, categoryLabel: categoryMap[item.category].label, title: item.name }));

function HomePage() {
  const { locale, t } = useLanguage();
  const [featuredOffset, setFeaturedOffset] = useState(0);
  const featuredPool = [
    ...featuredDishIds.map((id) => menuItems.find((item) => item.id === id)).filter((item): item is MenuItem => Boolean(item)),
    ...menuItems.filter((item) => !featuredDishIds.includes(item.id)),
  ];
  const signature = Array.from({ length: 4 }, (_, index) => featuredPool[(featuredOffset + index) % featuredPool.length]);

  useEffect(() => {
    const rotation = window.setInterval(() => setFeaturedOffset((offset) => (offset + 1) % featuredPool.length), 15_000);
    return () => window.clearInterval(rotation);
  }, [featuredPool.length]);

  return <PageFrame><Hero />
  <section className="menu-showcase section-shell" aria-labelledby="home-menu-title"><div className="split-heading"><Reveal><Eyebrow>{t('home.eyebrow')}</Eyebrow><h2 id="home-menu-title">{t('home.title')}</h2></Reveal><Reveal delay={0.1}><p>{t('home.copy')}</p><a className="text-link" href="/menu">{t('home.fullMenu')} <span>↗</span></a></Reveal></div><div className="dish-cards"><AnimatePresence initial={false} mode="popLayout">{signature.map((dish, index) => { const verticalOffset = index % 2 ? 34 : 0; return <motion.article className="dish-card" layout="position" key={dish.id} initial={{ opacity: 0, x: 22, y: verticalOffset }} animate={{ opacity: 1, x: 0, y: verticalOffset }} exit={{ opacity: 0, x: -22, y: verticalOffset }} whileHover={{ y: verticalOffset - 6 }} transition={{ duration: 0.48, delay: featuredOffset === 0 ? index * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}><div className="dish-card-image"><img src={getMenuImage(dish)} alt={localize(dish.name, locale)} /></div><div className="dish-card-body"><strong>{formatPrice(dish.price, locale)}</strong><h3>{localize(dish.name, locale)}</h3><p>{localize(dish.description, locale)}</p><a href="/order#order-menu">{t('nav.order')} <span>↗</span></a></div></motion.article>; })}</AnimatePresence></div></section>
  <section className="story section-shell"><div className="story-grid"><Reveal><Eyebrow>{t('home.storyEyebrow')}</Eyebrow><h2>{t('home.storyTitle')}</h2></Reveal><Reveal className="story-copy" delay={0.1}><p>{t('home.storyCopy')}</p><a className="text-link" href="/about">{t('home.storyLink')} <span>↗</span></a></Reveal></div><div className="service-mosaic"><Reveal className="service-photo service-photo-large" variant="image"><img src={images.story} alt="Savorelle pasta" /></Reveal><Reveal className="service-photo" delay={0.14} variant="image"><img src={images.galleryA} alt="Savorelle dish" /></Reveal></div></section>
  <section className="experience"><div className="experience-image"><img src={images.experience} alt="Savorelle dining room" /></div><Reveal className="experience-copy" variant="slide"><Eyebrow>{t('home.atmosphere')}</Eyebrow><h2>{t('home.atmosphereTitle')}</h2><a className="text-link inverse-link" href="/gallery">{t('home.galleryLink')} <span>↗</span></a></Reveal></section><ReservationCallout /></PageFrame>; }

function MenuPage() { const { locale, t } = useLanguage(); const [active, setActive] = useState(menuCategories[0].id); const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null); const activeItems = menuItems.filter((item) => item.category === active); return <PageFrame><PageHero label={t('menu.label')} title={t('menu.title')} copy={t('menu.copy')} image={images.dishOne} imageAlt="Savorelle seasonal dish" />
  <section className="signature-feature section-shell"><Reveal className="signature-image" variant="image"><img src={images.hero} alt="Savorelle Burger" /></Reveal><Reveal className="signature-copy" delay={0.12}><Eyebrow>{t('menu.recommendation')}</Eyebrow><h2>{t('menu.signatureTitle')}</h2><p>{t('menu.signatureCopy')}</p><dl><div><dt>{t('menu.ingredients')}</dt><dd>{t('menu.ingredientsValue')}</dd></div><div><dt>{t('menu.fromChef')}</dt><dd>{t('menu.fromChefValue')}</dd></div></dl><strong className="signature-price">{formatPrice(16, locale)}</strong></Reveal></section>
  <section className="editorial-menu section-shell"><div className="menu-index" aria-label={t('menu.index')}>{menuCategories.map((category) => <button type="button" className={active === category.id ? 'is-active' : ''} key={category.id} onClick={() => { setActive(category.id); setSelectedDish(null); }}>{localize(category.label, locale)}</button>)}</div><div className="menu-page-layout"><MenuSection name={localize(categoryMap[active].label, locale)} index={menuCategories.findIndex((item) => item.id === active)} dishes={activeItems} onSelect={setSelectedDish} /></div><p className="dietary-note"><strong>{t('menu.dietaryTitle')}</strong> {t('menu.dietaryCopy')}</p></section>
  <section className="menu-cta section-shell"><Reveal><Eyebrow>{t('menu.ctaEyebrow')}</Eyebrow><h2>{t('menu.ctaTitle')}</h2><div className="cta-row"><a className="primary-action" href="/reservations">{t('menu.reserve')} <span>↗</span></a><a className="secondary-action" href="/reservations">{t('menu.viewReservations')}</a></div></Reveal></section><MenuDetailPanel dish={selectedDish} onClose={() => setSelectedDish(null)} /></PageFrame>; }

function MenuSection({ name, index, dishes, onSelect }: { name: string; index: number; dishes: MenuItem[]; onSelect: (dish: MenuItem) => void }) { const { locale } = useLanguage(); return <Reveal><div className="menu-section-heading"><span>{String(index + 1).padStart(2, '0')}</span><h2>{name}</h2></div>{dishes.map((dish) => <article className="editorial-menu-item" key={dish.id}><button className="menu-item-trigger" type="button" onClick={() => onSelect(dish)} aria-label={`Detalji: ${localize(dish.name, locale)}`}><div><h3>{localize(dish.name, locale)} {dish.dietary && <small className="dietary-tag">{dish.dietary}</small>}</h3><p>{localize(dish.description, locale)}</p></div><strong>{formatPrice(dish.price, locale)}</strong><span aria-hidden="true">↗</span></button></article>)}</Reveal>; }

function MenuDetailPanel({ dish, onClose }: { dish: MenuItem | null; onClose: () => void }) { const { locale } = useLanguage(); return <AnimatePresence>{dish && <motion.div className="menu-detail-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><motion.aside className="menu-detail-panel" role="dialog" aria-modal="true" aria-label={`Detalji jela: ${localize(dish.name, locale)}`} initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .985 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}><button className="menu-detail-close" type="button" onClick={onClose} aria-label="Zatvori detalje">×</button><div className="menu-detail-image"><img src={getMenuImage(dish)} alt={localize(dish.name, locale)} /></div><div className="menu-detail-copy"><span>Selekcija chefa</span><h2>{localize(dish.name, locale)}</h2><strong>{formatPrice(dish.price, locale)}</strong><p>{localize(dish.description, locale)}</p>{dish.dietary && <small className="menu-detail-dietary">{dish.dietary}</small>}<a className="primary-action" href="/order#order-menu">Dodajte u narudžbu <span>↗</span></a></div></motion.aside></motion.div>}</AnimatePresence>; }

function AboutPage() { const { t } = useLanguage(); return <PageFrame><PageHero label={t('about.label')} title={t('about.title')} copy={t('about.copy')} image={images.experience} imageAlt="Savorelle dining room" />
  <section className="story-editorial section-shell"><Reveal><Eyebrow>{t('about.storyEyebrow')}</Eyebrow><h2>{t('about.storyTitle')}</h2></Reveal><Reveal className="story-editorial-copy" delay={0.14}><p>{t('about.story1')}</p><p>{t('about.story2')}</p></Reveal></section>
  <section className="image-text-editorial section-shell"><Reveal className="image-frame tall-frame" variant="image"><img src={images.chef} alt="Savorelle chef" /></Reveal><Reveal className="chef-bio" delay={0.12}><Eyebrow>{t('about.chefEyebrow')}</Eyebrow><h2>Elena Morin</h2><p>{t('about.chefCopy')}</p><blockquote>{t('about.quote')}</blockquote></Reveal></section>
  <section className="craft-grid section-shell"><Reveal><Eyebrow>{t('about.sourceEyebrow')}</Eyebrow><h2>{t('about.sourceTitle')}</h2></Reveal><div><Reveal delay={0.08}><p>{t('about.sourceCopy')}</p></Reveal><Reveal delay={0.16} className="image-frame"><img src={images.galleryB} alt="Fresh ingredients" /></Reveal></div></section>
  <section className="craftsmanship section-shell"><Reveal className="image-frame" variant="image"><img src={images.galleryA} alt="Savorelle plating" /></Reveal><Reveal delay={0.12}><Eyebrow>{t('about.craftEyebrow')}</Eyebrow><h2>{t('about.craftTitle')}</h2><p>{t('about.craftCopy')}</p></Reveal></section><ReservationCallout /></PageFrame>; }

function GalleryPage() {
  const { locale, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [categoryImageIndices, setCategoryImageIndices] = useState<Record<string, number>>(() => Object.fromEntries(menuCategories.map((category) => [category.id, 0])));
  const entries = selectedCategory ? menuGalleryEntries.filter((entry) => entry.category === selectedCategory) : [];

  useEffect(() => {
    let cancelled = false;
    const timers = new Set<number>();
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (!cancelled) callback();
      }, delay);
      timers.add(timer);
    };
    const rotateCategoryImages = () => {
      menuCategories.forEach((category, index) => {
        schedule(() => {
          setCategoryImageIndices((current) => ({ ...current, [category.id]: current[category.id] + 1 }));
          if (index === menuCategories.length - 1) schedule(rotateCategoryImages, 20_000);
        }, index * 360);
      });
    };
    schedule(rotateCategoryImages, 20_000);
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return <PageFrame><PageHero label={t('gallery.label')} title={t('gallery.title')} copy={t('gallery.copy')} image={menuGalleryEntries[0].image} imageAlt={localize(menuGalleryEntries[0].alt, locale)} />
    <section className="gallery-page section-shell">
      {selectedCategory ? <>
        <button className="gallery-back" type="button" onClick={() => { setSelectedCategory(null); setLightbox(null); }}>← Sve kategorije</button>
        <div className="gallery-category-heading"><Eyebrow>{t('gallery.label')}</Eyebrow><h2>{localize(categoryMap[selectedCategory].label, locale)}</h2></div>
        <motion.div className="gallery-wall editorial-gallery" layout>{entries.map((entry, index) => <Reveal className={`gallery-tile gallery-tile-${(index % 5) + 1}`} key={localize(entry.title, locale)} delay={index * 0.05} variant="image"><button type="button" onClick={() => setLightbox(index)} aria-label={`${t('gallery.open')}: ${localize(entry.title, locale)}`}><img src={entry.image} alt={localize(entry.alt, locale)} /></button></Reveal>)}</motion.div>
      </> : <motion.div className="gallery-category-grid" layout>{menuCategories.map((category, index) => { const dishes = menuItems.filter((item) => item.category === category.id); const activeDish = dishes[categoryImageIndices[category.id] % dishes.length]; return <motion.button className="gallery-category-card" type="button" key={category.id} onClick={() => setSelectedCategory(category.id)} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -7 }} transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}><AnimatePresence initial={false} mode="wait"><motion.img key={activeDish.id} src={getMenuImage(activeDish)} alt={localize(category.label, locale)} initial={{ opacity: 0, scale: 1.045 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} /></AnimatePresence><span><small>{dishes.length} jela</small>{localize(category.label, locale)}<b aria-hidden="true">↗</b></span></motion.button>; })}</motion.div>}
    </section><GalleryLightbox entries={entries} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} /></PageFrame>;
}

function ReservationsPage() { const { t } = useLanguage(); const info = [[t('booking.hours'), contactDetails.hours.join(' · ')], [t('booking.duration'), t('booking.durationCopy')], [t('booking.groups'), t('booking.groupsCopy')], [t('booking.arrival'), t('booking.arrivalCopy')]]; return <PageFrame><PageHero label={t('reservation.label')} title={t('reservation.title')} copy={t('reservation.copy')} image={images.galleryD} imageAlt="Dinner guests" />
  <section className="reservations section-shell"><Reveal><Eyebrow>{t('reservation.eyebrow')}</Eyebrow><h2>{t('reservation.heading')}</h2></Reveal><Reveal delay={0.1}><ReservationForm /></Reveal></section><section className="booking-info section-shell"><Reveal><Eyebrow>{t('booking.eyebrow')}</Eyebrow><h2>{t('booking.title')}</h2></Reveal><div className="info-columns">{info.map(([title, body]) => <Reveal key={title} delay={0.08} className="info-rule"><h3>{title}</h3><p>{body}</p></Reveal>)}</div></section><FaqSection /></PageFrame>; }

function ContactPage() { const { t } = useLanguage(); const travel = [[t('contact.parking'), t('contact.parkingCopy')], [t('contact.transport'), t('contact.transportCopy')], [t('contact.taxi'), t('contact.taxiCopy')], [t('contact.accessibility'), t('contact.accessibilityCopy')]]; return <PageFrame><PageHero label={t('contact.label')} title={t('contact.title')} copy={t('contact.copy')} image={images.experience} imageAlt="Savorelle bar and dining room" />
  <section className="contact-details section-shell"><Reveal><Eyebrow>{t('contact.eyebrow')}</Eyebrow><h2>{t('contact.heading')}</h2></Reveal><div className="contact-grid"><Reveal className="contact-panel" delay={0.08}><div><h3>{t('contact.address')}</h3><p>{contactDetails.address}</p></div><div><h3>{t('contact.reservations')}</h3><p>{contactDetails.phone}<br />{contactDetails.reservationEmail}</p></div><div><h3>{t('contact.hours')}</h3>{contactDetails.hours.map((hour) => <p key={hour}>{hour}</p>)}</div></Reveal><Reveal className="map-panel" delay={0.14}><div className="map-lines" /><div><span>{t('contact.map')}</span><a className="secondary-action" href="https://maps.google.com/?q=Sarajevo" target="_blank" rel="noreferrer">{t('contact.directions')}</a></div></Reveal></div></section>
  <section className="getting-here section-shell"><Reveal><Eyebrow>{t('contact.arrivalEyebrow')}</Eyebrow><h2>{t('contact.arrivalTitle')}</h2></Reveal><div className="info-columns">{travel.map(([title, body]) => <Reveal className="info-rule" delay={0.08} key={title}><h3>{title}</h3><p>{body}</p></Reveal>)}</div></section>
  <section className="private-dining section-shell"><Reveal className="image-frame" variant="image"><img src={images.galleryC} alt="Private dining atmosphere" /></Reveal><Reveal delay={0.12}><Eyebrow>{t('contact.privateEyebrow')}</Eyebrow><h2>{t('contact.privateTitle')}</h2><p>{t('contact.privateCopy')}</p><a className="primary-action" href="mailto:events@savorelle.com">{t('contact.inquiry')} <span>↗</span></a></Reveal></section><ContactForm /></PageFrame>; }

function OrderPage() {
  const { locale, t } = useLanguage();
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup');
  const [category, setCategory] = useState(menuCategories[0].id);
  const [zone, setZone] = useState('central');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [checkout, setCheckout] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [flyingDish, setFlyingDish] = useState<{ image: string; fromX: number; fromY: number; toX: number; toY: number } | null>(null);
  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const deliveryZones = [{ id: 'central', fee: 2.5 }, { id: 'outer', fee: 4.5 }, { id: 'extended', fee: 6.5 }];
  const dishes = menuItems.filter((dish) => dish.category === category);
  const cartItems = menuItems.filter((dish) => (cart[dish.id] ?? 0) > 0);
  const subtotal = cartItems.reduce((total, dish) => total + dish.price * (cart[dish.id] ?? 0), 0);
  const deliveryFee = mode === 'delivery' ? deliveryZones.find((item) => item.id === zone)?.fee ?? 0 : 0;
  const total = subtotal + deliveryFee;
  const previewDish = menuItems.find((dish) => dish.id === previewId);
  const change = (id: string, delta: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));
  const cartCount = cartItems.reduce((count, dish) => count + (cart[dish.id] ?? 0), 0);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('savorelle-cart-change', { detail: { count: cartCount } }));
  }, [cartCount]);
  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener('savorelle-open-cart', openCart);
    return () => window.removeEventListener('savorelle-open-cart', openCart);
  }, []);
  const addDish = (dish: MenuItem, event: ReactMouseEvent<HTMLButtonElement>) => {
    change(dish.id, 1);
    const source = event.currentTarget.getBoundingClientRect();
    const target = document.querySelector<HTMLElement>('[data-cart-trigger]')?.getBoundingClientRect();
    if (!target) return;
    setFlyingDish({ image: getMenuImage(dish), fromX: source.left, fromY: source.top, toX: target.left + target.width / 2, toY: target.top + target.height / 2 });
  };
  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-order-category="${nextCategory}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }));
  };
  const moveCategory = (direction: -1 | 1) => {
    const currentIndex = Math.max(0, menuCategories.findIndex((item) => item.id === category));
    const nextIndex = (currentIndex + direction + menuCategories.length) % menuCategories.length;
    selectCategory(menuCategories[nextIndex].id);
  };
  const orderSummaryLabel = locale === 'bs' ? 'Pregled narudžbe' : 'Order summary';

  if (checkout) return <PageFrame><CheckoutFlow items={cartItems.map((dish) => ({ id: dish.id, name: localize(dish.name, locale), price: dish.price, quantity: cart[dish.id] ?? 0 }))} fulfillmentType={mode} deliveryZone={zone as 'central' | 'outer' | 'extended'} subtotal={subtotal} deliveryFee={deliveryFee} total={total} onBack={() => setCheckout(false)} onStartOver={() => { setCart({}); setCheckout(false); }} /></PageFrame>;

  return <PageFrame><PageHero label={t('order.label')} title={t('order.title')} copy={t('order.copy')} image={images.dishTwo} imageAlt="Savorelle pasta course" />
    <section className="order-page section-shell">
      <AnimatePresence>{flyingDish && <motion.img className="flying-dish" src={flyingDish.image} alt="" aria-hidden="true" initial={{ x: flyingDish.fromX, y: flyingDish.fromY, scale: .8, opacity: 1 }} animate={{ x: flyingDish.toX, y: flyingDish.toY, scale: .25, opacity: .15 }} transition={{ duration: .62, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => setFlyingDish(null)} />}</AnimatePresence>
      <AnimatePresence>{cartOpen && <motion.aside className="order-cart-drawer" role="dialog" aria-modal="true" aria-label="Korpa" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}><header><span>Vaša korpa</span><button type="button" onClick={() => setCartOpen(false)} aria-label="Zatvori korpu">×</button></header>{cartItems.length ? <><div className="drawer-items">{cartItems.map((dish) => <div key={dish.id}><span>{cart[dish.id]} × {localize(dish.name, locale)}</span><b>{formatPrice(dish.price * (cart[dish.id] ?? 0), locale)}</b></div>)}</div><div className="drawer-total"><span>Ukupno</span><strong>{formatPrice(total, locale)}</strong></div><button className="primary-action" type="button" onClick={() => { setCartOpen(false); setCheckout(true); }}>Nastavite na kupovinu <span>↗</span></button></> : <p>Korpa je trenutno prazna.</p>}</motion.aside>}</AnimatePresence>
      <header className="order-top" aria-labelledby="order-controls-title">
        <h2 id="order-controls-title">{t('order.label').toUpperCase()}</h2>
        <div className="order-mode" role="group" aria-label={t('order.type')}>{(['pickup', 'delivery'] as const).map((item) => <button type="button" className={mode === item ? 'is-active' : ''} onClick={() => setMode(item)} key={item} aria-pressed={mode === item}>{t(`order.${item}`)}</button>)}</div>
        <div className="order-category-nav" aria-label={t('order.categories')}>
          <button className="category-arrow category-arrow-prev" type="button" onClick={() => moveCategory(-1)} aria-label="Prethodne kategorije">←</button>
          <div className="order-categories" ref={categoryScrollerRef} role="tablist">{menuCategories.map((item) => <button type="button" role="tab" aria-selected={category === item.id} data-order-category={item.id} className={category === item.id ? 'is-active' : ''} onClick={() => selectCategory(item.id)} key={item.id}>{localize(item.label, locale)}</button>)}</div>
          <button className="category-arrow category-arrow-next" type="button" onClick={() => moveCategory(1)} aria-label="Sljedeće kategorije">→</button>
        </div>
      </header>
      <div className="order-layout"><div className="order-menu" id="order-menu"><AnimatePresence mode="wait" initial={false}><motion.div className="order-items" key={category} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .32, ease: [0.22, 1, 0.36, 1] }}>{dishes.map((dish, index) => <motion.article className="order-item" key={dish.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .34, delay: index * .055, ease: [0.22, 1, 0.36, 1] }}><button className="order-dish-image" type="button" onClick={() => setPreviewId(dish.id)} aria-label={`${t('gallery.open')}: ${localize(dish.name, locale)}`}><img src={getMenuImage(dish)} alt={localize(dish.name, locale)} /></button><div className="order-item-copy"><h3>{localize(dish.name, locale)}</h3><p>{localize(dish.description, locale)}</p><strong>{formatPrice(dish.price, locale)}</strong></div><div className="quantity-control"><button type="button" onClick={() => change(dish.id, -1)} aria-label={`${t('order.subtract')} ${localize(dish.name, locale)}`}>−</button><span>{cart[dish.id] ?? 0}</span><button type="button" onClick={(event) => addDish(dish, event)} aria-label={`${t('order.add')} ${localize(dish.name, locale)}`}>+</button></div></motion.article>)}</motion.div></AnimatePresence></div>
        <aside className={`order-cart ${cartItems.length ? 'is-ready' : ''}`}><Eyebrow>{orderSummaryLabel}</Eyebrow><span className="order-fulfillment-status">{t(`order.${mode}`)}</span><h2>{t(`order.${mode}`)}</h2>{cartItems.length ? <div className="cart-items">{cartItems.map((dish) => <div className="cart-row" key={dish.id}><span>{cart[dish.id]} × {localize(dish.name, locale)}</span><button className="cart-remove" type="button" onClick={() => setCart((current) => ({ ...current, [dish.id]: 0 }))} aria-label={`${t('order.remove')} ${localize(dish.name, locale)}`} title={t('order.remove')}>×</button></div>)}</div> : <p>{t('order.empty')}</p>}
          {mode === 'delivery' ? <label className="delivery-zone"><span>{t('order.deliveryZone')}</span><select value={zone} onChange={(event) => setZone(event.target.value)}>{deliveryZones.map((item) => <option key={item.id} value={item.id}>{t(`order.${item.id}`)} · {formatPrice(item.fee, locale)}</option>)}</select><small>{t('order.deliveryEstimate')}</small></label> : <p className="pickup-note">{t('order.freePickup')}</p>}
          <div className="cart-summary"><div><span>{t('order.subtotal')}</span><strong>{formatPrice(subtotal, locale)}</strong></div><div><span>{t('order.deliveryFee')}</span><strong>{mode === 'delivery' ? formatPrice(deliveryFee, locale) : '0 KM'}</strong></div><div className="cart-total"><span>{t('order.total')}</span><strong>{formatPrice(total, locale)}</strong></div></div><p className="demo-note">{t('order.demo')}</p><button className="primary-action" type="button" disabled={subtotal === 0} onClick={() => setCheckout(true)}>{t('order.continue')} <span>↗</span></button></aside></div>
      <DishLightbox image={previewDish ? getMenuImage(previewDish) : null} title={previewDish ? localize(previewDish.name, locale) : ''} onClose={() => setPreviewId(null)} />
    </section></PageFrame>;
}

function ContactForm() { const { t } = useLanguage(); const [sent, setSent] = useState(false); function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); } return <section className="contact-form-section section-shell"><Reveal><Eyebrow>{t('contact.noteEyebrow')}</Eyebrow><h2>{t('contact.noteTitle')}</h2></Reveal><Reveal delay={0.1}><form className="reservation-form contact-form" onSubmit={submit}><div className="form-grid"><label>{t('contact.name')}<input required /></label><label>{t('reservation.email')}<input type="email" required /></label><label>{t('reservation.phone')} <em>{t('contact.optional')}</em><input type="tel" /></label><label>{t('contact.subject')}<select defaultValue=""><option value="" disabled>{t('contact.selectSubject')}</option><option>{t('contact.reservations')}</option><option>{t('contact.privateEyebrow')}</option><option>{t('contact.general')}</option></select></label><label className="full-field">{t('contact.message')}<textarea required /></label></div><div className="form-footer"><p>{sent ? t('contact.sent') : t('contact.response')}</p><button className="primary-action" type="submit">{t('contact.send')} <span>↗</span></button></div></form></Reveal></section>; }

function FaqSection() { const { locale, t } = useLanguage(); const [open, setOpen] = useState(0); return <section className="faq section-shell"><Reveal><Eyebrow>{t('faq.eyebrow')}</Eyebrow><h2>{t('faq.title')}</h2></Reveal><div className="faq-list">{reservationFaqs.map((item, index) => <Reveal key={localize(item.question, locale)} delay={index * 0.04} variant="fade"><button className="faq-item" type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{localize(item.question, locale)}</span><b>{open === index ? '−' : '+'}</b></button><AnimatePresence>{open === index && <motion.p className="faq-answer" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{localize(item.answer, locale)}</motion.p>}</AnimatePresence></Reveal>)}</div></section>; }
function ReservationCallout() { const { t } = useLanguage(); return <section className="reservation-callout section-shell"><Reveal><Eyebrow>{t('common.reserveEyebrow')}</Eyebrow><h2>{t('common.reserveTitle')}</h2><a className="primary-action" href="/reservations">{t('common.reserveButton')} <span>↗</span></a></Reveal></section>; }
function PageFrame({ children }: { children: React.ReactNode }) { return <motion.main {...pageMotion}>{children}</motion.main>; }
function Footer() { const { t } = useLanguage(); return <footer className="footer"><div><a className="brand" href="/"><span>Savorelle</span></a><p>{t('footer.tagline')}</p></div><nav aria-label={t('footer.navigation')}><a href="/menu">{t('nav.menu')}</a><a href="/about">{t('nav.about')}</a><a href="/gallery">{t('nav.gallery')}</a><a href="/reservations">{t('nav.reservations')}</a><a href="/contact">{t('nav.contact')}</a></nav><div><p>{contactDetails.address}</p><p>{contactDetails.phone}</p><p>{t('footer.social')}</p></div></footer>; }
function getRoute() { return window.location.pathname.replace(/\/$/, '') || '/'; }
function App() { const { locale, t } = useLanguage(); const [route, setRoute] = useState(getRoute); const pages = useMemo<Record<string, React.ReactNode>>(() => ({ '/': <HomePage />, '/menu': <MenuPage />, '/about': <AboutPage />, '/gallery': <GalleryPage />, '/reservations': <ReservationsPage />, '/contact': <ContactPage />, '/order': <OrderPage /> }), [locale]); const metadata: Record<string, [string, string]> = { '/': [t('seo.homeTitle'), t('seo.homeDesc')], '/menu': [t('seo.menuTitle'), t('seo.menuDesc')], '/about': [t('seo.aboutTitle'), t('seo.aboutDesc')], '/gallery': [t('seo.galleryTitle'), t('seo.galleryDesc')], '/reservations': [t('seo.reservationTitle'), t('seo.reservationDesc')], '/contact': [t('seo.contactTitle'), t('seo.contactDesc')], '/order': [t('seo.orderTitle'), t('seo.orderDesc')] };
  useEffect(() => {
    const scrollToHash = (hash: string) => {
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    const onPopState = () => {
      setRoute(getRoute());
      scrollToHash(window.location.hash);
    };
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element).closest('a[href^="/"]') as HTMLAnchorElement | null;
      if (!target || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const nextRoute = target.pathname.replace(/\/$/, '') || '/';
      if (!pages[nextRoute]) return;
      event.preventDefault();
      window.history.pushState({}, '', `${nextRoute}${target.hash}`);
      setRoute(nextRoute);
      scrollToHash(target.hash);
    };
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onClick);
    };
  }, [pages]);
  useEffect(() => { const [title, description] = metadata[route] ?? metadata['/']; document.title = title; document.querySelector('meta[name="description"]')?.setAttribute('content', description); }, [metadata, route]);
  return <><Navigation /><AnimatePresence mode="wait"><motion.div key={`${route}-${locale}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>{pages[route] ?? <HomePage />}</motion.div></AnimatePresence><Footer /></>; }
export default App;
