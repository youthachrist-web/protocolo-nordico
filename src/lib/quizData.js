// Dados oficiais do quiz do Protocolo Nórdico — 7 etapas
// Cada pergunta apresenta versão PT e IT, com gatilho e etapa de consciência.

export const quizQuestions = [
  {
    id: 1,
    stage: "Inconsciente do problema",
    trigger: "Ambição",
    pt: "Qual é a sua idade?",
    it: "Qual è la tua età?",
    options: ["28–34", "35–44", "45–54", "55+"],
    key: "idade"
  },
  {
    id: 2,
    stage: "Consciente do problema",
    trigger: "Medo",
    pt: "Sente um cansaço que nem o café resolve?",
    it: "Senti una stanchezza che nemmeno il caffè risolve?",
    options: ["Sempre", "Às vezes", "Raramente", "Nunca"],
    key: "cansaco"
  },
  {
    id: 3,
    stage: "Consciente do problema",
    trigger: "Medo",
    pt: "Tem dificuldade em perder a barriga, mesmo a treinar?",
    it: "Fai fatica a perdere la pancia, anche allenandoti?",
    options: ["Sim, muita", "Um pouco", "Não treino", "Não é um problema"],
    key: "barriga"
  },
  {
    id: 4,
    stage: "Consciente do problema",
    trigger: "Medo",
    pt: "Como está a qualidade do seu sono?",
    it: "Come è la qualità del tuo sonno?",
    options: ["Durmo bem", "Durmo, mas não descanso", "Insónia frequente", "Muito irregular"],
    key: "sono"
  },
  {
    id: 5,
    stage: "Implicação",
    trigger: "Medo",
    pt: "Isto já afeta a sua motivação, o seu humor ou a sua vida íntima?",
    it: "Questo influisce già sulla tua motivazione, sul tuo umore o sulla tua vita intima?",
    options: ["Muito", "Um pouco", "Ainda não, mas preocupa-me", "Não"],
    key: "impacto"
  },
  {
    id: 6,
    stage: "Implicação",
    trigger: "Medo",
    pt: "Na intimidade, o que mais gostaria de melhorar?",
    it: "Nell'intimità, cosa vorresti migliorare di più?",
    options: ["Ereções mais firmes", "Durar mais (controlo da ejaculação)", "Ter mais vontade", "Tudo isso"],
    key: "intimidade"
  },
  {
    id: 7,
    stage: "Consciente da solução",
    trigger: "Ambição",
    pt: "Já tentou resolver isto antes com dieta, suplementos ou treino?",
    it: "Hai già provato a risolvere questo problema con dieta, integratori o allenamento?",
    options: ["Sim, sem resultado", "Sim, mas o resultado foi temporário", "Não, é a primeira vez"],
    key: "tentativas"
  }
];

// Imagens de transformação (antes/depois) — prova social
export const transformationImages = [
  {
    url: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/d135cbb5b_IMG_4630.jpeg",
    name: "Mário",
    age: 52,
    city: "Lisboa, PT",
    quote: "Em 6 semanas perdi a barriga que carregava há anos. A energia voltou como aos 30."
  },
  {
    url: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/5aedacd76_IMG_4628.jpeg",
    name: "André",
    age: 47,
    city: "Porto, PT",
    quote: "O protocolo do sono mudou tudo. Acordo descansado e o foco no trabalho melhorou."
  },
  {
    url: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/34673eb42_IMG_4629.jpeg",
    name: "Ricardo",
    age: 55,
    city: "São Paulo, BR",
    quote: "Aos 55 voltei a ter definição. Disciplina simples, resultados reais."
  },
  {
    url: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/a7a0cf005_IMG_4627.jpeg",
    name: "Bruno",
    age: 49,
    city: "Roma, IT",
    quote: "Depois de tentar de tudo, foi o primeiro método que respeitou o meu ritmo."
  },
  {
    url: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/6ec19aa77_IMG_4626.jpeg",
    name: "Tiago",
    age: 58,
    city: "Milano, IT",
    quote: "Recuperei confiança e disposição. A minha família notou a diferença."
  }
];

// Imagens lifestyle / aspiracionais
export const lifestyleImages = {
  hero: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/ee1e1a2ce_IMG_4618.jpeg",
  beach: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/95e50b92a_IMG_4620.jpeg",
  balcony: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/83b21e4c6_IMG_4619.jpeg",
  gym: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/92d3eb08b_IMG_4625.jpeg",
  meals: "https://media.base44.com/images/public/user_6a8ef58c9d0ccce86ce9d613/725aaf3d9_IMG_4604.jpeg"
};

// Imagens de frutas (geradas) — secção de alimentação
export const fruitImages = {
  berries: "https://media.base44.com/images/public/6a8ef63ffa9445f0d95ba3c3/e3c3ff20d_generated_image.png",
  citrus: "https://media.base44.com/images/public/6a8ef63ffa9445f0d95ba3c3/ca9bbb3d7_generated_image.png"
};

export const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/28E9ASdFtaBX0W381Y9IQ02";
export const PRODUCT_PRICE = "€9,98";
// Preço anterior real (praticado antes desta oferta) — usado como âncora
export const PRODUCT_OLD_PRICE = "€16,49";

// Valores numéricos para o Meta Pixel (eventos InitiateCheckout / Purchase)
export const pixelProducts = {
  protocolo: { name: "Protocolo Nórdico", value: 9.98 },
  ebook: { name: "Controlo Total", value: 6.59 },
};

// Áreas analisadas no resultado personalizado
export const profileAreas = [
  { key: "energia", label: "Energia", icon: "Zap" },
  { key: "sono", label: "Sono", icon: "Moon" },
  { key: "motivacao", label: "Motivação", icon: "Flame" },
  { key: "treino", label: "Treino", icon: "Dumbbell" },
  { key: "habitos", label: "Hábitos", icon: "Leaf" },
  { key: "objetivos", label: "Objetivos", icon: "Target" }
];

// Gera análise personalizada (educativa, não médica) a partir das respostas
export function buildProfile(answers) {
  const get = (key) => answers[key];

  // Pontuações simples de 0-100 por área, baseadas nas respostas
  const energia = scoreFrom(get("cansaco"), ["Nunca", "Raramente", "Às vezes", "Sempre"]);
  const sono = scoreFrom(get("sono"), ["Durmo bem", "Durmo, mas não descanso", "Muito irregular", "Insónia frequente"]);
  const motivacao = scoreFrom(get("impacto"), ["Não", "Ainda não, mas preocupa-me", "Um pouco", "Muito"]);
  const treino = scoreFrom(get("barriga"), ["Não é um problema", "Não treino", "Um pouco", "Sim, muita"]);
  const habitos = Math.round((energia + sono) / 2);
  const objetivos = scoreFrom(get("tentativas"), ["Não, é a primeira vez", "Sim, mas o resultado foi temporário", "Sim, sem resultado"]);

  return {
    energia,
    sono,
    motivacao,
    treino,
    habitos,
    objetivos,
    idade: get("idade"),
    objetivoPrincipal: get("objetivo")
  };
}

function scoreFrom(value, order) {
  if (!value) return 50;
  const idx = order.indexOf(value);
  if (idx === -1) return 50;
  return Math.round((idx / (order.length - 1)) * 100);
}

// Microcopies do ecrã de processamento
export const processingSteps = [
  "A analisar as suas respostas…",
  "A identificar os hábitos que mais podem estar a afetar a sua energia…",
  "A preparar o seu perfil personalizado…"
];

// Oferta — promessas e garantias
export const offerPromises = [
  "Garantia de 30 dias: se não sentir diferença, devolvemos o seu dinheiro",
  "Ataca as causas — circulação, pavimento pélvico, sono e testosterona — não os sintomas",
  "Sem comprimidos, sem consultas embaraçosas: tudo no seu telemóvel, em privado",
  "Acesso imediato — começa hoje à noite",
];

// O que está incluído no protocolo
export const whatsIncluded = [
  "Protocolo completo de 28 a 40 dias",
  "Plano de treino adaptado ao seu nível",
  "Guia de alimentação e suplementação",
  "Protocolo de sono e recuperação",
  "Rotina matinal de energia",
  "Guia de exposição à luz solar",
  "Acompanhamento por WhatsApp",
  "Acesso vitalício e atualizações gratuitas",
];

// Pop-ups de prova — factos de estudos publicados (as compras reais vêm da Stripe)
export const proofFacts = [
  { title: "82,5% ganharam controlo", text: "da ejaculação em 12 semanas de treino pélvico", source: "Pastore et al., 2014" },
  { title: "40% recuperaram a ereção", text: "normal só com exercícios do pavimento pélvico", source: "Dorey et al., 2004" },
  { title: "−15% de testosterona", text: "numa semana a dormir 5 horas por noite", source: "JAMA, 2011" },
  { title: "Garantia de 30 dias", text: "se não sentir diferença, devolvemos o seu dinheiro", source: "Protocolo Nórdico" },
];

// Factos para a página de tráfego pago (sem temas sexuais)
export const proofFactsVitalidade = [
  { title: "−15% de testosterona", text: "numa semana a dormir 5 horas por noite", source: "JAMA, 2011" },
  { title: "Garantia de 30 dias", text: "se não sentir diferença, devolvemos o seu dinheiro", source: "Protocolo Nórdico" },
];

// Upsell — ebook de desempenho sexual
export const upsellProduct = {
  title: "Controlo Total — Ejaculação Precoce & Desempenho Sexual",
  description:
    "Ebook educativo com protocolos práticos para ganhar controlo, durar mais e melhorar a confiança e o desempenho íntimo.",
  bullets: [
    "Técnicas de controlo para durar mais",
    "Exercícios de fortalecimento do pavimento pélvico",
    "Hábitos que melhoram a circulação e a libido",
    "Protocolo de 21 dias passo a passo",
    "Acesso digital imediato",
  ],
  price: "€6,59",
  oldPrice: "€9,97",
};

export const STRIPE_UPSELL_URL = "https://buy.stripe.com/dRm28q9pdcK5bAH4PM9IQ03";
// Desempenho sexual — pilares mostrados na página inicial
export const sexualPillars = [
  {
    key: "ereccao",
    title: "Ereções mais firmes",
    why: "A ereção é um fenómeno de circulação: sangue a entrar e a ficar retido. Sedentarismo, barriga, álcool e noites mal dormidas atacam precisamente isso.",
    works: [
      "Treino cardiovascular que melhora o fluxo sanguíneo",
      "Fortalecimento do pavimento pélvico (retém o sangue na ereção)",
      "Alimentação que protege os vasos sanguíneos",
      "Redução da gordura abdominal",
    ],
  },
  {
    key: "controlo",
    title: "Controlo da ejaculação",
    why: "Terminar cedo demais não é falta de \"força de vontade\". É um reflexo que se treina — com músculos, respiração e técnica.",
    works: [
      "Exercícios de pavimento pélvico para controlar o reflexo",
      "Técnicas de pausa e respiração durante a relação",
      "Gestão da ansiedade de desempenho",
      "Rotina progressiva, passo a passo",
    ],
  },
  {
    key: "desejo",
    title: "Mais vontade e energia",
    why: "O desejo cai quando o corpo está em modo sobrevivência: pouco sono, stress alto e zero energia ao fim do dia.",
    works: [
      "Protocolo de sono para proteger a testosterona",
      "Treino de força que aumenta energia e confiança",
      "Luz solar e rotina matinal",
      "Hábitos que baixam o stress crónico",
    ],
  },
];

// Estudos publicados que sustentam os pilares (fontes reais — não alterar sem verificar)
export const scienceEvidence = [
  {
    finding: "40% dos homens recuperaram a ereção normal só com exercícios do pavimento pélvico",
    detail: "Ensaio clínico com homens com disfunção erétil: ao fim de 6 meses de exercícios pélvicos, 40% recuperaram a função erétil normal e outros 35,5% melhoraram.",
    source: "Dorey G. et al., British Journal of General Practice, 2004",
  },
  {
    finding: "82,5% ganharam controlo sobre a ejaculação em 12 semanas",
    detail: "Homens com ejaculação precoce ao longo da vida fizeram 12 semanas de treino do pavimento pélvico: 33 em 40 passaram a controlar o reflexo ejaculatório.",
    source: "Pastore A.L. et al., Therapeutic Advances in Urology, 2014",
  },
  {
    finding: "Exercício aeróbico regular reduz a disfunção erétil",
    detail: "Revisão sistemática: cerca de 40 minutos de exercício aeróbico moderado a intenso, 4 vezes por semana, durante 6 meses, melhora a função erétil.",
    source: "Gerbild H. et al., Sexual Medicine, 2018",
  },
  {
    finding: "Uma semana a dormir 5 horas baixa a testosterona 10–15%",
    detail: "Em homens jovens e saudáveis, uma única semana de sono restrito reduziu a testosterona diurna para níveis equivalentes a 10–15 anos de envelhecimento.",
    source: "Leproult R. & Van Cauter E., JAMA, 2011",
  },
];

// Relatos de clientes sobre desempenho sexual.
// Adicione APENAS relatos reais, com autorização do cliente. Exemplo:
// { name: "João", age: 44, city: "Lisboa, PT", quote: "..." }
// Enquanto a lista estiver vazia, a secção de relatos não aparece no site.
export const sexualTestimonials = [];

// ===== Blocos da oferta (página inicial e página de tráfego pago) =====

// Como funciona — 3 passos
export const howItWorks = [
  { step: "1", title: "Faça o teste de 2 minutos", text: "7 perguntas rápidas e anónimas para perceber o que mais pesa na sua energia." },
  { step: "2", title: "Descarregue o protocolo", text: "Logo após o pagamento, descarrega o PDF — lê no telemóvel, em privado." },
  { step: "3", title: "Siga o plano dia a dia", text: "28 dias de treino, sono, alimentação e rotina, com ajustes ao seu nível atual." },
];

// Bónus incluídos no acesso (fazem parte da oferta atual)
export const bonuses = [
  { title: "Acompanhamento por WhatsApp", text: "Tire dúvidas sobre o plano durante o protocolo." },
  { title: "Acesso vitalício + atualizações", text: "Paga uma vez e recebe todas as versões novas do protocolo." },
];

// Garantia explicada
export const guaranteeText =
  "Siga o protocolo durante 30 dias. Se não sentir diferença na sua energia e disposição, envie-nos um email e devolvemos 100% do valor. Sem perguntas e sem burocracia.";

// Perguntas frequentes
export const faqs = [
  { q: "É discreto?", a: "Sim. O protocolo é um PDF que descarrega e lê no telemóvel, em privado. Não há envios físicos, nem consultas, nem comprimidos." },
  { q: "Funciona se já tenho 50 ou 55 anos?", a: "Sim. O plano adapta-se ao seu nível atual: começa com movimentos simples e progride ao seu ritmo. Se tiver alguma condição de saúde, fale com o seu médico antes de começar." },
  { q: "Preciso de ginásio?", a: "Não. Os treinos podem ser feitos em casa, com o peso do corpo. Se tiver acesso a um ginásio, o protocolo mostra como tirar partido dele." },
  { q: "Como recebo o protocolo?", a: "Logo após o pagamento abre-se a página de download do PDF. O recibo segue para o email que usou na compra. É imediato." },
  { q: "E se não resultar comigo?", a: "Tem 30 dias de garantia. Se não sentir diferença, devolvemos o dinheiro." },
];
