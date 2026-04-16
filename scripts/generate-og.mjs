import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

async function renderLogoPng(logoPath, size) {
  const buf = await readFile(logoPath);
  const isSvg = String(logoPath).endsWith('.svg');
  const pipeline = sharp(buf, isSvg ? { density: 300 } : undefined).resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  return pipeline.png().toBuffer();
}

function fitTitleFontSize(title, maxWidth = 680, maxFontSize = 72) {
  const avgCharFactor = 0.52;
  const estWidth = title.length * maxFontSize * avgCharFactor;
  if (estWidth <= maxWidth) return maxFontSize;
  return Math.floor(maxWidth / (title.length * avgCharFactor));
}

async function buildOg({ title, tagline, subtitle, logoPath, logoSize, outPath }) {
  const logoPng = await renderLogoPng(logoPath, logoSize);
  const titleFontSize = fitTitleFontSize(title);
  const titleY = 260 + (72 - titleFontSize) / 2;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#DD5635"/>
      <stop offset="1" stop-color="#F07A50"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#000000"/>
  <rect x="0" y="0" width="8" height="${HEIGHT}" fill="url(#accent)"/>
  <g font-family="Work Sans, -apple-system, Segoe UI, Helvetica, Arial, sans-serif" fill="#ffffff">
    <text x="500" y="${titleY}" font-size="${titleFontSize}" font-weight="700" letter-spacing="-1.5">${escapeXml(title)}</text>
    <text x="500" y="315" font-size="30" font-weight="400" fill="#DD5635">${escapeXml(tagline)}</text>
    ${subtitle
      .split('\n')
      .map((line, i) => `<text x="500" y="${400 + i * 40}" font-size="26" font-weight="300" fill="#cccccc">${escapeXml(line)}</text>`)
      .join('\n    ')}
    <text x="500" y="555" font-size="22" font-weight="400" fill="#999999">koolcodez.com</text>
  </g>
</svg>`;

  const out = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      {
        input: logoPng,
        top: Math.round((HEIGHT - logoSize) / 2),
        left: Math.round((420 - logoSize) / 2) + 60,
      },
    ])
    .png()
    .toBuffer();

  await writeFile(outPath, out);
  console.log(`Wrote ${outPath} (${out.length} bytes)`);
}

const publicDir = new URL('../public/', import.meta.url);

await buildOg({
  title: 'Kool Codez',
  tagline: 'Frontend engineering',
  subtitle: 'React libraries and TypeScript UI components\ncrafted for speed, polish, and maintainability.',
  logoPath: new URL('icon-512.png', publicDir),
  logoSize: 340,
  outPath: new URL('og-default.png', publicDir),
});

const projects = [
  {
    slug: 'react-socket',
    title: 'react-socket',
    tagline: 'Real time React WebSocket hooks',
    subtitle: 'Type safe, auto reconnecting, optimistic\nupdates and offline queuing out of the box.',
    logo: 'react-socket-logo.svg',
    logoSize: 300,
  },
  {
    slug: 'react-searchable-dropdown',
    title: 'react-searchable-dropdown',
    tagline: 'Virtualized React combobox',
    subtitle: 'Single and multi select, async search,\ncustom rendering, zero dependencies.',
    logo: 'react-searchable-dropdown-logo.svg',
    logoSize: 300,
  },
  {
    slug: 'swipe-bar',
    title: 'swipe-bar',
    tagline: 'Gesture driven React sidebar',
    subtitle: 'Spring physics, touch and mouse,\nnative feel for mobile first web apps.',
    logo: 'swipe-bar-logo.svg',
    logoSize: 300,
  },
  {
    slug: 'fork',
    title: 'fork',
    tagline: 'Headless ClojureScript forms',
    subtitle: 'Declarative validation, dirty tracking,\nsubmission for Re-frame and Reagent.',
    logo: 'fork-logo.svg',
    logoSize: 300,
  },
];

for (const project of projects) {
  await buildOg({
    title: project.title,
    tagline: project.tagline,
    subtitle: project.subtitle,
    logoPath: new URL(project.logo, publicDir),
    logoSize: project.logoSize,
    outPath: new URL(`og-${project.slug}.png`, publicDir),
  });
}
