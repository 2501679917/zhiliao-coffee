# Zhiliao Coffee Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Zhiliao Coffee single-page site as an identity-faithful, atmospheric brand experience using the real cafe, its “知了” mark, interactive imagery, a featured menu, and reliable reservation feedback.

**Architecture:** Keep the current static HTML/CSS/vanilla-JavaScript frontend and FastAPI/SQLite backend. Separate browser responsibilities into focused ES modules for gallery interaction, menu dialog behavior, and form submission while keeping content and accessibility semantics in `index.html`. Store all production media locally; generated or edited imagery must pass a side-by-side identity review before use.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, Node.js built-in test runner, Python 3, FastAPI, Pydantic, SQLite, unittest.

---

## File map

- Modify `outputs/cafe-website/index.html`: semantic one-page content, real address, featured menu, dialog, reservation UI.
- Replace `outputs/cafe-website/assets/css/styles.css`: design tokens, layout, gallery states, dialog, forms, responsive and reduced-motion rules.
- Replace `outputs/cafe-website/assets/js/main.js`: application bootstrap, navigation, imports, page-level wiring.
- Create `outputs/cafe-website/assets/js/gallery.js`: pointer, touch, keyboard, and single-active-card behavior.
- Create `outputs/cafe-website/assets/js/menu-dialog.js`: accessible full-menu dialog and focus restoration.
- Create `outputs/cafe-website/assets/js/reservation.js`: validation, timeout, API submission, and explicit states.
- Create `outputs/cafe-website/assets/data/menu.js`: canonical menu names, categories, prices, and featured flags.
- Create `outputs/cafe-website/assets/images/source/`: copied original cafe references for provenance.
- Create `outputs/cafe-website/assets/images/brand/zhiliao-mark.png`: cleaned transparent brand mark derived from `E:\photo\1.jpg`.
- Create `outputs/cafe-website/assets/images/brand/zhiliao-mark-source.jpg`: cropped source evidence for the mark.
- Create `outputs/cafe-website/assets/images/space/`: approved identity-faithful space images.
- Create `outputs/cafe-website/assets/images/menu/`: approved drink and dessert images.
- Create `outputs/cafe-website/tests/site.test.mjs`: static-content, menu, interaction contract, and external-image tests.
- Create `outputs/cafe-website/backend/test_main.py`: reservation validation and endpoint tests.
- Modify `outputs/cafe-website/backend/main.py`: stricter validation, relative API use, and safe database failure messages.
- Modify `outputs/cafe-website/README.md`: correct UTF-8 documentation and local run/test instructions.

### Task 1: Establish the media inventory and brand assets

**Files:**
- Create: `outputs/cafe-website/assets/images/source/*.jpg`
- Create: `outputs/cafe-website/assets/images/brand/zhiliao-mark-source.jpg`
- Create: `outputs/cafe-website/assets/images/brand/zhiliao-mark.png`
- Create: `outputs/cafe-website/assets/images/media-manifest.json`

- [ ] **Step 1: Copy only approved source references into the project**

Copy the seven person-free space/detail originals, the two menu references, and the three new screenshots from `E:\photo`. Do not copy `e0906b3667e9ca1af43c14730ca2c81b.jpg` because it contains a person.

Run:

```powershell
New-Item -ItemType Directory -Force outputs/cafe-website/assets/images/source,outputs/cafe-website/assets/images/brand,outputs/cafe-website/assets/images/space,outputs/cafe-website/assets/images/menu
Copy-Item E:\photo\0a04e79ffeae14b33037a4a5a52dd705.jpg,E:\photo\222eb3e3f1e62eaa2fe58cb2dcc6e17d.jpg,E:\photo\288bcee7e6de99e46b18f9a9ecd114bb.jpg,E:\photo\38b4a13d22c181e3900f02816d41f7ab.jpg,E:\photo\4be2d78b3ccf87a3ade76aab5201c902.jpg,E:\photo\5c901d5e62d3d50bc2dd969b00703106.jpg,E:\photo\ca14a014db3bf18055d6b2d63da2bfc1.jpg,E:\photo\0e447ffc9d03f2d83cd3f67258f869a0.jpg,E:\photo\4f9141a4d02e56d9675698488ef3944b.jpg,E:\photo\9465cc0a851a8663f22b8965ddfa5a2a.jpg,E:\photo\1.jpg,E:\photo\c101ffeef6a4051e54081891d67dfdeb.jpg outputs/cafe-website/assets/images/source/
```

Expected: 12 source files and no file named `e0906b3667e9ca1af43c14730ca2c81b.jpg`.

- [ ] **Step 2: Create the provenance manifest**

Write `media-manifest.json` with an entry for every source containing `sourceFile`, `kind`, `personFree`, `allowedEdits`, and `productionUse`. Set `personFree` to `true`; use `productionUse: "reference-only"` for screenshots and `productionUse: "candidate"` for clean cafe originals.

- [ ] **Step 3: Extract the brand mark with the image editing skill**

Invoke the available `imagegen` skill for an identity-preserving edit of `1.jpg`. Crop to the wooden cafe sign, remove the phone screenshot UI, wall, pipe, and red address sign, then isolate the exact white “知了” strokes on transparency. Do not redraw it using a typeface. Save the crop as `zhiliao-mark-source.jpg` and the transparent result as `zhiliao-mark.png`.

- [ ] **Step 4: Verify the extracted mark**

Open the source crop and transparent PNG side by side. Confirm the distinctive long horizontal stroke, lower curved stroke, and relative spacing match the photographed sign. Confirm there are no screenshot icons or wall pixels.

- [ ] **Step 5: Commit the media inventory**

```bash
git add outputs/cafe-website/assets/images
git commit -m "assets: add approved cafe references and brand mark"
```

### Task 2: Generate and approve identity-faithful production imagery

**Files:**
- Create: `outputs/cafe-website/assets/images/space/hero-courtyard.webp`
- Create: `outputs/cafe-website/assets/images/space/paper-lamp-room.webp`
- Create: `outputs/cafe-website/assets/images/space/window-garden.webp`
- Create: `outputs/cafe-website/assets/images/space/ceramics-shelf.webp`
- Create: `outputs/cafe-website/assets/images/menu/matcha-pair.webp`
- Create: `outputs/cafe-website/assets/images/menu/citrus-coffee-dessert.webp`
- Modify: `outputs/cafe-website/assets/images/media-manifest.json`

- [ ] **Step 1: Generate four space edits from matching references**

Use the `imagegen` skill in image-to-image mode. Preserve the real architecture and furnishings while improving crop, lens perspective, natural warm light, texture, and edge cleanliness. Use `ca14...` for the hero, `222e...`/`0a04...` for the paper-lamp room, `4be2...` for the window garden, and `288b...` for the ceramics shelf. Explicitly prohibit people, new rooms, new windows, added seating, text, signs, and logos.

- [ ] **Step 2: Generate two drink edits from matching references**

Use `9465...` for the matcha pair and `c101...` for the citrus drink/dessert. Remove app chrome, usernames, reaction icons, black screenshot bars, date stamps, and map watermarks. Preserve cup shape, drink color, garnish, dessert type, tabletop character, and believable cafe lighting.

- [ ] **Step 3: Review every result against its source**

Reject any image that changes the building layout, invents products, contains people, retains UI/watermarks, or makes the real space unrecognizable. Record the approved output filename and its reference filename in `media-manifest.json`.

- [ ] **Step 4: Check production dimensions and weight**

Run:

```powershell
Get-ChildItem outputs/cafe-website/assets/images/space,outputs/cafe-website/assets/images/menu -File | Select-Object Name,Length
```

Expected: every production image is WebP and preferably below 1.2 MB; the hero is at least 1600 px wide and card images at least 900 px wide.

- [ ] **Step 5: Commit approved production imagery**

```bash
git add outputs/cafe-website/assets/images
git commit -m "assets: add identity-faithful cafe imagery"
```

### Task 3: Define the canonical menu and write static contract tests

**Files:**
- Create: `outputs/cafe-website/assets/data/menu.js`
- Create: `outputs/cafe-website/tests/site.test.mjs`

- [ ] **Step 1: Write the menu data**

Export `MENU_ITEMS` containing these verified items and prices: 巴斯克 38, 桂花乌龙酵素水洗 48, 冬日草莓 38, 话梅气泡 32, 红标瑰夏日晒 88, 抹茶/豆乳拿铁 32, 柚子雪松 38, 芝士话梅 38, 热可可 32, 草莓红颜日晒 38, 可可坚果酥水洗 38. Give each item `id`, `name`, `category`, `price`, `featured`, `description`, and optional `image`. Mark 6–8 items as featured, prioritizing the two approved product images.

- [ ] **Step 2: Write failing static tests**

In `site.test.mjs`, use `node:test`, `node:assert/strict`, and `fs.readFileSync`. Assert that `index.html` contains the real address `成都市武侯区玉林街2号民沁苑2栋4单元1层1号`, contains `11:00 - 18:30`, references `zhiliao-mark.png`, has `id="full-menu-dialog"`, contains no `images.unsplash.com`, contains no `09:00` or `20:00`, and contains no person-source filename.

- [ ] **Step 3: Run tests and confirm the existing page fails**

Run:

```bash
node --test outputs/cafe-website/tests/site.test.mjs
```

Expected: failures for the brand mark, menu dialog, Unsplash URLs, and old timeline times.

- [ ] **Step 4: Commit the test and menu contract**

```bash
git add outputs/cafe-website/assets/data/menu.js outputs/cafe-website/tests/site.test.mjs
git commit -m "test: define redesign content contracts"
```

### Task 4: Rebuild the semantic page and visual system

**Files:**
- Modify: `outputs/cafe-website/index.html`
- Replace: `outputs/cafe-website/assets/css/styles.css`

- [ ] **Step 1: Replace the HTML structure**

Build semantic sections in this order: fixed navigation, courtyard hero, story, interactive space gallery, featured menu, native `<dialog id="full-menu-dialog">`, visit/reservation, footer. Use the real address verbatim and `11:00 - 18:30`. Remove the fictional timeline, outdoor-deck/private-room claims, contact-message form, inline styles, and every external photo URL.

- [ ] **Step 2: Add accessible content and media contracts**

Use descriptive `alt` text for content images, `alt=""` for decoration, `aria-expanded` on gallery cards, a visible `<label>` for each form control, an `aria-live="polite"` status region, and a skip link. Add width/height plus `loading="lazy"` to non-hero images; preload the local hero image.

- [ ] **Step 3: Replace CSS with the approved design system**

Define tokens for ink green `#20241e`, dark wood `#342f26`, paper `#eee8da`, moss `#6f725b`, muted text `#aaa99d`, and vermilion `#a84f3a`. Implement editorial typography, asymmetric gallery columns, responsive menu and reservation layouts, focus-visible rings, safe-area spacing, and image failure backgrounds.

- [ ] **Step 4: Add motion and reduced-motion rules**

Limit card tilt to 3 degrees and transition durations to 500–800 ms. Under `@media (prefers-reduced-motion: reduce)`, set animation/transition duration near zero, remove transforms, and keep content readable through opacity-only state changes.

- [ ] **Step 5: Run the static tests**

```bash
node --test outputs/cafe-website/tests/site.test.mjs
```

Expected: all content-contract tests pass.

- [ ] **Step 6: Commit the semantic redesign**

```bash
git add outputs/cafe-website/index.html outputs/cafe-website/assets/css/styles.css
git commit -m "feat: rebuild atmospheric cafe page"
```

### Task 5: Implement gallery and menu interactions

**Files:**
- Create: `outputs/cafe-website/assets/js/gallery.js`
- Create: `outputs/cafe-website/assets/js/menu-dialog.js`
- Modify: `outputs/cafe-website/assets/js/main.js`
- Modify: `outputs/cafe-website/tests/site.test.mjs`

- [ ] **Step 1: Extend tests for interaction contracts**

Assert `gallery.js` exports `initGallery`, contains listeners for `pointermove`, `pointerleave`, `click`, and `keydown`, and updates `aria-expanded`. Assert `menu-dialog.js` exports `initMenuDialog`, calls `showModal()` and `close()`, listens for `Escape`, and restores focus to the opener.

- [ ] **Step 2: Run the tests to verify the modules are missing**

```bash
node --test outputs/cafe-website/tests/site.test.mjs
```

Expected: module-file assertions fail.

- [ ] **Step 3: Implement `initGallery`**

Use one active card at a time. Fine pointers update CSS variables `--rx` and `--ry` from pointer position; touch/click toggles active state without preventing vertical scroll; Enter and Space toggle the focused card; pointer leave resets CSS variables. Update `aria-expanded` on every state transition.

- [ ] **Step 4: Implement `initMenuDialog`**

Render categorized items from `MENU_ITEMS`, open with `showModal()`, close from the close button, backdrop click, or Escape, and return focus to the opening button. Do not create a route or online-order action.

- [ ] **Step 5: Replace `main.js` with a small bootstrap**

Import both initializers, wire the mobile navigation and scroll state after `DOMContentLoaded`, and avoid scroll handlers that mutate hero background position on every frame.

- [ ] **Step 6: Run the interaction contract tests**

```bash
node --test outputs/cafe-website/tests/site.test.mjs
```

Expected: all tests pass.

- [ ] **Step 7: Commit interactions**

```bash
git add outputs/cafe-website/assets/js outputs/cafe-website/tests/site.test.mjs
git commit -m "feat: add touch-responsive gallery and menu dialog"
```

### Task 6: Make reservation validation and failure states reliable

**Files:**
- Create: `outputs/cafe-website/assets/js/reservation.js`
- Modify: `outputs/cafe-website/assets/js/main.js`
- Modify: `outputs/cafe-website/backend/main.py`
- Create: `outputs/cafe-website/backend/test_main.py`

- [ ] **Step 1: Write backend validation tests**

Use `unittest`, `tempfile.TemporaryDirectory`, and FastAPI `TestClient`. Patch `DB_FILE` to a temporary database and call `init_db()`. Test a valid reservation returns 200; blank name, malformed phone, date in the past, time before 11:00, time after 18:30, guests below 1, and guests above 20 each return 422.

- [ ] **Step 2: Run the backend tests and confirm failures**

```bash
python -m unittest outputs.cafe-website.backend.test_main -v
```

If the hyphenated directory prevents module import, run:

```bash
python outputs/cafe-website/backend/test_main.py
```

Expected: current permissive Pydantic model fails the invalid-input assertions.

- [ ] **Step 3: Tighten the reservation model**

Use Pydantic field constraints and validators: strip non-empty names, accept a 7–20 character phone containing digits and common separators, require `date >= date.today()`, require `11:00 <= time <= 18:30`, and constrain guests to 1–20. Return a generic 500 detail such as `预约暂时无法保存，请稍后重试` instead of leaking raw exception text.

- [ ] **Step 4: Implement browser reservation states**

Export `initReservationForm`. Submit to relative `/api/reservations` with an `AbortController` timeout of 10 seconds. Set states `idle`, `submitting`, `success`, and `error`; disable the submit button only during submission; display backend validation messages without claiming success; keep entered data after failure; reset only after success.

- [ ] **Step 5: Wire the reservation initializer**

Import and call `initReservationForm` from `main.js`. Set the date input minimum to the local current date and constrain the time input to 11:00–18:30 in HTML as a first-line client hint.

- [ ] **Step 6: Run backend and frontend tests**

```bash
python outputs/cafe-website/backend/test_main.py
node --test outputs/cafe-website/tests/site.test.mjs
```

Expected: both suites pass.

- [ ] **Step 7: Commit reservation reliability**

```bash
git add outputs/cafe-website/backend/main.py outputs/cafe-website/backend/test_main.py outputs/cafe-website/assets/js/reservation.js outputs/cafe-website/assets/js/main.js outputs/cafe-website/index.html
git commit -m "feat: validate reservations and expose honest states"
```

### Task 7: Perform responsive, accessibility, and content verification

**Files:**
- Modify: `outputs/cafe-website/tests/site.test.mjs`
- Modify: `outputs/cafe-website/README.md`

- [ ] **Step 1: Add final negative assertions**

Assert the HTML and CSS/JS contain none of: `unsplash.com`, `e0906b3667e9ca1af43c14730ca2c81b`, `09:00`, `20:00`, `户外木露台`, or `私密木屋包间`. Assert all production image paths exist and every featured item price matches `MENU_ITEMS`.

- [ ] **Step 2: Start the application**

```bash
python outputs/cafe-website/backend/main.py
```

Expected: Uvicorn serves the page at `http://localhost:8000` and `/api/reservations` is available.

- [ ] **Step 3: Test desktop interactions manually**

At 1440×900 and 1024×768, verify hero crop, fixed navigation contrast, gallery tilt below 3 degrees, hover fade, text readability, keyboard Enter/Space behavior, dialog focus return, and no horizontal overflow.

- [ ] **Step 4: Test mobile interactions manually**

At 390×844 and 360×800, verify one-tap gallery expansion, second-tap collapse, switching cards, uninterrupted vertical scrolling, menu dialog close behavior, reservation controls above the safe area, and no content hidden behind the mobile action bar.

- [ ] **Step 5: Test reduced motion and image fallback**

Enable reduced motion in browser emulation and verify tilt/parallax disappear. Temporarily rename one non-hero production image and verify the paper-colored fallback and alternative text remain usable, then restore the exact filename.

- [ ] **Step 6: Update README**

Document UTF-8 project purpose, real asset policy, install/run commands, Node and Python test commands, the real address, `11:00–18:30`, and the requirement that regenerated images remain identity-faithful and person-free.

- [ ] **Step 7: Run all automated checks**

```bash
node --test outputs/cafe-website/tests/site.test.mjs
python outputs/cafe-website/backend/test_main.py
git status --short
```

Expected: both test suites pass; only intended README/test edits remain before the final commit.

- [ ] **Step 8: Commit documentation and verification**

```bash
git add outputs/cafe-website/README.md outputs/cafe-website/tests/site.test.mjs
git commit -m "docs: document cafe site operation and verification"
```

### Task 8: Push the completed redesign

**Files:**
- No new files; verify repository state.

- [ ] **Step 1: Review the commit series**

```bash
git log --oneline --decorate -10
git diff origin/main...main --stat
```

Expected: separate commits for assets, tests/contracts, page design, interactions, reservations, and documentation.

- [ ] **Step 2: Verify no source screenshot or database leak**

```bash
git ls-files | Select-String -Pattern 'cafe\.db|__pycache__|e0906b3667e9ca1af43c14730ca2c81b'
```

Expected: no output.

- [ ] **Step 3: Push `main`**

```bash
git push origin main
```

Expected: GitHub reports `main -> main` and the remote repository contains the completed site.

