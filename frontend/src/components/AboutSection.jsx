import '../styles/about.css';

export default function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <p className="about__eyebrow pixel-heading">About</p>
        <div className="about__grid">
          <div>
            <h2 className="about__heading">The model</h2>
            <p>
              A random forest classifier trained on NYC Airbnb listing data predicts
              one of three room types: entire home/apartment, private room, or shared
              room. Numeric features are imputed and scaled; the borough and
              neighbourhood are one‑hot encoded before reaching the classifier.
            </p>
          </div>
          <div>
            <h2 className="about__heading">The stack</h2>
            <p>
              The backend is a FastAPI service that loads the trained pipeline and
              exposes a single <code>/predict</code> endpoint. This site is a React +
              Vite frontend that sends listing details to that endpoint and renders
              the returned room type and class probabilities — nothing is predicted
              client-side.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
