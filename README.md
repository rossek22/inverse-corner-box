# InverseCornerBox

> Smooth, responsive cards and containers with mathematical **inverted (concave) corners** and aligned button/badge slots for **React** and **Next.js**.

[![npm version](https://img.shields.io/npm/v/inverse-corner-box.svg)](https://www.npmjs.com/package/inverse-corner-box)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

- 📐 **True SVG Arc Geometry** – Uses exact mathematical SVG arcs (`A rx ry ...`) for flawless concave fillets without CSS pseudo-element hacks.
- ⚡ **Zero Border Lag** – Fill and stroke rendered in a unified SVG path layer, preventing any stroke desynchronization during animations or layout resizes.
- 📱 **Fully Responsive** – Automatically observes container dimensions using `ResizeObserver`.
- 🚀 **Next.js & SSR Ready** – Includes `'use client'` banner and SSR-safe isomorphic layout effects.
- 🎨 **Deeply Customizable** – Configure outer radius, inverted radius, outer fillet radius, notch dimensions, stroke, fill, shadows, and all 4 corner positions.
- 📦 **Dual ESM & CJS Builds** – Modern bundler support with full TypeScript `.d.ts` definitions.

---

## 📦 Installation

```bash
# npm
npm install inverse-corner-box

# yarn
yarn add inverse-corner-box

# pnpm
pnpm add inverse-corner-box

# bun
bun add inverse-corner-box
```

---

## 🚀 Quick Start

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

## 🧭 Positions

`InverseCornerBox` supports placing the inverted notch in any of the 4 corners:

| Position | Value | Description |
|---|---|---|
| **Bottom Right** *(default)* | `"bottom-right"` | Cutout in the bottom-right corner |
| **Bottom Left** | `"bottom-left"` | Cutout in the bottom-left corner |
| **Top Right** | `"top-right"` | Cutout in the top-right corner |
| **Top Left** | `"top-left"` | Cutout in the top-left corner |

```tsx
<InverseCornerBox position="top-right" notchContent={<Badge>NEW</Badge>}>
  {/* Content */}
</InverseCornerBox>
```

---

## ⚙️ Props Reference

`InverseCornerBox` extends all standard `React.HTMLAttributes<HTMLDivElement>` props (such as `onClick`, `id`, `style`, `className`, etc.) and supports `ref` forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | `undefined` | Inner content rendered within the container. |
| `notchContent` | `ReactNode` | `undefined` | Element placed inside the inverted notch cutout (e.g. button, badge). |
| `position` | `CornerPosition` | `"bottom-right"` | Which corner to place the inverted notch in. |
| `bg` / `backgroundColor` | `string` | `"#18181B"` | Fill color of the shape (hex, rgb, hsl, gradient). |
| `borderColor` | `string` | `"rgba(255, 255, 255, 0.2)"` | Border stroke color. |
| `borderWidth` | `number` | `1.2` | Border stroke width in pixels. |
| `strokeDasharray` | `string` | `undefined` | Optional dash array pattern for dashed/dotted strokes. |
| `cornerRadius` | `number` | `28` | Outer corner radius for standard corners. |
| `invertedRadius` | `number` | `24` | Radius of the concave/inverted curve. |
| `outerFilletRadius` | `number` | `invertedRadius` | Transition radius at the outer boundaries of the notch. |
| `notchWidth` | `number` | `145` | Width of the notch cutout in pixels. |
| `notchHeight` | `number` | `56` | Height of the notch cutout in pixels. |
| `shadow` | `boolean \| string` | `true` | Enables default shadow or custom CSS drop-shadow string. |
| `className` | `string` | `""` | Additional CSS / Tailwind classes for the container. |
| `notchClassName` | `string` | `""` | Additional CSS classes for the notch container. |
| `notchStyle` | `CSSProperties` | `undefined` | Custom inline styles for the notch container. |
| `svgClassName` | `string` | `""` | Additional CSS classes for the SVG element. |
| `svgStyle` | `CSSProperties` | `undefined` | Custom inline styles for the SVG element. |
| `contentClassName` | `string` | `""` | Additional CSS classes for the content wrapper. |
| `contentStyle` | `CSSProperties` | `undefined` | Custom inline styles for the content wrapper. |
| `pathProps` | `SVGProps<SVGPathElement>` | `undefined` | Props forwarded directly to the SVG `<path>` element. |

---

## 🛠️ Low-Level SVG Path Generator

You can also use the standalone mathematical path generator function to draw raw SVG paths in your own custom canvas, Three.js, or SVG elements:

```tsx
import { generateNotchPath } from "inverse-corner-box";

const pathData = generateNotchPath({
  width: 400,
  height: 250,
  cornerRadius: 28,
  invertedRadius: 24,
  notchWidth: 140,
  notchHeight: 56,
  position: "bottom-right",
});

console.log(pathData);
// "M 28 0 L 372 0 A 28 28 0 0 1 400 28 ..."
```

---

## 📄 License

MIT © [Aram (rossek22)](https://github.com/rossek22)
