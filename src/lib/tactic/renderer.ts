import { parse as parseYaml } from 'yaml';
import { ZONES } from './zones.js';

// ── types ──────────────────────────────────────────────────────────────────

interface PlayerDef {
  id?: string;
  pos: string;
  label: string | number;
  name?: string;
  shape?: string;
}

export interface TacticConfig {
  title?: string;
  pitch?: 'full' | 'half';
  theme?: 'default' | 'dark';
  note?: string;
  home?: PlayerDef[];
  away?: PlayerDef[];
}

// ── themes ─────────────────────────────────────────────────────────────────

interface Theme {
  pitchFill: string;
  lineColor: string;
  homeFill: string;
  homeStroke: string;
  homeText: string;
  awayFill: string;
  awayStroke: string;
  awayText: string;
  annoText: string;
  annoBg: string;
}

const THEMES: Record<string, Theme> = {
  default: {
    pitchFill:  '#3a8a3a',
    lineColor:  'rgba(255,255,255,0.85)',
    homeFill:   '#ce3524',
    homeStroke: '#fff',
    homeText:   '#fff',
    awayFill:   '#1a3a6b',
    awayStroke: '#fff',
    awayText:   '#fff',
    annoText:   '#fff',
    annoBg:     '#0b1b3f',
  },
  dark: {
    pitchFill:  '#162616',
    lineColor:  'rgba(255,255,255,0.65)',
    homeFill:   '#ce3524',
    homeStroke: '#fff',
    homeText:   '#fff',
    awayFill:   '#2563eb',
    awayStroke: '#fff',
    awayText:   '#fff',
    annoText:   '#fff',
    annoBg:     '#111',
  },
};

// ── pitch geometry (SVG space: 800 × 518, proportional to FIFA 105m × 68m) ─

const PITCH_W = 800;
const PITCH_H = 518;
const GOAL_D  = 20;
const GOAL_Y1 = 231;
const GOAL_Y2 = 287;
const PA_X    = 126;
const PA_Y1   = 106;
const PA_Y2   = 413;
const GA_X    = 42;
const GA_Y1   = 190;
const GA_Y2   = 329;
const PSX_L   = 84;
const PSX_R   = 716;
const CY      = 259;
const CR      = 70;

const VIEWBOX: Record<string, string> = {
  full: `-${GOAL_D} 0 ${PITCH_W + GOAL_D * 2} ${PITCH_H}`,
  half: `378 0 442 ${PITCH_H}`,
};

const SVG_SIZE: Record<string, [number, number]> = {
  full: [840, 518],
  half: [442, 518],
};

// ── helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── SVG renderers ──────────────────────────────────────────────────────────

const PLAYER_R = 17;
const STROKE_W = 2.5;

function renderPitch(t: Theme): string {
  const lc = t.lineColor;
  const lw = 2;
  return `
  <rect x="${-GOAL_D}" y="0" width="${PITCH_W + GOAL_D * 2}" height="${PITCH_H}" fill="${t.pitchFill}"/>
  <rect x="0" y="0" width="${PITCH_W}" height="${PITCH_H}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <line x1="400" y1="0" x2="400" y2="${PITCH_H}" stroke="${lc}" stroke-width="${lw}"/>
  <circle cx="400" cy="${CY}" r="${CR}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <circle cx="400" cy="${CY}" r="3" fill="${lc}"/>
  <rect x="0" y="${PA_Y1}" width="${PA_X}" height="${PA_Y2 - PA_Y1}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <rect x="${PITCH_W - PA_X}" y="${PA_Y1}" width="${PA_X}" height="${PA_Y2 - PA_Y1}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <rect x="0" y="${GA_Y1}" width="${GA_X}" height="${GA_Y2 - GA_Y1}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <rect x="${PITCH_W - GA_X}" y="${GA_Y1}" width="${GA_X}" height="${GA_Y2 - GA_Y1}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <circle cx="${PSX_L}" cy="${CY}" r="3" fill="${lc}"/>
  <circle cx="${PSX_R}" cy="${CY}" r="3" fill="${lc}"/>
  <path d="M ${PA_X} ${CY + 56} A ${CR} ${CR} 0 0 0 ${PA_X} ${CY - 56}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <path d="M ${PITCH_W - PA_X} ${CY - 56} A ${CR} ${CR} 0 0 0 ${PITCH_W - PA_X} ${CY + 56}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <rect x="${-GOAL_D}" y="${GOAL_Y1}" width="${GOAL_D}" height="${GOAL_Y2 - GOAL_Y1}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <rect x="${PITCH_W}" y="${GOAL_Y1}" width="${GOAL_D}" height="${GOAL_Y2 - GOAL_Y1}" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <path d="M 8 0 A 8 8 0 0 1 0 8" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <path d="M 792 0 A 8 8 0 0 0 800 8" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <path d="M 0 510 A 8 8 0 0 1 8 518" fill="none" stroke="${lc}" stroke-width="${lw}"/>
  <path d="M 800 510 A 8 8 0 0 0 792 518" fill="none" stroke="${lc}" stroke-width="${lw}"/>`;
}

function renderPlayer(p: PlayerDef, team: 'home' | 'away', t: Theme): string {
  const pos = ZONES[p.pos];
  if (!pos) return '';
  const [cx, cy] = pos;
  const fill   = team === 'home' ? t.homeFill   : t.awayFill;
  const stroke = team === 'home' ? t.homeStroke : t.awayStroke;
  const text   = team === 'home' ? t.homeText   : t.awayText;
  const isGK   = p.shape === 'square' || p.pos === 'gk' || p.pos === 'opp-gk';

  const shape = isGK
    ? `<rect x="${cx - PLAYER_R}" y="${cy - PLAYER_R}" width="${PLAYER_R * 2}" height="${PLAYER_R * 2}"
           fill="${fill}" stroke="${stroke}" stroke-width="${STROKE_W}" rx="3"/>`
    : `<circle cx="${cx}" cy="${cy}" r="${PLAYER_R}"
           fill="${fill}" stroke="${stroke}" stroke-width="${STROKE_W}"/>`;

  const nameTag = p.name
    ? (() => {
        const ny = cy + PLAYER_R + 16;
        const nw = Math.max(44, p.name.length * 7.5 + 14);
        return `<rect x="${cx - nw / 2}" y="${ny - 9}" width="${nw}" height="18" rx="4" fill="${t.annoBg}"/>
  <text x="${cx}" y="${ny}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${t.annoText}" font-weight="700">${esc(p.name)}</text>`;
      })()
    : '';

  return `${shape}
  <text x="${cx}" y="${cy + 4}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" font-weight="800" fill="${text}">${esc(String(p.label))}</text>
  ${nameTag}`;
}

// ── public API ─────────────────────────────────────────────────────────────

export function renderTactic(yamlSource: string): string {
  let config: TacticConfig;
  try {
    config = (parseYaml(yamlSource) as TacticConfig) ?? {};
  } catch (e) {
    return `<div class="tactic-error">tactic parse error: ${esc(String(e))}</div>`;
  }

  const pitch = config.pitch ?? 'full';
  const t     = THEMES[config.theme ?? 'default'] ?? THEMES.default;
  const home  = config.home ?? [];
  const away  = config.away ?? [];

  const [svgW, svgH] = SVG_SIZE[pitch] ?? SVG_SIZE.full;
  const vb = VIEWBOX[pitch] ?? VIEWBOX.full;

  const playersSVG = [
    ...home.map(p => renderPlayer(p, 'home', t)),
    ...away.map(p => renderPlayer(p, 'away', t)),
  ].join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg"
     width="${svgW}" height="${svgH}" viewBox="${vb}"
     role="img"${config.title ? ` aria-label="${esc(config.title)}"` : ''}
     style="font-family:'Trebuchet MS',system-ui,sans-serif">
  ${config.title ? `<title>${esc(config.title)}</title>` : ''}
  ${renderPitch(t)}
  ${playersSVG}
</svg>`;
}
