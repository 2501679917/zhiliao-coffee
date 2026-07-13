import { MENU_ITEMS } from '../data/menu.js';

export function initMenuDialog() {
  const dialog = document.querySelector('#full-menu-dialog');
  const content = document.querySelector('#full-menu-content');
  if (!dialog || !content) return;
  const groups = Map.groupBy ? Map.groupBy(MENU_ITEMS, (item) => item.category) : MENU_ITEMS.reduce((map, item) => map.set(item.category, [...(map.get(item.category) || []), item]), new Map());
  content.innerHTML = [...groups].map(([category, items]) => `<section class="menu-category"><h3>${category}</h3>${items.map((item) => `<div class="menu-row"><div><strong>${item.name}</strong><small>${item.description}</small></div><span>¥${item.price}</span></div>`).join('')}</section>`).join('');
  let opener = null;
  document.querySelectorAll('[data-menu-open]').forEach((button) => button.addEventListener('click', () => { opener = button; dialog.showModal(); }));
  const close = () => { dialog.close(); opener?.focus(); };
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
}
