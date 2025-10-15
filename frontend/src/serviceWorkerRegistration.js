// src/serviceWorkerRegistration.js

// This function is used to register the service worker
export function register() {
  if (process.env.NODE_ENV === "production") {
    const publicUrl = new URL(window.location);
    if (publicUrl.hostname === "localhost") {
      return;
    }

    // Register the service worker to enable PWA features
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Error during service worker registration:", error);
      });
  }
}

// Optionally, you can add an unregister function to handle service worker updates
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Error during service worker unregistration:", error);
      });
  }
}
