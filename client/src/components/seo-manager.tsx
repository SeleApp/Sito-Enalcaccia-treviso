import { useEffect } from "react";
import { useLocation } from "wouter";

const SITE_URL = "https://www.enalcacciatv.it";
const DEFAULT_IMAGE = `${SITE_URL}/attached_assets/logo-enalcaccia-treviso.png?v=20260307`;

type SeoConfig = {
  title: string;
  description: string;
  noindex?: boolean;
};

const seoByPath: Record<string, SeoConfig> = {
  "/": {
    title: "ENAL Caccia Treviso | Associazione Provinciale",
    description:
      "Sito ufficiale di ENAL Caccia Treviso: notizie, eventi, tesseramento, attività venatorie, gare cinofile, pesca e tiro in provincia di Treviso.",
  },
  "/news": {
    title: "News e comunicati | ENAL Caccia Treviso",
    description:
      "Ultime notizie, comunicati, attività associative e aggiornamenti dal mondo venatorio della provincia di Treviso.",
  },
  "/magazine": {
    title: "Magazine | ENAL Caccia Treviso",
    description:
      "Approfondimenti su caccia, biodiversità, gestione faunistica, pesca e tiro a cura di ENAL Caccia Treviso.",
  },
  "/competitions": {
    title: "Gare e competizioni | ENAL Caccia Treviso",
    description:
      "Calendario, risultati e informazioni sulle gare e competizioni promosse da ENAL Caccia Treviso.",
  },
  "/membership": {
    title: "Tesseramento e quote associative | ENAL Caccia Treviso",
    description:
      "Informazioni sul tesseramento ENAL Caccia Treviso, quote associative, coperture e servizi dedicati ai soci.",
  },
  "/contact": {
    title: "Contatti e sede | ENAL Caccia Treviso",
    description:
      "Contatta ENAL Caccia Treviso. Sede in Via Cattaneo 28, Treviso. Ricevimento martedì e giovedì dalle 08:00 alle 11:30.",
  },
  "/scuola-venatoria": {
    title: "Scuola venatoria | ENAL Caccia Treviso",
    description:
      "Formazione, corsi e aggiornamenti della Scuola venatoria di ENAL Caccia Treviso per cacciatori e aspiranti cacciatori.",
  },
  "/direttivo": {
    title: "Comitato direttivo | ENAL Caccia Treviso",
    description:
      "Scopri il comitato direttivo provinciale e l'organizzazione di ENAL Caccia Treviso.",
  },
  "/gare-cinofile": {
    title: "Gare cinofile | ENAL Caccia Treviso",
    description:
      "Eventi, prove e risultati delle gare cinofile organizzate e promosse da ENAL Caccia Treviso.",
  },
  "/gare-pesca": {
    title: "Gare di pesca | ENAL Caccia Treviso",
    description:
      "Calendario, regolamenti e risultati delle gare di pesca promosse da ENAL Caccia Treviso.",
  },
  "/gare-tiro": {
    title: "Gare di tiro | ENAL Caccia Treviso",
    description:
      "Calendario, regolamenti e risultati delle gare di tiro promosse da ENAL Caccia Treviso.",
  },
  "/pesca-tiro": {
    title: "Pesca e tiro | ENAL Caccia Treviso",
    description:
      "Attività, iniziative e informazioni dedicate ai settori pesca e tiro di ENAL Caccia Treviso.",
  },
  "/eventi": {
    title: "Eventi | ENAL Caccia Treviso",
    description:
      "Assemblee, convegni, incontri e appuntamenti organizzati da ENAL Caccia Treviso e dalle sezioni locali.",
  },
  "/privacy-policy": {
    title: "Privacy policy | ENAL Caccia Treviso",
    description: "Informativa sul trattamento dei dati personali del sito ENAL Caccia Treviso.",
  },
  "/cookie-policy": {
    title: "Cookie policy | ENAL Caccia Treviso",
    description: "Informativa sull'utilizzo dei cookie nel sito ENAL Caccia Treviso.",
  },
  "/auth": {
    title: "Accesso area riservata | ENAL Caccia Treviso",
    description: "Accesso all'area riservata del sito ENAL Caccia Treviso.",
    noindex: true,
  },
  "/dashboard": {
    title: "Area riservata | ENAL Caccia Treviso",
    description: "Area riservata ai soci di ENAL Caccia Treviso.",
    noindex: true,
  },
  "/admin": {
    title: "Amministrazione | ENAL Caccia Treviso",
    description: "Area amministrativa del sito ENAL Caccia Treviso.",
    noindex: true,
  },
};

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

function setCanonical(href: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;
}

export function SeoManager() {
  const [location] = useLocation();

  useEffect(() => {
    const normalizedPath = location.split("?")[0].replace(/\/$/, "") || "/";
    const isNewsDetail = normalizedPath.startsWith("/news/");
    const config =
      seoByPath[normalizedPath] ??
      (isNewsDetail
        ? {
            title: "Notizia | ENAL Caccia Treviso",
            description: "Leggi la notizia completa sul sito ufficiale di ENAL Caccia Treviso.",
          }
        : {
            title: "ENAL Caccia Treviso",
            description:
              "Sito ufficiale di ENAL Caccia Treviso: notizie, eventi, tesseramento e attività associative.",
          });

    const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
    document.title = config.title;
    document.documentElement.lang = "it";

    setMeta('meta[name="description"]', { name: "description", content: config.description });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: config.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
    });
    setMeta('meta[property="og:type"]', { property: "og:type", content: isNewsDetail ? "article" : "website" });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "it_IT" });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "ENAL Caccia Treviso" });
    setMeta('meta[property="og:title"]', { property: "og:title", content: config.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: config.description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_IMAGE });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: config.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: config.description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_IMAGE });
    setCanonical(canonicalUrl);
  }, [location]);

  return null;
}
