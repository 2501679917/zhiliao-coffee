import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const expectedMenu = new Map([
  ['巴斯克', 38], ['桂花乌龙酵素水洗', 48], ['冬日草莓', 38], ['话梅气泡', 32],
  ['红标瑰夏日晒', 88], ['抹茶/豆乳拿铁', 32], ['柚子雪松', 38], ['芝士话梅', 38],
  ['热可可', 32], ['草莓红颜日晒', 38], ['可可坚果酥水洗', 38],
]);

async function menuItems() {
  const source = await readFile(new URL('assets/data/menu.js', root), 'utf8');
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).MENU_ITEMS;
}

test('uses verified location and hours', () => {
  assert.match(html, /成都市武侯区玉林街2号民沁苑2栋4单元1层1号/);
  assert.match(html, /11:00\s*[-–—至]\s*18:30/);
});
test('uses local brand and full menu dialog', () => {
  assert.match(html, /zhiliao-mark\.png/);
  assert.match(html, /id=["']full-menu-dialog["']/);
});
test('removes unrelated and inaccurate legacy content', () => {
  assert.doesNotMatch(html, /images\.unsplash\.com|09:00|20:00|e0906b3667e9ca1af43c14730ca2c81b|户外木露台|私密木屋包间/);
});
test('every referenced local image exists', async () => {
  const paths = [...html.matchAll(/(?:src|href)=["'](assets\/images\/[^"']+)["']/g)].map((match) => match[1]);
  assert.ok(paths.length > 8);
  await Promise.all(paths.map((path) => access(new URL(path, root))));
});
test('interaction modules expose accessible contracts', async () => {
  const gallery = await readFile(new URL('assets/js/gallery.js', root), 'utf8');
  const menu = await readFile(new URL('assets/js/menu-dialog.js', root), 'utf8');
  const reservation = await readFile(new URL('assets/js/reservation.js', root), 'utf8');
  assert.match(gallery, /export function initGallery|pointermove|pointerleave|keydown|aria-expanded/);
  assert.match(menu, /export function initMenuDialog|showModal\(\)|close\(\)|focus\(\)/);
  assert.match(reservation, /export function initReservationForm|AbortController|10000|\/api\/reservations/);
});
test('menu exports exact verified names and prices', async () => {
  const items = await menuItems();
  assert.equal(items.length, expectedMenu.size);
  assert.deepEqual(new Map(items.map(({ name, price }) => [name, price])), expectedMenu);
});
test('menu entries have stable complete fields', async () => {
  const items = await menuItems();
  assert.equal(new Set(items.map(({ id }) => id)).size, items.length);
  for (const item of items) {
    assert.ok(item.id && item.category && item.description);
    assert.equal(typeof item.price, 'number');
    assert.equal(typeof item.featured, 'boolean');
    assert.ok(item.image === null || typeof item.image === 'string');
  }
  const count = items.filter(({ featured }) => featured).length;
  assert.ok(count >= 6 && count <= 8);
});
