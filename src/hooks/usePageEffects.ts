import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Per-navigation DOM work: scroll to the top (or to #hash), then fade in
 * every `.reveal` element as it enters the viewport.
 */
export function usePageEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watched = new WeakSet<Element>();
    const watchNew = () =>
      pending().forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        observer.observe(el);
      });
    watchNew();
    // Content can appear after this runs (a step change, late data, a live reload in dev).
    // Without this, a .reveal added later would stay invisible forever.
    let frame = 0;
    const mutations = new MutationObserver(() => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          watchNew();
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);
}
