import { useState, useEffect, useRef } from 'react';
import { Quote, Star } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import SectionHeader from './ui/SectionHeader';

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  position?: string;
  organization: string;
  content: string;
  rating: number;
  image?: string;
  published?: boolean;
}

interface TestimonialsSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  scrollSeconds?: number;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Isatou Touray',
    role: 'Minister',
    organization: 'Ministry of Health',
    content: 'The BICC provided exceptional service for our regional health summit. The facilities were world-class and the staff was incredibly professional.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ambassador John Smith',
    role: 'Diplomatic Envoy',
    organization: 'United Nations',
    content: 'An outstanding venue that rivals the best conference centers in the world. The Sir Dawda Kairaba Jawara Hall is truly magnificent.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Fatou Jallow',
    role: 'CEO',
    organization: 'West African Development Bank',
    content: 'We have hosted multiple events at BICC. The attention to detail and commitment to excellence is unmatched in the sub-region.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Hon. Mamadou Tangara',
    role: 'Minister',
    organization: 'Ministry of Foreign Affairs',
    content: 'BICC has elevated The Gambia\'s profile as a host for international diplomacy and large-scale conferences.',
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="elegant-card p-6 sm:p-8 relative h-full bg-stone-50/50 w-[300px] sm:w-[340px] shrink-0">
      <Quote className="absolute top-5 right-5 text-bicc-primary/15" size={40} />
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-bicc-gold text-bicc-gold" />
        ))}
      </div>
      <p className="text-slate-600 mb-6 leading-relaxed relative z-10 italic text-sm sm:text-base line-clamp-5">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-bicc-gold/30"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-bicc-primary flex items-center justify-center text-white font-bold text-sm">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-display font-semibold text-slate-900 text-sm truncate">{testimonial.name}</div>
          <div className="text-xs text-slate-500 truncate">
            {testimonial.role || testimonial.position || 'Guest'}, {testimonial.organization}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({
  eyebrow = 'Client Testimonials',
  title = 'What Our Clients Say',
  description = 'Hear from organizations and dignitaries who have experienced excellence at BICC.',
  scrollSeconds = 40,
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Testimonial[];
        const published = data.filter((item) => item.published !== false);
        if (published.length > 0) setTestimonials(published);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const loopItems = testimonials.length < 3
    ? [...testimonials, ...testimonials, ...testimonials]
    : [...testimonials, ...testimonials];

  useEffect(() => {
    if (loading || loopItems.length === 0) return;

    let frameId = 0;
    let lastTime = performance.now();
    const speed = 50 / Math.max(scrollSeconds, 10);

    const tick = (now: number) => {
      const track = trackRef.current;
      if (track && !paused) {
        const delta = (now - lastTime) / 1000;
        offsetRef.current -= speed * delta * 60;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(offsetRef.current) >= halfWidth) {
          offsetRef.current = 0;
        }
        track.style.transform = `translateX(${offsetRef.current}px)`;
      }
      lastTime = now;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [loading, loopItems.length, paused, scrollSeconds]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4" />
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="overflow-hidden py-2">
          <div ref={trackRef} className="flex gap-5 sm:gap-6 w-max will-change-transform">
            {loopItems.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
