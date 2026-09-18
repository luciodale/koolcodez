/**
 * Brand mark generator: the thorn brackets </> (three tapered thorns).
 *
 * Two cuts of the same mark:
 * - MARK: the reference drawing, for anything rendered at 48px and up.
 * - MARK_SMALL: heavier slash and brackets so the thorns survive at 16 to 32px
 *   (favicons, navbar, docs footers).
 *
 * Writes the SVG masters to /brand and /public, plus every raster icon.
 * Run: bun scripts/generate-brand.ts
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ACCENT = "#ef4723";
const GROUND = "#0c0a09";
const TEXT = "#ffffff";

export const MARK =
	"M36 16Q25 37 5 50Q25 63 36 84Q30 64 21 50Q30 36 36 16Z" +
	"M64 16Q75 37 95 50Q75 63 64 84Q70 64 79 50Q70 36 64 16Z" +
	"M62 10Q46 46 38 90Q54 54 62 10Z";

export const MARK_SMALL =
	"M36 15Q25 37 4 50Q25 63 36 85Q31 64 24 50Q31 36 36 15Z" +
	"M64 15Q75 37 96 50Q75 63 64 85Q69 64 76 50Q69 36 64 15Z" +
	"M62 10Q43 46 38 90Q57 54 62 10Z";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function markSvg(d: string, fill: string) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${fill}" d="${d}"/></svg>\n`;
}

// Mark placed in a box of `size` px whose top left corner sits at (x, y).
function placed(d: string, x: number, y: number, size: number, fill = ACCENT) {
	return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100"><path fill="${fill}" d="${d}"/></svg>`;
}

// Rounded dark tile, same shape as the previous app icons (22% corner radius).
function appIcon(size: number) {
	const markSize = size * 0.64;
	const offset = (size - markSize) / 2;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${GROUND}"/>${placed(MARK, offset, offset, markSize)}</svg>`;
}

function avatar(size: number) {
	const markSize = size * 0.6;
	const offset = (size - markSize) / 2;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${GROUND}"/>${placed(MARK, offset, offset, markSize)}</svg>`;
}

function smoothstep(a: number, b: number, v: number) {
	const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
	return t * t * (3 - 2 * t);
}

// Copperplate style hatching: horizontal lines that bow away from (cx, cy),
// swell with distance and taper to nothing near the mark and near clearings.
// Each line is a filled ribbon so its weight can change along its length.
function engravedField(w: number, h: number, cx: number, cy: number, clearings: Clearing[]) {
	const lines: string[] = [];
	const gap = 5;
	const step = 3;
	for (let y0 = gap / 2; y0 < h + gap; y0 += gap) {
		const top: string[] = [];
		const bottom: string[] = [];
		for (let x = -step; x <= w + step; x += step) {
			const dx = x - cx;
			const dy = y0 - cy;
			const d = Math.hypot(dx * 0.8, dy);
			const wave = 1.4 * Math.sin(x / 110 + y0 / 37) * smoothstep(200, 420, d);
			const y = y0 + dy * 0.6 * Math.exp(-((d / 190) ** 2)) + wave;
			let tone = smoothstep(190, 420, Math.hypot(dx * 0.8, y - cy)) * (1 - 0.5 * smoothstep(480, 800, Math.abs(dx)));
			for (const c of clearings) {
				tone *= smoothstep(0.9, 1.9, Math.hypot((x - c.cx) / c.rx, (y - c.cy) / c.ry));
			}
			const half = (1.9 * tone) / 2;
			top.push(`${x} ${(y - half).toFixed(2)}`);
			bottom.push(`${x} ${(y + half).toFixed(2)}`);
		}
		lines.push(`M${top.join("L")}L${bottom.reverse().join("L")}Z`);
	}
	return `<path fill="${TEXT}" fill-opacity="0.55" d="${lines.join("")}"/>`;
}

type Clearing = { cx: number; cy: number; rx: number; ry: number };

// Concentric rings shaded like an engraved medallion lit from the top left:
// each ring swells on the lit side and thins to a hairline on the far side.
function engravedRings(cx: number, cy: number, r0: number, r1: number, count: number) {
	const light = (-135 * Math.PI) / 180;
	const rings: string[] = [];
	for (let i = 0; i < count; i++) {
		const r = r0 + ((r1 - r0) * i) / (count - 1);
		const band = Math.sin((Math.PI * (i + 0.5)) / count);
		const outer: string[] = [];
		const inner: string[] = [];
		for (let k = 0; k <= 360; k += 2) {
			const a = (k * Math.PI) / 180;
			const lit = (0.5 + 0.5 * Math.cos(a - light)) ** 1.6;
			const half = (0.15 + 2.1 * lit * band) / 2;
			outer.push(`${(cx + (r + half) * Math.cos(a)).toFixed(2)} ${(cy + (r + half) * Math.sin(a)).toFixed(2)}`);
			inner.push(`${(cx + (r - half) * Math.cos(a)).toFixed(2)} ${(cy + (r - half) * Math.sin(a)).toFixed(2)}`);
		}
		rings.push(`M${outer.join("L")}ZM${inner.reverse().join("L")}Z`);
	}
	return `<path fill="${TEXT}" fill-opacity="0.8" fill-rule="evenodd" d="${rings.join("")}"/>`;
}

function linkedinBanner() {
	const w = 1584;
	const h = 396;
	const cx = w / 2;
	const cy = h / 2 - 6;
	const markSize = 190;
	const url = { right: w - 56, baseline: h - 40, width: 196, size: 28 };
	const urlClearing = { cx: url.right - url.width / 2, cy: url.baseline - url.size / 3, rx: url.width / 2 + 20, ry: url.size };
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="${GROUND}"/>
${engravedField(w, h, cx, cy, [urlClearing])}
${engravedRings(cx, cy, 136, 176, 9)}
${placed(MARK, cx - markSize / 2, cy - markSize / 2, markSize, TEXT)}
<text x="${url.right}" y="${url.baseline}" text-anchor="end" font-family="Work Sans" font-weight="500" font-size="${url.size}" letter-spacing="0.5" fill="${TEXT}">koolcodez.com</text>
</svg>`;
}

// Default social card, same layout as the project cards in /public/og-*.png.
function ogDefault() {
	const w = 1200;
	const h = 630;
	const markSize = 280;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs><linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DD5635"/><stop offset="1" stop-color="#F07A50"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="#000000"/>
<rect width="8" height="${h}" fill="url(#bar)"/>
${placed(MARK, 270 - markSize / 2, h / 2 - markSize / 2, markSize)}
<g font-family="Work Sans" fill="${TEXT}">
	<text x="500" y="260" font-size="72" font-weight="700" letter-spacing="-1.5">Kool Codez</text>
	<text x="500" y="315" font-size="30" font-weight="400" fill="#DD5635">Frontend engineering</text>
	<text x="500" y="400" font-size="26" font-weight="300" fill="#cccccc">React libraries and TypeScript UI components</text>
	<text x="500" y="440" font-size="26" font-weight="300" fill="#cccccc">crafted for speed, polish, and maintainability.</text>
	<text x="500" y="555" font-size="22" font-weight="400" fill="#999999">koolcodez.com</text>
</g>
</svg>`;
}

async function png(svg: string, out: string) {
	await sharp(Buffer.from(svg)).png().toFile(join(ROOT, out));
}

// ICO container holding a single 32x32 PNG.
async function ico(out: string) {
	const image = await sharp(Buffer.from(markSvg(MARK_SMALL, ACCENT))).resize(32, 32).png().toBuffer();
	const header = Buffer.alloc(22);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(1, 4);
	header.writeUInt8(32, 6);
	header.writeUInt8(32, 7);
	header.writeUInt8(0, 8);
	header.writeUInt8(0, 9);
	header.writeUInt16LE(1, 10);
	header.writeUInt16LE(32, 12);
	header.writeUInt32LE(image.length, 14);
	header.writeUInt32LE(22, 18);
	await writeFile(join(ROOT, out), Buffer.concat([header, image]));
}

await writeFile(join(ROOT, "brand/koolcodez-mark.svg"), markSvg(MARK, ACCENT));
await writeFile(join(ROOT, "brand/koolcodez-mark-small.svg"), markSvg(MARK_SMALL, ACCENT));
await writeFile(join(ROOT, "public/favicon.svg"), markSvg(MARK_SMALL, ACCENT));
await ico("public/favicon.ico");
await png(appIcon(180), "public/apple-touch-icon.png");
await png(appIcon(192), "public/icon-192.png");
await png(appIcon(512), "public/icon-512.png");
await png(appIcon(512), "public/logo.png");
await png(avatar(512), "brand/github-avatar.png");
await png(linkedinBanner(), "brand/linkedin-banner.png");
await png(ogDefault(), "public/og-default.png");
