import { useEffect } from "react";
import "./StartupIntro.css";

const ingredientLabels = [
  "Crispy Zinger",
  "Cheddar",
  "Jalapeno",
  "Special Sauce",
  "Mozzarella",
];

export default function StartupIntro({ duration = 4200, onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <section className="startup-intro" aria-label="Zinger Mozzarella introduction">
      <div className="startup-intro-smoke startup-intro-smoke-one" />
      <div className="startup-intro-smoke startup-intro-smoke-two" />
      <div className="startup-intro-light" />
      <div className="startup-intro-particles" aria-hidden="true" />

      <div className="startup-intro-stage">
        <div className="startup-intro-label startup-intro-label-top">Crispy. Bold. Squared.</div>
        <div className="startup-sandwich-shadow" />
        <div className="startup-sandwich" aria-hidden="true">
          <span className="sandwich-layer sandwich-bun-top" />
          <span className="sandwich-layer sandwich-tomato" />
          <span className="sandwich-layer sandwich-cheddar" />
          <span className="sandwich-layer sandwich-zinger" />
          <span className="sandwich-layer sandwich-mozzarella" />
          <span className="sandwich-layer sandwich-lettuce" />
          <span className="sandwich-layer sandwich-bun-bottom" />
        </div>

        <div className="startup-ingredients" aria-hidden="true">
          {ingredientLabels.map((label, index) => (
            <span className={`startup-ingredient ingredient-${index + 1}`} key={label}>{label}</span>
          ))}
        </div>

        <div className="startup-intro-title">
          <span>Zinger</span>
          <strong>Mozzarella</strong>
        </div>
      </div>
    </section>
  );
}