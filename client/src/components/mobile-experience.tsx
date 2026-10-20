import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ArrowRight, BookOpen, CalendarDays, ChevronDown, ChevronRight,
  Download, ExternalLink, FileText, IdCard, LogOut, Mail, Menu, Newspaper,
  Search, ShieldCheck, Users, X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ArticleRichContent } from "@/components/article-rich-content";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { eventPosters } from "@/pages/events-page";
import { membershipCatalog } from "@/pages/membership-page";
import type { News } from "@shared/schema";

const NEWS_KEY = "/api/news?v=20261020-editoriale";
const brandLogo = "/attached_assets/logo-enalcaccia-treviso.png?v=20260307";

const mainLinks = [
  { href: "/news", label: "Notizie e comunicati" },
  { href: "/eventi", label: "Calendario eventi" },
  { href: "/membership", label: "Tesseramento e assicurazioni" },
  { href: "/contact", label: "Contatti e assistenza" },
];

const activityLinks = [
  { href: "/scuola-venatoria", label: "Scuola venatoria" },
  { href: "/gare-cinofile", label: "Gare cinofile" },
  { href: "/gare-pesca", label: "Gare pesca" },
  { href: "/gare-tiro", label: "Gare tiro" },
  { href: "/pesca-tiro", label: "Pesca e tiro" },
];

const dateString = (value: unknown) => {
  if (!value) return "";
  const d = new Date(value as string);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
};

function usePublishedNews() {
  return useQuery<News[]>({
    queryKey: [NEWS_KEY],
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

function SectionIntro({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return (
    <div className="mb-6 space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#2D5016]">{kicker}</p>
      <h1 className="font-serif text-[31px] font-bold leading-[1.16] tracking-tight text-[#193024]">{title}</h1>
      <p className="max-w-2xl text-[16px] leading-7 text-[#617062]">{description}</p>
    </div>
  );
}

function QuickLink({ href, title, Icon }: { href: string; title: string; Icon: typeof Newspaper }) {
  return (
    <Link href={href} className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-[#DFE5DA] bg-white p-4 text-[#193024] transition-colors hover:border-[#2D5016] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5016]">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DDE6D3] text-[#2D5016]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <span className="text-[17px] font-semibold leading-snug">{title}</span>
    </Link>
  );
}

function MobileHome() {
  const { data, isLoading } = usePublishedNews();
  const current = useMemo(() => [...(data || [])]
    .filter(x => x.published)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 3), [data]);

  return (
    <div className="ec-mobile-page mx-auto max-w-5xl p-4 sm:px-7 sm:py-7">
      <section className="rounded-[20px] bg-[#193219] bg-cover bg-center px-5 py-6 text-white sm:px-8 sm:py-9" style={{ backgroundImage: "linear-gradient(90deg, rgba(25,50,25,0.96), rgba(25,50,25,0.80)), url('/attached_assets/Panorama-Bosco.JPG')" }}>
        <p className="text-xs font-bold uppercase tracking-wider text-[#DDE6D3]">ENALCACCIA · Provincia di Treviso</p>
        <h1 className="mt-4 max-w-xl font-serif text-[36px] font-bold leading-[1.15] sm:text-[44px]">Tradizione, territorio, futuro.</h1>
        <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#E6EADD]">
          Informazioni e servizi per cacciatori, pescatori e appassionati di tiro della provincia.
        </p>
        <Link href="/news" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-base font-semibold text-[#2D5016]">
          Scopri le notizie <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>

      <div className="mt-7">
        <h2 className="mb-4 font-serif text-[25px] font-bold text-[#193024]">I servizi più utilizzati</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickLink href="/news" title="Notizie" Icon={Newspaper} />
          <QuickLink href="/eventi" title="Eventi" Icon={CalendarDays} />
          <QuickLink href="/membership" title="Tesseramento" Icon={IdCard} />
          <QuickLink href="/auth" title="Area Soci" Icon={Users} />
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-[#DFE5DA] bg-white p-5 sm:p-7">
        <span className="inline-flex rounded-lg bg-[#F5E5C3] px-3 py-2 text-xs font-bold text-[#193219]">COMUNICAZIONI AI SOCI</span>
        <h2 className="mt-3 font-serif text-[24px] font-bold leading-snug text-[#193024]">Ultimi aggiornamenti dal territorio</h2>
        {isLoading && <p className="mt-3 text-[#617062]">Caricamento delle notizie…</p>}
        {!isLoading && current.length === 0 && <p className="mt-3 text-[#617062]">Nessuna notizia disponibile al momento.</p>}
        <div className="mt-3 divide-y divide-[#DFE5DA]">
          {current.map(n => (
            <Link key={n.id} href={`/news/${n.slug}`} className="block py-3 focus-visible:outline-2 focus-visible:outline-[#2D5016]">
              <span className="text-xs font-medium text-[#617062]">{dateString(n.createdAt)} · {n.category}</span>
              <span className="mt-1 flex items-start justify-between gap-3 text-[16px] font-semibold leading-snug text-[#193024]">{n.title}<ChevronRight className="h-5 w-5 shrink-0 text-[#2D5016]" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
        <Link href="/news" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-[#2D5016]">Tutte le comunicazioni <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link href="/scuola-venatoria" className="rounded-2xl bg-[#DDE6D3] p-5 text-[#193219]">
          <h2 className="font-serif text-[22px] font-bold">Attività sul territorio</h2>
          <p className="mt-2 text-[15px] leading-6">Cinofilia, formazione, pesca e tiro: scopri le iniziative delle sezioni.</p>
          <span className="mt-3 inline-flex items-center gap-1 font-semibold">Approfondisci <ArrowRight className="h-4 w-4" /></span>
        </Link>
        <Link href="/news" className="rounded-2xl bg-[#DDE6D3] p-5 text-[#193219]">
          <h2 className="font-serif text-[22px] font-bold">Documenti e normativa</h2>
          <p className="mt-2 text-[15px] leading-6">Circolari, calendario venatorio e comunicazioni ufficiali utili ai soci.</p>
          <span className="mt-3 inline-flex items-center gap-1 font-semibold">Consulta le notizie <ArrowRight className="h-4 w-4" /></span>
        </Link>
      </div>
    </div>
  );
}

function MobileNews() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tutte");
  const { data = [], isLoading, isError } = usePublishedNews();
  const articles = useMemo(() => [...data].filter(n => n.published)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()), [data]);
  const categories = useMemo(() => ["Tutte", ...new Set(articles.map(n => n.category).filter(Boolean))], [articles]);
  const found = useMemo(() => articles.filter(n => {
    const text = `${n.title} ${n.excerpt || ""} ${n.content || ""}`.toLocaleLowerCase("it-IT");
    return (category === "Tutte" || n.category === category) && text.includes(search.toLocaleLowerCase("it-IT").trim());
  }), [articles, category, search]);

  return (
    <div className="ec-mobile-page mx-auto max-w-5xl p-5 sm:px-7 sm:py-8">
      <SectionIntro kicker="Informazione" title="Notizie e comunicati" description="Disposizioni, aggiornamenti e iniziative dalla provincia di Treviso." />
      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#DFE5DA] bg-white px-4">
        <Search className="h-5 w-5 shrink-0 text-[#617062]" aria-hidden="true" />
        <span className="sr-only">Cerca nelle notizie</span>
        <input value={search} onChange={e => setSearch(e.target.value)} type="search" placeholder="Cerca un argomento o un luogo" className="min-w-0 w-full border-none bg-transparent text-base text-[#193024] outline-none placeholder:text-[#617062]" />
      </label>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtra per categoria">
        {categories.map(c => (
          <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={c === category} className={`min-h-11 shrink-0 rounded-full px-4 text-[15px] font-semibold ${c === category ? "bg-[#2D5016] text-white" : "bg-[#DDE6D3] text-[#2D5016]"}`}>{c}</button>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#617062]" aria-live="polite">{isLoading ? "Caricamento…" : `${found.length} ${found.length === 1 ? "notizia" : "notizie"}`}</p>
      {isError && <p role="alert" className="mt-4 rounded-xl bg-white p-5">Non è stato possibile caricare le notizie. Riprova più tardi.</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {found.map(article => (
          <Link key={article.id} href={`/news/${article.slug}`} className="flex flex-col overflow-hidden rounded-2xl border border-[#DFE5DA] bg-white p-4 sm:p-5">
            {article.featuredImage && !article.featuredImage.toLowerCase().endsWith(".pdf") && (
              <div className="mb-4 overflow-hidden rounded-xl bg-[#EDF2E8]">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  loading="lazy"
                  className={`h-44 w-full ${article.featuredImage.startsWith("/images/notizie/") ? "object-contain bg-white" : "object-cover"}`}
                />
              </div>
            )}
            <div><span className="inline-flex max-w-full rounded-lg bg-[#DDE6D3] px-3 py-2 text-xs font-bold uppercase text-[#2D5016]">{article.category}</span></div>
            <h2 className="mt-3 font-serif text-[21px] font-bold leading-[1.28] text-[#193024]">{article.title}</h2>
            <p className="mt-2 text-[13px] text-[#617062]">{dateString(article.createdAt)}</p>
            {article.excerpt && <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-[#617062]">{article.excerpt}</p>}
            <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-2 text-[15px] font-semibold text-[#2D5016]">Leggi la notizia <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
      {!isLoading && found.length === 0 && <p className="mt-5 rounded-xl bg-white p-5 text-base">Nessun articolo corrisponde alla ricerca.</p>}
    </div>
  );
}

function MobileArticle({ slug }: { slug: string }) {
  const { data: article, isPending, isError } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: Boolean(slug), staleTime: 0, refetchOnMount: "always",
  });
  return (
    <div className="ec-mobile-page ec-mobile-article mx-auto max-w-3xl px-5 pb-10 pt-6 sm:px-8">
      <Link href="/news" className="mb-5 inline-flex min-h-11 items-center gap-2 font-semibold text-[#2D5016]"><ArrowLeft className="h-5 w-5" /> Tutte le notizie</Link>
      {isPending && <p className="mt-6 text-[#617062]">Caricamento dell'articolo…</p>}
      {(isError || (!isPending && !article)) && <p role="alert" className="mt-4 rounded-xl bg-white p-5">Articolo non disponibile. <Link href="/news" className="font-semibold underline">Torna alle notizie</Link>.</p>}
      {article && (
        <article className="space-y-4">
          <div className="inline-flex rounded-lg bg-[#DDE6D3] px-3 py-2 text-xs font-bold uppercase text-[#2D5016]">{article.category}</div>
          <h1 className="font-serif text-[32px] font-bold leading-[1.18] text-[#193024] sm:text-[40px]">{article.title}</h1>
          <p className="text-sm text-[#617062]">Pubblicato il {dateString(article.createdAt)}</p>
          {article.updatedAt && article.createdAt && dateString(article.updatedAt) !== dateString(article.createdAt) &&
            <p className="text-sm text-[#617062]">Testo aggiornato il {dateString(article.updatedAt)}</p>}
          {article.featuredImage && (
            <div className="overflow-hidden rounded-2xl bg-white p-3">
              {article.featuredImage.toLocaleLowerCase().endsWith(".pdf")
                ? <a href={article.featuredImage} target="_blank" rel="noopener noreferrer" className="flex min-h-32 items-center gap-3 font-semibold text-[#2D5016]"><FileText className="h-8 w-8" /> Apri la locandina PDF <ExternalLink className="h-4 w-4" /></a>
                : <a href={article.featuredImage} target="_blank" rel="noopener noreferrer" aria-label="Apri l'immagine originale"><img src={article.featuredImage} alt={article.title} loading="lazy" className="mx-auto max-h-[520px] w-full object-contain" /></a>}
            </div>
          )}
          {article.excerpt && <p className="text-lg leading-8 text-[#617062]">{article.excerpt}</p>}
          <div className="ec-mobile-richtext prose prose-neutral max-w-none break-words text-[17px] leading-8 text-[#193024]">
            <ArticleRichContent content={article.content} />
          </div>
          <Link href="/news" className="inline-flex min-h-12 items-center gap-2 font-semibold text-[#2D5016]"><ArrowLeft className="h-5 w-5" /> Torna alle notizie</Link>
        </article>
      )}
    </div>
  );
}

function MobileEvents() {
  const [view, setView] = useState<"archive" | "calendar">("archive");
  return (
    <div className="ec-mobile-page mx-auto max-w-5xl p-5 sm:px-7 sm:py-8">
      <SectionIntro kicker="Appuntamenti" title="Eventi e locandine" description="Manifestazioni, incontri e gare organizzati sul territorio trevigiano." />
      <div className="mb-5 flex gap-2" role="group" aria-label="Visualizzazione eventi">
        <button type="button" onClick={() => setView("archive")} aria-pressed={view === "archive"} className={`min-h-12 rounded-xl px-4 font-semibold ${view === "archive" ? "bg-[#2D5016] text-white" : "bg-[#DDE6D3] text-[#2D5016]"}`}>Archivio eventi</button>
        <button type="button" onClick={() => setView("calendar")} aria-pressed={view === "calendar"} className={`min-h-12 rounded-xl px-4 font-semibold ${view === "calendar" ? "bg-[#2D5016] text-white" : "bg-[#DDE6D3] text-[#2D5016]"}`}>In programma</button>
      </div>
      {view === "calendar" ? (
        <div className="space-y-4 rounded-2xl border border-[#DFE5DA] bg-white p-5">
          <h2 className="font-serif text-[23px] font-bold">Prossimi appuntamenti</h2>
          <p className="text-base leading-7 text-[#617062]">Nell'archivio delle locandine attualmente presenti non risultano eventi con una data successiva a oggi. Per altre iniziative consulta anche le pagine dedicate alle attività.</p>
          <Link href="/gare-cinofile" className="flex min-h-12 items-center gap-2 font-semibold text-[#2D5016]">Consulta le gare cinofile <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {eventPosters.map(poster => (
            <article key={poster.id} className="flex gap-3 rounded-2xl border border-[#DFE5DA] bg-white p-3 sm:p-4">
              <a href={poster.document || poster.image} target="_blank" rel="noopener noreferrer" className="w-24 shrink-0 self-start overflow-hidden rounded-xl bg-[#EDF2E8] sm:w-32" aria-label={`Apri locandina ${poster.title}`}>
                <img src={poster.image} alt={`Locandina ${poster.title}`} className="aspect-[3/4] w-full object-contain" loading="lazy" />
              </a>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-xs font-bold uppercase text-[#2D5016]">{poster.dateLabel}</p>
                <h2 className="text-[17px] font-semibold leading-snug text-[#193024]">{poster.title}</h2>
                <a href={poster.document || poster.image} target="_blank" rel="noopener noreferrer" className="mt-auto flex min-h-11 items-center gap-1 text-sm font-semibold text-[#2D5016]">Apri locandina <ExternalLink className="h-4 w-4" /></a>
                {poster.article && <Link href={poster.article} className="flex min-h-11 items-center gap-1 text-sm font-semibold text-[#2D5016]">Leggi la notizia <ArrowRight className="h-4 w-4" /></Link>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMembership() {
  const [category, setCategory] = useState("Tutte");
  const categories = ["Tutte", ...new Set(membershipCatalog.map(item => item.category))];
  const results = membershipCatalog.filter(item => category === "Tutte" || item.category === category);
  return (
    <div className="ec-mobile-page mx-auto max-w-5xl p-5 sm:px-7 sm:py-8">
      <SectionIntro kicker="Servizi ai soci" title="Tesseramento ENALCACCIA" description="Consulta il catalogo delle tessere e delle opzioni disponibili per le attività venatorie e sportive." />
      <p className="rounded-xl bg-[#DDE6D3] p-4 text-[15px] leading-6 text-[#193219]">Le tipologie e le quote indicate provengono dal catalogo del sito. Per la disponibilità e le modalità di rilascio contatta la segreteria.</p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-3" role="group" aria-label="Filtra le tessere per attività">
        {categories.map(c => <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c} className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${category === c ? "bg-[#2D5016] text-white" : "bg-[#DDE6D3] text-[#2D5016]"}`}>{c}</button>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map(item => (
          <div key={item.title} className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#DFE5DA] bg-white p-3">
            <img src={item.image} alt={item.title} loading="lazy" className="h-24 w-24 shrink-0 rounded-lg bg-[#F8F7F1] object-contain" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-[#2D5016]">{item.category}</p>
              <h2 className="mt-1 text-[16px] font-semibold leading-snug text-[#193024]">{item.title}</h2>
              {item.priceLabel && <p className="mt-2 text-base font-bold text-[#2D5016]">{item.priceLabel}</p>}
            </div>
          </div>
        ))}
      </div>
      <Link href="/contact" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2D5016] px-4 text-base font-semibold text-white">Contatta la segreteria <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}

export function MobileHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  useEffect(() => { setOpen(false); setActivitiesOpen(false); }, [location]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  const menuLink = (href: string, label: string) => (
    <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-[55px] items-center justify-between gap-3 rounded-xl border border-[#DFE5DA] bg-white px-4 text-[17px] font-semibold leading-snug text-[#193024]">
      {label}<ChevronRight className="h-5 w-5 shrink-0 text-[#2D5016]" aria-hidden="true" />
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DFE5DA] bg-white shadow-sm">
        <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-7">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <img src={brandLogo} alt="Enalcaccia Treviso" className="h-12 w-12 shrink-0 rounded-full object-contain" />
            <span className="min-w-0 leading-tight">
              <span className="block text-[16px] font-extrabold tracking-wide text-[#2D5016]">ENALCACCIA</span>
              <span className="block text-[11px] font-semibold text-[#617062] sm:text-[12px]">SEZIONE PROVINCIALE DI TREVISO</span>
            </span>
          </Link>
          <nav aria-label="Navigazione tablet" className="hidden items-center gap-5 md:flex">
            <Link href="/news" className="text-[15px] font-semibold text-[#193024]">Notizie</Link>
            <Link href="/eventi" className="text-[15px] font-semibold text-[#193024]">Eventi</Link>
            <button type="button" className="min-h-11 text-[15px] font-semibold text-[#193024]" onClick={() => setOpen(true)}>Attività</button>
            <Link href={user ? "/dashboard" : "/auth"} className="text-[15px] font-semibold text-[#193024]">Area Soci</Link>
            {user?.role === "admin" && <Link href="/admin" className="text-[15px] font-semibold text-[#2D5016]">Amministrazione</Link>}
          </nav>
          <button type="button" onClick={() => setOpen(true)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF2E8] text-[#2D5016] md:hidden" aria-label="Apri menu di navigazione" aria-expanded={open}>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>
      {open && <div className="fixed inset-0 z-[70] bg-black/50" onMouseDown={() => setOpen(false)} />}
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu Enalcaccia Treviso" className="fixed inset-y-0 right-0 z-[71] w-full max-w-[430px] overflow-y-auto bg-[#F8F7F1] p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={brandLogo} alt="" className="h-11 w-11 rounded-full object-contain" />
              <span className="font-serif text-lg font-bold text-[#193219]">Enalcaccia Treviso</span>
            </div>
            <button type="button" aria-label="Chiudi menu" onClick={() => setOpen(false)} className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDE6D3] text-[#2D5016]"><X className="h-6 w-6" /></button>
          </div>
          <h2 className="mt-7 font-serif text-[29px] font-bold text-[#193024]">Dove vuoi andare?</h2>
          <p className="mt-1 text-[16px] leading-6 text-[#617062]">Tutte le sezioni del sito, in modo semplice.</p>
          <div className="mt-5 space-y-3">
            {mainLinks.map(item => menuLink(item.href, item.label))}
            <button type="button" onClick={() => setActivitiesOpen(v => !v)} aria-expanded={activitiesOpen} className="flex min-h-[55px] w-full items-center justify-between rounded-xl border border-[#DFE5DA] bg-white px-4 text-[17px] font-semibold text-[#193024]">
              Attività <ChevronDown className={`h-5 w-5 text-[#2D5016] transition-transform ${activitiesOpen ? "rotate-180" : ""}`} />
            </button>
            {activitiesOpen && <div className="ml-3 space-y-2">{activityLinks.map(item => menuLink(item.href, item.label))}</div>}
            <Link href={user ? "/dashboard" : "/auth"} onClick={() => setOpen(false)} className="mt-5 block rounded-xl bg-[#DDE6D3] p-4 text-[#193219]">
              <span className="block text-[18px] font-bold">Area riservata ai soci</span>
              <span className="mt-1 block text-[15px] text-[#617062]">{user ? "Consulta il tuo account." : "Accedi oppure richiedi un account."}</span>
              <span className="mt-2 flex min-h-11 items-center gap-2 text-[15px] font-bold">Vai all'Area Soci <ArrowRight className="h-4 w-4" /></span>
            </Link>
            {user?.role === "admin" && menuLink("/admin", "Amministrazione")}
            {user && <button type="button" onClick={() => { setOpen(false); void logoutMutation.mutateAsync(); }} className="flex min-h-12 items-center gap-2 px-3 text-[16px] font-semibold text-[#2D5016]"><LogOut className="h-5 w-5" /> Esci dall'account</button>}
          </div>
        </div>
      )}
    </>
  );
}

export function MobileBottomNav() {
  const [location] = useLocation();
  const items = [
    { href: "/", text: "Home", icon: BookOpen },
    { href: "/news", text: "Notizie", icon: Newspaper },
    { href: "/eventi", text: "Eventi", icon: CalendarDays },
    { href: "/auth", text: "Area Soci", icon: Users },
  ];
  return (
    <nav aria-label="Accessi rapidi per smartphone" className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DFE5DA] bg-white/95 shadow-[0_-6px_18px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:hidden">
      <div className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ href, text, icon: Icon }) => {
          const active = href === "/" ? location === "/" : location.startsWith(href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-[65px] flex-col items-center justify-center gap-1 text-[12px] font-semibold ${active ? "text-[#2D5016]" : "text-[#617062]"}`}><Icon className="h-5 w-5" aria-hidden="true" />{text}</Link>;
        })}
      </div>
    </nav>
  );
}

export function MobileFooter() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setNotice(""); setSending(true);
    try {
      await apiRequest("POST", "/api/newsletter", { email: email.trim() });
      setNotice("Indirizzo ricevuto correttamente.");
      setEmail("");
    } catch {
      toast({ title: "Iscrizione non riuscita", description: "Riprova più tardi.", variant: "destructive" });
    } finally { setSending(false); }
  };
  return (
    <>
      <footer className="mt-auto border-t border-[#DFE5DA] bg-white px-5 py-7 text-[#193024] sm:px-7">
        <div className="mx-auto max-w-5xl">
          <p className="font-serif text-xl font-bold">Enalcaccia Treviso</p>
          <p className="mt-1 text-sm text-[#617062]">Sezione provinciale · Caccia, pesca, tiro e cinofilia.</p>
          <div className="mt-5">
            <h2 className="font-semibold">Iscriviti alla newsletter</h2>
            <form className="mt-2 flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
              <label htmlFor="ec-newsletter" className="sr-only">Indirizzo email per la newsletter</label>
              <input id="ec-newsletter" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="La tua email" className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#DFE5DA] bg-white px-4 text-base" />
              <button type="submit" disabled={sending} className="min-h-12 rounded-xl bg-[#2D5016] px-5 text-base font-semibold text-white disabled:opacity-50">{sending ? "Invio…" : "Iscriviti"}</button>
            </form>
            {notice && <p role="status" className="mt-2 text-sm text-[#2D5016]">{notice}</p>}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#617062]">
            <Link href="/contact">Contatti</Link><Link href="/privacy-policy">Privacy</Link><Link href="/cookie-policy">Cookie</Link>
          </div>
          <p className="mt-4 text-xs text-[#617062]">© 2026 ENAL Caccia · Sezione provinciale di Treviso</p>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}

export function MobileExperience({ path }: { path: string }) {
  if (path === "/") return <MobileHome />;
  if (path === "/news") return <MobileNews />;
  if (path.startsWith("/news/")) return <MobileArticle slug={decodeURIComponent(path.slice(6))} />;
  if (path === "/eventi") return <MobileEvents />;
  if (path === "/membership") return <MobileMembership />;
  return null;
}

export function hasMobileExperience(path: string) {
  return path === "/" || path === "/news" || path.startsWith("/news/") || path === "/eventi" || path === "/membership";
}
