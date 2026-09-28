// Meta Pixel (Facebook) — carregado só quando existe um ID configurado.
// O ID do Pixel é público; pode vir da variável de ambiente VITE_META_PIXEL_ID
// (Vercel → Settings → Environment Variables) ou ser colado diretamente aqui.
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "29239458548980024";

let initialized = false;

export function initMetaPixel() {
  if (initialized || !META_PIXEL_ID || typeof window === "undefined") return;
  initialized = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", META_PIXEL_ID);
}

export function trackEvent(name, params, options) {
  initMetaPixel();
  if (!initialized || typeof window.fbq !== "function") return;
  window.fbq("track", name, params || {}, options || {});
}

export function trackCustomEvent(name, params, options) {
  initMetaPixel();
  if (!initialized || typeof window.fbq !== "function") return;
  window.fbq("trackCustom", name, params || {}, options || {});
}

export const trackPageView = () => trackEvent("PageView");

// Produto → parâmetros padrão do Meta (value/currency/content_name)
export function productParams(product) {
  return {
    value: product.value,
    currency: "EUR",
    content_name: product.name,
    content_type: "product",
  };
}
