"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useMemo,
  useId,
} from 'react';
import { useSpring } from 'motion/react';
import {
  CornerPosition,
  ClipMethod,
  CornerNotchConfig,
  MultiCornerOptions,
  generateMultiCornerPath,
} from './path';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface InverseCornerBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  // Single-slot shorthand
  notchContent?: React.ReactNode;
  position?: CornerPosition;
  notchWidth?: number;
  notchHeight?: number;
  cornerRadius?: number;
  invertedRadius?: number;

  // Multi-corner props
  topLeft?: CornerNotchConfig | boolean;
  topRight?: CornerNotchConfig | boolean;
  bottomRight?: CornerNotchConfig | boolean;
  bottomLeft?: CornerNotchConfig | boolean;

  // Dedicated slots
  notchTopLeft?: React.ReactNode;
  notchTopRight?: React.ReactNode;
  notchBottomRight?: React.ReactNode;
  notchBottomLeft?: React.ReactNode;

  // Features
  clipMethod?: ClipMethod;
  interactiveMorph?: boolean;
  morphWidthDelta?: number;
  bg?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shadow?: boolean | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SPRING_CONFIG = {
  stiffness: 420,
  damping: 28,
  mass: 0.7,
};

export const InverseCornerBox = forwardRef<HTMLDivElement, InverseCornerBoxProps>(
  (
    {
      children,
      notchContent,
      position = 'bottom-right',
      notchWidth = 150,
      notchHeight = 54,
      cornerRadius = 28,
      invertedRadius = 24,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      notchTopLeft,
      notchTopRight,
      notchBottomRight,
      notchBottomLeft,
      clipMethod = 'clip-path',
      interactiveMorph = false,
      morphWidthDelta = 35,
      bg,
      backgroundColor = '#18181B',
      borderColor = 'rgba(255, 255, 255, 0.22)',
      borderWidth = 1.2,
      shadow = true,
      className = '',
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const mainPathRef = useRef<SVGPathElement>(null);
    const clipPathRef = useRef<SVGPathElement>(null);
    const singleSlotRef = useRef<HTMLDivElement>(null);

    const rawId = useId();
    const clipId = `notch-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    const [size, setSize] = useState<{ width: number; height: number }>({
      width: 390,
      height: 240,
    });
    const [isHovered, setIsHovered] = useState(false);

    useIsomorphicLayoutEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const updateSize = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const nw = Math.round(rect.width);
          const nh = Math.round(rect.height);
          setSize((prev) => {
            if (prev.width === nw && prev.height === nh) return prev;
            return { width: nw, height: nh };
          });
        }
      };

      updateSize();
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(updateSize);
        observer.observe(el);
        return () => observer.disconnect();
      }
    }, []);

    const morphOffset = interactiveMorph && isHovered ? morphWidthDelta : 0;
    const hasExplicitMulti =
      topLeft !== undefined ||
      topRight !== undefined ||
      bottomRight !== undefined ||
      bottomLeft !== undefined;

    const targetTlW = hasExplicitMulti
      ? topLeft
        ? (typeof topLeft === 'object' ? (topLeft.notchWidth ?? notchWidth) : notchWidth) + morphOffset
        : 0
      : position === 'top-left'
      ? notchWidth + morphOffset
      : 0;
    const targetTlH = hasExplicitMulti
      ? topLeft
        ? typeof topLeft === 'object' ? (topLeft.notchHeight ?? notchHeight) : notchHeight
        : 0
      : position === 'top-left'
      ? notchHeight
      : 0;

    const targetTrW = hasExplicitMulti
      ? topRight
        ? (typeof topRight === 'object' ? (topRight.notchWidth ?? notchWidth) : notchWidth) + morphOffset
        : 0
      : position === 'top-right'
      ? notchWidth + morphOffset
      : 0;
    const targetTrH = hasExplicitMulti
      ? topRight
        ? typeof topRight === 'object' ? (topRight.notchHeight ?? notchHeight) : notchHeight
        : 0
      : position === 'top-right'
      ? notchHeight
      : 0;

    const targetBrW = hasExplicitMulti
      ? bottomRight
        ? (typeof bottomRight === 'object' ? (bottomRight.notchWidth ?? notchWidth) : notchWidth) + morphOffset
        : 0
      : position === 'bottom-right'
      ? notchWidth + morphOffset
      : 0;
    const targetBrH = hasExplicitMulti
      ? bottomRight
        ? typeof bottomRight === 'object' ? (bottomRight.notchHeight ?? notchHeight) : notchHeight
        : 0
      : position === 'bottom-right'
      ? notchHeight
      : 0;

    const targetBlW = hasExplicitMulti
      ? bottomLeft
        ? (typeof bottomLeft === 'object' ? (bottomLeft.notchWidth ?? notchWidth) : notchWidth) + morphOffset
        : 0
      : position === 'bottom-left'
      ? notchWidth + morphOffset
      : 0;
    const targetBlH = hasExplicitMulti
      ? bottomLeft
        ? typeof bottomLeft === 'object' ? (bottomLeft.notchHeight ?? notchHeight) : notchHeight
        : 0
      : position === 'bottom-left'
      ? notchHeight
      : 0;

    const tlWSpring = useSpring(targetTlW, SPRING_CONFIG);
    const tlHSpring = useSpring(targetTlH, SPRING_CONFIG);
    const trWSpring = useSpring(targetTrW, SPRING_CONFIG);
    const trHSpring = useSpring(targetTrH, SPRING_CONFIG);
    const brWSpring = useSpring(targetBrW, SPRING_CONFIG);
    const brHSpring = useSpring(targetBrH, SPRING_CONFIG);
    const blWSpring = useSpring(targetBlW, SPRING_CONFIG);
    const blHSpring = useSpring(targetBlH, SPRING_CONFIG);

    useEffect(() => {
      tlWSpring.set(targetTlW);
      tlHSpring.set(targetTlH);
      trWSpring.set(targetTrW);
      trHSpring.set(targetTrH);
      brWSpring.set(targetBrW);
      brHSpring.set(targetBrH);
      blWSpring.set(targetBlW);
      blHSpring.set(targetBlH);
    }, [
      targetTlW,
      targetTlH,
      targetTrW,
      targetTrH,
      targetBrW,
      targetBrH,
      targetBlW,
      targetBlH,
      tlWSpring,
      tlHSpring,
      trWSpring,
      trHSpring,
      brWSpring,
      brHSpring,
      blWSpring,
      blHSpring,
    ]);

    const initialPath = useMemo(() => {
      return generateMultiCornerPath(size.width, size.height, {
        globalCornerRadius: cornerRadius,
        globalInvertedRadius: invertedRadius,
        topLeft: targetTlW > 4 && targetTlH > 4 ? { notchWidth: targetTlW, notchHeight: targetTlH } : false,
        topRight: targetTrW > 4 && targetTrH > 4 ? { notchWidth: targetTrW, notchHeight: targetTrH } : false,
        bottomRight: targetBrW > 4 && targetBrH > 4 ? { notchWidth: targetBrW, notchHeight: targetBrH } : false,
        bottomLeft: targetBlW > 4 && targetBlH > 4 ? { notchWidth: targetBlW, notchHeight: targetBlH } : false,
      });
    }, [size.width, size.height, cornerRadius, invertedRadius, targetTlW, targetTlH, targetTrW, targetTrH, targetBrW, targetBrH, targetBlW, targetBlH]);

    // Zero-lag RAF DOM loop
    useEffect(() => {
      let animId: number;
      const renderTick = () => {
        const curTlW = Number(tlWSpring.get());
        const curTlH = Number(tlHSpring.get());
        const curTrW = Number(trWSpring.get());
        const curTrH = Number(trHSpring.get());
        const curBrW = Number(brWSpring.get());
        const curBrH = Number(brHSpring.get());
        const curBlW = Number(blWSpring.get());
        const curBlH = Number(blHSpring.get());

        const options: MultiCornerOptions = {
          globalCornerRadius: cornerRadius,
          globalInvertedRadius: invertedRadius,
          topLeft: curTlW > 4 && curTlH > 4 ? { notchWidth: curTlW, notchHeight: curTlH, invertedRadius, cornerRadius } : false,
          topRight: curTrW > 4 && curTrH > 4 ? { notchWidth: curTrW, notchHeight: curTrH, invertedRadius, cornerRadius } : false,
          bottomRight: curBrW > 4 && curBrH > 4 ? { notchWidth: curBrW, notchHeight: curBrH, invertedRadius, cornerRadius } : false,
          bottomLeft: curBlW > 4 && curBlH > 4 ? { notchWidth: curBlW, notchHeight: curBlH, invertedRadius, cornerRadius } : false,
        };

        const path = generateMultiCornerPath(size.width, size.height, options);

        if (mainPathRef.current) mainPathRef.current.setAttribute('d', path);
        if (clipPathRef.current) clipPathRef.current.setAttribute('d', path);

        if (containerRef.current) {
          containerRef.current.style.setProperty('--notch-tl-w', `${curTlW}px`);
          containerRef.current.style.setProperty('--notch-tr-w', `${curTrW}px`);
          containerRef.current.style.setProperty('--notch-br-w', `${curBrW}px`);
          containerRef.current.style.setProperty('--notch-bl-w', `${curBlW}px`);
        }

        if (singleSlotRef.current) {
          const isTopPos = position.startsWith('top');
          const isLeftPos = position.endsWith('left');
          const activeW = isTopPos ? (isLeftPos ? curTlW : curTrW) : (isLeftPos ? curBlW : curBrW);
          const activeH = isTopPos ? (isLeftPos ? curTlH : curTrH) : (isLeftPos ? curBlH : curBrH);
          const effW = Math.max(notchWidth, activeW);
          const effH = Math.max(notchHeight, activeH);

          singleSlotRef.current.style.width = `${effW}px`;
          singleSlotRef.current.style.height = `${effH}px`;
          singleSlotRef.current.style.top = isTopPos ? '0px' : `${size.height - effH}px`;
          singleSlotRef.current.style.left = isLeftPos ? '0px' : `${size.width - effW}px`;
        }

        const isSettled =
          Math.abs(tlWSpring.getVelocity()) < 0.05 &&
          Math.abs(trWSpring.getVelocity()) < 0.05 &&
          Math.abs(brWSpring.getVelocity()) < 0.05 &&
          Math.abs(blWSpring.getVelocity()) < 0.05;

        if (!isSettled) {
          animId = requestAnimationFrame(renderTick);
        }
      };

      renderTick();

      const unsub1 = tlWSpring.on('change', () => { cancelAnimationFrame(animId); animId = requestAnimationFrame(renderTick); });
      const unsub2 = trWSpring.on('change', () => { cancelAnimationFrame(animId); animId = requestAnimationFrame(renderTick); });
      const unsub3 = brWSpring.on('change', () => { cancelAnimationFrame(animId); animId = requestAnimationFrame(renderTick); });
      const unsub4 = blWSpring.on('change', () => { cancelAnimationFrame(animId); animId = requestAnimationFrame(renderTick); });

      return () => {
        cancelAnimationFrame(animId);
        unsub1();
        unsub2();
        unsub3();
        unsub4();
      };
    }, [size.width, size.height, cornerRadius, invertedRadius, position, notchWidth, notchHeight, tlWSpring, trWSpring, brWSpring, blWSpring]);

    const isTop = position.startsWith('top');
    const isLeft = position.endsWith('left');
    const fillColor = bg ?? backgroundColor;

    const shadowFilter = useMemo(() => {
      if (!shadow) return undefined;
      if (typeof shadow === 'string') return shadow;
      return 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))';
    }, [shadow]);

    return (
      <div
        ref={containerRef}
        onClick={onClick}
        onMouseEnter={() => interactiveMorph && setIsHovered(true)}
        onMouseLeave={() => interactiveMorph && setIsHovered(false)}
        className={`relative select-none ${className}`}
        style={style}
        {...rest}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={shadowFilter ? { filter: shadowFilter } : undefined}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={clipId}>
              <path ref={clipPathRef} d={initialPath} />
            </clipPath>
          </defs>

          <path
            ref={mainPathRef}
            d={initialPath}
            fill={fillColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div
          className="relative z-10 w-full h-full overflow-hidden"
          style={clipMethod === 'clip-path' ? { clipPath: `url(#${clipId})` } : undefined}
        >
          {children}
        </div>

        {!hasExplicitMulti && notchContent && (
          <div
            ref={singleSlotRef}
            className="absolute z-30 flex items-center justify-center p-1 will-change-transform"
            style={{
              top: isTop ? 0 : size.height - notchHeight,
              left: isLeft ? 0 : size.width - notchWidth,
              width: notchWidth,
              height: notchHeight,
            }}
          >
            {notchContent}
          </div>
        )}

        {hasExplicitMulti && (
          <>
            {topLeft && notchTopLeft && (
              <div className="absolute left-0 top-0 z-30 flex items-center justify-center p-1" style={{ width: targetTlW, height: targetTlH }}>
                {notchTopLeft}
              </div>
            )}
            {topRight && notchTopRight && (
              <div className="absolute right-0 top-0 z-30 flex items-center justify-center p-1" style={{ width: targetTrW, height: targetTrH }}>
                {notchTopRight}
              </div>
            )}
            {bottomRight && notchBottomRight && (
              <div className="absolute right-0 bottom-0 z-30 flex items-center justify-center p-1" style={{ width: targetBrW, height: targetBrH }}>
                {notchBottomRight}
              </div>
            )}
            {bottomLeft && notchBottomLeft && (
              <div className="absolute left-0 bottom-0 z-30 flex items-center justify-center p-1" style={{ width: targetBlW, height: targetBlH }}>
                {notchBottomLeft}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

InverseCornerBox.displayName = 'InverseCornerBox';

export default InverseCornerBox;
