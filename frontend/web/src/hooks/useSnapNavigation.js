import { useEffect } from "react";

export default function useSnapNavigation() {
  useEffect(() => {
    const container = document.getElementById(
      "app-scroll-container"
    );
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll("[data-section]")
    );
    if (!sections.length) return;

    const getCurrentIndex = () => {
      const containerRect = container.getBoundingClientRect();
      const center =
        container.scrollTop + containerRect.height / 2;

      return sections.findIndex((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        return center >= top && center < bottom;
      });
    };

    const scrollToIndex = (index) => {
      sections[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    const onKeyDown = (e) => {
      // Ignore inputs & textareas
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const currentIndex = getCurrentIndex();
      if (currentIndex === -1) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(
          Math.min(currentIndex + 1, sections.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(Math.max(currentIndex - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, []);
}
