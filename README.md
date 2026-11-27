# Amit Kumar Yadav — Interactive 3D Developer Portfolio

An interactive 3D hand-drawn developer portfolio built with React, Vite, Three.js, React Three Fiber, GSAP, and custom GLSL reveal shaders. Visitors enter through a sketchy brick facade into an infinite paper corridor connecting four bespoke interactive 3D rooms.

> [!NOTE]
> Enable hardware acceleration in your browser for smooth 60 FPS WebGL rendering across desktop and mobile tiers.

---

## ✨ Experience Overview

- **Interactive Entrance:** Open the central sketch doors to enter the corridor, squash four wandering wall bugs with a sketchy `"BUG FIXED!"` animation, grab and flick the hanging tree-branch computer mouse with damped pendulum physics, or click the rubber duck for debugging wisdom.
- **Infinite 3D Corridor:** Scroll seamlessly past pencil-sketch murals and inspectable framed illustrations (including custom Synthwave, Arduino/AI circuit, and Knightfall artwork) lined along a hand-drawn sawtooth hallway.
- **Interactive Rooms:**
  - **About:** Floating cloud-island journey, education milestones, and skills showcase.
  - **Gallery:** Flippable 3D showcase cards for key software and hardware builds.
  - **Studio:** Interactive retro monitor, dual TV screens, and mobile device showcase.
  - **Contact:** Sketchbook paper view with direct Gmail copy/mail actions and floating interactive social barrels.

---

## 🚀 Featured Projects

- **[Knightfall](https://knightfall-chess-zeta.vercel.app/)** ([GitHub](https://github.com/A-gent-47/knightfall-chess)) — Interactive chess platform featuring tactical puzzles, multi-difficulty bots with distinct playstyles, move-by-move mistake analysis, and custom themes.
- **[SYNTHWAVE](https://synthwave-pied.vercel.app/)** ([GitHub](https://github.com/A-gent-47/SYNTHWAVE-)) — Interactive audio-reactive browser music visualizer with a retro synthwave aesthetic.
- **KisanSetu (SIH 2026)** — Crop procurement and logistics platform built for Smart India Hackathon (`SIH26032`) with farmer registration, slot booking, live queue management, alerts, and payment tracking.
- **Multi-Stage Smart Access & Automated Door System** — Energy-efficient DTI hardware prototype built with Arduino Mega using low-power standby, ultrasonic proximity detection, weight confirmation, and automated actuation.

---

## 🧰 Tech Stack

- **UI & Build:** React 19, Vite, React Router
- **3D & Motion:** Three.js, React Three Fiber (`@react-three/fiber`, `@react-three/drei`), Postprocessing, GSAP
- **Shaders & Assets:** Custom GLSL shaders (`RevealMaterial`, `PaintRevealMaterial`), WebP POT texture preloading (`texturePreloadList.js`)

---

## 🛠️ Quick Local Setup

Make sure **Node.js v20+** is installed:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

For production verification (recommended for compressed assets & textures):

```bash
npm run build && npm run preview
```

---

## 🙌 Credits & Licence

Code in this repository is licensed under the [MIT License](LICENSE).

Based on [Tomasz Szmajda](https://github.com/ITomPoland)'s open-source 3D portfolio template: **[ITomPoland/portfolio-itom](https://github.com/ITomPoland/portfolio-itom)** (MIT License). Personalized, extended, and maintained by **Amit Kumar Yadav (AMIT)**.
