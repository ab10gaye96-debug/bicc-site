import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  backgroundImage: string;
  children?: ReactNode;
  compact?: boolean;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden pt-20', compact ? 'pb-16 sm:pb-20' : 'pb-24 sm:pb-28')}>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center motion-safe:animate-ken-burns"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-bicc-primary/55 to-slate-950/85" />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic3VyZmljZUx1bWluYW5jZSIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxLjAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="motion-safe:animate-hero-fade motion-safe:[animation-delay:80ms] motion-safe:opacity-0">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-bicc-gold/80" aria-hidden />
            <span className="text-bicc-gold text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase">
              {eyebrow}
            </span>
            <span className="h-px w-10 bg-bicc-gold/80" aria-hidden />
          </div>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] motion-safe:animate-hero-fade motion-safe:[animation-delay:180ms] motion-safe:opacity-0">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed motion-safe:animate-hero-fade motion-safe:[animation-delay:280ms] motion-safe:opacity-0">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-8 motion-safe:animate-hero-fade motion-safe:[animation-delay:380ms] motion-safe:opacity-0">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
