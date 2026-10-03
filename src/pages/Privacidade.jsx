import React from "react";
import { LegalPage, Section, ContactEmail } from "@/components/protocolo/LegalPage";
import { CONTROLLER_NAME } from "@/lib/legal";

export default function Privacidade() {
  return (
    <LegalPage title="Política de Privacidade">
      <Section title="1. Quem é o responsável">
        <p>
          O responsável pelo tratamento dos seus dados pessoais no site do
          Protocolo Nórdico é <strong>{CONTROLLER_NAME}</strong>. Para qualquer
          questão sobre os seus dados, contacte <ContactEmail />.
        </p>
      </Section>

      <Section title="2. Que dados recolhemos">
        <p><strong>Teste gratuito (quiz):</strong> as suas respostas (idade e perguntas sobre energia, desempenho e saúde íntima), o seu email e a origem da visita (por exemplo, o anúncio em que clicou).</p>
        <p>
          Algumas respostas dizem respeito à saúde e são, por isso, uma categoria
          especial de dados. Só as tratamos com o seu consentimento explícito,
          dado no fim do teste.
        </p>
        <p><strong>Compras:</strong> nome, email, país e dados da compra (produto, valor, data e método de pagamento). Os dados do cartão, MB WAY ou Multibanco são tratados diretamente pela Stripe; nunca os vemos nem os guardamos.</p>
        <p><strong>Navegação:</strong> a origem da visita (o anúncio em que clicou) e algumas preferências guardadas no seu navegador (por exemplo, as respostas do teste para mostrar o resultado). Só se aceitar os cookies: páginas visitadas e cliques nos botões de compra, através do Pixel da Meta e da UTMify.</p>
      </Section>

      <Section title="3. Para que usamos os dados e com que fundamento">
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Mostrar o resultado do teste e enviar-lhe informação sobre o Protocolo Nórdico</strong>: com base no seu consentimento, que pode retirar a qualquer momento.</li>
          <li><strong>Processar a compra e entregar o produto</strong>: execução do contrato.</li>
          <li><strong>Cumprir obrigações fiscais e contabilísticas</strong>: obrigação legal.</li>
          <li><strong>Medir a eficácia dos anúncios</strong> com o Pixel da Meta (visitas, contactos e cliques em comprar): só com o seu consentimento, dado no aviso de cookies.</li>
          <li><strong>Saber que anúncio originou uma compra</strong> (a compra é comunicada à Meta e à UTMify a partir da Stripe, com a origem da visita): interesse legítimo em avaliar a publicidade, sem decisões automatizadas sobre si.</li>
        </ul>
        <p>Não vendemos os seus dados a ninguém.</p>
      </Section>

      <Section title="4. Com quem partilhamos">
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Stripe</strong>: pagamentos.</li>
          <li><strong>Railway</strong>: alojamento do site e dos dados do teste.</li>
          <li><strong>Meta (Facebook/Instagram)</strong> e <strong>UTMify</strong>: medição de anúncios. A Meta recebe eventos como visita, início de compra, contacto e compra, mas não as suas respostas ao teste.</li>
        </ul>
        <p>
          Alguns destes fornecedores estão fora do Espaço Económico Europeu (por
          exemplo, nos EUA ou no Brasil). Nesses casos, as transferências são
          feitas com as garantias previstas no RGPD, como as cláusulas
          contratuais-tipo da Comissão Europeia.
        </p>
      </Section>

      <Section title="5. Cookies">
        <p>
          Ao entrar no site pode aceitar ou recusar os cookies de medição. Se
          recusar, o Pixel da Meta não é carregado. Os únicos dados guardados no
          seu navegador são os necessários ao funcionamento do site: a sua
          escolha de cookies, as respostas do teste e a origem da visita.
        </p>
        <p>
          Pode mudar a escolha a qualquer momento em “Preferências de cookies”,
          no fundo de cada página.
        </p>
      </Section>

      <Section title="6. Durante quanto tempo guardamos">
        <ul className="list-disc space-y-2 pl-5">
          <li>Dados do teste: até 24 meses ou até retirar o consentimento, o que acontecer primeiro.</li>
          <li>Dados de compra: 10 anos, como exige a lei fiscal portuguesa.</li>
        </ul>
      </Section>

      <Section title="7. Os seus direitos">
        <p>
          Pode pedir acesso, retificação, apagamento, limitação ou portabilidade
          dos seus dados, opor-se ao seu tratamento e retirar o consentimento a
          qualquer momento, sem afetar o tratamento feito até aí. Basta escrever
          para <ContactEmail />. Respondemos no prazo de um mês.
        </p>
        <p>
          Também pode apresentar reclamação à Comissão Nacional de Proteção de
          Dados (<a href="https://www.cnpd.pt" target="_blank" rel="noreferrer" className="underline">www.cnpd.pt</a>).
        </p>
      </Section>
    </LegalPage>
  );
}
