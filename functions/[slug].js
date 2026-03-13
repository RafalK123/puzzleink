export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;

  // Sprawdzenie czy ścieżka pasuje do /free-coloring/<slug>
  const slugMatch = path.match(/^\/free-coloring\/([^\/]+)\/?$/);

  if (!slugMatch) {
    // jeśli to nie slug, zwróć galerię
    const url = new URL(context.request.url);
    url.pathname = "/free-coloring/index.html";
    return context.env.ASSETS.fetch(url.toString());
  }

  const slug = slugMatch[1];

  const url = new URL(context.request.url);
  url.pathname = "/free-coloring/slug.html";
  url.searchParams.set("file", slug);

  const newRequest = new Request(url.toString(), context.request);

  return context.env.ASSETS.fetch(newRequest);
}