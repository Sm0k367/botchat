/**
 * TSL: CHRONOS-COGNITIVE ACCELERATOR vΩ.∞
 * Project: botchat (GitHub Pages Optimization)
 * Manifested by Codesynth Engineers & KeyMaster Ops
 * Objective: Enable SharedArrayBuffer for Zero-Key Local Inference
 */

if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 0) return response;

                    const newHeaders = new Headers(response.headers);
                    // AXIOMATIC SECURITY INJECTION: Unlocking high-speed memory
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error("COI_ACCELERATOR_DISRUPTION:", e))
        );
    });
} else {
    // Logic to register the worker automatically when included via <script>
    const script = document.currentScript;
    if (script) {
        const swUrl = script.src;
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register(swUrl).then((registration) => {
                registration.addEventListener("updatefound", () => {
                    console.log("ACCELERATOR_SYNC: Updating Neural Core...");
                    location.reload();
                });
            });
        }
    }
}
