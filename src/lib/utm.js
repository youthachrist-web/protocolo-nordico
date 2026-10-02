// Rastreio de UTMs para a UTMify.
// Guarda as UTMs com que o visitante chegou (último clique vence) e junta-as
// aos links de pagamento da Stripe, que aceitam utm_* nos Payment Links.
// A UTMify recebe a venda pelo webhook da Stripe.

const KEY_UTMS = "pn_utms";
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function store() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// Chamado em cada mudança de página: se o URL trouxer UTMs, guarda-as
export function captureUtms() {
  if (typeof window === "undefined") return;
  const url = new URLSearchParams(window.location.search);
  const found = {};
  for (const p of UTM_PARAMS) {
    const v = url.get(p);
    if (v) found[p] = v.slice(0, 200);
  }
  if (Object.keys(found).length) store()?.setItem(KEY_UTMS, JSON.stringify(found));
}

function storedUtms() {
  // Inclui as UTMs do URL atual (o link pode ser gerado antes de captureUtms correr)
  captureUtms();
  try {
    return JSON.parse(store()?.getItem(KEY_UTMS) || "{}");
  } catch {
    return {};
  }
}

// Link da Stripe com as UTMs do visitante
export function withTracking(url) {
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(storedUtms())) {
      if (UTM_PARAMS.includes(k) && v) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return url;
  }
}

// UTMs do visitante (para guardar com o contacto do quiz)
export function getUtms() {
  return storedUtms();
}
