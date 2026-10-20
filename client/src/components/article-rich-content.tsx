import { createElement, Fragment, useMemo, type ReactNode } from "react";

/**
 * Rende gli articoli editoriali importati da WordPress senza eseguire HTML
 * arbitrario. Sono consentiti solo gli elementi e gli attributi necessari
 * a testo, gallerie fotografiche e collegamenti ai documenti.
 */
function safeUrl(value: string | null, allowEmail = false): string | null {
  if (!value) return null;
  const url = value.trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (allowEmail && /^mailto:/i.test(url)) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return null;
}

function childrenOf(node: Node, key: string): ReactNode[] {
  return Array.from(node.childNodes).map((child, i) => renderNode(child, key + "-" + i));
}

function renderNode(node: Node, key: string): ReactNode {
  if (node.nodeType === 3) return node.textContent || "";
  if (node.nodeType !== 1) return null;

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  if (["script", "style", "iframe", "object", "embed", "noscript", "svg", "form"].includes(tag)) {
    return null;
  }

  if (tag === "img") {
    const src = safeUrl(element.getAttribute("src"));
    if (!src) return null;
    return createElement("img", {
      key,
      src,
      alt: element.getAttribute("alt") || "Fotografia dell'articolo",
      loading: "lazy",
      decoding: "async",
      className: "block h-auto max-h-[640px] w-full rounded-lg object-contain",
    });
  }

  if (tag === "a") {
    const href = safeUrl(element.getAttribute("href"), true);
    const child = childrenOf(node, key);
    if (!href) return createElement(Fragment, { key }, ...child);
    return createElement("a", {
      key,
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "break-words font-medium text-forest underline underline-offset-2 hover:opacity-80",
    }, ...child);
  }

  if (tag === "br" || tag === "hr") {
    return createElement(tag, { key, ...(tag === "hr" ? { className: "my-8 border-border" } : {}) });
  }

  const children = childrenOf(node, key);
  const known: Record<string, string> = {
    p: "mb-5 leading-8",
    h2: "mb-4 mt-9 font-serif text-2xl font-bold text-foreground",
    h3: "mb-3 mt-8 font-serif text-xl font-bold text-foreground",
    h4: "mb-3 mt-6 font-semibold text-foreground",
    ul: "mb-6 list-disc space-y-2 pl-6 leading-8",
    ol: "mb-6 list-decimal space-y-2 pl-6 leading-8",
    li: "pl-1",
    blockquote: "my-6 border-l-4 border-forest/40 bg-muted/40 px-5 py-4 italic",
    strong: "font-semibold",
    b: "font-semibold",
    em: "italic",
    i: "italic",
    figure: "my-5",
    div: "",
    span: "",
  };
  if (tag === "figure" && element.classList.contains("wp-block-gallery")) {
    return createElement("div", { key, className: "my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" }, ...children);
  }
  if (tag === "div" && element.classList.contains("wp-block-file")) {
    return createElement("div", { key, className: "my-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-forest/20 bg-forest/5 p-4" }, ...children);
  }
  if (Object.prototype.hasOwnProperty.call(known, tag)) {
    return createElement(tag, { key, className: known[tag] }, ...children);
  }
  return createElement(Fragment, { key }, ...children);
}

export function ArticleRichContent({ content }: { content: string }) {
  const nodes = useMemo(() => {
    if (typeof document === "undefined") return [] as ReactNode[];
    if (!/<[a-z][\s\S]*>/i.test(content)) {
      return content.split(/\n{2,}/).map((paragraph, i) =>
        createElement("p", { key: i, className: "mb-5 whitespace-pre-line leading-8" }, paragraph),
      );
    }
    const doc = new DOMParser().parseFromString(content, "text/html");
    return childrenOf(doc.body, "article");
  }, [content]);

  return createElement("div", { className: "max-w-none text-foreground" }, ...nodes);
}
