/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

// import { clientsClaim } from "workbox-core";
// import { ExpirationPlugin } from "workbox-expiration";
// import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";
// import { StaleWhileRevalidate } from "workbox-strategies";

// declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "cache_sample";
const urlsToCache = ["index.html", "offline.html"];
const version = "v0.0.1";

// clientsClaim();

//install sw at first time
//place to cache assets to speed up the loading time of web page
self.addEventListener("install", () => {
  console.log("sw install event");
  event.waitUntil(
    caches.open(version + CACHE_NAME).then((cache) => {
      console.log("opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

//Activate the sw after install
//Place where old caches are cleared
self.addEventListener("activate", () => {
  console.log("sw activate event");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.indexOf(version) !== 0;
          })
          .map(function (cachName) {
            return caches.delete(cachName);
          })
      )
    )
  );
});

//listen for requests
self.addEventListener("fetch", () => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
