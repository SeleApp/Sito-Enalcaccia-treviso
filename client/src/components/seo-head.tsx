import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SITE_URL = "https://enalcaccia-treviso.replit.app";

export function SEOHead({ 
  title, 
  description, 
  keywords = "caccia, pesca, tiro, enalcaccia, treviso, tessere, gare, cinofilia",
  type = 'website',
  image = '/og-image.jpg',
  url,
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    const normalizedUrl = url || (typeof window !== "undefined" ? `${SITE_URL}${window.location.pathname}` : SITE_URL);
    const normalizedImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

    // Aggiorna il title della pagina
    document.title = `${title} | ENAL Caccia Treviso`;
    
    // Meta description
    updateMetaTag('description', description);
    
    // Meta keywords
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaProperty('og:title', `${title} | ENAL Caccia Treviso`);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:image', normalizedImage);
    updateMetaProperty('og:site_name', 'ENAL Caccia - Sezione Provinciale di Treviso');
    updateMetaProperty('og:locale', 'it_IT');
    
    updateMetaProperty('og:url', normalizedUrl);
    updateCanonicalLink(normalizedUrl);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${title} | ENAL Caccia Treviso`);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', normalizedImage);
    updateMetaTag('robots', noIndex ? 'noindex,nofollow' : 'index,follow');
    
    // Schema.org structured data
    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ENAL Caccia - Sezione Provinciale di Treviso",
      "description": "Associazione venatoria provinciale di Treviso per caccia, pesca sportiva e tiro. Tessere ufficiali, gare cinofile e corsi di formazione.",
      "url": SITE_URL,
      "logo": `${SITE_URL}/attached_assets/logo-enalcaccia-treviso.png?v=20260307`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Via della Caccia, 123",
        "addressLocality": "Treviso",
        "postalCode": "31100",
        "addressRegion": "TV",
        "addressCountry": "IT"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+39-0422-123456",
        "contactType": "customer service",
        "email": "info@enalcaccia-veneto.it"
      },
      "sameAs": [
        "https://www.enalcaccia.it",
        "https://www.regione.veneto.it"
      ]
    };

    const pathName = normalizedUrl.replace(SITE_URL, "") || "/";
    const shouldAddBreadcrumb = pathName !== "/" && !noIndex;
    const breadcrumbStructuredData = shouldAddBreadcrumb
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${SITE_URL}/`,
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": title,
              "item": normalizedUrl,
            },
          ],
        }
      : undefined;

    if (structuredData) {
      updateStructuredData(structuredData);
    } else if (breadcrumbStructuredData) {
      updateStructuredData([defaultStructuredData, breadcrumbStructuredData]);
    } else {
      updateStructuredData(defaultStructuredData);
    }
    
  }, [title, description, keywords, type, image, url, noIndex, structuredData]);

  return null;
}

function updateCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateStructuredData(data: object | object[]) {
  // Rimuovi script structured data esistente
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Aggiungi nuovo script structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}