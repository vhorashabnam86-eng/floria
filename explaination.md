# DUSK (Floria) — Simple & Complete Project Guide

> A beginner-friendly, visual explanation of the **DUSK** digital sanctuary: what it does, how it works, and how the code is organized.

---

## 1. What is this Project?

**DUSK (Floria)** is an interactive, cinematic 3D website designed as an immersive digital fantasy sanctuary (*"Where starlight breathes and creatures dream"*).

Unlike standard websites that are flat and static, DUSK feels like an interactive video game or film:
- **Interactive Flashlight**: Moving your mouse acts like a glowing torch beam revealing a hidden celestial kingdom underneath the night sky.
- **Living 3D Creature**: A floating 3D moth/fairy creature hovers in the center of the screen, follows your cursor with its eyes and body, flaps its wings faster when you move quickly, and pulses with glowing light.
- **Cinematic Scroll Zoom**: As you scroll down the page, a framed art card seamlessly expands to fill your entire screen.
- **Specimen Archive**: An interactive gallery of fantasy flora and fauna with kinetic text and staggered entrance animations.

---

## 2. Visual Architecture: The 4 Main Sections

```
┌────────────────────────────────────────────────────────┐
│ 1. HERO SECTION (app/page.tsx)                         │
│    • Interactive Flashlight cursor reveal              │
│    • Real-time 3D flying creature (Three.js)           │
│    • Large gradient title: "DUSK"                      │
├────────────────────────────────────────────────────────┤
│ 2. STORYTELLING SECTION (StorytellingSection.tsx)       │
│    • Framed art card morphs & expands to full screen   │
│      as the user scrolls down                          │
├────────────────────────────────────────────────────────┤
│ 3. DISCOVERY ARCHIVE (DiscoverySection.tsx)            │
│    • Specimen cards of fantasy creatures and flora     │
│    • GSAP staggered kinetic reveal animations          │
├────────────────────────────────────────────────────────┤
│ 4. FINE-ART FOOTER (FloriaFooter.tsx)                  │
│    • Luxury editorial navigation, lore, and credits    │
└────────────────────────────────────────────────────────┘
```

---

## 3. How the "Magic" Works (Under the Hood)

### A. The "Flashlight" Spotlight Beam
- **File**: `app/page.tsx`
- **Concept**: There are two full-screen background pictures stacked on top of each other:
  1. **Base Layer**: A dark, nocturnal sky landscape (`/bg-reveal.jpg`).
  2. **Reveal Layer**: A bright, glowing starlight fantasy kingdom (`/bg-base.jpg`).
- **How it works**: The top image is hidden by default. As you move your mouse, a circular CSS `mask-image` (`radial-gradient`) follows your cursor.
- **Why it feels smooth**: The spotlight doesn't jump instantly to your mouse. It uses **Linear Interpolation (LERP)** to slide smoothly toward your cursor with natural inertia and weight.

---

### B. The 3D Floating Creature
- **File**: `app/components/CreatureCanvas.tsx`
- **Engine**: Built with **Three.js** (WebGL), loading a 3D model from `/3dmodel/creature.glb`.
- **Natural Floating**: Mathematical sine waves (`Math.sin` and `Math.cos`) gently float the creature up, down, and sideways so it feels like it is hovering in mid-air.
- **Head & Body Tracking**: Mouse coordinates are converted into 3D rotational angles (**Yaw, Pitch, Roll**). As you move your mouse around, the creature rotates and banks into turns to look directly at your pointer.
- **Dynamic Wing Flapping**:
  - When your mouse is still, the creature beats its wings at a relaxed, gentle pace.
  - When you move your mouse quickly, the code calculates your cursor speed and accelerates the wing flap frequency.
- **Bioluminescent Body Glow**: The creature's abdomen has an emissive material and a point light that smoothly pulses brighter and dimmer like a breathing firefly.

---

### C. Cinematic Scroll-Driven Viewport Expansion
- **File**: `app/components/StorytellingSection.tsx`
- **How it works**: The section spans a tall scroll track ($320\text{vh}$) with a sticky viewport stage ($100\text{vh}$).
- **The Transition**: As the user scrolls:
  - A compact vertical card (ratio 9:16) smoothly grows until it fills $100\text{vw} \times 100\text{vh}$ (the entire browser window).
  - The rounded corners flatten from `24px` to `0px`.
  - The surrounding text labels and badge tags fly outward and fade away along curved paths.

---

### D. Specimen Archive & Kinetic Staging
- **File**: `app/components/DiscoverySection.tsx`
- **Animation Engine**: Uses **GSAP (GreenSock)**.
- **How it works**: As the section scrolls into view (`IntersectionObserver`), GSAP coordinates a multi-step sequence:
  1. The title words *"Discover"* and *"Dusk"* scale up with an elastic spring effect (`back.out`).
  2. Badges and telemetry panels slide into position.
  3. Individual specimen cards glide upward into view with soft scale transitions.

---

## 4. Technology Stack Summary

| Technology | Purpose in Project |
|---|---|
| **Next.js 15 / 16 (App Router)** | Framework managing the application structure and client-side rendering. |
| **React 19** | Component-based UI logic and reactive state management. |
| **Three.js (WebGL)** | High-performance 3D rendering engine for the creature, lighting, and camera. |
| **GSAP (GreenSock)** | Timeline-based sequencing for typography and card reveals. |
| **Tailwind CSS v4** | Rapid utility styling, glassmorphism, responsive sizing, and layouts. |
| **TypeScript** | Type-safe code ensuring clean interfaces and fewer bugs. |

---

## 5. File & Folder Structure

```
floria/
├── app/
│   ├── components/
│   │   ├── CreatureCanvas.tsx      # 3D Three.js canvas & creature physics
│   │   ├── DiscoverySection.tsx    # Specimen archive grid with GSAP animations
│   │   ├── FloriaFooter.tsx        # High-contrast fine-art footer
│   │   └── StorytellingSection.tsx # Scroll-driven card expansion stage
│   ├── favicon.ico
│   ├── globals.css                 # Global CSS styles & font definitions
│   ├── layout.tsx                  # Root HTML shell & meta information
│   └── page.tsx                    # Main landing page & cursor flashlight mask
├── public/
│   ├── 3dmodel/creature.glb        # 3D Creature binary mesh file
│   ├── bg-base.jpg                 # Reveal image (starlight world)
│   ├── bg-reveal.jpg               # Base image (dark twilight sky)
│   └── ...                         # Specimen images & icons
├── ALGORITHMS.md                   # Full mathematical & engineering equations
├── package.json                    # Dependencies & run scripts
└── explanation.md                  # This guide
```

---

## 6. How to Run & Test the Project

1. Open your terminal in the `floria` project directory:
   ```bash
   cd c:/shabnam/mywork/floria/floria
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 7. How to Customize Common Features

- **Change the Flashlight Size or Softness**:
  In `app/page.tsx`, look for the `maskGradient` variable. You can change `260px` to a larger or smaller radius.
- **Change Background Images**:
  Replace `public/bg-base.jpg` and `public/bg-reveal.jpg` with your own high-resolution pictures.
- **Adjust Creature Size or Position**:
  In `app/components/CreatureCanvas.tsx`, adjust `camera.position.set(0, 0, 3.2)` or `scaleFactor`.
- **Add New Specimens to the Archive**:
  In `app/components/DiscoverySection.tsx`, locate the specimens array and add new entries with their name, habitat, and image paths.
