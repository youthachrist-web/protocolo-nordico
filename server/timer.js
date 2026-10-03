// Temporizador para emails: GIF animado com a contagem decrescente até `ate`
// (segundos Unix). Cada pedido gera 60 fotogramas (um por segundo) a partir de
// agora, por isso ao abrir o email a pessoa vê o tempo real que falta.
// GET /api/timer.gif?ate=1790000000

import gifenc from "gifenc";

const { GIFEncoder } = gifenc;

const W = 300;
const H = 76;
const BG = 0;
const GOLD = 1;
const DIM = 2;
const PALETTE = [
  [27, 27, 22], // fundo escuro do site
  [203, 166, 85], // dourado
  [58, 56, 46], // segmentos apagados
];

// Segmentos: a topo, b dir-cima, c dir-baixo, d base, e esq-baixo, f esq-cima, g meio
const DIGITS = ["abcdef", "bc", "abged", "abgcd", "fgbc", "afgcd", "afgedc", "abc", "abcdefg", "abcdfg"];
const DW = 28;
const DH = 54;
const T = 6;

function rect(px, x, y, w, h, c) {
  for (let j = y; j < y + h; j++) {
    const row = j * W;
    for (let i = x; i < x + w; i++) px[row + i] = c;
  }
}

function digit(px, x, y, n) {
  const on = DIGITS[n];
  const half = Math.floor(DH / 2);
  const seg = {
    a: [x + T, y, DW - 2 * T, T],
    d: [x + T, y + DH - T, DW - 2 * T, T],
    g: [x + T, y + half - T / 2, DW - 2 * T, T],
    f: [x, y + T, T, half - T - 1],
    b: [x + DW - T, y + T, T, half - T - 1],
    e: [x, y + half + 1, T, half - T - 1],
    c: [x + DW - T, y + half + 1, T, half - T - 1],
  };
  for (const [k, r] of Object.entries(seg)) rect(px, ...r, on.includes(k) ? GOLD : DIM);
}

function frame(seconds) {
  const px = new Uint8Array(W * H).fill(BG);
  const s = Math.max(0, seconds);
  const parts = [Math.min(99, Math.floor(s / 3600)), Math.floor((s % 3600) / 60), s % 60];
  const groupW = DW * 2 + 8;
  const colonW = 22;
  const total = groupW * 3 + colonW * 2;
  let x = Math.floor((W - total) / 2);
  const y = Math.floor((H - DH) / 2);
  parts.forEach((v, idx) => {
    digit(px, x, y, Math.floor(v / 10));
    digit(px, x + DW + 8, y, v % 10);
    x += groupW;
    if (idx < 2) {
      rect(px, x + 8, y + 14, 6, 6, GOLD);
      rect(px, x + 8, y + DH - 20, 6, 6, GOLD);
      x += colonW;
    }
  });
  return px;
}

export function timerGif(searchParams, now = Date.now()) {
  const ate = Number(searchParams.get("ate")) || 0;
  const left = Math.floor(ate - now / 1000);
  const gif = GIFEncoder();
  const frames = left > 0 ? Math.min(60, left + 1) : 1;
  for (let i = 0; i < frames; i++) {
    gif.writeFrame(frame(left - i), W, H, { palette: PALETTE, delay: 1000, repeat: -1 });
  }
  gif.finish();
  return Buffer.from(gif.bytes());
}
