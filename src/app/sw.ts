import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { BACKEND_URL } from "./common/const";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
});

self.addEventListener("push", function (event) {
    console.log("[Service Worker] Push Received.");
    console.log(`[Service Worker] Push had this data: "${event}"`);
    console.log(`[Service Worker] Push had this data: "${event.data?.text()}"`);

    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || "Checking in on you!",
            icon: data.icon || "/poop.png",
            badge: data.badge || "/poop-small.png",
            vibrate: data.vibrate || [100, 50, 100],
            tag: data.tag || "default",
            silent: data.silent || false,
            data: {
                url: data.url || "https://shithub.xyz",
                dateOfArrival: Date.now(),
                pushKey: data.pushKey || "default",
            },
        };
        event.waitUntil(
            self.registration.showNotification(
                data.title || "ShitHub",
                options,
            ),
        );
        event.waitUntil(fetch(`${BACKEND_URL}/webpush/received`, {
            method: "post",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                pushKey: data.pushKey || "default",
                receivedAt: Date.now(),
            }),
        }));
    }
});

self.addEventListener("notificationclick", function (event) {
    console.log("[Service Worker] Notification click Received.");
    event.notification.close();
    event.waitUntil(this.clients.openWindow(event.notification.data.url));
    event.waitUntil(fetch(`${BACKEND_URL}/webpush/opened`, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            pushKey: event.notification.data.pushKey || "default",
            openedAt: Date.now(),
        }),
    }));
});

self.addEventListener("pushsubscriptionchange", (event: any) => {
    const subscription = self.registration.pushManager
        .subscribe(event.oldSubscription.options)
        .then((subscription) =>
            fetch(`${BACKEND_URL}/webpush/update`, {
                method: "post",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    oldEndpoint: event.oldSubscription.endpoint,
                    subscription: subscription.toJSON(),
                }),
            })
        );
    event.waitUntil(subscription);
});

serwist.addEventListeners();
