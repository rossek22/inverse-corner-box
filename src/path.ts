export type CornerPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface GenerateNotchPathOptions {
    /** Total width of the container */
    width: number;
    /** Total height of the container */
    height: number;
    /** Outer corner radius for normal corners (default: 28) */
    cornerRadius?: number;
    /** Radius of the concave/inverted curve (default: 24) */
    invertedRadius?: number;
    /** Outer fillet transition radius at notch edges (default: equals invertedRadius) */
    outerFilletRadius?: number;
    /** Width of the notch cutout (default: 145) */
    notchWidth?: number;
    /** Height of the notch cutout (default: 56) */
    notchHeight?: number;
    /** Corner position where the notch is located (default: "bottom-right") */
    position?: CornerPosition;
}

/**
 * Generates a mathematical SVG path with smooth inverse (concave) corners and fillets.
 */
export function generateNotchPath({
    width: w,
    height: h,
    cornerRadius = 28,
    invertedRadius = 24,
    outerFilletRadius,
    notchWidth = 145,
    notchHeight = 56,
    position = "bottom-right",
}: GenerateNotchPathOptions): string {
    if (w <= 0 || h <= 0) return "";

    // Safety clamping to prevent path deformation when size is smaller than radii
    const nw = Math.min(notchWidth, w);
    const nh = Math.min(notchHeight, h);
    const maxRadius = Math.min(w / 2, h / 2);
    const R = Math.max(0, Math.min(cornerRadius, maxRadius));
    const r_inv = Math.max(0, Math.min(invertedRadius, nw / 2, nh / 2));
    const r_out = Math.max(
        0,
        Math.min(outerFilletRadius !== undefined ? outerFilletRadius : r_inv, nw / 2, nh / 2),
    );

    if (position === "bottom-right") {
        return [
            `M ${R} 0`,
            `L ${Math.max(R, w - R)} 0`,
            `A ${R} ${R} 0 0 1 ${w} ${R}`,
            `L ${w} ${Math.max(R, h - nh - r_out)}`,
            `A ${r_out} ${r_out} 0 0 1 ${w - r_out} ${h - nh}`,
            `L ${w - nw + r_inv} ${h - nh}`,
            `A ${r_inv} ${r_inv} 0 0 0 ${w - nw} ${h - nh + r_inv}`,
            `L ${w - nw} ${h - r_out}`,
            `A ${r_out} ${r_out} 0 0 1 ${w - nw - r_out} ${h}`,
            `L ${R} ${h}`,
            `A ${R} ${R} 0 0 1 0 ${h - R}`,
            `L 0 ${R}`,
            `A ${R} ${R} 0 0 1 ${R} 0`,
            "Z",
        ].join(" ");
    }

    if (position === "bottom-left") {
        return [
            `M ${R} 0`,
            `L ${Math.max(R, w - R)} 0`,
            `A ${R} ${R} 0 0 1 ${w} ${R}`,
            `L ${w} ${h - R}`,
            `A ${R} ${R} 0 0 1 ${w - R} ${h}`,
            `L ${nw + r_out} ${h}`,
            `A ${r_out} ${r_out} 0 0 1 ${nw} ${h - r_out}`,
            `L ${nw} ${h - nh + r_inv}`,
            `A ${r_inv} ${r_inv} 0 0 0 ${nw - r_inv} ${h - nh}`,
            `L ${r_out} ${h - nh}`,
            `A ${r_out} ${r_out} 0 0 1 0 ${h - nh - r_out}`,
            `L 0 ${R}`,
            `A ${R} ${R} 0 0 1 ${R} 0`,
            "Z",
        ].join(" ");
    }

    if (position === "top-right") {
        return [
            `M ${R} 0`,
            `L ${w - nw - r_out} 0`,
            `A ${r_out} ${r_out} 0 0 1 ${w - nw} ${r_out}`,
            `L ${w - nw} ${nh - r_inv}`,
            `A ${r_inv} ${r_inv} 0 0 0 ${w - nw + r_inv} ${nh}`,
            `L ${w - r_out} ${nh}`,
            `A ${r_out} ${r_out} 0 0 1 ${w} ${nh + r_out}`,
            `L ${w} ${h - R}`,
            `A ${R} ${R} 0 0 1 ${w - R} ${h}`,
            `L ${R} ${h}`,
            `A ${R} ${R} 0 0 1 0 ${h - R}`,
            `L 0 ${R}`,
            `A ${R} ${R} 0 0 1 ${R} 0`,
            "Z",
        ].join(" ");
    }

    // top-left
    return [
        `M ${nw + r_out} 0`,
        `L ${Math.max(R, w - R)} 0`,
        `A ${R} ${R} 0 0 1 ${w} ${R}`,
        `L ${w} ${h - R}`,
        `A ${R} ${R} 0 0 1 ${w - R} ${h}`,
        `L ${R} ${h}`,
        `A ${R} ${R} 0 0 1 0 ${h - R}`,
        `L 0 ${nh + r_out}`,
        `A ${r_out} ${r_out} 0 0 1 ${r_out} ${nh}`,
        `L ${nw - r_inv} ${nh}`,
        `A ${r_inv} ${r_inv} 0 0 0 ${nw} ${nh - r_inv}`,
        `L ${nw} ${r_out}`,
        `A ${r_out} ${r_out} 0 0 1 ${nw + r_out} 0`,
        "Z",
    ].join(" ");
}
