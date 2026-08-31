import { useEffect, useRef, useState } from "react";

export const INTRO_ACTIVE = "INTRO_ACTIVE";
export const MAIN_ACTIVE = "MAIN_ACTIVE";
export const OPENING = "OPENING";
export const CLOSING = "CLOSING";

// Reopening the intro from the top requires a DELIBERATE overscroll — a clear
// additional upward pull past the very top. A generous threshold plus an expiry
// means simply resting at the top (or a brief flick) never triggers the video.
const OVERSCROLL_THRESHOLD = 220; // accumulated px of ongoing upward gesture
const OVERSCROLL_EXPIRY_MS = 450; // reset accumulator if the gesture pauses
const TRANSITION_MS = 600; // must match the CSS transition duration

/**
 * Clean intro <-> main page state machine.
 *
 * INTRO_ACTIVE : full-screen video overlay owns the viewport, page scroll locked.
 * CLOSING      : video fades/scales out, page revealed with entrance animation.
 * MAIN_ACTIVE  : normal website, normal scrolling.
 * OPENING      : page fades out, video revealed -> plays again.
 *
 * Only ONE of INTRO / MAIN is ever visually active.
 */
export function useIntroState() {
  const [state, setState] = useState(INTRO_ACTIVE);
  const stateRef = useRef(INTRO_ACTIVE);
  const timersRef = useRef([]);

  const set = (next) => {
    stateRef.current = next;
    setState(next);
  };

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const after = (fn, ms) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
  };

  const openIntro = () => {
    if (stateRef.current === INTRO_ACTIVE || stateRef.current === OPENING) return;
    clearTimers();
    window.scrollTo(0, 0);
    set(OPENING);
    after(() => {
      if (stateRef.current === OPENING) set(INTRO_ACTIVE);
    }, TRANSITION_MS);
  };

  const closeIntro = () => {
    if (stateRef.current === INTRO_ACTIVE) {
      clearTimers();
      set(CLOSING);
      after(() => {
        if (stateRef.current === CLOSING) set(MAIN_ACTIVE);
      }, TRANSITION_MS);
    }
  };

  // Lock/unlock page scroll whenever the state changes.
  useEffect(() => {
    const isLocked = state === INTRO_ACTIVE || state === OPENING;

    if (isLocked && !document.body.dataset.introLocked) {
      const scrollY = window.scrollY;
      document.body.dataset.introLocked = "1";
      document.body.dataset.introTop = String(scrollY);
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else if (!isLocked && document.body.dataset.introLocked) {
      const top = Number(document.body.dataset.introTop || window.scrollY || 0);
      delete document.body.dataset.introLocked;
      delete document.body.dataset.introTop;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, top);
    }
  }, [state]);

  // Scroll / gesture handling driven by the current state.
  useEffect(() => {
    let touchStartY = 0;
    let touchCurrentY = 0;
    let overscrollAccum = 0;
    let overscrollArmed = false;

    const onWheel = (e) => {
      const s = stateRef.current;

      if ((s === INTRO_ACTIVE) && e.deltaY > 0) {
        e.preventDefault();
        closeIntro();
        return;
      }

      if (s === MAIN_ACTIVE && window.scrollY <= 0 && e.deltaY < 0) {
        overscrollAccum += Math.abs(e.deltaY);
        if (overscrollAccum >= OVERSCROLL_THRESHOLD) {
          overscrollAccum = 0;
          openIntro();
        }
      }
    };

    const onTouchStart = (e) => {
      const t = e.touches && e.touches[0];
      touchStartY = t ? t.clientY : 0;
      touchCurrentY = touchStartY;
      overscrollAccum = 0;
      overscrollArmed = stateRef.current === MAIN_ACTIVE && window.scrollY <= 0;
    };

    const onTouchMove = (e) => {
      const s = stateRef.current;
      const t = e.touches && e.touches[0];
      if (!t) return;

      if (s === INTRO_ACTIVE) {
        // Any touch drag on the intro = skip/exit (swipe down or any movement).
        e.preventDefault();
        closeIntro();
        return;
      }

      if (window.scrollY > 0) return;

      // At the top: accumulate upward finger movement as an overscroll gesture.
      const dy = touchCurrentY - t.clientY; // >0 = finger moving up
      if (dy > 0) {
        overscrollAccum += dy;
        if (overscrollArmed && overscrollAccum >= OVERSCROLL_THRESHOLD) {
          overscrollAccum = 0;
          overscrollArmed = false;
          openIntro();
        }
      } else {
        overscrollAccum = 0;
      }
      touchCurrentY = t.clientY;
    };

    const onKeyDown = (e) => {
      if (stateRef.current === MAIN_ACTIVE && window.scrollY <= 0 && e.key === "ArrowUp") {
        openIntro();
      } else if (stateRef.current === INTRO_ACTIVE && e.key === "ArrowDown") {
        closeIntro();
      }
    };

    const opts = { passive: false };
    window.addEventListener("wheel", onWheel, opts);
    window.addEventListener("touchstart", onTouchStart, opts);
    window.addEventListener("touchmove", onTouchMove, opts);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel, opts);
      window.removeEventListener("touchstart", onTouchStart, opts);
      window.removeEventListener("touchmove", onTouchMove, opts);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return { state, openIntro, closeIntro };
}
