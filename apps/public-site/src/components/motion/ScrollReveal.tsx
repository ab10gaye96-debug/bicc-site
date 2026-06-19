import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useScrollReveal } from '../../hooks/useScrollReveal';

type RevealAnimation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: RevealAnimation;
  as?: keyof JSX.IntrinsicElements;
}

const hiddenClasses: Record<RevealAnimation, string> = {
  'fade-up': 'opacity-0 translate-y-10',
  'fade-down': 'opacity-0 -translate-y-10',
  'fade-left': 'opacity-0 -translate-x-10',
  'fade-right': 'opacity-0 translate-x-10',
  'scale-in': 'opacity-0 scale-[0.96]',
  fade: 'opacity-0',
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  animation = 'fade-up',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      className={cn(
        'motion-safe:transition-all motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : hiddenClasses[animation],
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
