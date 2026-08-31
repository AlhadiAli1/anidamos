import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./StartupIntro.css";

export default function StartupIntro() {
  const introRef = useRef(null);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const exitingRef = useRef(false);

  const scrollToHero = () => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    window.scrollTo({ top: Math.max(0, hero.offsetTop - 44), behavior: "smooth" });
  };

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    // Firmly lock the page so nothing can scroll while the intro plays.
    // Using `position: fixed` prevents ANY scroll movement until we unlock.
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = "0";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, []);

  // Fade the whole intro out, then collapse it (so it no longer leaves a big
  // empty scroll block above the main content) and reveal the main menu.
  const exitIntro = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    // Unlock the page only after the exit is done; restore fixed-position lock
    // removal and the previous scroll marker so nothing jumps mid-exit.
    window.setTimeout(() => {
      setCollapsed(true);
      unlockScroll();
      // Wait for the collapse to be committed/layout before scrolling so the
      // hero's new offset is used.
      window.requestAnimationFrame(scrollToHero);
    }, 600);
  };

  const lockScroll = () => {
    const scrollY = window.scrollY;
    document.body.dataset.introTop = String(scrollY);
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    const top = Number(document.body.dataset.introTop || 0);
    delete document.body.dataset.introTop;
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, top);
  };

  // Re-open the intro from the top: expand it back, scroll to top and replay.
  const openIntro = () => {
    exitingRef.current = false;
    setExiting(false);
    setCollapsed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    lockScroll();
    const v = videoRef.current;
    if (v) {
      v.playbackRate = 1.2;
      v.currentTime = 0;
      // Wait for seek to finish before playing to avoid race conditions.
      const onSeeked = () => {
        v.removeEventListener("seeked", onSeeked);
        v.play().catch(() => {});
      };
      v.addEventListener("seeked", onSeeked);
      // Fallback: if seeked never fires (already at 0), play after a tick.
      setTimeout(() => {
        v.removeEventListener("seeked", onSeeked);
        if (v.paused) v.play().catch(() => {});
      }, 120);
    }
  };

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setTimeout(() => {
      setCollapsed(true);
      window.requestAnimationFrame(scrollToHero);
    }, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      if (!exitingRef.current) {
        e.preventDefault();
        // Scrolling down while video plays = skip to end.
        if (e.deltaY > 0) {
          finishIntro();
        }
        return;
      }
    };

    let touchStartY = null;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (!exitingRef.current) {
        e.preventDefault();
        const y = e.touches[0]?.clientY;
        // Any swipe (up or down) while the video plays = skip to end.
        if (touchStartY !== null && y != null && Math.abs(y - touchStartY) > 40) {
          finishIntro();
        }
        return;
      }
      if (window.scrollY > 0) return;
    };
    const onTouchEnd = () => {
      touchStartY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoReady]);

  const handleVideoReady = () => {
    setVideoReady(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.2;
    }
    if (introRef.current?.getBoundingClientRect().top < window.innerHeight) {
      videoRef.current?.play().catch(() => {});
    }
  };

  const finishIntro = () => {
    exitIntro();
  };

  const sectionClass = [
    "startup-intro",
    videoReady ? "video-ready" : "",
    exiting ? "startup-intro--exiting" : "",
    collapsed ? "collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClass} id="intro" ref={introRef} aria-label="Zinger Mozzarella introduction">
      <div className="startup-intro-video-frame">
        <video
          className="startup-intro-video"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          playbackRate={1.2}
          onCanPlay={handleVideoReady}
          onEnded={finishIntro}
          preload="auto"
        >
          <source src="/app_intro.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="startup-intro-overlay" />
      <div className="startup-intro-smoke startup-intro-smoke-one" />
      <div className="startup-intro-smoke startup-intro-smoke-two" />
      <div className="startup-intro-light" />
      <div className="startup-intro-particles" aria-hidden="true" />

      <div className="startup-intro-stage">
        <div className="startup-intro-label startup-intro-label-top">Andiamos Art</div>
        <div className="startup-intro-title">
          <span>Zinger</span>
          <strong>Mozzarella</strong>
        </div>
      </div>
    </section>
  );
}
