# InverseCornerBox

> Smooth, responsive cards and containers with mathematical **inverted (concave) corners**, **multi-corner slots**, and **interactive spring morph animations** for **React** and **Next.js**.

[![npm version](https://img.shields.io/npm/v/inverse-corner-box.svg)](https://www.npmjs.com/package/inverse-corner-box)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

- 📐 **True Mathematical SVG Arcs** – Exact SVG curves (`A rx ry ...`) for flawless concave fillets without CSS pseudo-element hacks.
- 🔄 **Multi-Corner Support** – Configure inverted notches independently for `topLeft`, `topRight`, `bottomRight`, and `bottomLeft` simultaneously.
- ⚡ **Interactive Spring Morphing** – Fluid, zero-lag spring animations on hover (`interactiveMorph`) powered by `motion`.
- ✂️ **Built-in Clip-Path Masking** – Automatic SVG clipPath mask so child content never overflows past the curved corners.
- 📱 **Fully Responsive** – Automatically observes container dimensions using `ResizeObserver`.
- 🚀 **Next.js & SSR Ready** – Includes `'use client'` banner and SSR-safe isomorphic layout effects.
- 📦 **Dual ESM & CJS Builds** – Modern bundler support with full TypeScript `.d.ts` definitions.

---

## 📦 Installation

```bash
# npm
npm install inverse-corner-box motion

# yarn
yarn add inverse-corner-box motion

# pnpm
pnpm add inverse-corner-box motion

# bun
bun add inverse-corner-box motion
```

---

## 🚀 Quick Start

### 1. Single Corner Shorthand

```tsx
import React from "react";
import { InverseCornerBox } from "inverse-corner-box";

export default function Card() {
  return (
    <InverseCornerBox
      className="w-96 h-64 p-6"
      bg="#18181B"
      borderColor="rgba(255, 255, 255, 0.15)"
      borderWidth={1.5}
      position="bottom-right"
      notchWidth={140}
      notchHeight={52}
      notchContent={
        <button className="w-full h-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-medium transition-colors">
          Action
        </button>
      }
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-bold text-white">Sculk Cloud</h3>
          <p className="text-zinc-400 text-sm mt-1">High performance server infrastructure</p>
        </div>
        <div className="text-2xl font-semibold text-white">
          $12.00 <span className="text-xs text-zinc-400 font-normal">/ mo</span>
        </div>
      </div>
    </InverseCornerBox>
  );
}
```

---

### 2. Multi-Corner Setup

Configure separate notches and content for any or all corners:

```tsx
import { InverseCornerBox } from "inverse-corner-box";

export default function MultiCornerCard() {
  return (
    <InverseCornerBox
      className="w-full h-80 p-8"
      bg="#0F172A"
      borderColor="rgba(56, 189, 248, 0.25)"
      topLeft={{ notchWidth: 120, notchHeight: 44 }}
      notchTopLeft={<span className="text-xs font-mono text-cyan-400 font-bold">STATUS: ACTIVE</span>}
      bottomRight={{ notchWidth: 150, notchHeight: 52 }}
      notchBottomRight={
        <button className="w-full h-full bg-cyan-600 text-white rounded-xl font-medium">
          Connect →
        </button>
      }
    >
      <h2 className="text-white text-2xl font-bold">Multi-Corner Grid</h2>
    </InverseCornerBox>
  );
}
```

---

### 3. Interactive Spring Morphing

Enable fluid spring morph animations on hover:

```tsx
<InverseCornerBox
  interactiveMorph={true}
  morphWidthDelta={35}
  position="bottom-right"
  notchContent={<button className="w-full h-full bg-cyan-600 text-white rounded-xl">Hover me</button>}
>
  {/* Content */}
</InverseCornerBox>
```

---

## ⚙️ Props Reference

`InverseCornerBox` extends all standard `React.HTMLAttributes<HTMLDivElement>` props (`onClick`, `id`, `style`, `className`, etc.) and supports `ref` forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | `undefined` | Inner content rendered within the container. |
| `position` | `CornerPosition` | `"bottom-right"` | Corner location for single-slot shorthand (`"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"`). |
| `notchContent` | `ReactNode` | `undefined` | Element placed inside the single-slot notch cutout. |
| `notchWidth` | `number` | `150` | Default notch cutout width in pixels. |
| `notchHeight` | `number` | `54` | Default notch cutout height in pixels. |
| `cornerRadius` | `number` | `28` | Outer corner radius for standard corners. |
| `invertedRadius` | `number` | `24` | Radius of the concave/inverted curve. |
| `topLeft` | `CornerNotchConfig \| boolean` | `undefined` | Configuration for top-left notch. |
| `topRight` | `CornerNotchConfig \| boolean` | `undefined` | Configuration for top-right notch. |
| `bottomRight` | `CornerNotchConfig \| boolean` | `undefined` | Configuration for bottom-right notch. |
| `bottomLeft` | `CornerNotchConfig \| boolean` | `undefined` | Configuration for bottom-left notch. |
| `notchTopLeft` | `ReactNode` | `undefined` | Dedicated slot element for top-left notch. |
| `notchTopRight` | `ReactNode` | `undefined` | Dedicated slot element for top-right notch. |
| `notchBottomRight` | `ReactNode` | `undefined` | Dedicated slot element for bottom-right notch. |
| `notchBottomLeft` | `ReactNode` | `undefined` | Dedicated slot element for bottom-left notch. |
| `interactiveMorph` | `boolean` | `false` | Enables spring-animated morphing on hover. |
| `morphWidthDelta` | `number` | `35` | Additional width expansion during hover morphing. |
| `clipMethod` | `'clip-path' \| 'svg-background' \| 'none'` | `'clip-path'` | Clipping strategy for inner children. |
| `bg` | `string` | `"#18181B"` | Fill color of the shape (hex, rgb, hsl, gradient). |
| `borderColor` | `string` | `"rgba(255, 255, 255, 0.22)"` | Border stroke color. |
| `borderWidth` | `number` | `1.2` | Border stroke width in pixels. |
| `shadow` | `boolean \| string` | `true` | Enables default shadow or custom CSS drop-shadow string. |

---

## 🛠️ Low-Level Path Generators

You can also import the path generators directly:

```tsx
import { generateMultiCornerPath, generateNotchPath } from "inverse-corner-box";

const pathData = generateMultiCornerPath(400, 250, {
  globalCornerRadius: 28,
  globalInvertedRadius: 24,
  bottomRight: { notchWidth: 140, notchHeight: 56 },
  topLeft: { notchWidth: 100, notchHeight: 40 },
});
```

---

## 📄 License

Released under the [MIT License](https://opensource.org/licenses/MIT). © [rossek22](https://github.com/rossek22)
