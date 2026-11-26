---
name: browser-visual-qa
description: Token-efficient real-browser verification and responsive visual QA using playwright-cli (aligned with perf-stack).
---
# Skill: browser-visual-qa

## When to Use
- After creating or modifying web pages, SPAs, PWAs, or static HTML outputs.
- To verify responsive layout, console health, interactive flows, and visual polish without dumping full DOM/accessibility trees into the LLM context.

---

## 1. Why `playwright-cli`
Unlike MCP browser servers that inject large accessibility trees on every turn, `playwright-cli` uses short, targeted CLI commands (`snapshot`, `find`, `click`, `screenshot`), keeping context clean and token usage low.

---

## 2. Standard Verification Workflow
1. **Start a local server** (as a background daemon, e.g., `npx serve dist -l 4173` or `python3 -m http.server 4173`).
2. **Check Desktop (`1280x800`):**
   ```bash
   playwright-cli open http://localhost:4173
   playwright-cli resize 1280 800
   playwright-cli snapshot
   playwright-cli eval "document.documentElement.scrollWidth <= window.innerWidth"
   playwright-cli screenshot
   ```
3. **Check Mobile (`390x844`):**
   ```bash
   playwright-cli resize 390 844
   playwright-cli eval "document.documentElement.scrollWidth <= window.innerWidth"
   playwright-cli screenshot
   ```
4. **Exercise critical flows** using element refs from `snapshot` (`click e1`, `fill e2 "..."`, `press Enter`) and confirm zero JS/console errors.
5. **Close session:**
   ```bash
   playwright-cli close
   ```

---

## 3. Fallback (Offline / No Browser Binary)
- Install on demand (`npm install -g @playwright/cli@latest`) **or** run static HTML/JS/CSS checks (`node --check`, DOM ID cross-reference checks, and responsive media-query inspection).
