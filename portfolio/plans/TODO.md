# Portfolio Site Implementation Roadmap

## Overview
Single-page HTML portfolio for Siddharta Govindaraj - AI Trainer & Consultant.
**Total: 10 phases, 31 tasks**

---

## Phase 1: Foundation

- [ ] **HTML Skeleton & SEO** - Basic HTML5 structure with meta tags, Open Graph, viewport
- [ ] **CSS Custom Properties** - Define color palette, spacing, typography variables for light/dark themes
- [ ] **Google Fonts Integration** - Load Inter font family

---

## Phase 2: Core Infrastructure

- [ ] **Theme Toggle System** - Dark/light mode with localStorage persistence, CSS class switching
- [ ] **Sticky Header** - Logo, navigation links, contact icons, theme toggle button
- [ ] **Smooth Scroll Navigation** - Anchor links with smooth scrolling behavior

---

## Phase 3: Hero Section

- [ ] **Hero Layout** - Flexbox structure, gradient background (Purple #8B5CF6 → Violet #7C3AED → Deep Blue #6366F1)
- [ ] **Photo Component** - Circular image (280x280px) with purple glow border
- [ ] **Typing Animation** - JavaScript typewriter effect cycling through: AI Trainer, Consultant, Python Geek, Author
- [ ] **Hero Buttons** - "Contact Me" (outline) and "Download Resume" (filled) with hover states
- [ ] **Floating Particles** - CSS-only animated background particles

---

## Phase 4: About Section

- [ ] **About Layout** - Quote box + body text structure
- [ ] **About Animation** - Fade-in on scroll via Intersection Observer

---

## Phase 5: Skills Section

- [ ] **Skills Grid Layout** - 3-column responsive grid (3-col ≥768px, 1-col <768px)
- [ ] **Skill Cards** - Accent bars (4px), category headers, tag pills (rounded 9999px)
- [ ] **Skills Animation** - Staggered fade-in + slide-up on scroll

---

## Phase 6: Timeline Section

- [ ] **Timeline Structure** - Vertical line with position markers (12px circular dots)
- [ ] **Timeline Cards** - Content cards with hover lift/shadow effects
- [ ] **Timeline Animation** - Staggered slide-in on scroll

---

## Phase 7: Projects Section

- [ ] **Projects Container** - Scroll-snap container setup (400px fixed height)
- [ ] **Project Cards** - Image left, text right layout, tags, visit button
- [ ] **Progress Dots** - 4 dots, active indicator synced with scroll position
- [ ] **Projects Animation** - Fade transitions between projects (0.5s ease)

---

## Phase 8: Testimonials Section

- [ ] **Testimonial Card** - Quote, author photo (64x64px circular), name, title
- [ ] **Testimonial Animation** - Fade-in on scroll

---

## Phase 9: Contact & Footer

- [ ] **Contact Card** - Phone, email, LinkedIn with inline SVG icons
- [ ] **Footer** - Divider line and copyright text

---

## Phase 10: Polish & Deploy

- [ ] **Responsive Testing** - Mobile breakpoints, touch interactions
- [ ] **Accessibility Audit** - ARIA labels, keyboard navigation, focus states
- [ ] **Performance Optimization** - Image optimization, minimal footprint
- [ ] **GitHub Pages Deployment** - Push and verify live site

---

## File Structure

```
portfolio/
├── index.html      (main portfolio - single file)
├── Profile.pdf     (existing - linked for download)
├── images/
│   ├── playfulpython.png
│   ├── siddharta.png
│   ├── toolsforagile.png
│   └── book.png
└── plans/
    ├── REQUIREMENTS.md
    └── to-do.md (this file)
```

---

## Notes

- All CSS and JS embedded in single HTML file (no external dependencies except fonts)
- Target deployment: GitHub Pages
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge) + mobile
