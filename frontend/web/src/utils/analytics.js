export const trackEvent = (event, payload = {}) => {
  if (window.gtag) {
    window.gtag("event", event, payload);
  }

  // fallback (optional)
  console.log("[Analytics]", event, payload);
};
