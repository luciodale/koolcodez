/** Throwaway: render cursor / return-arrow logo candidates to /tmp. */
import sharp from "sharp";

const ORANGE = "#ef4723";
const CHARCOAL = "#161618";
const CREAM = "#f4ece0";

// 64x64 grid, bold-ish uniform stroke, round caps, very few lines. Concept:
// terminal cursor / return arrow, blended with k+c where possible.

type Cand = { name: string; note: string; icon: string };

function stroke(color: string, sw: number): string {
	return `fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
}
function block(x: number, y: number, w: number, h: number, fill: string): string {
	return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${fill}"/>`;
}
function cArc(cx: number, cy: number, r: number, gapDeg: number): string {
	const half = (gapDeg / 2) * (Math.PI / 180);
	const sx = cx + r * Math.cos(half);
	const sy = cy - r * Math.sin(half);
	const ex = cx + r * Math.cos(half);
	const ey = cy + r * Math.sin(half);
	return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 1 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

// P1 return arrow (enter key glyph): shaft down + corner + left arrowhead.
function returnArrow(sw: number): string {
	return `<path d="M46 16 V36 H24" ${stroke(ORANGE, sw)}/><path d="M31 28 L23 36 L31 44" ${stroke(ORANGE, sw)}/>`;
}

// P2 terminal prompt: chevron + block cursor (the classic >_ ).
function promptCursor(sw: number): string {
	return `<path d="M20 20 L33 32 L20 44" ${stroke(ORANGE, sw)}/>${block(40, 25, 8, 14, CREAM)}`;
}

// P3 open c with a block cursor in its mouth (cursor sitting inside the code).
function cCursor(sw: number): string {
	return `<path d="${cArc(30, 32, 15, 118)}" ${stroke(ORANGE, sw)}/>${block(38, 25, 8, 14, CREAM)}`;
}

// P4 return arrow whose corner is a soft curve, hook reading as a c; cream tip.
function returnC(sw: number): string {
	return `<path d="M44 16 V30 C 44 38, 38 40, 30 40 H24" ${stroke(ORANGE, sw)}/><path d="M31 33 L23 40 L31 47" ${stroke(ORANGE, sw)}/>`;
}

// P5 caret cursor + c: insertion caret over an open c.
function caretC(sw: number): string {
	return `<path d="${cArc(32, 36, 14, 120)}" ${stroke(ORANGE, sw)}/><path d="M25 20 L32 13 L39 20" ${stroke(ORANGE, sw)}/>${block(30, 11, 4, 4, CREAM)}`;
}

// P6 k built from a chevron + stem, with a block cursor as the c-substitute.
function kCursor(sw: number): string {
	return `<g ${stroke(ORANGE, sw)}><line x1="18" y1="14" x2="18" y2="50"/><line x1="18" y1="33" x2="32" y2="20"/><line x1="18" y1="33" x2="33" y2="50"/></g>${block(40, 26, 9, 14, CREAM)}`;
}

const candidates: Cand[] = [
	{ name: "P1-return-arrow", note: "enter / return arrow, minimal", icon: returnArrow(5) },
	{ name: "P2-prompt-cursor", note: "terminal prompt >_ chevron + cursor", icon: promptCursor(5) },
	{ name: "P3-c-cursor", note: "open c with block cursor in the mouth", icon: cCursor(5) },
	{ name: "P4-return-c", note: "return arrow whose hook reads as a c", icon: returnC(5) },
	{ name: "P5-caret-c", note: "insertion caret over an open c", icon: caretC(5) },
	{ name: "P6-k-cursor", note: "k + block cursor standing in for c", icon: kCursor(5) },
];

const CARD = 520;

async function main() {
	for (const cand of candidates) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD}" height="${CARD}" viewBox="0 0 ${CARD} ${CARD}">
			<rect width="${CARD}" height="${CARD}" fill="${CHARCOAL}"/>
			<g transform="translate(140 95) scale(4.0)">${cand.icon}</g>
			<g transform="translate(440 22)">
				<rect x="-8" y="-8" width="78" height="78" rx="16" fill="#0d0d0e"/>
				<g transform="scale(0.95)">${cand.icon}</g>
			</g>
			<text x="${CARD / 2}" y="470" fill="${CREAM}" font-family="Work Sans, sans-serif" font-size="42" font-weight="500" letter-spacing="-1" text-anchor="middle">koolcodez</text>
		</svg>`;
		const out = `/tmp/kc-${cand.name}.webp`;
		await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(out);
		console.log(out, "—", cand.note);
	}
}

main();
