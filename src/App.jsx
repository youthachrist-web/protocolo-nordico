import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MetaPixelTracker from './components/MetaPixelTracker';
import CookieBanner from './components/CookieBanner';
// A /vitalidade (destino dos anúncios) vem no pacote principal; as outras
// páginas carregam só quando são abertas, para a página de anúncios abrir
// mais depressa no telemóvel.
import Vitalidade from '@/pages/Vitalidade';
const Home = lazy(() => import('@/pages/Home'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const Resultado = lazy(() => import('@/pages/Resultado'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Obrigado = lazy(() => import('@/pages/Obrigado'));
const Acesso = lazy(() => import('@/pages/Acesso'));
const Privacidade = lazy(() => import('@/pages/Privacidade'));
const Termos = lazy(() => import('@/pages/Termos'));
const PageNotFound = lazy(() => import('./lib/PageNotFound'));

// O site não tem contas de utilizador: as rotas abrem logo, sem esperar pela
// verificação de autenticação da Base44 (que atrasava a primeira imagem).
const AppRoutes = () => (
  <Suspense fallback={<div className="min-h-screen bg-pn-light" />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/obrigado" element={<Obrigado />} />
      <Route path="/vitalidade" element={<Vitalidade />} />
      <Route path="/acesso" element={<Acesso />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Suspense>
);

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <MetaPixelTracker />
        <CookieBanner />
        <AppRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
