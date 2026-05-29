export const trackEvent = (event, payload = {}) => {
  if (window.gtag) {
    window.gtag("event", event, payload);
  }

  if (import.meta.env.DEV) {
    console.log("[Analytics]", event, payload);
  }
};
