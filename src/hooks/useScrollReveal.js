import { useEffect } from "react";

export function useScrollReveal(scopeRef, deps = []) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const elements = [...scope.querySelectorAll(".reveal-on-scroll")];

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.revealed = "true";
        element.classList.add("is-visible");
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = "true";
            entry.target.classList.add("is-visible");
          } else {
            entry.target.dataset.revealed = "false";
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px 8% 0px", threshold: 0.08 }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, deps);
}