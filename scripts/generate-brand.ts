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
const OXBLOOD = "#42170c";
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
function placed(d: string, x: number, y: number, size: number) {
	return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100"><path fill="${ACCENT}" d="${d}"/></svg>`;
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

// Deterministic PRNG so the banner renders identically on every run.
function mulberry32(seed: number) {
	let a = seed;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// A burst of long tapered thorns radiating from (cx, cy), echoing the mark.
function thornBurst(cx: number, cy: number, count: number, seed: number) {
	const rand = mulberry32(seed);
	const blades: string[] = [];
	for (let i = 0; i < count; i++) {
		const angle = (i / count) * 360 + (rand() - 0.5) * (240 / count);
		const r0 = 130 + rand() * 40;
		const r1 = r0 + 260 + rand() * 820;
		const peak = r0 + (r1 - r0) * (0.18 + rand() * 0.14);
		const half = 1.2 + rand() * 3.4;
		const opacity = (0.12 + rand() * 0.3).toFixed(3);
		blades.push(
			`<path transform="translate(${cx} ${cy}) rotate(${angle.toFixed(2)})" fill-opacity="${opacity}" d="M${r0} 0Q${peak.toFixed(1)} ${half.toFixed(2)} ${r1.toFixed(1)} 0Q${peak.toFixed(1)} ${(-half).toFixed(2)} ${r0} 0Z"/>`,
		);
	}
	return blades.join("");
}

function linkedinBanner() {
	const w = 1584;
	const h = 396;
	const cx = w / 2;
	const cy = h / 2 - 8;
	const markSize = 190;
	const x = cx - markSize / 2;
	const y = cy - markSize / 2;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs>
	<radialGradient id="glow" cx="${cx}" cy="${cy}" r="420" gradientUnits="userSpaceOnUse" gradientTransform="translate(${cx} ${cy}) scale(2 1) translate(${-cx} ${-cy})">
		<stop offset="0" stop-color="${OXBLOOD}" stop-opacity="1"/>
		<stop offset="0.45" stop-color="${OXBLOOD}" stop-opacity="0.45"/>
		<stop offset="1" stop-color="${OXBLOOD}" stop-opacity="0"/>
	</radialGradient>
	<radialGradient id="fade" cx="${cx}" cy="${cy}" r="760" gradientUnits="userSpaceOnUse">
		<stop offset="0" stop-color="#fff" stop-opacity="1"/>
		<stop offset="0.55" stop-color="#fff" stop-opacity="0.55"/>
		<stop offset="1" stop-color="#fff" stop-opacity="0"/>
	</radialGradient>
	<mask id="rays" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="url(#fade)"/></mask>
	<filter id="halo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="${GROUND}"/>
<rect width="${w}" height="${h}" fill="url(#glow)"/>
<g mask="url(#rays)" fill="${ACCENT}">${thornBurst(cx, cy, 72, 7)}</g>
<g filter="url(#halo)" opacity="0.55">${placed(MARK, x, y, markSize)}</g>
${placed(MARK, x, y, markSize)}
<text x="${w - 56}" y="${h - 40}" text-anchor="end" font-family="Work Sans" font-weight="500" font-size="28" fill="${ACCENT}">koolcodez.com</text>
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
