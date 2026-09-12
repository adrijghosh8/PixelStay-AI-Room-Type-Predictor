import '../styles/hero.css';

export default function Hero({ onStart }) {
  return (
    <section className="hero" id="home">
      <div className="hero__content container">
        <p className="hero__eyebrow">Rooftop Terminal · NYC</p>
        <h1 className="hero__headline pixel-heading">
          FIND
          <br />
          YOUR STAY.
        </h1>
        <p className="hero__sub">
          Enter a listing's details and a trained model predicts whether
          it's an entire home, a private room, or a shared room.
        </p>
        <button className="hero__cta" onClick={onStart}>
          Start Prediction <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
