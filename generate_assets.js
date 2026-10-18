#!/usr/bin/env node
/*
 * Burgundy GitHub-profile asset generator (Node.js, no dependencies).
 *
 * 1. Edit the CONFIG block below with YOUR real details.
 * 2. In the repo root run:  node generate_assets.js
 * 3. It (re)writes every SVG into ./assets/ - commit them with README.md.
 *
 * Only use facts you can verify. Do not add a phone number.
 */
const fs = require("fs");
const path = require("path");

// --------------------------------------------------------------------------
// CONFIG - replace every placeholder
// --------------------------------------------------------------------------
const CONFIG = {
  name: "Naveen Negi",
  roleLine: "FULL STACK DEVELOPER  |  MERN  |  NEXT.JS",
  tagline: "Building ideas into useful products.",

  about:
    "Computer Science and Engineering student at Shivalik College of Engineering, Dehradun, " +
    "building fast, scalable web applications with React, Next.js, Node.js and MongoDB. " +
    "I specialize in crafting seamless UIs and robust REST APIs.",

  tiles: [
    ["GFG 160", "Completed the GeeksforGeeks 160 Days of Code challenge"],
    ["INTERN", "Full Stack Developer at ZeTheta Algorithms, 2026"],
    ["3", "Full-stack projects on GitHub"],
    ["B.Tech CSE", "Shivalik College of Engineering, Dehradun"],
  ],

  projects: [
    {
      name: "ShrinkIt",
      desc: "Full-stack URL shortener with user authentication, custom short links, QR code generation and a personalized dashboard with link history.",
      metrics: ["JWT authentication", "QR codes", "Link dashboard"],
      tech: ["Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    },
    {
      name: "PassOp",
      desc: "Password manager for saving and managing credentials through a responsive React interface, with password hashing for credential security.",
      metrics: ["Password hashing", "Responsive UI"],
      tech: ["React.js", "JavaScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    },
    {
      name: "BaaS Platform",
      desc: "Backend-as-a-Service project inspired by Firebase and Supabase, with user authentication, projects, API keys, collections and documents.",
      metrics: ["API key management", "REST APIs tested with Postman"],
      tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Mongoose", "Postman"],
    },
  ],

  toolkit: {
    Languages: ["JavaScript", "Java", "C", "C++"],
    Frontend: ["HTML", "CSS", "React.js", "Next.js", "Tailwind CSS"],
    Backend: ["Node.js", "Express.js"],
    Database: ["MongoDB"],
    Tools: ["Git", "GitHub", "VS Code", "Postman", "Docker"],
  },

  certs: [
    "Full Stack Developer Internship - ZeTheta Algorithms",
    "GeeksforGeeks - 160 Days of Code Challenge",
  ],

  titles: {
    about: ["01  ABOUT", "Hello, I'm Naveen Negi."],
    recognition: ["02  RECOGNITION", "Proof, on the record."],
    work: ["03  SELECTED WORK", "Products, not assignments."],
    toolkit: ["04  TOOLKIT", "The tools I reach for."],
    commits: ["05  COMMIT LOG", "A year of building."],
    certifications: ["06  CERTIFICATIONS", "Credentials, verified."],
    connect: ["07  CONNECT", "Let's build something worth explaining."],
  },

  signature: "Turning coffee into clean code and complex algorithms into seamless user experiences.",
};

// --------------------------------------------------------------------------
// Palette + helpers
// --------------------------------------------------------------------------
const C = {
  midnight: "#10070C",
  wineDark: "#190B12",
  burgundy: "#451126",
  wine: "#701A3D",
  rose: "#C77B9B",
  pale: "#E5B5C7",
  ivory: "#F8F0F3",
  muted: "#B6A3AC",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Arial, Helvetica, sans-serif";
const OUT = "assets";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Greedy word wrap, like Python's textwrap.wrap
function wrap(s, width) {
  const lines = [];
  let cur = "";
  for (const w of String(s).split(/\s+/).filter(Boolean)) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= width) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function text(x, y, s, o = {}) {
  const {
    size = 20,
    fill = C.ivory,
    family = SANS,
    weight = "400",
    anchor = "start",
    spacing = 0,
    style = "normal",
  } = o;
  return (
    `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" ` +
    `font-weight="${weight}" font-style="${style}" fill="${fill}" ` +
    `text-anchor="${anchor}" letter-spacing="${spacing}">${esc(s)}</text>`
  );
}

function doc(w, h, uid, label, body, extraDefs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<defs>
<linearGradient id="${uid}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${C.midnight}"/><stop offset="60%" stop-color="${C.wineDark}"/><stop offset="100%" stop-color="${C.burgundy}"/></linearGradient>
<linearGradient id="${uid}-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.wine}" stop-opacity="0"/><stop offset="50%" stop-color="${C.rose}"/><stop offset="100%" stop-color="${C.wine}" stop-opacity="0"/></linearGradient>
<pattern id="${uid}-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${C.pale}" stroke-opacity="0.06"/></pattern>
<filter id="${uid}-blur" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="6"/></filter>
${extraDefs}
</defs>
<rect width="${w}" height="${h}" rx="18" fill="url(#${uid}-bg)"/>
<rect width="${w}" height="${h}" rx="18" fill="url(#${uid}-grid)"/>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="18" fill="none" stroke="${C.rose}" stroke-opacity="0.25"/>
${body}
</svg>
`;
}

function glowLine(uid, x, y, w) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="url(#${uid}-line)" filter="url(#${uid}-blur)"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="url(#${uid}-line)">` +
    `<animate attributeName="opacity" values="0.55;1;0.55" dur="4s" repeatCount="indefinite"/></rect>`
  );
}

// Returns [svgString, bottomY]
function chips(items, x0, y0, maxX, size = 15, accent = false) {
  const out = [];
  const h = 34;
  let x = x0;
  let y = y0;
  for (const it of items) {
    const w = Math.floor(it.length * size * 0.58) + 30;
    if (x + w > maxX) {
      x = x0;
      y += h + 10;
    }
    const fill = accent ? C.rose : C.wine;
    const op = accent ? "0.22" : "0.40";
    out.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="17" fill="${fill}" fill-opacity="${op}" stroke="${C.rose}" stroke-opacity="0.55"/>`
    );
    out.push(text(x + w / 2, y + 22, it, { size, anchor: "middle" }));
    x += w + 10;
  }
  return [out.join("\n"), y + h];
}

function write(name, content) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), content, "utf8");
  console.log("wrote", path.join(OUT, name));
}

// --------------------------------------------------------------------------
// Assets
// --------------------------------------------------------------------------
function hero(cfg) {
  const uid = "hero";
  const extra =
    `<radialGradient id="${uid}-light" cx="0.8" cy="0.25" r="0.65">` +
    `<stop offset="0%" stop-color="${C.wine}" stop-opacity="0.7">` +
    `<animate attributeName="stop-opacity" values="0.45;0.8;0.45" dur="7s" repeatCount="indefinite"/></stop>` +
    `<stop offset="100%" stop-color="${C.wine}" stop-opacity="0"/></radialGradient>`;
  const body = `
<rect width="1200" height="440" rx="18" fill="url(#${uid}-light)"/>
<g fill="none" stroke="${C.rose}" stroke-opacity="0.35">
<circle cx="980" cy="220" r="120"/>
<ellipse cx="980" cy="220" rx="170" ry="62" transform="rotate(-20 980 220)"/>
<circle cx="980" cy="220" r="60" stroke-opacity="0.2"/>
</g>
<circle r="5" fill="${C.pale}"><animateMotion dur="9s" repeatCount="indefinite" path="M980,100 a120,120 0 1,1 -0.1,0"/></circle>
<path d="M40 380 C 260 320, 400 410, 580 350 S 900 300, 1160 360" fill="none" stroke="${C.rose}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="0" opacity="0.8">
<animate attributeName="stroke-dashoffset" values="1400;0;0" keyTimes="0;0.6;1" dur="6s" repeatCount="indefinite"/></path>
${text(70, 190, cfg.name, { size: 68, family: SERIF, weight: "700", spacing: 1 })}
${text(72, 240, cfg.roleLine, { size: 21, fill: C.pale, spacing: 3 })}
${text(72, 292, cfg.tagline, { size: 24, fill: C.rose, family: SERIF, style: "italic" })}
${glowLine(uid, 72, 258, 460)}
`;
  write("hero.svg", doc(1200, 440, uid, `${cfg.name} - ${cfg.roleLine}`, body, extra));
}

function title(key, label, heading) {
  const uid = `t-${key}`;
  const body =
    text(60, 46, label, { size: 15, fill: C.rose, weight: "700", spacing: 6 }) +
    text(60, 92, heading, { size: 40, family: SERIF, weight: "700" }) +
    glowLine(uid, 60, 106, 360);
  write(`title-${key}.svg`, doc(1200, 130, uid, `${label} - ${heading}`, body));
}

function about(cfg) {
  const lines = wrap(cfg.about, 92);
  const h = 70 + lines.length * 36;
  const body = lines.map((ln, i) => text(60, 62 + i * 36, ln, { size: 22 })).join("");
  write("about-intro.svg", doc(1200, h, "about", cfg.about, body));
}

function tiles(cfg) {
  const parts = [];
  const labels = [];
  cfg.tiles.forEach(([val, lab], i) => {
    const x = 30 + i * 290;
    parts.push(
      `<rect x="${x}" y="30" width="270" height="170" rx="14" fill="${C.wine}" fill-opacity="0.25" stroke="${C.rose}" stroke-opacity="0.4"/>`
    );
    const vsize = val.length <= 10 ? 34 : 22;
    parts.push(text(x + 135, 104, val, { size: vsize, family: SERIF, weight: "700", anchor: "middle" }));
    wrap(lab, 26)
      .slice(0, 3)
      .forEach((ln, j) => {
        parts.push(text(x + 135, 140 + j * 22, ln, { size: 15, fill: C.pale, anchor: "middle" }));
      });
    labels.push(`${val}: ${lab}`);
  });
  write("recognition.svg", doc(1200, 230, "tiles", labels.join("; "), parts.join("\n")));
}

function project(i, p) {
  const uid = `proj${i}`;
  const desc = wrap(p.desc, 88);
  let y = 62;
  const body = [text(60, y, p.name, { size: 34, family: SERIF, weight: "700" })];
  y += 22;
  for (const ln of desc) {
    y += 30;
    body.push(text(60, y, ln, { size: 19, fill: C.muted }));
  }
  y += 28;
  if (p.metrics.length) {
    const [svg, bottom] = chips(p.metrics, 60, y, 1140, 15, true);
    body.push(svg);
    y = bottom + 22;
  }
  const [svg, bottom] = chips(p.tech, 60, y, 1140, 15);
  body.push(svg);
  const h = bottom + 34;
  body.push(`<rect x="60" y="0" width="200" height="3" fill="url(#${uid}-line)"/>`);
  const label = `${p.name}: ${p.desc} ` + [...p.metrics, ...p.tech].join(", ");
  write(`project-${i}.svg`, doc(1200, h, uid, label, body.join("\n")));
}

function toolkit(cfg) {
  let y = 36;
  const body = [];
  const label = [];
  for (const [cat, items] of Object.entries(cfg.toolkit)) {
    const [svg, bottom] = chips(items, 300, y, 1140, 15);
    body.push(text(60, y + 23, cat.toUpperCase(), { size: 14, fill: C.rose, weight: "700", spacing: 3 }));
    body.push(svg);
    y = bottom + 24;
    body.push(`<rect x="60" y="${y - 12}" width="1080" height="1" fill="${C.rose}" fill-opacity="0.18"/>`);
    label.push(`${cat}: ${items.join(", ")}`);
  }
  write("toolkit.svg", doc(1200, y + 6, "toolkit", "Tech stack. " + label.join(". "), body.join("\n")));
}

function certs(cfg) {
  const items = cfg.certs;
  const half = Math.ceil(items.length / 2);
  const cols = [items.slice(0, half), items.slice(half)];
  const body = [];
  cols.forEach((col, c) => {
    const x = 60 + c * 560;
    col.forEach((it, r) => {
      const y = 60 + r * 42;
      body.push(`<path d="M${x} ${y - 6} l6 6 l-6 6 l-6 -6 z" fill="${C.rose}"/>`);
      body.push(text(x + 22, y + 2, it, { size: 19 }));
    });
  });
  const h = 60 + half * 42 + 10;
  write("certifications.svg", doc(1200, h, "certs", "Certifications: " + items.join("; "), body.join("\n")));
}

function footer(cfg) {
  const uid = "foot";
  const body =
    glowLine(uid, 300, 36, 600) +
    text(600, 90, cfg.signature, { size: cfg.signature.length > 60 ? 21 : 26, fill: C.pale, family: SERIF, anchor: "middle", style: "italic" }) +
    text(600, 122, cfg.name, { size: 14, fill: C.rose, weight: "700", anchor: "middle", spacing: 6 });
  write("footer-signature.svg", doc(1200, 150, uid, cfg.signature, body));
}

// --------------------------------------------------------------------------
hero(CONFIG);
for (const [k, [label, heading]] of Object.entries(CONFIG.titles)) title(k, label, heading);
about(CONFIG);
tiles(CONFIG);
CONFIG.projects.forEach((p, i) => project(i + 1, p));
toolkit(CONFIG);
certs(CONFIG);
footer(CONFIG);
console.log("Done. Now commit README.md + assets/ and push.");
