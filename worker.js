// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    console.log("[DEBUG] Request path:", JSON.stringify(url.pathname));
    console.log("[DEBUG] Request method:", request.method);

    if (url.pathname === "/api/getMangaboxViewer") {
      // ... resto do código
    } else {
      return new Response("Route not found: " + url.pathname, { status: 404 });
    }
  }
};
