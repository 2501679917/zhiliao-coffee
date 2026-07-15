# Local Business Website Skill Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish, validate, and smoke-test the personal `build-local-business-website` Codex skill without changing the completed 知了 COFFEE website or the user's backup files.

**Architecture:** Keep the skill installed only at `C:\Users\林风\.codex\skills\build-local-business-website`. Add UI metadata through the official skill generator, harden only failures demonstrated by smoke tests, and use temporary fixtures for verification. Because the skill directory is outside the `zhiliao-coffee` Git repository, repository commits contain documentation only, not a duplicate skill copy.

**Tech Stack:** Codex skill Markdown/YAML, Python 3 standard library, PowerShell, Node test runner, FastAPI unittest suite, Git.

---

### Task 1: Add UI metadata and validate skill structure

**Files:**
- Create: `C:\Users\林风\.codex\skills\build-local-business-website\agents\openai.yaml`
- Verify: `C:\Users\林风\.codex\skills\build-local-business-website\SKILL.md`

- [ ] **Step 1: Generate deterministic UI metadata in UTF-8 mode**

Run:

```powershell
python -X utf8 C:\Users\林风\.codex\skills\.system\skill-creator\scripts\generate_openai_yaml.py C:\Users\林风\.codex\skills\build-local-business-website `
  --interface 'display_name=Local Business Website Builder' `
  --interface 'short_description=Build authentic websites for physical local businesses' `
  --interface 'default_prompt=Use $build-local-business-website to create or redesign an authentic, responsive website for a physical local business.'
```

Expected file:

```yaml
interface:
  display_name: "Local Business Website Builder"
  short_description: "Build authentic websites for physical local businesses"
  default_prompt: "Use $build-local-business-website to create or redesign an authentic, responsive website for a physical local business."
```

- [ ] **Step 2: Verify frontmatter and directory shape**

Confirm that `SKILL.md` frontmatter contains only `name` and `description`, the folder name matches `build-local-business-website`, all referenced scripts/references exist, and no README, project-specific assets, cache, or credentials were added.

- [ ] **Step 3: Run the official validator with UTF-8 enabled**

Run:

```powershell
$env:PYTHONUTF8='1'
python C:\Users\林风\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\林风\.codex\skills\build-local-business-website
```

Expected: exit code `0` and `Skill is valid!`. Do not edit the bundled system validator merely to change the machine's CP936 default encoding.

### Task 2: Harden demonstrated script failures

**Files:**
- Modify: `C:\Users\林风\.codex\skills\build-local-business-website\scripts\inventory_media.py`
- Modify: `C:\Users\林风\.codex\skills\build-local-business-website\scripts\start_demo_tunnel.ps1`
- Modify: `C:\Users\林风\.codex\skills\build-local-business-website\scripts\audit_site.py`

- [ ] **Step 1: Make media inventory continue after an unreadable/corrupt candidate**

Wrap each candidate's stat/dimension/hash work in a per-file `try` block. Keep valid items in `items`, append failures to an `errors` array with the relative file and exception message, add `error_count`, print/write the complete report, and exit `1` when `errors` is non-empty. The success schema remains backward-compatible through `root`, `count`, and `items`.

Target control flow:

```python
errors = []
for path in candidates:
    relative = path.relative_to(args.root).as_posix()
    try:
        stat = path.stat()
        size = image_size(path)
        # append the normal item
    except (OSError, ValueError, struct.error) as error:
        errors.append({"file": relative, "error": f"{type(error).__name__}: {error}"})

result = {
    "root": str(args.root.resolve()),
    "count": len(items),
    "error_count": len(errors),
    "items": items,
    "errors": errors,
}
return 1 if errors else 0
```

- [ ] **Step 2: Give the tunnel script a non-network help path**

Add comment-based help plus a `-Help` switch, `-h` alias, and raw `--help` handling before probing localhost. Help must print the service URL, cloudflared path, state directory parameters, temporary-link warning, and privacy prerequisite, then exit `0` without starting a process or opening a tunnel. Do not advertise `-?`: Windows PowerShell may consume it at the `powershell.exe -File` host boundary before the script can handle it; `Get-Help .\start_demo_tunnel.ps1` is the native detailed-help path.

After `cloudflared` starts, wrap PID writing, URL discovery, and public HTTP verification in one failure-cleanup boundary. Any exception after process creation must stop the newly started process before rethrowing; only a fully verified HTTP 200 result may leave the tunnel running.

Target entry behavior:

```powershell
param(
  [switch]$Help,
  [string]$ServiceUrl = 'http://localhost:8000',
  [string]$CloudflaredPath = 'cloudflared',
  [string]$StateDir = "$env:TEMP\local-business-demo"
)
if ($Help -or $args -contains '--help') {
  # print usage and return before Invoke-WebRequest
  exit 0
}
```

- [ ] **Step 3: Correct common website-reference audit boundaries**

Parse both `src`/`href`/CSS `url(...)` and `srcset` candidates. Strip query strings and fragments before resolving local paths. Resolve `/assets/...` from the audited site root, reject any resolved local target outside that root with an `outside-root` finding, and keep non-image external links allowed.

Skip common non-production directories such as `tests`, `test`, `node_modules`, `.git`, and `__pycache__`. Parse CSS `url(...)` only in CSS files so JavaScript `new URL(...)` calls are not mistaken for production assets; ignore encoded local fragments such as `%23filter-id` inside data-backed SVG/CSS content.

Target resolution rules:

```python
clean_ref = ref.split('#', 1)[0].split('?', 1)[0]
target = (args.root / clean_ref.lstrip('/')) if clean_ref.startswith('/') else (path.parent / clean_ref)
target = target.resolve()
try:
    target.relative_to(site_root)
except ValueError:
    findings.append({'type': 'outside-root', 'file': rel, 'value': ref})
    continue
```

For `srcset`, split comma-separated candidates and audit the URL portion before each density/width descriptor. Accept separators with or without whitespace (`a.jpg 1x,b.jpg 2x`) without merging the candidates; preserve `data:` URL handling.

- [ ] **Step 4: Smoke-test all three scripts in a temporary directory**

Verify:

```powershell
python ...\inventory_media.py --help
python ...\audit_site.py --help
powershell -NoProfile -File ...\start_demo_tunnel.ps1 --help
```

Use temporary fixtures to prove that inventory reports dimensions/hash and preserves its source; a corrupt image is reported while valid files remain in the report; audit returns `0` for a clean site and `1` for external images, missing local assets, forbidden filenames, denied text, outside-root references, and external `srcset`; root-relative resources and `index.html#fragment` resolve without false positives; the completed 知了 COFFEE site audits with `count: 0`; tunnel preflight reports a clear local-service or cloudflared error without creating a public tunnel.

### Task 3: Confirm discovery and protect the existing website

**Files:**
- Verify: `C:\Users\林风\.codex\skills\build-local-business-website\agents\openai.yaml`
- Verify: `C:\Users\林风\Documents\Codex\2026-07-12\i-want-to-create-a-website\outputs\cafe-website\tests\site.test.mjs`
- Verify: `C:\Users\林风\Documents\Codex\2026-07-12\i-want-to-create-a-website\outputs\cafe-website\backend\test_main.py`

- [ ] **Step 1: Confirm Codex discovery evidence**

Confirm the skill remains under the fallback discovery root `C:\Users\林风\.codex\skills` and is present in the current Codex Available skills catalog. Treat `agents/openai.yaml` as UI metadata, not a prerequisite for model-side directory discovery.

- [ ] **Step 2: Run website regressions**

Run:

```powershell
node --test outputs/cafe-website/tests/site.test.mjs
```

Expected: `7/7` passing.

Run from `outputs/cafe-website/backend`:

```powershell
python test_main.py
```

Expected: `2/2` passing. Record but do not expand scope for dependency deprecation warnings.

- [ ] **Step 3: Inspect final Git status and commit only repository documentation**

Confirm `work/` and `outputs/cafe-website/backend/main.py.bak` remain unchanged and untracked. Do not add the personal skill directory to the website repository. If the only intended repository change is this plan, commit exactly this file with:

```powershell
git add docs/superpowers/plans/2026-07-15-local-business-website-skill-completion.md
git commit -m "docs: plan local business website skill completion"
```
