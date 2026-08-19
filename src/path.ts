export type CornerPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type ClipMethod = 'clip-path' | 'svg-background' | 'none';

export interface CornerNotchConfig {
  enabled?: boolean;
  notchWidth?: number;
  notchHeight?: number;
  invertedRadius?: number;
  cornerRadius?: number;
}

export interface MultiCornerOptions {
  globalCornerRadius?: number;
  globalInvertedRadius?: number;
  topLeft?: CornerNotchConfig | boolean;
  topRight?: CornerNotchConfig | boolean;
  bottomRight?: CornerNotchConfig | boolean;
  bottomLeft?: CornerNotchConfig | boolean;
}

export interface GenerateNotchPathOptions {
  width: number;
  height: number;
  cornerRadius?: number;
  invertedRadius?: number;
  outerFilletRadius?: number;
  notchWidth?: number;
  notchHeight?: number;
  position?: CornerPosition;
}

// Geometry Path Generator for Multi-corner & Single-corner notches
export function generateMultiCornerPath(
  width: number,
  height: number,
  options: MultiCornerOptions = {}
): string {
  const w = Math.max(width, 100);
  const h = Math.max(height, 80);
  const defR = options.globalCornerRadius ?? 28;
  const defInv = options.globalInvertedRadius ?? 24;

  const getRaw = (cfg?: CornerNotchConfig | boolean) => {
    if (!cfg) return { enabled: false, reqW: 0, reqH: 0, r_inv: defInv, R: defR };
    if (cfg === true) return { enabled: true, reqW: 130, reqH: 50, r_inv: defInv, R: defR };
    return {
      enabled: cfg.enabled !== false,
      reqW: cfg.notchWidth ?? 130,
      reqH: cfg.notchHeight ?? 50,
      r_inv: cfg.invertedRadius ?? defInv,
      R: cfg.cornerRadius ?? defR,
    };
  };

  const rawTl = getRaw(options.topLeft);
  const rawTr = getRaw(options.topRight);
  const rawBr = getRaw(options.bottomRight);
  const rawBl = getRaw(options.bottomLeft);

  const resolve = (raw: ReturnType<typeof getRaw>, maxW: number, maxH: number) => {
    if (!raw.enabled) return { enabled: false, nw: 0, nh: 0, r_inv: defInv, R: defR, r_out: defInv };
    const nw = Math.max(10, Math.min(raw.reqW, maxW));
    const nh = Math.max(10, Math.min(raw.reqH, maxH));
    const r_inv = Math.min(raw.r_inv, nw / 2, nh / 2);
    const R = Math.min(raw.R, w / 4, h / 4);
    const r_out = Math.min(r_inv, (w - nw) / 3, (h - nh) / 3);
    return { enabled: true, nw, nh, r_inv, R, r_out };
  };

  const tl = resolve(rawTl, rawTr.enabled ? Math.floor(w * 0.48) : Math.floor(w - rawTl.R - 20), rawBl.enabled ? Math.floor(h * 0.48) : Math.floor(h - rawTl.R - 15));
  const tr = resolve(rawTr, rawTl.enabled ? Math.floor(w * 0.48) : Math.floor(w - rawTr.R - 20), rawBr.enabled ? Math.floor(h * 0.48) : Math.floor(h - rawTr.R - 15));
  const br = resolve(rawBr, rawBl.enabled ? Math.floor(w * 0.48) : Math.floor(w - rawBr.R - 20), rawTr.enabled ? Math.floor(h * 0.48) : Math.floor(h - rawBr.R - 15));
  const bl = resolve(rawBl, rawBr.enabled ? Math.floor(w * 0.48) : Math.floor(w - rawBl.R - 20), rawTl.enabled ? Math.floor(h * 0.48) : Math.floor(h - rawBl.R - 15));

  const p: string[] = [];

  // Top edge & start
  p.push(tl.enabled ? `M ${tl.nw + tl.r_out} 0` : `M ${tl.R} 0`);

  // Top-Right
  if (tr.enabled) {
    p.push(`L ${w - tr.nw - tr.r_out} 0`);
    p.push(`A ${tr.r_out} ${tr.r_out} 0 0 1 ${w - tr.nw} ${tr.r_out}`);
    p.push(`L ${w - tr.nw} ${tr.nh - tr.r_inv}`);
    p.push(`A ${tr.r_inv} ${tr.r_inv} 0 0 0 ${w - tr.nw + tr.r_inv} ${tr.nh}`);
    p.push(`L ${w - tr.r_out} ${tr.nh}`);
    p.push(`A ${tr.r_out} ${tr.r_out} 0 0 1 ${w} ${tr.nh + tr.r_out}`);
  } else {
    p.push(`L ${w - tr.R} 0`);
    p.push(`A ${tr.R} ${tr.R} 0 0 1 ${w} ${tr.R}`);
  }

  // Bottom-Right
  if (br.enabled) {
    p.push(`L ${w} ${h - br.nh - br.r_out}`);
    p.push(`A ${br.r_out} ${br.r_out} 0 0 1 ${w - br.r_out} ${h - br.nh}`);
    p.push(`L ${w - br.nw + br.r_inv} ${h - br.nh}`);
    p.push(`A ${br.r_inv} ${br.r_inv} 0 0 0 ${w - br.nw} ${h - br.nh + br.r_inv}`);
    p.push(`L ${w - br.nw} ${h - br.r_out}`);
    p.push(`A ${br.r_out} ${br.r_out} 0 0 1 ${w - br.nw - br.r_out} ${h}`);
  } else {
    p.push(`L ${w} ${h - br.R}`);
    p.push(`A ${br.R} ${br.R} 0 0 1 ${w - br.R} ${h}`);
  }

  // Bottom-Left
  if (bl.enabled) {
    p.push(`L ${bl.nw + bl.r_out} ${h}`);
    p.push(`A ${bl.r_out} ${bl.r_out} 0 0 1 ${bl.nw} ${h - bl.r_out}`);
    p.push(`L ${bl.nw} ${h - bl.nh + bl.r_inv}`);
    p.push(`A ${bl.r_inv} ${bl.r_inv} 0 0 0 ${bl.nw - bl.r_inv} ${h - bl.nh}`);
    p.push(`L ${bl.r_out} ${h - bl.nh}`);
    p.push(`A ${bl.r_out} ${bl.r_out} 0 0 1 0 ${h - bl.nh - bl.r_out}`);
  } else {
    p.push(`L ${bl.R} ${h}`);
    p.push(`A ${bl.R} ${bl.R} 0 0 1 0 ${h - bl.R}`);
  }

  // Top-Left finish
  if (tl.enabled) {
    p.push(`L 0 ${tl.nh + tl.r_out}`);
    p.push(`A ${tl.r_out} ${tl.r_out} 0 0 1 ${tl.r_out} ${tl.nh}`);
    p.push(`L ${tl.nw - tl.r_inv} ${tl.nh}`);
    p.push(`A ${tl.r_inv} ${tl.r_inv} 0 0 0 ${tl.nw} ${tl.nh - tl.r_inv}`);
    p.push(`L ${tl.nw} ${tl.r_out}`);
    p.push(`A ${tl.r_out} ${tl.r_out} 0 0 1 ${tl.nw + tl.r_out} 0`);
  } else {
    p.push(`L 0 ${tl.R}`);
    p.push(`A ${tl.R} ${tl.R} 0 0 1 ${tl.R} 0`);
  }

  p.push('Z');
  return p.join(' ');
}

export function generateNotchPath({
  width,
  height,
  cornerRadius = 28,
  invertedRadius = 24,
  notchWidth = 130,
  notchHeight = 50,
  position = 'bottom-right',
}: GenerateNotchPathOptions): string {
  return generateMultiCornerPath(width, height, {
    globalCornerRadius: cornerRadius,
    globalInvertedRadius: invertedRadius,
    topLeft: position === 'top-left' ? { notchWidth, notchHeight } : false,
    topRight: position === 'top-right' ? { notchWidth, notchHeight } : false,
    bottomRight: position === 'bottom-right' ? { notchWidth, notchHeight } : false,
    bottomLeft: position === 'bottom-left' ? { notchWidth, notchHeight } : false,
  });
}
