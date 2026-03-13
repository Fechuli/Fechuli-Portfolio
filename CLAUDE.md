# CLAUDE.md — Fechuli

Project instructions and persistent context for AI-assisted development.

---

## Design Context

### Users
Creative professionals, potential collaborators, design-conscious developers, and curious explorers. They visit from desktop, likely with a design eye — they notice details, hover on things, read hidden Easter eggs. Their job-to-be-done: understand who Federico Fiaschi is, be impressed enough to reach out or remember him.

### Brand Personality
**Tecnico · Poetico · Ironico**

Federico is a digital craftsman who codes as a form of expression. The site speaks with precision and care, but never takes itself too seriously — there's always a wink, a hidden joke, a philosophical aside that makes it feel human. It's the portfolio of someone who loves both the craft and the culture around it.

### Emotional Goal
**Curiosità** — the visitor should always feel there's more to discover. Each section should reward exploration: hidden interactions, unexpected details, layers beneath layers. The site is a game as much as a portfolio.

### Aesthetic Direction
- **Reference tier**: Awwwards top sites, experimental WebGL portfolios — the kind of work that wins Site of the Day
- **Visual tone**: Dark sophistication meets raw creativity. Not corporate, not sterile. Intentional imperfection (grain overlay, CRT effects, pixel distortion) is part of the aesthetic
- **Palette**: Deep wine/burgundy `#330014` on cream `#FFF5F5` — warm, unusual, anti-trend. Never cold blues or generic grays
- **Typography**: "Resin" display font at large scales with extreme tight tracking (`-0.06em` to `-0.07em`). "Arimo" for everything readable. The contrast between expressive display and functional body is intentional
- **Anti-references**: Generic agency templates, Bootstrap portfolios, anything that feels like a theme. No hero-with-CTA-button layouts. No stock photo aesthetics

### Design Principles

1. **Reward curiosity over clarity** — interactions don't need to explain themselves. If something looks interesting, users should click or hover to find out. Discovery IS the UX
2. **Every pixel has intent** — no decorative element without purpose. Corner grids, grain, scan lines — each creates atmosphere. If something can be removed without loss, remove it
3. **Warmth inside the machine** — the palette and tone should feel human and personal despite the technical complexity. Burgundy over black. Cream over white. Film grain over clean renders
4. **Impeccable at scale** — headings exist at typographic scale (`11rem`). Animations are orchestrated, not sprinkled. When something moves, it moves with purpose and timing
5. **Irony as interface** — humor and self-awareness are valid design elements here. The terminal self-destruct sequence, the "offline" screen, the entity dialogue — these are features, not bugs

### Technical Stack
- **Framework**: Next.js 16 / React 19 / TypeScript
- **Styling**: Tailwind CSS v4 (PostCSS)
- **Animation**: GSAP 3 (SplitText, ScrollTrigger) + Framer Motion
- **3D**: Three.js + React Three Fiber
- **Scroll**: Lenis smooth scroll
- **i18n**: next-intl (EN + IT)
- **Component API**: CVA (class-variance-authority) for variants

### Color Tokens
| Role | Value |
|------|-------|
| Primary accent / dark | `#330014` |
| Background / light text | `#FFF5F5` |
| Pure white (borders, detail) | `#FFFFFF` |
| Pure black | `#000000` |
| Selection bg | `#330014` |
| Selection text | `#FFF5F5` |

### Typography
| Role | Font | Notes |
|------|------|-------|
| Display / headings | Resin | Custom woff, tight tracking |
| Body / UI | Arimo | Google Font via CSS var `--font-arimo` |
