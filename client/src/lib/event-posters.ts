export type EventPoster = {
  id: string;
  title: string;
  dateLabel: string;
  image: string;
  article?: string;
  document?: string;
};

/**
 * Locandine di iniziative documentate nell'archivio Notizie.
 * Le cinque immagini in /images/notizie/ sono esattamente le locandine originali
 * già associate alle rispettive notizie; non sono copertine generiche.
 *
 * Il Trofeo Prealpi Venete (FIBEC) è stato rimosso su richiesta.
 */
export const eventPosters: EventPoster[] = [
  {
    id: "prova-enci-san-boldo-2026",
    title: "Prova Nazionale ENCI – Passo San Boldo",
    dateLabel: "30 agosto 2026",
    image: "/images/notizie/PHOTO-2026-10-20-09-02-59.jpg",
    article: "/news/prova-nazionale-enci-san-boldo-30-agosto-2026",
  },
  {
    id: "tiro-altivole-luglio-2026",
    title: "Gara di tiro al piattello – Altivole",
    dateLabel: "11–12 luglio 2026",
    image: "/images/notizie/PHOTO-2026-10-20-09-07-14.jpg",
    article: "/news/gara-tiro-piattello-altivole-11-12-luglio-2026",
  },
  {
    id: "biodiversita-avifauna-2026",
    title: "Biodiversità e conservazione dell’avifauna",
    dateLabel: "28 maggio 2026",
    image: "/images/notizie/PHOTO-2026-10-20-09-03-51.jpg",
    article: "/news/conferenza-biodiversita-avifauna-28-maggio-2026",
  },
  {
    id: "prova-cinofila-aprile-2026",
    title: "Prova cinofila – Treviso",
    dateLabel: "18 aprile 2026",
    image: "/attached_assets/Locandina 18-04-26.png",
    article: "/news/gara-cinofila-provinciale-18-aprile-2026-locandina-ufficiale",
    document: "/attached_assets/Locandina 18-04-26.pdf",
  },
  {
    id: "lupo-conoscere-per-capire-2025",
    title: "Il lupo: conoscere per capire – Pederobba",
    dateLabel: "27 novembre 2025",
    image: "/attached_assets/Locandina Lupo.jpg",
  },
  {
    id: "gestione-lepre-miane-2025",
    title: "Gestione della lepre nei Comprensori Alpini",
    dateLabel: "9 ottobre 2025",
    image: "/images/notizie/PHOTO-2026-10-20-09-05-25.jpg",
    article: "/news/gestione-lepre-comprensori-pedemontana-9-ottobre-2025",
  },
  {
    id: "tiro-altivole-luglio-2025",
    title: "Gara di tiro al piattello – Altivole",
    dateLabel: "19–20 luglio 2025",
    image: "/images/notizie/PHOTO-2026-10-20-09-06-15.jpg",
    article: "/news/gara-tiro-piattello-altivole-19-20-luglio-2025",
  },
];
