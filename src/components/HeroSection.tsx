import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroBg from '@/assets/hero-bg.jpg';
import heroMedicalMachines from '@/assets/hero-medical-machines .jpg';
import heroHospitalBed from '@/assets/hero-hospital-bed.jpg';

const slides = [
  {
    badge: 'hero.subtitle',
    title: 'hero.title',
    description: 'hero.description',
    cta: 'hero.cta',
    secondary: 'hero.secondary',
    ctaLink: '/products',
    secondaryLink: '/about',
    overlay: 'from-navy-dark/95 via-navy/85 to-navy/60',
    image: heroBg,
  },
  {
    badge: 'hero.slide2Badge',
    title: 'hero.slide2Title',
    description: 'hero.slide2Description',
    cta: 'hero.slide2Cta',
    secondary: 'hero.secondary',
    ctaLink: '/certifications',
    secondaryLink: '/about',
    overlay: 'from-navy-dark/90 via-navy/80 to-transparent',
    image: heroMedicalMachines,
  },
  {
    badge: 'hero.slide3Badge',
    title: 'hero.slide3Title',
    description: 'hero.slide3Description',
    cta: 'hero.slide3Cta',
    secondary: 'hero.secondary',
    ctaLink: '/contact',
    secondaryLink: '/about',
    overlay: 'from-navy-dark/95 via-navy/75 to-navy/50',
    image: heroHospitalBed,
  },
];

const HeroSection = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background images — cross-fade between slides */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={`bg-${current}`}
            src={slides[current].image}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        {/* Overlay gradient */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`overlay-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-r ${slides[current].overlay}`}
          />
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-white/20 border border-white/40 rounded-full text-white text-sm font-medium mb-6">
                {t(slides[current].badge)}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6">
                {t(slides[current].title)}
              </h1>

              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-xl">
                {t(slides[current].description)}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={slides[current].ctaLink}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/85 transition-all shadow-gold"
                >
                  {t(slides[current].cta)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={slides[current].secondaryLink}
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary-foreground/30 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-all"
                >
                  {t(slides[current].secondary)}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent(prev => (prev + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
    </section>
  );
};

export default HeroSection;
