import React from "react";
import { Link } from "react-router-dom";
import { LegalPage, Section, ContactEmail } from "@/components/protocolo/LegalPage";
import { CONTROLLER_NAME } from "@/lib/legal";

export default function Termos() {
  return (
    <LegalPage title="Termos e Condições">
      <Section title="1. Quem vende">
        <p>
          Os produtos do Protocolo Nórdico são vendidos por <strong>{CONTROLLER_NAME}</strong>.
          Contacto: <ContactEmail />.
        </p>
      </Section>

      <Section title="2. O que compra">
        <p>
          Produtos digitais em PDF: o <strong>Protocolo Nórdico</strong> e,
          opcionalmente, o guia <strong>Controlo Total</strong>, com os bónus
          descritos na página de venda no momento da compra. Os preços estão em
          euros e incluem todos os encargos; o pagamento é único, sem
          subscrição.
        </p>
      </Section>

      <Section title="3. Pagamento e entrega">
        <p>
          O pagamento é feito através da Stripe, por cartão, MB WAY ou
          Multibanco. Depois de o pagamento ser confirmado, abre-se a página de
          download do PDF.
        </p>
        <p>
          No Multibanco, o acesso fica disponível depois de pagar a referência e
          de o banco confirmar o pagamento, o que pode demorar algumas horas.
          Pode descarregar a qualquer momento em{" "}
          <Link to="/acesso" className="underline">A minha compra</Link>, com o
          email que usou no pagamento.
        </p>
      </Section>

      <Section title="4. Garantia de 30 dias">
        <p>
          Se não ficar satisfeito, escreva para <ContactEmail /> no prazo de 30
          dias após a compra, com o email usado no pagamento, e devolvemos 100%
          do valor pelo mesmo método de pagamento. Não pedimos justificação.
        </p>
        <p>
          Ao pedir o acesso imediato a um conteúdo digital, a lei (Decreto-Lei
          n.º 24/2014) deixa de prever o direito de livre resolução de 14 dias.
          A nossa garantia de 30 dias aplica-se na mesma e é mais longa.
        </p>
      </Section>

      <Section title="5. Saúde">
        <p>
          O conteúdo é educativo e não substitui aconselhamento, diagnóstico ou
          tratamento médico. Fale com um profissional de saúde antes de mudar o
          treino, a alimentação ou a suplementação, sobretudo se tiver alguma
          condição de saúde ou tomar medicação. Dificuldades persistentes de
          ereção podem ser sinal de outros problemas de saúde e devem ser
          avaliadas por um médico. Os resultados variam de pessoa para pessoa.
        </p>
      </Section>

      <Section title="6. Uso do conteúdo">
        <p>
          O PDF é para uso pessoal. Não é permitido revendê-lo, partilhá-lo
          publicamente ou distribuí-lo.
        </p>
      </Section>

      <Section title="7. Dados pessoais">
        <p>
          O tratamento dos seus dados está descrito na{" "}
          <Link to="/privacidade" className="underline">Política de Privacidade</Link>.
        </p>
      </Section>

      <Section title="8. Reclamações e litígios">
        <p>
          Pode apresentar reclamação no{" "}
          <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" className="underline">Livro de Reclamações Eletrónico</a>.
          Em caso de litígio de consumo, pode recorrer a uma entidade de
          resolução alternativa de litígios, como o CNIACC – Centro Nacional de
          Informação e Arbitragem de Conflitos de Consumo (
          <a href="https://www.cniacc.pt" target="_blank" rel="noreferrer" className="underline">www.cniacc.pt</a>).
          Aplica-se a lei portuguesa.
        </p>
      </Section>
    </LegalPage>
  );
}
