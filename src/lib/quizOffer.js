// Oferta do diagnóstico: quem acabou o quiz tem 15 minutos para comprar e
// recebe o guia Controlo Total grátis. O prazo é real: conta a partir do
// momento em que deixou o email (guardado no navegador e no servidor) e o
// servidor só entrega o guia se o checkout for aberto dentro desse prazo.

import { STRIPE_CHECKOUT_URL } from "@/lib/quizData";
import { withTracking } from "@/lib/utm";

export const QUIZ_OFFER_MINUTES = 15;
const STORAGE_KEY = "pn_quiz_state";

export function getQuizOffer() {
  try {
    const state = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (!state?.leadAt || !state?.lead?.email) return null;
    return { email: state.lead.email, deadline: state.leadAt + QUIZ_OFFER_MINUTES * 60 * 1000 };
  } catch {
    return null;
  }
}

// Link de compra com o email do quiz já preenchido na Stripe, para o servidor
// reconhecer a oferta.
export function checkoutUrl(offer) {
  const href = withTracking(STRIPE_CHECKOUT_URL);
  if (!offer || offer.deadline <= Date.now()) return href;
  try {
    const u = new URL(href);
    u.searchParams.set("prefilled_email", offer.email);
    return u.toString();
  } catch {
    return href;
  }
}
