import { useEffect, useState } from "react";

/**
 * Hook performante para detectar media queries
 * @param query - La media query a evaluar (ej: "(min-width: 768px)")
 * @returns boolean indicando si la media query coincide
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Actualizar el estado inicial
    setMatches(mediaQuery.matches);

    // Handler para cambios
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Añadir listener
    mediaQuery.addEventListener("change", handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/**
 * Hook para detectar si el dispositivo es móvil (menor que md breakpoint de Tailwind)
 * md breakpoint en Tailwind = 768px
 * @returns boolean - true si el ancho de pantalla es menor a 768px
 */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

/**
 * Hook para detectar diferentes breakpoints de Tailwind
 */
export function useBreakpoint() {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2Xl = useMediaQuery("(min-width: 1536px)");

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile: !isMd,
  };
}
