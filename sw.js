// 決めること の service worker（2026-11-20）
// 母艦（Python jobs\push_send.py）から届いた Web プッシュを通知に出す。押すとアプリを開く。
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (err) { p = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(p.title || '決めること', {
    body: p.body || '', icon: 'icon-192.png', badge: 'icon-192.png', data: { url: p.url || './' }, tag: p.tag || undefined
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of cs) { if ('focus' in c) { try { c.navigate(url); } catch (err) { } return c.focus(); } }
    return self.clients.openWindow(url);
  })());
});
