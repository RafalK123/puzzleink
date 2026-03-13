export async function onRequest(context) {

  const slug = context.params.slug;

  const url = new URL(context.request.url);
  url.pathname = "/free-coloring/slug.html";
  url.searchParams.set("file", slug);

  const newRequest = new Request(url.toString(), context.request);

  return context.env.ASSETS.fetch(newRequest);

}