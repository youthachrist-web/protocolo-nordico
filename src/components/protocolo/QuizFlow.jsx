import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { quizQuestions, processingSteps } from "@/lib/quizData";
import { base44 } from "@/api/base44Client";
import { trackEvent } from "@/lib/metaPixel";

const STORAGE_KEY = "pn_quiz_state";

export default function QuizFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState("quiz"); // 'quiz' | 'capture' | 'processing'
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState(1);

  // Lead capture
  const [lead, setLead] = useState({ nome: "", email: "", ddi: "+351", telefone: "", cidade: "", desafio: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Processing
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const question = quizQuestions[qIndex];
  const total = quizQuestions.length;
  const progress = step === "quiz" ? ((qIndex) / total) * 100 : 100;

  // Persist answers temporarily
  useEffect(() => {
    if (step === "quiz") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, qIndex }));
    }
  }, [answers, qIndex, step]);

  function handleSelect(option) {
    setSelected(option);
    setDirection(1);
    setTimeout(() => {
      const newAnswers = { ...answers, [question.key]: option };
      setAnswers(newAnswers);
      setSelected(null);

      if (qIndex < total - 1) {
        setQIndex(qIndex + 1);
      } else {
        // Última pergunta → captura
        setStep("capture");
      }
    }, 280);
  }

  function goBack() {
    if (qIndex > 0) {
      setDirection(-1);
      setQIndex(qIndex - 1);
      const prevKey = quizQuestions[qIndex - 1].key;
      setSelected(answers[prevKey] || null);
    }
  }

  function validateLead() {
    const e = {};
    if (!lead.nome.trim()) e.nome = "Indique o seu nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) e.email = "E-mail inválido";
    const digits = lead.telefone.replace(/\D/g, "");
    const minDigits = lead.ddi === "+55" ? 10 : 8;
    if (digits.length < minDigits) e.telefone = "Telefone inválido";
    if (!lead.cidade.trim()) e.cidade = "Indique a sua cidade";
    if (!lead.desafio) e.desafio = "Selecione o seu desafio";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submitLead() {
    if (!validateLead()) return;
    setSubmitting(true);
    // Guarda lead + respostas para a página de resultado
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, lead })
    );
    // Guarda no Supabase + envia email de notificação (não bloqueia o fluxo)
    base44.functions.invoke("saveLead", {
      nome: lead.nome,
      email: lead.email,
      ddi: lead.ddi,
      telefone: lead.telefone,
      cidade: lead.cidade,
      desafio: lead.desafio,
      answers
    }).catch(() => {});
    trackEvent("Lead", { content_name: "Quiz Protocolo Nórdico" });
    setTimeout(() => {
      setSubmitting(false);
      setStep("processing");
    }, 400);
  }

  // Tela de processamento
  useEffect(() => {
    if (step !== "processing") return;
    const timer = setTimeout(
      () => navigateRef.current("/resultado", { state: { answers, lead } }),
      processingSteps.length * 1200 + 800
    );
    return () => clearTimeout(timer);
  }, [step]);

  // ===== PROCESSING =====
  if (step === "processing") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-pn-dark px-6 text-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 rounded-full bg-pn-gold/30 pn-pulse-ring" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-pn-gold/40 bg-pn-dark">
            <Loader2 className="h-8 w-8 animate-spin text-pn-gold" />
          </div>
        </div>
        <div className="pn-eyebrow mb-3">A preparar o seu resultado</div>
        <div className="space-y-3">
          {processingSteps.map((s, i) => (
            <div
              key={i}
              className="pn-fade-up flex items-center justify-center gap-2 text-sm text-pn-light/80"
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              <Check className="h-4 w-4 text-pn-gold" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== LEAD CAPTURE =====
  if (step === "capture") {
    return (
      <div className="min-h-[100dvh] bg-pn-light px-5 py-12 sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <div className="pn-eyebrow mb-3">Quase lá</div>
            <h1 className="pn-serif text-2xl leading-snug text-pn-ink md:text-3xl">
              Falta apenas um passo para preparar o seu resultado personalizado.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-pn-ink/60">
              Informe os seus dados para liberarmos a análise do seu perfil.
              Também podemos enviar o seu resultado para o seu contacto, caso
              precise consultá-lo mais tarde.
            </p>
          </div>

          <div className="space-y-5">
            <Field label="Nome" error={errors.nome}>
              <input
                type="text"
                value={lead.nome}
                onChange={(e) => setLead({ ...lead, nome: e.target.value })}
                placeholder="O seu primeiro nome"
                className="pn-input"
                autoComplete="given-name"
              />
            </Field>

            <Field label="E-mail" error={errors.email}>
              <input
                type="email"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                placeholder="o.seu@email.com"
                className="pn-input"
                autoComplete="email"
              />
            </Field>

            <Field label="WhatsApp / Telefone" error={errors.telefone}>
              <div className="flex items-stretch gap-2">
                <select
                  value={lead.ddi}
                  onChange={(e) => {
                    const newDdi = e.target.value;
                    setLead({ ...lead, ddi: newDdi, telefone: maskPhone(lead.telefone, newDdi) });
                  }}
                  className="pn-input pn-ddi"
                >
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+39">🇮🇹 +39</option>
                </select>
                <input
                  type="tel"
                  value={lead.telefone}
                  onChange={(e) => setLead({ ...lead, telefone: maskPhone(e.target.value, lead.ddi) })}
                  placeholder={lead.ddi === "+55" ? "(11) 91234-5678" : lead.ddi === "+39" ? "347 123 4567" : "912 345 678"}
                  className="pn-input pn-phone"
                  autoComplete="tel-national"
                  inputMode="tel"
                />
              </div>
            </Field>

            <Field label="Cidade" error={errors.cidade}>
              <input
                type="text"
                value={lead.cidade}
                onChange={(e) => setLead({ ...lead, cidade: e.target.value })}
                placeholder="A sua cidade"
                className="pn-input"
                autoComplete="address-level2"
              />
            </Field>

            <Field label="Qual é o seu maior desafio atual?" error={errors.desafio}>
              <select
                value={lead.desafio}
                onChange={(e) => setLead({ ...lead, desafio: e.target.value })}
                className="pn-input"
              >
                <option value="">Selecione…</option>
                <option value="Falta de energia">Falta de energia</option>
                <option value="Barriga / peso">Barriga / peso</option>
                <option value="Sono fraco">Sono fraco</option>
                <option value="Foco e motivação">Foco e motivação</option>
                <option value="Disposição íntima">Disposição íntima</option>
              </select>
            </Field>

            <button
              onClick={submitLead}
              disabled={submitting}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> A preparar…</>
              ) : (
                <>Ver o meu resultado <ArrowRight className="h-4 w-4" /></>
              )}
            </button>

            <p className="pt-1 text-center text-xs leading-relaxed text-pn-ink/40">
              Os seus dados estão seguros. Não partilhamos com terceiros.
            </p>
          </div>
        </div>

        <style>{`
          .pn-input {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid hsl(40 25% 80%);
            background: white;
            padding: 0.75rem 0.9rem;
            font-size: 0.95rem;
            color: hsl(60 8% 15.3%);
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .pn-ddi {
            width: 6.75rem;
            flex: none;
            padding-left: 0.6rem;
            padding-right: 0.4rem;
          }
          .pn-phone {
            flex: 1 1 0%;
            min-width: 0;
          }
          .pn-input:focus {
            border-color: hsl(41 53% 56.5%);
            box-shadow: 0 0 0 3px hsl(41 53% 56.5% / 0.15);
          }
        `}</style>
      </div>
    );
  }

  // ===== QUIZ =====
  return (
    <div className="flex min-h-[100dvh] flex-col bg-pn-light">
      {/* Barra de progresso */}
      <div className="sticky top-0 z-10 bg-pn-light/90 backdrop-blur">
        <div className="mx-auto max-w-lg px-6 pt-6 pb-3">
          <div className="mb-2 flex items-center justify-between text-xs text-pn-ink/50">
            <span className="pn-label">Pergunta {qIndex + 1} de {total}</span>
            {qIndex > 0 && (
              <button onClick={goBack} className="flex items-center gap-1 text-pn-ink/50 hover:text-pn-ink">
                <ArrowLeft className="h-3 w-3" /> Voltar
              </button>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-pn-ink/10">
            <div
              className="h-full rounded-full bg-pn-gold transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pergunta */}
      <div className="flex flex-1 items-center px-6 py-8">
        <div
          key={qIndex}
          className={`mx-auto w-full max-w-lg ${direction === 1 ? "pn-fade-up" : "pn-fade-in"}`}
        >

          <h2 className="pn-serif text-2xl leading-snug text-pn-ink md:text-3xl">
            {question.pt}
          </h2>

          <div className="mt-8 space-y-3">
            {question.options.map((opt) => {
              const isSelected = selected === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all active:scale-[0.99] ${
                    isSelected
                      ? "border-pn-gold bg-pn-gold/10 text-pn-ink"
                      : "border-pn-ink/10 bg-white text-pn-ink hover:border-pn-gold/50 hover:bg-pn-gold/5"
                  }`}
                >
                  <span>{opt}</span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected ? "border-pn-gold bg-pn-gold text-pn-dark" : "border-pn-ink/20"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="pn-label mb-2 block text-[11px] text-pn-ink/60">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function maskPhone(value, ddi) {
  const digits = value.replace(/\D/g, "");
  if (ddi === "+55") {
    // BR: (11) 91234-5678
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
  // PT: 912 345 678 (9 dígitos) · IT: 347 123 4567 (até 10 dígitos)
  const max = ddi === "+39" ? 10 : 9;
  const d = digits.slice(0, max);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}