// src/service-worker.js
import { openDB } from "idb"; // Import openDB from the idb library

import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache images and scripts
registerRoute(
  ({ request }) =>
    request.destination === "image" || request.destination === "script",
  new CacheFirst()
);

// Cache the main HTML file
registerRoute(
  ({ request }) => request.destination === "document",
  createHandlerBoundToURL("/index.html")
);

// Sync notes when the app is back online
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-notes") {
    event.waitUntil(syncNotes());
  }
});

async function syncNotes() {
  const notes = await getNotesFromIndexedDB(); // You will need to implement this function
  if (navigator.onLine) {
    await fetch("/api/sync-notes", {
      method: "POST",
      body: JSON.stringify(notes),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

async function getNotesFromIndexedDB() {
  const db = await openDB("notesDB", 1);
  return db.getAll("notes");
}
/* eslint-disable no-restricted-globals */
self.addEventListener("install", (event) => {
  // Your code...
});

self.addEventListener("activate", (event) => {
  // Your code...
});
/* eslint-enable no-restricted-globals */
