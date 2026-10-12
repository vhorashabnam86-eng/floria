
# DUSK (FLORIA) — Architecture, Algorithms & Creative Engineering Guide

> A comprehensive deep-dive into the mathematical models, procedural animations, 3D WebGL rendering, and architectural decisions behind the **DUSK** digital sanctuary.

---

## 1. System Overview & Technology Stack

The DUSK website is engineered as a high-performance, visually immersive web experience combining modern web standards with real-time procedural mathematics and 3D graphics.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DUSK WEB APPLICATION                            │
├────────────────────────────────────────────────────────────────────────┤
│  Framework: Next.js 15 (App Router, React 19, TypeScript)             │
│  Styling: Tailwind CSS v4 + Vanilla CSS Design Tokens                  │
│  3D Engine: Three.js + WebGL (PBR Shaders, ACES Tone Mapping)          │
│  Animation: GSAP (GreenSock) + Custom RAF Lerp Physics Loops           │
│  Typography: Outfit (Sans), Playfair Display (Serif), Space Mono       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Algorithms & Mathematical Formulations

### Algorithm 1: Fluid Linear Interpolation (LERP) Cursor Spotlight

Located in [page.tsx](file:///c:/shabnam/mywork/floria/floria/app/page.tsx#L20-L49).

#### Mathematical Theory
Directly pinning visual elements to mouse events causes jittery, robotic motion. To simulate natural mass and inertia, the cursor position is interpolated using a discrete **Linear Interpolation (Lerp)** function calculated on each animation frame:

$$P_{current}(t) = P_{current}(t - 1) + \lambda \cdot \big(P_{target}(t) - P_{current}(t - 1)\big)$$

Where:
- $P_{target} = (x_{mouse}, y_{mouse})$ is the instantaneous pointer coordinate.
- $P_{current}$ is the smoothed rendering position.
- $\lambda = 0.20$ is the smoothing coefficient (20% step toward target per frame).

#### Dual Layer Inversion & Dynamic Masking
Rather than using heavy canvas composites, the reveal effect uses GPU-accelerated CSS `mask-image`:

1. **Base Layer**: Displays `/bg-reveal.jpg` (celestial night landscape) darkened by an overlay.
2. **Reveal Layer**: Displays `/bg-base.jpg` (bright daytime starlight kingdom).
3. **Radial Gradient Mask**:
   $$\text{Mask}(r) = \begin{cases} 1.0 & r \le 140\text{px} \\ \frac{260 - r}{120} & 140\text{px} < r \le 260\text{px} \\ 0.0 & r > 260\text{px} \end{cases}$$
4. **Feathered Corona Glow**: A secondary radial gradient at the mask perimeter creates an optical dispersion ring (warm gold at $235\text{px}$ transitioning to violet at $255\text{px}$).

---

### Algorithm 2: Procedural 3D Creature Kinematics & Wing Flutter

Located in [CreatureCanvas.tsx](file:///c:/shabnam/mywork/floria/floria/app/components/CreatureCanvas.tsx#L183-L262).

#### 1. Coordinate Normalization
Mouse screen coordinates are mapped to normalized device coordinates (NDC) $[-1, 1]$:
$$X_{ndc} = \left(\frac{2 \cdot X_{screen}}{W}\right) - 1, \quad Y_{ndc} = -\left[\left(\frac{2 \cdot Y_{screen}}{H}\right) - 1\right]$$

Smoothed via lerp factor $\lambda = 0.18$.

#### 2. Harmonic Hover Float
To give the creature a living, floating presence, two out-of-phase sinusoidal waves modulate its spatial translation:

$$Y_{pos} = Y_{base} + \sin(2.2 \cdot t) \cdot 0.08 + Y_{ndc} \cdot 0.12$$
$$X_{pos} = \cos(1.5 \cdot t) \cdot 0.04 + X_{ndc} \cdot 0.35$$

- The $X_{pos}$ term creates responsive horizontal movement following the user's cursor.
- The out-of-phase angular frequencies ($2.2\text{ rad/s}$ vs $1.5\text{ rad/s}$) ensure the motion path never loops monotonously.

#### 3. Flight Banking & Rotational Kinematics (Yaw, Pitch, Roll)
When moving laterally, the creature banks into turns like a real airborne organism:

$$\text{Yaw} = -\frac{\pi}{2} - 0.75 \cdot X_{ndc} \quad \text{(turns to face cursor direction)}$$
$$\text{Pitch} = 0.12 - 0.45 \cdot Y_{ndc} \quad \text{(looks up and down)}$$
$$\text{Roll} = 0.25 \cdot X_{ndc} \quad \text{(rotational bank tilt)}$$

All rotational components are smoothed every frame via `THREE.MathUtils.lerp`.

#### 4. Velocity-Modulated Wing Fluttering
Wing oscillation frequency responds dynamically to mouse velocity:

$$\text{Flutter}_{base} = \sin(12 \cdot t) \cdot 0.28$$
$$\text{VelocityInfluence} = 2.5 \cdot |X_{target} - X_{current}|$$
$$\text{Flutter}_{dynamic} = \text{Flutter}_{base} \cdot (1 + \text{VelocityInfluence})$$

- When the cursor is still, wings beat at a relaxed $12\text{ rad/s}$.
- Rapid cursor movement accelerates the amplitude and visual intensity of the wing strokes.
- Bone rotations for `LeftWing_0` and `RightWing_1` are driven in antiphase around the Z and X axes.

#### 5. Bioluminescent Abdomen Pulse
The creature's abdomen mesh material (`Object_10` / emissive channel) and a localized Three.js `PointLight` cycle through a harmonic respiration curve:

$$I_{emissive}(t) = 1.6 + 0.6 \cdot \sin(3.5 \cdot t)$$
$$I_{light}(t) = 1.5 \cdot I_{emissive}(t)$$

---

### Algorithm 3: Scroll-Driven Cinematic Viewport Expansion

Located in [StorytellingSection.tsx](file:///c:/shabnam/mywork/floria/floria/app/components/StorytellingSection.tsx#L24-L124).

#### 1. Track Progress Calculation
The track spans $320\text{vh}$, with a `sticky` inner viewport stage ($100\text{vh}$).
Scroll progress is normalized to $[0, 1]$:

$$P_{raw} = \frac{-Y_{bounding}}{H_{track} - H_{viewport}}, \quad P = \text{clamp}(P_{raw}, 0, 1)$$

A dedicated RAF loop decouples scroll measurement from visual interpolation:
$$P_{current} = P_{current} + 0.12 \cdot (P_{target} - P_{current})$$

#### 2. Non-Linear Cubic S-Curve Transition
The expansion occurs between $P \in [0.12, 0.85]$:

$$T = \text{clamp}\left(\frac{P - 0.12}{0.85 - 0.12}, 0, 1\right)$$

To avoid robotic constant velocity, a smooth cubic bezier ease-in-out curve is evaluated:

$$f(T) = \begin{cases} 4T^3 & \text{if } T < 0.5 \\ 1 - \frac{(-2T + 2)^3}{2} & \text{if } T \ge 0.5 \end{cases}$$

#### 3. Geometric Morphing Dimensions
Dimensions morph smoothly from a 9:16 vertical art card into a full $100\text{vw} \times 100\text{vh}$ canvas:

$$W_{card} = W_{initial} + \big(W_{viewport} - W_{initial}\big) \cdot f(T)$$
$$H_{card} = H_{initial} + \big(H_{viewport} - H_{initial}\big) \cdot f(T)$$
$$\text{Radius}_{border} = \max\big(0, 24 \cdot (1 - 1.25 \cdot f(T))\big)$$
$$\text{Opacity}_{border} = \max\big(0, 1 - 2.2 \cdot f(T)\big)$$

#### 4. Asymmetric Chaotic Flyout Vectors
Surrounding editorial typography elements exit along calculated trajectories:

$$t_{elem} = \text{clamp}\left(\frac{P - \text{Start}}{\text{End} - \text{Start}}, 0, 1\right)$$
$$\text{Ease}_{out}(t) = 1 - (1 - t_{elem})^{2.5}$$
$$\text{Opacity} = \max(0, 1 - \text{Ease}_{out})$$
$$\vec{X}_{trans} = \Delta X \cdot \text{Ease}_{out}, \quad \vec{Y}_{trans} = \Delta Y \cdot \text{Ease}_{out}, \quad \theta = \Delta\theta \cdot \text{Ease}_{out}$$

| Element | Trigger Range | Vector $(\Delta X, \Delta Y)$ | Rotation ($\Delta\theta$) |
|---|---|---|---|
| Inscription (Top-Left) | $0.18 \to 0.44$ | $(+60\text{px}, -25\text{px})$ | $+4^\circ$ |
| Telemetry Pill (Left) | $0.26 \to 0.52$ | $(+65\text{px}, 0\text{px})$ | $+5^\circ$ |
| Fig. VII (Bottom-Right) | $0.34 \to 0.62$ | $(+50\text{px}, +35\text{px})$ | $+4^\circ$ |
| Scroll Pill (Bottom) | $0.04 \to 0.18$ | $(0\text{px}, +25\text{px})$ | $0^\circ$ |

---

### Algorithm 4: Asymmetric Editorial Grid & GSAP Kinetic Staging

Located in [DiscoverySection.tsx](file:///c:/shabnam/mywork/floria/floria/app/components/DiscoverySection.tsx#L118-L243).

#### 1. GSAP Staggered Header Staging
When the header intersects the viewport (`IntersectionObserver`, threshold $0.12$), a GSAP timeline coordinates kinetic typography:
1. `Discover` word blooms with `scale: 0.88 -> 1`, `opacity: 0 -> 1`, and elastic overshoot easing `back.out(1.4)`.
2. `Dusk` word animates with an overlapping offset (`"-=0.55"`).
3. Narrative description slides into place (`y: 22 -> 0`).
4. Metadata badges stagger sequentially with $\Delta t = 0.08\text{s}$.
5. Telemetry HUD panel enters from the right flank (`x: 35 -> 0`).

#### 2. Dual-Safety Specimen Observation
Each specimen card is observed independently:
- Upon intersection, its ID is flagged in React state `revealedCards[id] = true`.
- Transition: `translateY(35px) scale(0.97)` $\to$ `translateY(0px) scale(1)`.
- **Fail-safe Watchdog**: A $1500\text{ms}$ timeout automatically resolves all cards to visible if intersection observer triggers are delayed or interrupted.

---

## 3. Visual & Aesthetic Architecture

### Curated Color Harmonies
- **Void Obsidian Background**: `#000000` (100% luminance absorption).
- **Celestial Multi-Stop Twilight Gradient**:
  $$\text{CSS: } \text{linear-gradient}(135^\circ, \text{\#fcd34d } 0\%, \text{\#fb923c } 25\%, \text{\#e879f9 } 50\%, \text{\#a78bfa } 75\%, \text{\#818cf8 } 100\%)$$
- **Bioluminescent Accents**:
  - Emerald Green: `#10b981` (Spore & Abdomen emission)
  - Nocturnal Purple: `#c084fc` (Atmospheric aurora)
  - Starlight Amber: `#fef08a` (Lantern key rim)

### Typographic Trinity
1. **Outfit** (Sans-Serif): Crisp, geometric, modern legibility.
2. **Playfair Display** (High-Contrast Serif Italic): Editorial luxury and poetic resonance.
3. **Space Mono** (Monospace): Scientific field notes, archival indexes, and telemetry coordinates.

---

## 4. Performance & Memory Management

1. **GPU Offloading**: All transforms utilize hardware acceleration via `translate3d` and CSS `transform`/`opacity` properties, bypassing CPU layout reflows.
2. **Resource Teardown**:
   - `cancelAnimationFrame` invoked on component unmount.
   - Event listeners (`resize`, `scroll`, `pointermove`) cleaned up.
   - Three.js WebGL context disposed via `renderer.dispose()`.
   - GSAP timeline contexts reverted via `ctx.revert()`.
3. **Passive Scrolling**: Window scroll listeners marked with `{ passive: true }` to eliminate scroll-blocking overhead.
