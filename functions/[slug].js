export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  // Pobieramy ostatni element ścieżki jako slug
  const slug = pathSegments[pathSegments.length - 1];

  // Jeśli jesteśmy na głównej stronie galerii
  if (!slug || slug === "free-coloring") {
    const newUrl = new URL(context.request.url);
    newUrl.pathname = "/free-coloring/index.html";
    return context.env.ASSETS.fetch(newUrl);
  }

  // Dla każdego innego adresu w tej podścieżce serwujemy slug.html
  // System ASSETS Cloudflare Pages pobierze fizyczny plik /free-coloring/slug.html
  const rewriteUrl = new URL(context.request.url);
  rewriteUrl.pathname = "/free-coloring/slug.html";

  return context.env.ASSETS.fetch(rewriteUrl);
}