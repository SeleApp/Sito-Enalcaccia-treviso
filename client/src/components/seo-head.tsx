import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
}

export function SEOHead({ 
  title, 
  description, 
  keywords = "caccia, pesca, tiro, enalcaccia, treviso, tessere, gare, cinofilia",
  type = 'website',
  image = '/og-image.jpg',
  url
}: SEOHeadProps) {
  useEffect(() => {
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
    updateMetaProperty('og:image', image);
    updateMetaProperty('og:site_name', 'ENAL Caccia - Sezione Provinciale di Treviso');
    updateMetaProperty('og:locale', 'it_IT');
    
    if (url) {
      updateMetaProperty('og:url', url);
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${title} | ENAL Caccia Treviso`);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Schema.org structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ENAL Caccia - Sezione Provinciale di Treviso",
      "description": "Associazione venatoria provinciale di Treviso per caccia, pesca sportiva e tiro. Tessere ufficiali, gare cinofile e corsi di formazione.",
      "url": "https://enalcaccia-treviso.replit.app",
      "logo": "https://enalcaccia-treviso.replit.app/logo.png",
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
    
    updateStructuredData(structuredData);
    
  }, [title, description, keywords, type, image, url]);

  return null;
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

function updateStructuredData(data: object) {
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