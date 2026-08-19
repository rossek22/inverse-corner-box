"use client";

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { CornerPosition, generateNotchPath } from "./path";

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface InverseCornerBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Inner content placed inside the card */
    children?: React.ReactNode;
    /** Element placed in the inverted notch cut-out (e.g. button, icon, badge) */
    notchContent?: React.ReactNode;
    /** Additional CSS / Tailwind classes for the main container */
    className?: string;
    /** Background fill color of the shape (hex, rgb, hsl, gradient) */
    bg?: string;
    /** Background fill color (alias for bg) */
    backgroundColor?: string;
    /** Border stroke color */
    borderColor?: string;
    /** Border stroke width in pixels (default: 1.2) */
    borderWidth?: number;
    /** Optional stroke dash array for dashed borders */
    strokeDasharray?: string;
    /** Outer corner radius for standard corners (default: 28) */
    cornerRadius?: number;
    /** Radius of the inverted (concave) corner curve (default: 24) */
    invertedRadius?: number;
    /** Outer transition fillet radius at the notch boundary (default: equals invertedRadius) */
    outerFilletRadius?: number;
    /** Width of the notch cutout (default: 145) */
    notchWidth?: number;
    /** Height of the notch cutout (default: 56) */
    notchHeight?: number;
    /** Corner location of the inverted cutout (default: "bottom-right") */
    position?: CornerPosition;
    /** Enable default shadow or provide a custom CSS drop-shadow string (default: true) */
    shadow?: boolean | string;
    /** Additional CSS classes for the notch container */
    notchClassName?: string;
    /** Additional inline styles for the notch container */
    notchStyle?: React.CSSProperties;
    /** Additional CSS classes for the SVG element */
    svgClassName?: string;
    /** Additional inline styles for the SVG element */
    svgStyle?: React.CSSProperties;
    /** Additional CSS classes for the inner children wrapper */
    contentClassName?: string;
    /** Additional inline styles for the inner children wrapper */
    contentStyle?: React.CSSProperties;
    /** Additional props passed directly to the SVG `<path>` element */
    pathProps?: React.SVGProps<SVGPathElement>;
    /** Initial width fallback before measurement */
    initialWidth?: number;
    /** Initial height fallback before measurement */
    initialHeight?: number;
}

/**
 * InverseCornerBox
 *
 * A modern, responsive React container with smooth mathematical inverted (concave) corners
 * and an automatic aligned slot for buttons, badges, or controls.
 */
export const InverseCornerBox = forwardRef<HTMLDivElement, InverseCornerBoxProps>(
    (
        {
            children,
            notchContent,
            className = "",
            bg,
            backgroundColor = "#18181B",
            borderColor = "rgba(255, 255, 255, 0.2)",
            borderWidth = 1.2,
            strokeDasharray,
            cornerRadius = 28,
            invertedRadius = 24,
            outerFilletRadius,
            notchWidth = 145,
            notchHeight = 56,
            position = "bottom-right",
            shadow = true,
            notchClassName = "",
            notchStyle: customNotchStyle,
            svgClassName = "",
            svgStyle: customSvgStyle,
            contentClassName = "",
            contentStyle: customContentStyle,
            pathProps,
            initialWidth = 380,
            initialHeight = 230,
            style,
            ...rest
        },
        ref,
    ) => {
        const containerRef = useRef<HTMLDivElement>(null);
        useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

        const [size, setSize] = useState({
            width: initialWidth,
            height: initialHeight,
        });

        // Synchronous size observer to eliminate lag on layout changes
        useIsomorphicLayoutEffect(() => {
            const el = containerRef.current;
            if (!el) return;

            const updateSize = () => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    const nextW = Math.round(rect.width);
                    const nextH = Math.round(rect.height);
                    setSize((prev) => {
                        if (prev.width === nextW && prev.height === nextH) return prev;
                        return { width: nextW, height: nextH };
                    });
                }
            };

            updateSize();

            if (typeof ResizeObserver !== "undefined") {
                const observer = new ResizeObserver(updateSize);
                observer.observe(el);
                return () => observer.disconnect();
            }
        }, []);

        const fillColor = bg ?? backgroundColor;

        // Mathematical SVG path recalculation on dimension / prop changes
        const pathD = useMemo(() => {
            return generateNotchPath({
                width: size.width,
                height: size.height,
                cornerRadius,
                invertedRadius,
                outerFilletRadius,
                notchWidth,
                notchHeight,
                position,
            });
        }, [
            size.width,
            size.height,
            cornerRadius,
            invertedRadius,
            outerFilletRadius,
            notchWidth,
            notchHeight,
            position,
        ]);

        // Notch content slot positioning
        const computedNotchStyle = useMemo((): React.CSSProperties => {
            const base: React.CSSProperties = {
                position: "absolute",
                width: `${notchWidth}px`,
                height: `${notchHeight}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                boxSizing: "border-box",
                ...customNotchStyle,
            };

            switch (position) {
                case "bottom-right":
                    return { ...base, right: 0, bottom: 0 };
                case "bottom-left":
                    return { ...base, left: 0, bottom: 0 };
                case "top-right":
                    return { ...base, right: 0, top: 0 };
                case "top-left":
                    return { ...base, left: 0, top: 0 };
            }
        }, [notchWidth, notchHeight, position, customNotchStyle]);

        const shadowStyle = useMemo(() => {
            if (!shadow) return undefined;
            if (typeof shadow === "string") return { filter: shadow };
            return { filter: "drop-shadow(0px 12px 28px rgba(0,0,0,0.25))" };
        }, [shadow]);

        return (
            <div
                ref={containerRef}
                className={`relative select-none ${className}`}
                style={{ ...style }}
                {...rest}
            >
                {/* SVG Shape Layer */}
                <svg
                    className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${svgClassName}`}
                    viewBox={`0 0 ${size.width} ${size.height}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ ...shadowStyle, ...customSvgStyle }}
                >
                    <path
                        d={pathD}
                        fill={fillColor}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                        strokeDasharray={strokeDasharray}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        {...pathProps}
                    />
                </svg>

                {/* Primary Card Content */}
                <div
                    className={`relative z-10 w-full h-full ${contentClassName}`}
                    style={customContentStyle}
                >
                    {children}
                </div>

                {/* Inverted Notch Slot */}
                {notchContent && (
                    <div style={computedNotchStyle} className={notchClassName}>
                        {notchContent}
                    </div>
                )}
            </div>
        );
    },
);

InverseCornerBox.displayName = "InverseCornerBox";

export default InverseCornerBox;
