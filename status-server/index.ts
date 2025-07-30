Bun.serve({
    routes: {
        // Static routes
        "/api/status": new Response("OK"),
        "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
    },
    fetch(req) {
        return new Response("Not Found", { status: 404 });
    },
});