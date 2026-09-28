import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, trackPageView } from "@/lib/metaPixel";
import { captureUtms } from "@/lib/utm";

// Inicia o Meta Pixel e envia um PageView a cada mudança de rota (SPA).
export default function MetaPixelTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    trackPageView();
    captureUtms();
  }, [pathname]);

  return null;
}
