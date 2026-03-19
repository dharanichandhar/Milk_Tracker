# Portfolio Site Implementation Roadmap

## Overview
Single-page HTML portfolio for Siddharta Govindaraj - AI Trainer & Consultant.
**Total: 9 phases, 27 tasks**

---

## Phase 1: Foundation

- [x] **HTML Skeleton & SEO** - Basic HTML5 structure with meta tags, Open Graph, viewport
- [x] **CSS Custom Properties** - Define color palette, spacing, typography variables for light/dark themes
- [x] **Google Fonts Integration** - Load Inter font family

---

## Phase 2: Core Infrastructure

- [x] **Theme Toggle System** - Dark/light mode with localStorage persistence, CSS class switching
- [x] **Sticky Header** - Logo, navigation links, contact icons, theme toggle button
- [x] **Smooth Scroll Navigation** - Anchor links with smooth scrolling behavior

---

## Phase 3: Hero Section

- [x] **Hero Layout** - Flexbox structure, gradient background (Purple #8B5CF6 → Violet #7C3AED → Deep Blue #6366F1)
- [x] **Photo Component** - Circular image (280x280px) with purple glow border
- [x] **Typing Animation** - JavaScript typewriter effect cycling through: AI Trainer, Consultant, Python Geek, Author
- [x] **Hero Buttons** - "Contact Me" (outline) and "Download Resume" (filled) with hover states

---

## Phase 4: About Section

- [x] **About Layout** - Quote box + body text structure
- [x] **About Animation** - Fade-in on scroll via Intersection Observer

---

## Phase 5: Skills Section

- [x] **Skills Grid Layout** - 3-column responsive grid (3-col ≥768px, 1-col <768px)
- [x] **Skill Cards** - Accent bars (4px), category headers, tag pills (rounded 9999px)
- [x] **Skills Animation** - Staggered fade-in + slide-up on scroll

---

## Phase 6: Timeline Section

- [x] **Timeline Structure** - Vertical line with position markers (12px circular dots)
- [x] **Timeline Cards** - Content cards with hover lift/shadow effects
- [x] **Timeline Animation** - Staggered slide-in on scroll

---

## Phase 7: Projects Section

- [x] **Projects Container** - Scroll-snap container setup (400px fixed height)
- [x] **Project Cards** - Image left, text right layout, tags, visit button
- [x] **Progress Dots** - 4 dots, active indicator synced with scroll position
- [x] **Projects Animation** - Fade transitions between projects (0.5s ease)

---

## Phase 8: Testimonials Section

- [x] **Testimonial Card** - Quote, author photo (64x64px circular), name, title
- [x] **Testimonial Animation** - Fade-in on scroll

---

## Phase 9: Contact & Footer

- [x] **Contact Card** - Phone, email, LinkedIn with inline SVG icons
- [x] **Footer** - Divider line and copyright text

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
    └── TODO.md (this file)
```

---

## Notes

- All CSS and JS embedded in single HTML file (no external dependencies except fonts)
- Target deployment: GitHub Pages
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge) + mobile
