---
name: Another OAT Intelligence
colors:
  surface: '#151120'
  surface-dim: '#151120'
  surface-bright: '#3c3748'
  surface-container-lowest: '#100c1b'
  surface-container-low: '#1d1929'
  surface-container: '#221d2d'
  surface-container-high: '#2c2738'
  surface-container-highest: '#373243'
  on-surface: '#e8dff5'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e8dff5'
  inverse-on-surface: '#332e3f'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#d3bbff'
  on-secondary: '#3f0689'
  secondary-container: '#592da2'
  on-secondary-container: '#c8aaff'
  tertiary: '#ccbeff'
  on-tertiary: '#332664'
  tertiary-container: '#9587cc'
  on-tertiary-container: '#2c1f5c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#ebdcff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#260059'
  on-secondary-fixed-variant: '#572ba0'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#ccbeff'
  on-tertiary-fixed: '#1e0e4e'
  on-tertiary-fixed-variant: '#4a3d7c'
  background: '#151120'
  on-background: '#e8dff5'
  surface-variant: '#373243'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  gutter: 1rem
  margin: 1.25rem
---

## Brand & Style

This design system is built for a professional AI chatbot experience that balances high-tech intelligence with human reflection. The target audience seeks a premium, focused tool that feels more like a private digital sanctum than a mass-market social app. 

The visual style is a hybrid of **Glassmorphism** and **Corporate Modern**. It uses deep, monochromatic purple foundations to create a sense of vast, intellectual space, layered with translucent glass panels that imply clarity and depth. Soft gradients should mimic a gentle "inner glow" emanating from the AI, while crisp, high-contrast typography ensures the conversation remains the primary focus. The emotional goal is to feel reflective, intelligent, and authoritative.

## Colors

The palette is rooted in the "Another OAT" logo's violet DNA. The primary color is a vibrant violet (#8B5CF6) used for calls to action and active states. The secondary color is a deep, bruised purple (#4C1D95) used for subtle accents and gradient stops. 

The background is a custom neutral-dark (#0F0B1A), which is not a true black but a very desaturated purple, ensuring that pure black elements in the person image or logo assets pop. Accents use a soft lavender (#C4B5FD) to maintain legibility and provide a "misty" feel to the glassmorphism effects.

## Typography

This design system employs a tiered typographic strategy. **Manrope** is used for headlines to provide a modern, balanced, and premium feel. **Inter** handles the heavy lifting of chatbot dialogue due to its exceptional readability and neutral, systematic tone. For technical metadata, live data indicators, or system status labels, **JetBrains Mono** is used to inject a "processed" or "intelligent" data-centric aesthetic. All body text should maintain a generous line height to prevent fatigue during long reading sessions.

## Layout & Spacing

The layout is mobile-first and utilizes a **fluid grid** with safe margins. On mobile devices, the side margins are set to `1.25rem` to ensure content doesn't feel cramped. The chat interface uses a "stacked" philosophy where message bubbles and data visualizations are separated by `1rem` (md) gaps. Large sections, like the transition from the header to the main chat area, use `2.5rem` (xl) to provide visual breathing room, reinforcing the "reflective" brand tone.

## Elevation & Depth

Hierarchy is established through **glassmorphism** and **tonal layers**. 
- **The Base:** The deepest layer is the neutral-dark background.
- **Glass Panels:** Chat bubbles and cards use a semi-transparent surface (10-15% opacity) with a `24px` backdrop blur. 
- **Inner Glow:** Elements at higher elevation receive a subtle 1px "inner border" on the top and left edges using a light violet at 20% opacity to simulate light hitting a glass edge.
- **Shadows:** Avoid heavy black shadows. Instead, use "ambient glow shadows"—soft, diffused purple glows (#8B5CF6 at 10% opacity) that suggest the UI elements are hovering over a light source.

## Shapes

The shape language is consistently **Rounded**. Chat bubbles use the `rounded-lg` (1rem) setting for a friendly yet structured appearance. Action buttons and input fields utilize `rounded-xl` (1.5rem) to feel more inviting and tactile. The person image should be contained within a perfect circle or a very high-radius "squircle" to act as a focal point for the "Personal Reflection Engine."

## Components

- **Chat Bubbles:** User bubbles are solid primary violet with white text. AI bubbles use the glassmorphic style (blurred background, subtle white/lavender border).
- **Primary Buttons:** High-contrast white or light violet background with dark text for maximum visibility against the dark theme.
- **Input Fields:** Floating glass containers with a 1px lavender border. The cursor and focus state should utilize the primary violet color.
- **Chips/Badges:** Use JetBrains Mono for the text. They should have a subtle secondary purple background with high-transparency to indicate categories or "Live Data" status.
- **Data Visualization Cards:** Use the glassmorphism panel style. Graphs and charts within these cards should use a gradient stroke (Primary to Secondary violet) to maintain the "inner glow" aesthetic.
- **Avatar:** The provided person image should be used as the AI representative, styled with a thin violet ring to indicate "active" or "thinking" states.