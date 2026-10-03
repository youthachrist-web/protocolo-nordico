// Consentimento de cookies de medição (Pixel da UTMify / Meta).
// Sem escolha ou com recusa, o Pixel não é carregado. As compras continuam a
// chegar à Meta pelo webhook da Stripe → UTMify (lado do servidor).

const KEY = "pn_cookie_consent"; // "granted" | "denied"
const PIXEL_ID = "6aba39a9d59244adf0415fd2";
export const CONSENT_EVENT = "pn-consent-change";
let memory = null; // se o navegador bloquear o armazenamento

export function getConsent() {
  try {
    return window.localStorage.getItem(KEY) || memory;
  } catch {
    return memory;
  }
}

function loadPixel() {
  if (window.__pnPixelLoaded) return;
  window.__pnPixelLoaded = true;
  window.pixelId = PIXEL_ID;
  const s = document.createElement("script");
  s.src = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";
  s.async = true;
  document.head.appendChild(s);
}

export function setConsent(value) {
  memory = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // sem armazenamento: a escolha vale só para esta visita
  }
  if (value === "granted") loadPixel();
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Reabre o aviso (link "Preferências de cookies" no rodapé)
export function resetConsent() {
  memory = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignorar
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Ao abrir o site: carrega o Pixel se já houver consentimento
export function initConsent() {
  if (getConsent() === "granted") loadPixel();
}
