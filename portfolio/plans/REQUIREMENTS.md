# Portfolio Site Requirements

## Overview
Single-page HTML portfolio for Siddharta Govindaraj - AI Trainer & Consultant. Designed to stand out and attract potential recruiters.

## Profile Information

### Personal Details
- **Name**: Siddharta Govindaraj
- **Tagline**: AI Trainer, Consultant, Python Geek, Author
- **Photo URL**: https://media.licdn.com/dms/image/v2/C4D03AQEZ1sjjZvh1-A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516302553681?e=1775692800&v=beta&t=_oGGXVXFyDBhYeXR_viKzZ97jhUidRLLFxK_hqxIMRM
- **Resume**: Link to existing `Profile.pdf` for download

### Contact Information
- **Phone**: +91 99400 36487
- **Email**: siddharta@silverstripesoftware.in
- **LinkedIn**: https://www.linkedin.com/in/siddharta/

## Design Requirements

### Visual Style
- **Style**: Bold & Creative
- **Color Scheme**: Purple/Violet gradient theme
- **Theme**: Dark/Light mode toggle with localStorage persistence
- **Animations**: Scroll-triggered reveals, hover effects, smooth transitions

### Typography
- **Font**: Google Fonts (Inter or similar modern sans-serif)
- **Hierarchy**: Clear distinction between headings, body text, and accents

### Layout
- **Responsive**: Mobile-first design
- **Single Page**: All content accessible via scroll
- **Navigation**: Sticky header with section links

## Page Sections (Top to Bottom)

### 1. Hero Section

#### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  [Siddharta G.]    [Nav: About | Skills | Timeline | Projects]  │
│                                            [📞][✉️][🔗] [🌙/☀️]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────┐      Siddharta Govindaraj                    │
│    │             │      ─────────────────────                   │
│    │   [PHOTO]   │      Let's build something amazing          │
│    │  Circular   │      together.                              │
│    │  + glow     │      | AI Trainer | Consultant |           │
│    │             │      | Python Geek | Author |  ← typing    │
│    └─────────────┘                                              │
│                                                                 │
│                         [ Contact Me ] [ Download Resume ]     │
│                                                                 │
│         ~~~ Animated gradient background ~~~                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Specifications
- **Height**: 400px fixed height (auto on mobile with min-height 500px)
- **Width**: Max-width 1200px, centered with side margins, rounded corners
- **Layout**: Horizontal flexbox - photo left, text right
- **Background**: Animated gradient (Purple #8B5CF6 → Violet #7C3AED → Deep Blue #6366F1)

#### Navigation
- **Style**: Sticky header
- **Behavior**: Solid background always (visible over hero gradient)
- **Links**: About, Skills, Timeline, Projects (Contact removed from nav)
- **Logo**: "Siddharta G." on left
- **Contact Icons**: Phone, Email, LinkedIn icons on right (before toggle)
  - Style: Circle background, 32x32px, hover effect
  - Color: Purple accent, matches theme
  - Links: tel:, mailto:, LinkedIn URL
- **Toggle**: Dark/Light mode button, rightmost

#### Photo
- **Shape**: Circular
- **Size**: 280x280px
- **Effect**: Purple glow border (4px), subtle shadow for depth
- **Position**: Left side of hero content

#### Typography
- **Name**: "Siddharta Govindaraj" - Bold, clean, uniform weight
- **Conversational Tagline**: "Let's build something amazing together." - Softer weight
- **Roles**: Typing animation cycling through:
  - AI Trainer
  - Consultant
  - Python Geek
  - Author

#### Buttons
- **"Contact Me"**: Outline style (transparent bg, white/purple border)
- **"Download Resume"**: Filled style (purple bg, white text)
- **Both**: Rounded corners, hover animations

#### Animations
- **Typing effect**: Roles type out one by one, delete, retype next
- **Gradient**: Subtle animated gradient shift

### 2. About Section

#### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   "The 10x programmer is now within everyone's reach."  │  │
│   │                                                          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Hi, I'm Siddharta. For 15+ years, I've been helping teams   │
│   become dramatically more productive—from TDD and clean code  │
│   to full stack development and now agentic coding with AI.    │
│                                                                 │
│   I train engineers to harness AI effectively, write          │
│   beautiful code, and ship faster without sacrificing quality. │
│                                                                 │
│   [ Let's Talk ]                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Content
- **Quote**: "The 10x programmer is now within everyone's reach."
- **Body**: 
  - "Hi, I'm Siddharta. For 15+ years, I've been helping teams become dramatically more productive—from TDD and clean code to full stack development and now agentic coding with AI."
  - "I train engineers to harness AI effectively, write beautiful code, and ship faster without sacrificing quality."
- **CTA**: "Let's Talk" button (links to contact section)

#### Specifications
- **Layout**: Quote highlight box + supporting text below
- **Width**: Max-width 1200px, centered with side margins, rounded corners
- **Quote Box**: Large, italic, centered with subtle background styling
- **Body Text**: Clean, readable, max-width for optimal line length
- **CTA Button**: "Let's Talk" - filled style, links to contact section
- **Background**: Subtle section background (lighter/darker based on theme), limited to content area
- **Animation**: Fade-in on scroll using Intersection Observer

### 3. Skills Section

#### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                        ─── Skills ───                               │
│                                                                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│   │ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ │  │ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ │  │ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ │ │
│   │ AI & Machine     │  │ Development      │  │ Practices &      │ │
│   │ Learning         │  │                  │  │ Methodologies    │ │
│   │──────────────────│  │──────────────────│  │──────────────────│ │
│   │ [Agentic Coding] │  │   [Python]       │  │ [Test Driven     │ │
│   │ [Generative AI]  │  │  [JavaScript]    │  │  Development]    │ │
│   │ [AI Agents &     │  │ [Full Stack      │  │   [Clean Code]   │ │
│   │  Orchestrations] │  │  Development]    │  │ [CI/CD Pipelines]│ │
│   │ [LLM Apps]       │  │    [React]       │  │     [DevOps]     │ │
│   │   [LangChain]    │  │     [Vue]        │  │ [Iterative       │ │
│   │  [LlamaIndex]    │  │    [Angular]     │  │  Development]    │ │
│   │  [OpenAI APIs]   │  │   [FastAPI]      │  │ [Agile Coaching] │ │
│   │   [RAG Systems]  │  │    [Django]      │  │                  │ │
│   │   [PyTorch]      │  │   [Node.js]      │  │                  │ │
│   │  [TensorFlow]    │  │  [PostgreSQL]    │  │                  │ │
│   │ [OpenAI Agent    │  │ [Vector          │  │                  │ │
│   │   Framework]     │  │  Databases]      │  │                  │ │
│   │   [AI Evals]     │  │                  │  │                  │ │
│   │    [Pandas]      │  │                  │  │                  │ │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Content
- **AI & Machine Learning**: Agentic Coding, Generative AI, AI Agents & Orchestrations, LLM Applications, LangChain, LlamaIndex, OpenAI APIs, RAG Systems, PyTorch, TensorFlow, OpenAI Agent Framework, AI Evals, Pandas
- **Development**: Python, JavaScript, Full Stack Development, React, Vue, Angular, FastAPI, Django, Node.js, PostgreSQL, Vector Databases
- **Practices & Methodologies**: Test Driven Development, Clean Code, CI/CD Pipelines, DevOps, Iterative Development, Agile Coaching

#### Specifications
| Element | Specification |
|--------|---------------|
| **Section Header** | "Skills" centered, consistent with other sections |
| **Layout** | 3-column CSS Grid, equal width |
| **Column Gap** | 24px |
| **Card Style** | Rounded 12px, subtle bg, 1px border, 24px padding |
| **Accent Bar** | Colored bar (4px height) on top of each card |
| **Accent Colors** | AI: #A78BFA, Dev: #60A5FA, Practices: #34D399 |
| **Category Headers** | Bold, below accent bar |
| **Tag Style** | Pill badges, rounded 9999px, 8px 16px padding |
| **Tag Color** | Uniform purple theme (both light/dark modes) |
| **Tag Font** | 14px |
| **Tag Gap** | 8px, flex-wrap |
| **Responsive** | 3-col (≥768px), 1-col (<768px) |
| **Animation** | Fade-in + slide-up on scroll, staggered cards |
| **Interactivity** | Static display, no hover effects on tags |

### 4. Timeline Section

#### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                       ─── Journey ───                               │
│                                                                     │
│   ───┬─────────────────────────────────────────────────────────    │
│      │                                                              │
│   ●  │  ┌──────────────────────────────────────────────────────┐  │
│      │  │  Agentic Coding Consultant                            │  │
│      │  │  Nov 2025 - Present                                   │  │
│      │  │                                                       │  │
│      │  │  Helping teams leverage AI agents and agentic        │  │
│      │  │  workflows to dramatically boost developer productivity.│
│      │  └──────────────────────────────────────────────────────┘  │
│      │                                                              │
│   ●  │  ┌──────────────────────────────────────────────────────┐  │
│      │  │  Gen AI Trainer                                      │  │
│      │  │  Oct 2024 - Nov 2025                                 │  │
│      │  │                                                       │  │
│      │  │  Trained engineering teams on generative AI, LLMs,   │  │
│      │  │  and building AI-powered applications.               │  │
│      │  └──────────────────────────────────────────────────────┘  │
│      │                                                              │
│   ●  │  ┌──────────────────────────────────────────────────────┐  │
│      │  │  Full Stack Consultant                               │  │
│      │  │  Jun 2016 - Oct 2024                                 │  │
│      │  │                                                       │  │
│      │  │  Delivered full-stack solutions for clients across   │  │
│      │  │  industries, from startups to enterprise.            │  │
│      │  └──────────────────────────────────────────────────────┘  │
│      │                                                              │
│   ●  │  ┌──────────────────────────────────────────────────────┐  │
│      │  │  Technical Agile Coach                               │  │
│      │  │  May 2013 - Jun 2016                                 │  │
│      │  │                                                       │  │
│      │  │  Coached teams on TDD, clean code, and agile         │  │
│      │  │  practices to improve code quality and delivery.     │  │
│      │  └──────────────────────────────────────────────────────┘  │
│      │                                                              │
│   ───┴─────────────────────────────────────────────────────────    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Content

| Position | Period | Description |
|----------|--------|-------------|
| **Agentic Coding Consultant** | Nov 2025 - Present | Helping teams leverage AI agents and agentic workflows to dramatically boost developer productivity. |
| **Gen AI Trainer** | Oct 2024 - Nov 2025 | Trained engineering teams on generative AI, LLMs, and building AI-powered applications. |
| **Full Stack Consultant** | Jun 2016 - Oct 2024 | Delivered full-stack solutions for clients across industries, from startups to enterprise. |
| **Technical Agile Coach** | May 2013 - Jun 2016 | Coached teams on TDD, clean code, and agile practices to improve code quality and delivery. |

#### Specifications

| Element | Specification |
|--------|---------------|
| **Section Header** | "Journey" centered |
| **Layout** | Vertical timeline, line on left, cards stacked on right |
| **Timeline Line** | Solid vertical line, purple (#8B5CF6) |
| **Position Markers** | Circular dots (●), 12px, purple fill |
| **Card Style** | Rounded 12px, subtle bg, 1px border, 20px padding |
| **Card Title** | Bold, 18px |
| **Card Date** | Muted color, 14px |
| **Card Description** | Body text, 15px |
| **Gap Between Cards** | 24px |
| **Responsive** | Same layout, line moves closer to edge on mobile |
| **Animation** | Fade-in + slide-right on scroll, staggered |
| **Hover** | Subtle lift/shadow on card hover |

### 5. Projects Section

#### Layout (Image Left, Text Right)
```
┌─────────────────────────────────────────────────────────────────────┐
│                       ─── Projects ───                              │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │  ┌────────────┐   Playful Python                           │   │
│   │  │            │   ─────────────────                        │   │
│   │  │   IMAGE    │   Blog & courses on Python, AI/ML          │   │
│   │  │            │                                            │   │
│   │  │  (natural  │   • In-depth Python tutorials              │   │
│   │  │   ratio)   │   • AI/ML hands-on projects                │   │
│   │  │            │   • Practical, real-world examples         │   │
│   │  │            │                                            │   │
│   │  └────────────┘   [Python] [AI/ML] [Education] [Blog]      │   │
│   │                                                             │   │
│   │                    [ Visit Site → ]                         │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ○ ○ ● ○ ○  (progress dots - 4 total)                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Content

| Project | Image | Description | Highlights | Tags |
|---------|-------|-------------|------------|------|
| **Playful Python** | images/playfulpython.png | Blog & courses on Python, AI/ML | • In-depth Python tutorials<br>• AI/ML hands-on projects<br>• Practical, real-world examples | Python, AI/ML, Education, Blog |
| **siddharta.me** | images/siddharta.png | Personal blog, 25+ years of insights | • 25+ years of industry insights<br>• Software development best practices<br>• Agile and TDD wisdom | Blog, Insights, Technology |
| **Tools for Agile** | images/toolsforagile.png | Agile PM tool, custom reactive framework | • Custom reactive framework built from scratch<br>• Designed for distributed agile teams<br>• End-to-end project management | Agile, Productivity, Full Stack |
| **Test-Driven Python Development** | images/book.png | Published by Packt Publishing (2015) | • 266 pages of TDD mastery<br>• 4.6/5 star rating on Amazon<br>• Comprehensive guide to test-driven development | Python, TDD, Testing, Book |

#### URLs
- **Playful Python**: https://playfulpython.com
- **siddharta.me**: https://siddharta.me
- **Tools for Agile**: https://toolsforagile.com
- **Test-Driven Python Development**: https://www.amazon.in/Test-Driven-Python-Development-Siddharta-Govindaraj-ebook/dp/B00VQF59D6

#### Specifications

| Element | Specification |
|--------|---------------|
| **Section Header** | "Projects" centered |
| **Layout** | Scroll-snap container within section, one project visible at a time |
| **Scroll Behavior** | Scroll-snap within 400px container, tabs update on scroll |
| **Container Height** | 400px fixed height |
| **Tab Navigation** | Tabs at top, active tab highlights, click to scroll to project |
| **Card Layout** | Flexbox - image left, text right |
| **Image Width** | ~200-250px fixed |
| **Image Height** | Auto (natural aspect ratio) |
| **Image Object Fit** | `contain` |
| **Image Border** | Rounded 8px |
| **Text Container** | Flex-1, left padding 24px |
| **Project Name** | Bold, 24px |
| **Description** | Body text, 16px, muted |
| **Highlights** | Bullet points, 14px, 3 items max |
| **Tags** | Pill badges, 12px, 6px 12px padding |
| **Visit Button** | Outline style, "push origin main" |
| **Animation** | Fade/scale transition (0.5s ease) on active slide |
| **Responsive** | Desktop: side-by-side, Mobile: stacked |
| **Hover** | None |

#### Technical Implementation
- `scroll-snap-type: y mandatory` on inner container (400px height)
- Each project slide is `flex: 0 0 400px` with `scroll-snap-align: start`
- Tab navigation at top updates based on scroll position
- Click on tabs smoothly scrolls to corresponding project
- CSS transitions for fade/scale effects on active slide content

### 6. Testimonials Section

#### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                       ─── Testimonials ───                          │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ │   │
│   │                                                             │   │
│   │   "Siddharta (Sid) and I worked together for couple of     │   │
│   │    years. He occurred to me as one of the coolest,         │   │
│   │    driven, hands-on coach that people actually loved       │   │
│   │    to work with..."                                        │   │
│   │                                                             │   │
│   │              ┌──────┐                                      │   │
│   │              │      │  Kapil Sharma                        │   │
│   │              │ PHOTO│  VP Engineering                     │   │
│   │              │      │                                      │   │
│   │              └──────┘                                      │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Content

| Field | Value |
|-------|-------|
| **Quote** | "Siddharta (Sid) and I worked together for couple of years. He occurred to me as one of the coolest, driven, hands-on coach that people actually loved to work with (not easy for an agile coach :). His ability to effortlessly connect with varied audience - from interns to VPs was extremely powerful. Sid and I closely worked together on two key agile initiatives - an interactive session with engineering managers on defining and refining their role in agile work culture and a technical excellence summit with a wider engineering community - for them, by them (i.e. engineers crowdsourced problem statements and did live solutioning). Sid is an amazing person to work with and would be an asset to any organisation (small or big) looking for agile adoption." |
| **Author** | Kapil Sharma |
| **Title** | VP Engineering |
| **Photo URL** | https://media.licdn.com/dms/image/v2/C4D03AQEr6-aaiUbmaA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1629743690196?e=1775692800&v=beta&t=RU0MG0Nk5q1Gtye86Nm1PaWSRqshL9w7qGrJ_sX2A00 |

#### Specifications

| Element | Specification |
|--------|---------------|
| **Section Header** | "Testimonials" centered |
| **Card Style** | Rounded 12px, subtle bg, 1px border, 32px padding |
| **Accent Bar** | Purple (#8B5CF6), 4px height, full width, top of card |
| **Quote Text** | Italic, 18px, centered, max-width 700px |
| **Author Photo** | Circular, 64x64px, subtle shadow |
| **Author Name** | Bold, 16px, centered below photo |
| **Author Title** | Muted, 14px, centered below name |
| **Layout** | Centered, photo below quote text |
| **Animation** | Fade-in on scroll |
| **Responsive** | Same layout, padding adjusts on mobile |

#### Design Note
The accent bar at the top of the card should match the style used in the Skills section cards. When implementing, update Skills section to use top accent bar instead of left-side accent for visual consistency.

### 7. Contact Section

#### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                       ─── Let's Connect ───                         │
│                                                                     │
│              ┌─────────────────────────────────────┐               │
│              │                                     │               │
│              │   📞  +91 99400 36487               │               │
│              │                                     │               │
│              │   ✉️  siddharta@silverstripesoftware.in            │               │
│              │                                     │               │
│              │   🔗  linkedin.com/in/siddharta     │               │
│              │                                     │               │
│              └─────────────────────────────────────┘               │
│                                                                     │
│   ─────────────────────────────────────────────────────────────    │
│                     © 2026 Siddharta Govindaraj                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Content

| Field | Value | Link |
|-------|-------|------|
| **Phone** | +91 99400 36487 | `tel:+919940036487` |
| **Email** | siddharta@silverstripesoftware.in | `mailto:siddharta@silverstripesoftware.in` |
| **LinkedIn** | linkedin.com/in/siddharta | `https://www.linkedin.com/in/siddharta/` |
| **Copyright** | © 2026 Siddharta Govindaraj | — |

#### Specifications

| Element | Specification |
|--------|---------------|
| **Section Header** | "Let's Connect" centered |
| **Layout** | Centered contact info in card |
| **Card Style** | Rounded 12px, subtle bg, 1px border, 32px padding |
| **Contact Items** | Stacked vertically, 16px gap between items |
| **Icons** | Inline SVG, 20x20px, purple color |
| **Phone** | `tel:` link |
| **Email** | `mailto:` link |
| **LinkedIn** | External link, opens in new tab |
| **Footer** | Divider line + copyright text |
| **Copyright** | "© 2026 Siddharta Govindaraj", muted color |
| **Animation** | Fade-in on scroll |

#### Design Note
Contact icons also appear in the header (phone, email, LinkedIn) for immediate visibility. This section provides a larger, more prominent display of the same information with the footer below.

## Technical Requirements

### File Structure
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
    └── REQUIREMENTS.md (this file)
```

### Implementation
- **Single HTML file**: All CSS and JS embedded (no external dependencies except fonts)
- **CSS**: Custom properties for theming, flexbox/grid for layout
- **JavaScript**: 
  - Theme toggle with localStorage persistence
  - Intersection Observer API for scroll animations
  - Smooth scroll navigation
- **SEO**: Meta tags for discoverability (title, description, Open Graph)
- **Accessibility**: Semantic HTML, ARIA labels where needed
- **Performance**: Minimal footprint, fast load times

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome for Android)

## Deployment
- Target: GitHub Pages
- No build step required
- Single HTML file for easy deployment

## Status
- [x] Requirements gathered
- [x] Hero section detailed
- [x] About section detailed
- [x] Timeline section detailed
- [x] Skills section detailed
- [x] Projects section detailed
- [x] Testimonials section detailed
- [x] Contact section detailed
- [ ] Design approved
- [ ] Build started
- [ ] Testing complete
- [ ] Deployed

---
*Last updated: 2026-03-19* (Contact section detailed, header contact icons added)
