/**
 * Blog hero generator — minimal line-and-node style, echoing the project
 * logos in /public (thin uniform stroke, round caps, abstract arcs funneling
 * into small filled nodes, lots of negative space). Thin orange linework on a
 * dark charcoal field, with a single cream focal node per image.
 *
 * Run: bun scripts/generate-heroes.ts
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const W = 1200;
const H = 630;

const INK = "#ef4723"; // brand orange
const FOCAL = "#f4ece0"; // warm cream — the one node the eye lands on
const BG_CENTER = "#1d1d20";
const BG_EDGE = "#141416";

const SW = 6; // stroke width — thin, like the 3/64 logos scaled up
const R_NODE = 9; // ordinary node
const R_FOCAL = 15; // focal node

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "src", "assets");

function node(cx: number, cy: number, r = R_NODE, fill = INK): string {
	return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

const STROKE = `fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"`;

// ---- Per-article motifs ---------------------------------------------------

// fixing an AI-built codebase: a tangled loop on the left untangling into one
// clean line that lands on a single resolved node.
const fixing = `
	<path d="M440 315 C 470 315, 502 252, 542 282 C 582 312, 544 366, 504 346 C 478 333, 486 315, 522 315 L 800 315" ${STROKE}/>
	${node(440, 315)}
	${node(470, 250)}
	${node(800, 315, R_FOCAL, FOCAL)}`;

// from spaghetti to simplicity: three wavy lines converging to one straight
// line and a single clean node.
const spaghetti = `
	<path d="M380 268 C 448 244, 520 296, 644 315" ${STROKE}/>
	<path d="M380 315 C 462 304, 548 322, 644 315" ${STROKE}/>
	<path d="M380 362 C 448 386, 532 338, 644 315" ${STROKE}/>
	<path d="M644 315 L 836 315" ${STROKE}/>
	${node(380, 268)}
	${node(380, 315)}
	${node(380, 362)}
	${node(836, 315, R_FOCAL, FOCAL)}`;

// PWA reaching toward native: a browser pane bridged by an arc to a phone.
const pwa = `
	<rect x="372" y="232" width="168" height="166" rx="20" ${STROKE}/>
	<line x1="372" y1="272" x2="540" y2="272" ${STROKE}/>
	<rect x="700" y="206" width="128" height="218" rx="24" ${STROKE}/>
	<line x1="700" y1="246" x2="828" y2="246" ${STROKE}/>
	<path d="M540 312 C 600 268, 640 268, 700 312" ${STROKE}/>
	${node(392, 252, 5)}
	${node(412, 252, 5)}
	${node(620, 280)}
	${node(764, 400, R_FOCAL, FOCAL)}`;

// inside the frame: a viewport with a render sweep arc and a focal pulse.
const frame = `
	<rect x="438" y="205" width="324" height="220" rx="16" ${STROKE}/>
	<path d="M600 245 A 70 70 0 1 1 538 280" ${STROKE}/>
	${node(538, 280)}
	${node(600, 315, R_FOCAL, FOCAL)}`;

// trading grid: a rising data line through nodes over a faint baseline.
const trading = `
	<line x1="392" y1="438" x2="864" y2="438" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" opacity="0.22"/>
	<path d="M408 398 C 470 372, 488 372, 528 360 C 588 342, 600 392, 648 372 C 704 348, 720 286, 772 268 C 808 256, 832 250, 856 244" ${STROKE}/>
	${node(408, 398)}
	${node(528, 360)}
	${node(648, 372)}
	${node(772, 268)}
	${node(856, 244, R_FOCAL, FOCAL)}`;

// useful CSS: two facing brackets cradling three style tokens.
const css = `
	<path d="M486 238 C 446 238, 456 298, 426 315 C 456 332, 446 392, 486 392" ${STROKE}/>
	<path d="M714 238 C 754 238, 744 298, 774 315 C 744 332, 754 392, 714 392" ${STROKE}/>
	${node(556, 315)}
	${node(600, 315, R_FOCAL, FOCAL)}
	${node(644, 315)}`;

// frameworks: a minimal triangulated truss — structure holding things up.
const frameworks = (() => {
	const apex = [
		[524, 248],
		[676, 248],
	];
	const base = [
		[452, 400],
		[600, 400],
		[748, 400],
	];
	const edges: [number[], number[]][] = [
		[base[0], base[2]],
		[apex[0], apex[1]],
		[base[0], apex[0]],
		[apex[0], base[1]],
		[base[1], apex[1]],
		[apex[1], base[2]],
		[apex[0], base[0]],
		[apex[1], base[2]],
		[apex[0], apex[1]],
	];
	const lines = edges
		.map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${STROKE}/>`)
		.join("");
	const nodes = [...base.map((p) => node(p[0], p[1])), node(apex[0][0], apex[0][1]), node(apex[1][0], apex[1][1], R_FOCAL, FOCAL)].join("");
	return lines + nodes;
})();

// websockets: a scaled echo of the react-socket logo — two orbital arcs giving
// bidirectional flow around a central connection node.
const websockets = `
	<path d="M420 315 C 420 207, 510 135, 600 135 C 690 135, 744 189, 744 243" ${STROKE}/>
	<path d="M780 315 C 780 423, 690 495, 600 495 C 510 495, 456 441, 456 387" ${STROKE}/>
	${node(744, 243)}
	${node(456, 387)}
	${node(600, 315, R_FOCAL, FOCAL)}`;

// ---- File map -------------------------------------------------------------

const posters: { file: string; motif: string }[] = [
	{ file: "hero-fixing-an-ai-built-codebase.webp", motif: fixing },
	{ file: "hero-from-spaghetti-to-simplicity.webp", motif: spaghetti },
	{ file: "hero-pwa.webp", motif: pwa },
	{ file: "hero-inside-frame.webp", motif: frame },
	{ file: "hero-blog.webp", motif: trading },
	{ file: "hero-css.webp", motif: css },
	{ file: "hero-frameworks.webp", motif: frameworks },
	{ file: "hero-web-websockets.webp", motif: websockets },
];

function svgDoc(motif: string): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
		<defs>
			<radialGradient id="bg" cx="50%" cy="48%" r="70%">
				<stop offset="0%" stop-color="${BG_CENTER}"/>
				<stop offset="100%" stop-color="${BG_EDGE}"/>
			</radialGradient>
		</defs>
		<rect width="${W}" height="${H}" fill="url(#bg)"/>
		${motif}
	</svg>`;
}

async function main() {
	for (const { file, motif } of posters) {
		const svg = svgDoc(motif);
		await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(join(OUT_DIR, file));
		console.log(`wrote ${file}`);
	}
}

main();
