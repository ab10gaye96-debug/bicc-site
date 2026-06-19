import { cn } from '../../utils/cn';
import ScrollReveal from '../motion/ScrollReveal';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div className={cn(centered ? 'text-center' : 'text-left', 'mb-12 sm:mb-16', className)}>
      <ScrollReveal animation="fade-up">
        <div className={cn('flex items-center gap-4 mb-4', centered && 'justify-center')}>
          <span className={cn('h-px w-12 sm:w-16', light ? 'bg-bicc-gold/70' : 'bg-bicc-gold')} aria-hidden />
          <span
            className={cn(
              'font-sans text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase',
              light ? 'text-bicc-gold' : 'text-bicc-primary',
            )}
          >
            {eyebrow}
          </span>
          <span className={cn('h-px w-12 sm:w-16', light ? 'bg-bicc-gold/70' : 'bg-bicc-gold')} aria-hidden />
        </div>
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={120}>
        <h2
          className={cn(
            'font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight',
            light ? 'text-white' : 'text-slate-900',
          )}
        >
          {title}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal animation="fade-up" delay={220}>
          <p
            className={cn(
              'mt-4 max-w-2xl text-base sm:text-lg leading-relaxed',
              centered && 'mx-auto',
              light ? 'text-white/75' : 'text-slate-600',
            )}
          >
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
