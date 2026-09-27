import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, trackPageView } from "@/lib/metaPixel";

// Inicia o Meta Pixel e envia um PageView a cada mudança de rota (SPA).
export default function MetaPixelTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}
