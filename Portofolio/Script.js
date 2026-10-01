(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('navMenu');
  const toTop = document.getElementById('toTop');
  const links = [...menu.querySelectorAll('a')];

  /* Navbar berubah saat scroll + tombol back to top */
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Hamburger menu */
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menuBtn.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) setMenu(false); });

  /* Active nav indicator (smooth scroll dikerjakan CSS scroll-behavior) */
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && navObserver.observe(s));

  /* Scroll reveal */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('visible'));
  }

  /* Filter skills */
  const chips = document.querySelectorAll('.chip');
  const skillItems = document.querySelectorAll('.skill-list li');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    skillItems.forEach(li => li.classList.toggle('dim', f !== 'all' && li.dataset.status !== f));
  }));

  /* Lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  let lastFocus = null;

  const openLb = (img) => {
    lastFocus = document.activeElement;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };
  const closeLb = () => {
    if (lb.hidden) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  document.querySelectorAll('.hobby-btn').forEach(btn =>
    btn.addEventListener('click', () => openLb(btn.querySelector('img'))));
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLb(); setMenu(false); }
  });

  /* Tahun otomatis di footer */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
