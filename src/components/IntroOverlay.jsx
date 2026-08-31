import { useEffect, useRef } from "react";
import { INTRO_ACTIVE, OPENING, CLOSING } from "../hooks/useIntroState";
import "./IntroOverlay.css";

const INTRO_VIDEO_SRC = "/app_intro.mp4";

/**
 * Full-screen cinematic intro overlay. A `fixed` layer on top of the whole
 * page — NOT a scroll section — so there is never a half-video / half-page
 * state. It is either fully shown (owning the viewport) or fully hidden.
 *
 * The row of onUnmount cleanup / class mapping is kept minimal: opacity &
 * scale transitions are driven by the CSS `.intro-overlay` base via the
 * `shown` flag.
 */
export default function IntroOverlay({ state, onExit }) {
  const videoRef = useRef(null);
  const openCountRef = useRef(0);
  const wasShownRef = useRef(state === INTRO_ACTIVE || state === OPENING);

  const shown = state === INTRO_ACTIVE || state === OPENING;

  // Bump the animation key each time the intro (re)opens so the copy
  // fades/zooms in fresh on every entry (initial load AND re-entry from top).
  if (shown && !wasShownRef.current) {
    openCountRef.current += 1;
  }
  wasShownRef.current = shown;

  // Drive the video purely from the state machine.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (state === INTRO_ACTIVE) {
      // Fully shown now: reset to the beginning and play.
      try { v.currentTime = 0; } catch { /* noop */ }
      v.playbackRate = 1;
      v.play().catch(() => {});
    } else if (state === CLOSING) {
      // Video is fading out — stop playback.
      try { v.pause(); } catch { /* noop */ }
    }
  }, [state]);

  const className = shown
    ? "intro-overlay intro-overlay--shown"
    : "intro-overlay intro-overlay--hidden";

  return (
    <div
      className={className}
      role="presentation"
      aria-hidden={!shown}
      onClick={() => {
        // Tap/trackpad-click anywhere on the active intro = skip to the site.
        if (shown) onExit();
      }}
    >
      <div className="intro-overlay__frame">
        <video
          ref={videoRef}
          className="intro-overlay__video"
          src={INTRO_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onEnded={onExit}
          onError={() => onExit()}
        />
      </div>
      <div className="intro-overlay__copy">
        <div className="intro-overlay__label">Andiamos Art</div>
        <div className="intro-overlay__title">
          <span>Zinger</span>
          <strong>Mozzarella</strong>
        </div>
      </div>
    </div>
  );
}
