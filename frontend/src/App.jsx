import { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PixelCityBackground from './components/PixelCityBackground';
import PredictionForm from './components/PredictionForm';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

export default function App() {
  const predictRef = useRef(null);
  const aboutRef = useRef(null);
  const homeRef = useRef(null);

  const scrollTo = (section) => {
    const map = { home: homeRef, predict: predictRef, about: aboutRef };
    map[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar onNavigate={scrollTo} />
      <div ref={homeRef}>
        <PixelCityBackground>
          <Hero onStart={() => scrollTo('predict')} />
        </PixelCityBackground>
      </div>
      <div ref={predictRef}>
        <PredictionForm />
      </div>
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <Footer />
    </>
  );
}
