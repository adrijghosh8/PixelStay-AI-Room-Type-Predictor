import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="pixel-heading footer__brand">PIXELSTAY</span>
        <p className="footer__text">Built with React, Vite, and a FastAPI backend.</p>
      </div>
    </footer>
  );
}
