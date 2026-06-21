import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import HeroBackgroundSlideshow from '../ui/HeroBackgroundSlideshow';

interface HomeHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  backgroundImage: string;
  backgroundImages?: string[];
  backgroundVideo?: string;
  videoPoster?: string;
  useVideo: boolean;
  slideIntervalSeconds?: number;
}

export default function HomeHero({
  badge,
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage,
  backgroundImages,
  backgroundVideo,
  videoPoster,
  useVideo,
  slideIntervalSeconds = 5,
}: HomeHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {useVideo && backgroundVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover motion-safe:animate-ken-burns"
            autoPlay
            muted
            loop
            playsInline
            poster={videoPoster || backgroundImage}
          >
            <source src={backgroundVideo} />
          </video>
        ) : (
          <HeroBackgroundSlideshow
            backgroundImage={backgroundImage}
            images={backgroundImages}
            intervalSeconds={slideIntervalSeconds}
            showIndicators
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/45 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-bicc-primary/25 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none bg-slate-900/20" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-40 pb-28">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 text-white/90 text-xs sm:text-sm font-medium backdrop-blur-md mb-8 motion-safe:animate-hero-fade motion-safe:[animation-delay:100ms] motion-safe:opacity-0">
          <Star size={14} className="text-bicc-gold shrink-0" />
          {badge}
        </div>

        <h1 className="font-display text-white leading-[1.05] mb-6">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] motion-safe:animate-hero-fade motion-safe:[animation-delay:200ms] motion-safe:opacity-0">
            {title}
          </span>
          <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bicc-gold-light italic motion-safe:animate-hero-fade motion-safe:[animation-delay:320ms] motion-safe:opacity-0">
            {subtitle}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-10 motion-safe:animate-hero-fade motion-safe:[animation-delay:440ms] motion-safe:opacity-0">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center motion-safe:animate-hero-fade motion-safe:[animation-delay:560ms] motion-safe:opacity-0">
          <Link to="/venues" className="btn-elegant-primary group">
            {primaryButton}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/booking" className="btn-elegant-outline">
            {secondaryButton}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/50 motion-safe:animate-float">
        <span className="text-[10px] tracking-[0.35em] uppercase font-medium">Discover</span>
        <div className="w-px h-12 bg-gradient-to-b from-bicc-gold/80 to-transparent rounded-full" />
      </div>
    </section>
  );
}
