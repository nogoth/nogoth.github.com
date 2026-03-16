# Agent Notes

## playwright-cli Usage

### Installation & Browser

- **Run via npx:** `npx @playwright/cli <command>` — the package is `@playwright/cli`
- **Use Firefox:** Always open with `--browser=firefox`. Chrome is not installed in this environment.
  ```bash
  npx @playwright/cli open http://localhost:5173 --browser=firefox
  ```
- **Firefox is already installed.** Do NOT run `npx playwright install firefox` again — it's cached and ready.

### Common Gotchas

1. **`npx playwright-cli` does NOT work** — the correct package name is `@playwright/cli`, not `playwright-cli`. The bare name has no executable registered.

2. **`mousewheel` argument order is `deltaX deltaY`** — to scroll down, use `mousewheel 0 500`, not `mousewheel 500 0`. Getting this wrong scrolls horizontally instead of vertically.

3. **Use `eval` for reliable scrolling** — `mousewheel` can be flaky. Prefer:
   ```bash
   npx @playwright/cli eval "window.scrollTo(0, 800)"
   ```

4. **Dev server must run in background** — `npm run dev` blocks forever. Run it in a separate terminal or let the user start it. Do NOT run it inline or you will hang.

5. **Mobile viewport testing** — resize before screenshotting:
   ```bash
   npx @playwright/cli resize 375 812
   ```
   Common sizes: iPhone (375×812), Android (360×800), iPad (768×1024).

6. **Screenshots are the primary visual inspection tool** — snapshots (YAML) give you the DOM tree and element refs, but screenshots show actual rendering, alignment, and visual bugs.

### Typical Workflow

```bash
# 1. Open browser with Firefox
npx @playwright/cli open http://localhost:5173 --browser=firefox

# 2. Take snapshot to understand page structure
npx @playwright/cli snapshot

# 3. Screenshot for visual inspection
npx @playwright/cli screenshot --filename=page.png

# 4. Mobile testing
npx @playwright/cli resize 375 812
npx @playwright/cli screenshot --filename=mobile.png

# 5. Navigate / interact
npx @playwright/cli click e14
npx @playwright/cli fill e18 "search term"

# 6. Scroll down
npx @playwright/cli eval "window.scrollTo(0, 800)"
npx @playwright/cli screenshot --filename=scrolled.png

# 7. Clean up
npx @playwright/cli close
```
