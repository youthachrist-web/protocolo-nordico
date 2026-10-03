import React, { useEffect } from "react";
import QuizFlow from "@/components/protocolo/QuizFlow";

export default function Quiz() {
  // Pré-carrega a página de resultado (gráficos) enquanto a pessoa responde
  useEffect(() => {
    import("@/pages/Resultado");
  }, []);
  return <QuizFlow />;
}
