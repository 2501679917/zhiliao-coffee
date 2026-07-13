export function initGallery(root) {
  if (!root) return;
  const cards = [...root.querySelectorAll('.story-card')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setActive = (selected) => {
    cards.forEach((card) => {
      const active = card === selected && card.getAttribute('aria-expanded') !== 'true';
      card.classList.toggle('active', active);
      card.setAttribute('aria-expanded', String(active));
      if (!active) { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); }
    });
  };
  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (reduceMotion || event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx'); card.style.removeProperty('--ry');
    });
    card.addEventListener('click', () => setActive(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActive(card); }
    });
  });
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) setActive(null);
  });
}
