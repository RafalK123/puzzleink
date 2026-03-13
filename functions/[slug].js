export async function onRequest(context) {
  const slug = context.params.slug;

  if (!slug || slug.toLowerCase() === "free-coloring") {
    const url = new URL(context.request.url);
    url.pathname = "/free-coloring/index.html";
    return context.env.ASSETS.fetch(url.toString());
  }

  // fetch slug.html, ale bez ?file=slug
  const url = new URL(context.request.url);
  url.pathname = "/free-coloring/slug.html";

  const newRequest = new Request(url.toString(), context.request);

  return context.env.ASSETS.fetch(newRequest);
}