import { initGallery } from './gallery.js';
import { initMenuDialog } from './menu-dialog.js';
import { initReservationForm } from './reservation.js';

const header = document.querySelector('#site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 36);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
});
nav?.addEventListener('click', ({ target }) => {
  if (target.closest('a')) {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting));
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

initGallery(document.querySelector('[data-gallery]'));
initMenuDialog();
initReservationForm(document.querySelector('#reservation-form'));
