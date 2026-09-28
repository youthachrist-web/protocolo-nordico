import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtms } from "@/lib/utm";

// Guarda as UTMs do anúncio a cada mudança de rota (SPA).
// O Pixel da Meta é gerido pelo Pixel da UTMify (index.html).
export default function MetaPixelTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    captureUtms();
  }, [pathname]);

  return null;
}
