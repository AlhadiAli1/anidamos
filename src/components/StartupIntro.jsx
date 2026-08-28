import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./StartupIntro.css";

export default function StartupIntro() {
  const introRef = useRef(null);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

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
  }, []);

  useEffect(() => {
    const intro = introRef.current;
    const video = videoRef.current;
    if (!intro || !video) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        scrollToHero();
      }, 900);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && videoReady) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.6 });

    observer.observe(intro);
    return () => observer.disconnect();
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
    scrollToHero();
  };

  return (
    <section className={`startup-intro${videoReady ? " video-ready" : ""}`} id="intro" ref={introRef} aria-label="Zinger Mozzarella introduction">
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