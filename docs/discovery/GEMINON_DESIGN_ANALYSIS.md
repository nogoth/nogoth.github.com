# Geminon Design System Analysis

**URL**: https://nogoth.github.io/geminon  
**Type**: Vue.js + Vite app  
**Theme**: Retro-futuristic 80s spaceman/computer terminal aesthetic  
**Date**: March 4, 2026

---

## Color Palette

### Primary Colors (CSS Variables)

```css
--spaceman-primary:   #4B5320  (Olive Green - main background)
--spaceman-surface:   #C2B280  (Tan/Beige - text on dark, panel bg)
--spaceman-action:    #B7410E  (Rust Orange - interactive, alerts)
--spaceman-variation: #ACE1AF  (Mint Green - accents, grid lines)
--spaceman-dark:      #1A1C0B  (Nearly Black - borders, depth)
```

### Visual Breakdown

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Olive Green** | #4B5320 | Dark muted green | Primary bg, panel headers |
| **Tan/Beige** | #C2B280 | Light warm tan | Main text, panel backgrounds |
| **Rust Orange** | #B7410E | Deep reddish-orange | Action buttons, alerts, emphasis |
| **Mint Green** | #ACE1AF | Light pastel green | Accents, borders, grid pattern |
| **Nearly Black** | #1A1C0B | Warm dark gray | Borders, depth, shadows |

### Color Harmony

- **Warm earthy tones** (olive, tan, orange) dominating
- **Cool accent** (mint green) for secondary focus
- **High contrast** between dark text on light, light text on dark
- **Retro aesthetic**: 70s-80s color scheme with muted saturation
- **Accessibility**: Good contrast ratios throughout

---

## GUI Interface Components

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Side Launcher] ←→      [Console Stage / Main Panel]       │
│   (left or right)                                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

#### 1. **Side Launcher** (`side-launcher`)
- **Position**: Vertical bar on left or right edge
- **Dimensions**: 70px wide (mobile: 60px)
- **Border**: 1px mint green border
- **Background**: Semi-transparent dark (#1a1c0b at 30% opacity)
- **Border-radius**: Rounded on inner edge (15px)
- **Purpose**: Navigation hub / launcher pad

**Child components**:
- Navigation buttons (nav-btn)

#### 2. **Navigation Buttons** (`nav-btn`)
- **Dimensions**: 50x50px (mobile: 40x40px)
- **Border**: 2px solid dark with rounded corners (4px)
- **Shadow**: 3D drop shadow effect (3px 3px)
- **Variants**:
  - `.action` - Rust orange background
  - `.variation` - Mint green background
  - `.primary` - Olive green background
  - `.active` - Dark bg, action-colored border, inset shadow
- **Interactions**:
  - **Hover**: Brightness increase, raised shadow (5px 5px), -2px/-2px translate
  - **Active**: Pressed-in effect, darker appearance
- **Inner decoration**: Dark square indicator (40% of button size)

#### 3. **Console Stage** (`console-stage`)
- **Layout**: Flex container, centered
- **Padding-top**: 40px
- **Purpose**: Main content area

#### 4. **Spaceman Panel** (`spaceman-panel`)
- **Width**: 100% (max 800px)
- **Background**: Tan (#C2B280)
- **Border**: 4px solid dark (#1A1C0B)
- **Shadow**: 15px 15px with opacity
- **Appearance**: Retro computer monitor/dialog box

#### 5. **Panel Header** (`spaceman-elbow`)
- **Height**: 50px
- **Background**: Olive green (with `.action` and `.variation` variants)
- **Border**: 2px bottom dark border
- **Text**: "REGISTRY: WADA-MOD-2026" in mint green, right-aligned
- **Font**: 12px, bold, letter-spaced (2px)
- **Purpose**: Title bar with sci-fi registry label

#### 6. **Panel Content** (`spaceman-content`)
- **Padding**: 40px all sides
- **Typography**: Monospace (Courier New)
- **Text-transform**: UPPERCASE
- **Color**: Dark text on tan background

**Sub-components**:

**Headings (h2)**:
- Font size: 1.8rem
- Margin bottom: 30px
- Border bottom: 4px solid dark
- Padding bottom: 15px

**Stat Elements** (`.stat`, `.stardate-container`)
- Border: 2px mint green
- Background: Semi-transparent dark (5% opacity)
- Padding: 20px
- Layout: Flex, space-between
- **Label**: Small text, olive green, bold
- **Value**: Large text (2.2rem), rust orange, extra bold

**Navigation Links** (nav a)
- Padding: 18px
- Border: 2px solid dark
- Background: Mint green
- Color: Dark text
- Transition: 0.2s smooth
- **Hover**: Changes to rust orange bg, tan text, translates right (10px)

#### 7. **Scanning Text** (`.scanning-text`)
- **Animation**: Blinking (1s steps, on/off)
- **Color**: Rust orange
- **Background**: Rust orange at 10% opacity
- **Border**: 2px rust orange
- **Padding**: 15px
- **Text-align**: Center
- **Font-weight**: Bold
- **Purpose**: Alert/status indicator

#### 8. **Grid Pattern Background**
- **Type**: Linear gradients (horizontal + vertical)
- **Color**: Mint green at 10% opacity
- **Size**: 30px x 30px grid
- **Opacity**: Very subtle (1px lines)

---

## Typography

- **Font Family**: Courier New, Courier, monospace
- **Text Transform**: UPPERCASE (global)
- **Letter-spacing**: 2px on headers
- **Font weights**: 
  - Normal: 400 (body text)
  - Bold: 700 (labels, nav)
  - Extra-bold: 900 (values)

---

## Visual Effects & Animations

### Shadow Effects
- **Drop shadows**: 3D appearance (3px 3px, 5px 5px)
- **Inset shadows**: Pressed-in buttons (inset 2px 2px 5px)
- **Panel shadow**: Large (15px 15px) for depth

### Animations
- **Blink**: Scanning text flashing on/off (1s cycle)
- **Transitions**: 0.2s cubic-bezier(.4, 0, .2, 1) for smooth motion
- **Hover states**: Translate, brightness filters
- **Panel slides**: Enter/exit animations (0.4s)

### Interactive Feedback
- **Buttons on hover**: Lift up, brighten (brightness 1.1 filter), shadow increase
- **Buttons on active**: Press down, invert appearance
- **Links on hover**: Slide right (10px), color swap

---

## Design System Summary

### Aesthetic
- **Era**: 1970s-80s retro-futuristic
- **Mood**: Spaceman control panel, vintage computer terminal
- **Feel**: Nostalgic, playful, slightly dystopian

### Grid & Spacing
- **Gap**: 15px (main layout), 8px (mobile)
- **Padding**: 20px (general), 40px (content), 8-10px (buttons)
- **Border-radius**: 4px (buttons), 15px (launcher)

### Borders & Depth
- **Border thickness**: 1px (subtle), 2px (standard), 4px (major), 2px bottom (headers)
- **Shadow depth**: Creates 3D raised/pressed effects
- **Inset borders**: For active/pressed states

### Component States

| State | Background | Border | Text | Shadow |
|-------|-----------|--------|------|--------|
| Idle | Action/Primary color | Dark 2px | Dark | Drop 3px |
| Hover | Brightened | Dark 2px | Dark | Drop 5px, lifted |
| Active | Dark/inverted | Action color | Light | Inset, pressed |

---

## Mobile Responsiveness

### Breakpoint: max-width 1024px
- Padding reduced: 20px → 10px
- Gap reduced: 15px → 8px
- Side launcher: 70px → 60px
- Nav buttons: 50x50px → 40x40px

### Breakpoint: max-width 768px
- Value font size: 2.2rem → 1.8rem
- Further text size optimization

---

## Implementation Notes

### Built With
- Vue.js 3 + Vite
- Vanilla CSS (no framework like Tailwind)
- CSS variables for theming
- Flexbox layout
- CSS animations/transitions

### File Structure (from CSS)
- Single CSS file: `index-D87J-IbE.css` (minified/hashed)
- JavaScript bundle: `index-DVHVByMy.js`
- HTML root: `<div id="app"></div>`

### Accessibility Considerations
- High contrast colors
- Large touch targets (50px buttons)
- Semantic spacing
- Keyboard navigation support (implied by structure)

---

## Design Inspiration & Usage Ideas

### Perfect For
- Retro/nostalgic interfaces
- Sci-fi themed applications
- Control panels and dashboards
- Admin interfaces with personality
- Educational tools (spaceman theme)

### Color Combinations to Reuse
- **Primary action**: Rust orange on tan
- **Subtle accent**: Mint green on olive
- **High contrast**: Tan text on olive green bg
- **Alert state**: Rust orange with blinking animation

### Component Patterns to Adopt
- Stat boxes with label/value pairs
- Side navigation launcher bars
- Panel-based modal system
- Blinking status indicators
- Grid pattern backgrounds
- Monospace uppercase typography

---

## CSS Variable Reference (Complete)

```css
:root {
  --spaceman-primary:   #4B5320;  /* Olive green */
  --spaceman-surface:   #C2B280;  /* Tan/beige */
  --spaceman-action:    #B7410E;  /* Rust orange */
  --spaceman-variation: #ACE1AF;  /* Mint green */
  --spaceman-dark:      #1A1C0B;  /* Nearly black */
  --spaceman-bg:        var(--spaceman-primary);
}
```

---

## Quick Copy-Paste Palette

**For design tools or other projects**:

```
Palette: Geminon Spaceman
- Primary: #4B5320
- Surface: #C2B280
- Action: #B7410E
- Accent: #ACE1AF
- Dark: #1A1C0B
```

---

## Comparison to Nogoth Blog

If you were to apply Geminon's design to the Nogoth blog:
- Use mint green (#ACE1AF) for link highlights
- Rust orange (#B7410E) for active states
- Monospace Courier New for code blocks
- Add subtle grid background
- Retro shadow effects on cards
- Blinking indicators for "new" articles

This would give the Nogoth blog a fun retro aesthetic while maintaining readability.

---

**Analysis Created**: 2026-03-04  
**Status**: Complete  
**Time Spent**: ~3 minutes  
**Source**: CSS analysis of live site
