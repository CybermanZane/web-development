import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n';

const navItems = [
  ['nav.home', '/'], ['nav.menu', '/menu'], ['nav.about', '/about'], ['nav.gallery', '/gallery'], ['nav.reservations', '/reservations'], ['nav.contact', '/contact'],
] as const;

export function Navigation() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    const updateCart = (event: Event) => setCartCount((event as CustomEvent<{ count: number }>).detail?.count ?? 0);
    window.addEventListener('savorelle-cart-change', updateCart);
    return () => window.removeEventListener('savorelle-cart-change', updateCart);
  }, []);

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="/" aria-label={t('nav.brand')}>
        <img className="brand-mark" src="/images/savorelle-s-mark.png" alt="" />
      </a>

      <nav className="desktop-nav" aria-label={t('nav.label')}>
        {navItems.map(([label, href]) => (
          <a key={label} href={href} aria-current={currentPath === href ? 'page' : undefined}>
            {t(label)}
          </a>
        ))}
      </nav>

      <a className="nav-reserve" href="/order#order-menu" aria-current={currentPath === '/order' ? 'page' : undefined}>
        {t('nav.order')}
        <span aria-hidden="true">↗</span>
      </a>

      <button className={`nav-cart ${cartCount ? 'has-items' : ''}`} data-cart-trigger type="button" aria-label={`Korpa, ${cartCount} artikala`} onClick={() => { if (currentPath === '/order') { window.dispatchEvent(new Event('savorelle-open-cart')); } else { window.location.href = '/order#order-menu'; } }}>
        <span className="nav-cart-icon" aria-hidden="true" />
        <span className="nav-cart-count">{cartCount}</span>
      </button>

      <div className="language-switcher" aria-label="Language">
        <button type="button" aria-pressed={locale === 'bs'} className={locale === 'bs' ? 'is-active' : ''} onClick={() => setLocale('bs')}>BS</button>
        <button type="button" aria-pressed={locale === 'en'} className={locale === 'en' ? 'is-active' : ''} onClick={() => setLocale('en')}>EN</button>
      </div>

      <button
        className={`menu-toggle ${open ? 'is-open' : ''}`}
        type="button"
        aria-label={open ? t('nav.close') : t('nav.open')}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label={t('nav.mobileLabel')}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {navItems.map(([label, href], index) => (
              <motion.a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={currentPath === href ? 'page' : undefined}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.055 }}
              >
                {t(label)}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
