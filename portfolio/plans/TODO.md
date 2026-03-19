# Portfolio Website - Pending Fixes

## High Priority

- [x] **Type-in effect for terminal code** - Character-by-character typing animation with blinking cursor. Each line types out sequentially.

- [x] **Scroll-triggered fade animations** - Elements with `.fade-in` class animate on scroll. Projects section uses scroll-snap within container with tab navigation.

- [ ] **Cursor blink animation** - The blinking cursor effect (used in logo and potentially elsewhere) is not functioning properly.

- [x] **Light/Dark mode toggle** - Theme toggle button added to header. Uses Catppuccin Latte for light mode. Preference persisted in localStorage.

- [x] **Hero profile image** - Circular profile photo added to hero section, positioned left of the name with green glow border.

- [x] **Testimonial profile image** - Updated with correct LinkedIn profile image URL. Author title updated to "VP, Engineering".

## Implementation Notes

### Type-in Effect
- JavaScript types each line character-by-character (30ms per char)
- Blinking cursor appears while typing
- 150ms delay between lines
- Syntax highlighting preserved during animation

### Scroll Animations
- IntersectionObserver properly initialized for `.fade-in` elements
- `.fade-in` elements have correct initial styles (opacity: 0, transform: translateY)
- `.visible` class properly overrides with opacity: 1, transform: translateY(0)
- Projects section: scroll-snap within 400px container, tabs update on scroll

### Theme Toggle
- Toggle button in header actions (moon/sun icons)
- Light mode uses Catppuccin Latte color scheme
- Dark mode uses Catppuccin Mocha color scheme
- `data-theme` attribute on `<html>` element
- Preference stored in localStorage

### Profile Images
- Hero: Added circular profile photo (120x120px) with green glow border, positioned left of name
- Testimonial: Updated with Kapil Sharma's LinkedIn photo
