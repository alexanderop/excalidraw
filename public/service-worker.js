// Since we migrated to Vite, the service worker strategy changed, in CRA it was a custom service worker named service-worker.js and in Vite its sw.js handled by vite-plugin-pwa
// Due to this the existing CRA users were not able to migrate to Vite or any new changes post Vite unless browser is hard refreshed
// Hence adding a self destroying worker so all CRA service workers are destroyed and migrated to Vite
// We should remove this code after sometime when we are confident that
// all users have migrated to Vite

self.addEventListener("install", () => {
  globalThis.skipWaiting();
});

self.addEventListener("activate", () => {
  globalThis.registration
    .unregister()
    .then(() => {
      return globalThis.clients.matchAll();
    })
    .then((clients) => {
      for (const client of clients) client.navigate(client.url);
    });
});
