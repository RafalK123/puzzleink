export async function onRequest(context) {
  const slug = context.params.slug;

  // Jeśli slug jest pusty lub "free-coloring", zwracamy galerię
  if (!slug || slug.toLowerCase() === "free-coloring") {
    const url = new URL(context.request.url);
    url.pathname = "/free-coloring/index.html";
    return context.env.ASSETS.fetch(url.toString());
  }

  // W przeciwnym razie przekierowujemy do slug.html
  const url = new URL(context.request.url);
  url.pathname = "/free-coloring/slug.html";
  url.searchParams.set("file", slug);

  const newRequest = new Request(url.toString(), context.request);

  return context.env.ASSETS.fetch(newRequest);
}