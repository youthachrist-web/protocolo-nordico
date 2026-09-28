// Eventos Meta no browser.
// O Pixel da Meta é iniciado pelo Pixel da UTMify (index.html), que já envia
// PageView, ViewContent e InitiateCheckout (browser + API de Conversões) e a
// compra pelo webhook da Stripe. Aqui só enviamos o que a UTMify não deteta.

export function trackEvent(name, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", name, params || {});
}
