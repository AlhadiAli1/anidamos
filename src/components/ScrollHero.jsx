import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollHero.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Zinger burger ingredient stack, ordered BOTTOM -> TOP so later elements
 * paint over earlier ones (correct visual overlap at the seams).
 *
 * Each layer is a CSS placeholder (gradient/shape) sitting on a single
 * central vertical axis. `top`/`height` in ScrollHero.css control the
 * ASSEMBLED (resting) position — GSAP only ever animates `y` (translateY)
 * on top of that, so the ingredient never changes size or drifts sideways.
 *
 * `factor` = how far this layer travels relative to the other layers when
 * fully exploded (negative = up, positive = down, 0 = stays near center).
 * TO USE REAL PHOTOS: give a layer an `img` path (transparent PNG cutout,
 * e.g. "/images/hero-layers/bun-top.png") — nothing else needs to change.
 */
const BURGER_LAYERS = [
  { id: "bun-bottom", className: "layer-bun-bottom", factor: 0.75, rotate: 3, img: null },
  { id: "cheese", className: "layer-cheese", factor: 0.22, rotate: 0, img: null },
  { id: "chicken", className: "layer-chicken", factor: 0, rotate: 0, img: null },
  { id: "lettuce", className: "layer-lettuce", factor: -0.16, rotate: 0, img: null },
  { id: "sauce", className: "layer-sauce", factor: -0.35, rotate: 0, img: null },
  { id: "bun-top", className: "layer-bun-top", factor: -0.6, rotate: -3, img: null },
];

// Ambient background embers/dust — purely decorative, driven by the same
// scroll timeline (never autoplaying on their own).
const PARTICLE_COUNT = 18;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: Math.round((i * 137.5) % 100), // golden-angle spread = even-looking distribution
  size: 2 + ((i * 7) % 5),
  speed: 30 + ((i * 11) % 60), // px of parallax travel across the whole animation
  delay: (i % 6) * 0.12,
}));

// Base vertical travel distance (px) that layer `factor` values are
// multiplied against. Computed from viewport height so the fully exploded
// burger always stays inside the screen (and clear of the title copy
// band above it) on any phone size.
// ADJUST the clamp range below to make the explosion more/less dramatic.
function getExplodeUnit() {
  return gsap.utils.clamp(70, 130, window.innerHeight * 0.15);
}

export default function ScrollHero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const layerRefs = useRef({});
  const particleRefs = useRef([]);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    // This is a mobile-only set piece (9:16 phone composition). Desktop
    // keeps the existing <Hero/> section untouched — see the matching
    // `display: none` above 768px in ScrollHero.css.
    mm.add("(max-width: 768px)", () => {
      if (reduceMotion) {
        // Reduced-motion fallback: show the assembled burger, no scroll rig.
        gsap.set(Object.values(layerRefs.current), { y: 0, rotate: 0 });
        gsap.set(".scroll-hero-label, .scroll-hero-title, .scroll-hero-tagline", { opacity: 1, y: 0 });
        return undefined;
      }

      // --------------------------------------------------------------
      // ONE continuous timeline, scrubbed 1:1 by scroll position.
      // Every property below is tweened smoothly across the whole
      // scroll range — there are no discrete states or thresholds, so
      // every point in between is a real interpolated frame.
      // --------------------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%", // total scroll distance the explosion plays across
          scrub: 1, // slight cinematic smoothing, still tightly tied to the finger/wheel
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true, // recompute explode distances on resize/rotate
        },
      });

      // --- Intro copy fades in early and holds (continuous opacity tween,
      // not a visibility toggle) so it never "pops".
      tl.to(".scroll-hero-label", { opacity: 1, y: 0, ease: "none", duration: 0.12 }, 0)
        .to(".scroll-hero-particles", { opacity: 1, ease: "none", duration: 0.16 }, 0);

      // --- The explosion: each ingredient gets its OWN single tween that
      // spans the entire timeline, moving only on the Y axis (plus a hint
      // of rotation on the buns). Different `factor` values per layer are
      // what create the natural, non-uniform "physical" separation.
      // ADJUST getExplodeUnit() above to change how far apart layers end up.
      BURGER_LAYERS.forEach((layer) => {
        const el = layerRefs.current[layer.id];
        if (!el) return;
        tl.to(
          el,
          {
            y: () => layer.factor * getExplodeUnit(),
            rotate: layer.rotate || 0,
            ease: "none", // linear = perfectly 1:1 with scroll, no easing "catch-up" jumps
            duration: 1,
          },
          0
        );
      });

      // --- Title/tagline ride along the same continuous timeline,
      // settling in once the burger has started separating.
      tl.to(".scroll-hero-title", { opacity: 1, y: 0, ease: "none", duration: 0.3 }, 0.35)
        .to(".scroll-hero-tagline", { opacity: 1, y: 0, ease: "none", duration: 0.25 }, 0.55)
        .to(".scroll-hero-beam", { opacity: 1, ease: "none", duration: 0.4 }, 0.4);

      // --- Ambient parallax dust, same continuous-tween treatment.
      particleRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { y: -particles[i].speed, ease: "none", duration: 1 }, 0);
      });

      return () => tl.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="scroll-hero" id="scroll-hero" ref={sectionRef} aria-label="Andiamo's signature burger reveal">
      <div className="scroll-hero-stage" ref={stageRef}>
        <div className="scroll-hero-backdrop" aria-hidden="true" />
        <div className="scroll-hero-beam" aria-hidden="true" />
        <div className="scroll-hero-particles" aria-hidden="true">
          {particles.map((p, i) => (
            <span
              key={p.id}
              ref={(el) => (particleRefs.current[i] = el)}
              className="scroll-hero-particle"
              style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s` }}
            />
          ))}
        </div>

        <div className="scroll-hero-copy">
          <span className="scroll-hero-label">Andiamos Art</span>
          <h2 className="scroll-hero-title">
            <span>Zinger</span>
            <strong>Mozzarella</strong>
          </h2>
          <p className="scroll-hero-tagline">Crispy. Melted. Stacked to perfection.</p>
        </div>

        {/* Single central axis: every layer below is centered on this column
            and only ever moves vertically along it. */}
        <div className="scroll-hero-burger" aria-hidden="true">
          {BURGER_LAYERS.map((layer) =>
            layer.img ? (
              <img
                key={layer.id}
                ref={(el) => (layerRefs.current[layer.id] = el)}
                className={`burger-layer ${layer.className}`}
                src={layer.img}
                alt=""
              />
            ) : (
              <div
                key={layer.id}
                ref={(el) => (layerRefs.current[layer.id] = el)}
                className={`burger-layer ${layer.className}`}
              />
            )
          )}
          <div className="scroll-hero-shadow" />
        </div>
      </div>
    </section>
  );
}

