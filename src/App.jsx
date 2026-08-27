import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Menu     from "./components/Menu";
import Offers   from "./components/Offers";
import Features from "./components/Features";
import Contact  from "./components/Contact";
import Footer   from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CartToast from "./components/CartToast";
import { CartProvider } from "./context/CartContext";
import StartupIntro from "./components/StartupIntro";
import { getRestaurantConfig } from "./data/restaurantConfig";
import { useEffect, useState } from "react";

const INTRO_VIDEO_SRC = "/app_intro.mp4";

function preloadConfiguredImages() {
  const { menu, offers } = getRestaurantConfig();
  const imageSources = new Set([
    ...Object.values(menu).flatMap((items) => items.map((item) => item.img)),
    ...offers.map((offer) => offer.img),
  ].filter(Boolean));

  imageSources.forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  });
}

export default function App() {
  const [introVideoLoaded, setIntroVideoLoaded] = useState(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const preload = () => preloadConfiguredImages();

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(preload, 600);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (introVideoLoaded) return undefined;

    const video = document.createElement("video");
    const finish = () => setIntroVideoLoaded(true);
    const timeout = window.setTimeout(finish, 3500);

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = INTRO_VIDEO_SRC;
    video.addEventListener("canplay", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
    video.load();

    return () => {
      window.clearTimeout(timeout);
      video.removeEventListener("canplay", finish);
      video.removeEventListener("error", finish);
    };
  }, [introVideoLoaded]);

  if (!introVideoLoaded) {
    return <div className="app-preloader" aria-label="Loading Andiamos experience" />;
  }

  return (
    <CartProvider>
      <Navbar />
      <StartupIntro />
      <Hero />
      <Menu />
      <Offers />
      <Features />
      <Contact />
      <Footer />
      <CartDrawer />
      <CartToast />
    </CartProvider>
  );
}
