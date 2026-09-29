import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { transformationImages } from "@/lib/quizData";

export default function BeforeAfterGallery() {
  const [active, setActive] = useState(0);
  const item = transformationImages[active];

  return (
    <section className="bg-pn-light py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <div className="pn-eyebrow mb-4">Transformações reais</div>
          <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
            Antes e depois de quem aplicou o protocolo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-pn-ink/60">
            Resultados de homens que aplicaram o protocolo com disciplina.
            Cada história é única — o seu resultado depende do seu compromisso.
          </p>
        </div>

        {/* Imagem principal */}
        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-lg md:aspect-[3/4]">
            <Image
              src={item.url}
              alt={`Transformação antes e depois — ${item.name}, ${item.age} anos`}
              className="h-full w-full object-cover"
              fittingType="fill"
            />
          </div>

          <div>
            <div className="pn-label text-xs text-pn-gold-dark">Depoimento</div>
            <blockquote className="pn-serif mt-3 text-xl leading-relaxed text-pn-ink md:text-2xl">
              “{item.quote}”
            </blockquote>
            <div className="mt-4 text-sm text-pn-ink/70">
              <span className="font-semibold">{item.name}</span>, {item.age} anos · {item.city}
            </div>

            {/* Miniaturas */}
            <div className="mt-6 flex flex-wrap gap-3">
              {transformationImages.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg transition-all ${
                    i === active
                      ? "ring-2 ring-pn-gold ring-offset-2 ring-offset-pn-light"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Ver transformação de ${t.name}`}
                >
                  <Image
                    src={t.url}
                    alt={t.name}
                    className="h-full w-full object-cover"
                    fittingType="fill"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-pn-ink/40">
          Depoimentos reais e autorizados. Resultados individuais variam e
          dependem de fatores como adesão, genética e condições de base.
        </p>
      </div>
    </section>
  );
}