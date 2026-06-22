import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe2, Star, Calendar, MapPin, Award, Shield, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchEvents, fetchNews, fetchGallery } from '../api';
import { usePageContent } from '../hooks/usePageContent';
import { useApi } from '../hooks/useApi';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import TestimonialsSection from '../components/TestimonialsSection';
import PartnersSection from '../components/PartnersSection';
import NewsletterForm from '../components/NewsletterForm';
import HomeHero from '../components/home/HomeHero';
import ImageSlideshow from '../components/ui/ImageSlideshow';
import SectionHeader from '../components/ui/SectionHeader';
import ScrollReveal from '../components/motion/ScrollReveal';
import { useEffect, useRef, useState } from 'react';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ── Stats bar with intersection observer ─────────────────────────────────────
function StatsBar({ cmsStats }: { cmsStats?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { 
      icon: Users, 
      target: parseInt(cmsStats?.capacity?.value?.replace(/\D/g, '') || '4000'), 
      suffix: cmsStats?.capacity?.value?.replace(/\d/g, '') || '+', 
      label: cmsStats?.capacity?.label || 'Guest Capacity' 
    },
    { 
      icon: Building2, 
      target: parseInt(cmsStats?.spaces?.value?.replace(/\D/g, '') || '30'), 
      suffix: cmsStats?.spaces?.value?.replace(/\d/g, '') || '+', 
      label: cmsStats?.spaces?.label || 'Event Spaces' 
    },
    { 
      icon: Globe2, 
      target: parseInt(cmsStats?.events?.value?.replace(/\D/g, '') || '50'), 
      suffix: cmsStats?.events?.value?.replace(/\d/g, '') || '+', 
      label: cmsStats?.events?.label || 'International Events' 
    },
    { 
      icon: Award, 
      target: parseInt(cmsStats?.rating?.value?.replace(/\D/g, '') || '5'), 
      suffix: cmsStats?.rating?.value?.replace(/\d/g, '') || '-Star', 
      label: cmsStats?.rating?.label || 'Facility Rating' 
    },
  ];

  return (
    <section ref={ref} className="relative bg-gradient-to-r from-bicc-primary via-[#1a7394] to-bicc-primary border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <ScrollReveal key={i} delay={i * 100} animation="fade-up">
            <StatItem {...stat} animate={visible} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function StatItem({ icon: Icon, target, suffix, label, animate }: {
  icon: any; target: number; suffix: string; label: string; animate: boolean;
}) {
  const count = useCounter(target, 1800, animate);
  return (
    <div className="text-center">
      <Icon className="mx-auto text-bicc-gold mb-3" size={26} />
      <div className="font-display text-3xl sm:text-4xl font-semibold text-white">
        {animate ? count.toLocaleString() : '0'}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-white/70 mt-2 tracking-wide uppercase">{label}</div>
    </div>
  );
}

// ── Virtual Tour section — pulls from Gallery (Firestore), falls back to IMAGES ──
const FALLBACK_ROOMS = [
  { caption: 'Plenary Hall', category: 'Plenary Hall', url: IMAGES.conferenceHall },
  { caption: 'Banquet Hall', category: 'Banquet', url: IMAGES.banquetHall },
  { caption: 'Conference Exterior', category: 'Exterior', url: IMAGES.conferenceExterior },
  { caption: 'VVIP Lounge', category: 'VVIP Lounge', url: IMAGES.vvipLounge },
  { caption: 'Hospitality Area', category: 'Hospitality', url: IMAGES.hospitalityAlt },
  { caption: 'Control Room', category: 'Control Room', url: IMAGES.controlRoom },
];

// Categories that qualify as "tour" images — admin just tags gallery images with these
const TOUR_CATEGORIES = [
  'Plenary Hall', 'Banquet', 'Exterior', 'VVIP Lounge',
  'Hospitality', 'Control Room', 'Venue', 'Facility', 'Tour',
];

function VirtualTour() {
  const { data: galleryData } = useApi(() => fetchGallery(), []);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Use gallery images that match tour categories, fallback to hardcoded if none
  const tourImages = (() => {
    if (!galleryData || galleryData.length === 0) return FALLBACK_ROOMS;
    const filtered = galleryData.filter((img: any) =>
      img.category && TOUR_CATEGORIES.some(cat =>
        img.category.toLowerCase().includes(cat.toLowerCase())
      )
    );
    if (filtered.length === 0) return FALLBACK_ROOMS;
    return filtered.map((img: any) => ({
      url: img.url,
      caption: img.caption || img.category || 'BICC Facility',
      category: img.category || '',
    }));
  })();

  const total = tourImages.length;
  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, total]);

  // Reset active index if images change and index is out of range
  useEffect(() => {
    if (active >= total) setActive(0);
  }, [total]);

  const room = tourImages[active];
  if (!room) return null;

  return (
    <section className="py-20 sm:py-28 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Explore the Facility"
          title="Virtual Tour"
          description="Browse through the distinguished spaces of the Sir Dawda Kairaba Jawara International Conference Centre."
          light
        />

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* Main image */}
          <ScrollReveal animation="scale-in">
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer ring-1 ring-white/10" onClick={() => setLightbox(true)}>
            <img
              src={room.url}
              alt={room.caption}
              className="w-full aspect-[16/9] object-cover motion-safe:transition-transform motion-safe:duration-[1200ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-500">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-bicc-gold/40">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="text-bicc-gold text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                {active + 1} / {total}
              </p>
              <h3 className="font-display text-white text-lg sm:text-2xl">{room.caption}</h3>
              {room.category && room.category !== room.caption && (
                <p className="text-white/65 text-sm mt-1">{room.category}</p>
              )}
            </div>
          </div>
          </ScrollReveal>

          {/* Thumbnail strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:max-h-[480px] lg:overflow-y-auto lg:overflow-x-visible pr-0 lg:pr-1">
            {tourImages.map((r, i) => (
              <ScrollReveal key={i} delay={i * 60} animation="fade-up">
              <button
                onClick={() => setActive(i)}
                className={`relative rounded-xl overflow-hidden motion-safe:transition-all motion-safe:duration-500 shrink-0 w-28 sm:w-32 lg:w-auto ${
                  i === active ? 'ring-2 ring-bicc-gold scale-[1.02]' : 'opacity-55 hover:opacity-100'
                }`}
              >
                <img src={r.url} alt={r.caption} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 text-white text-xs font-semibold line-clamp-1">{r.caption}</p>
              </button>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal animation="fade-up" delay={200}>
        <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/gallery" className="btn-elegant-outline !text-white !border-white/25 !bg-white/5 mx-auto sm:mx-0">
            View Full Photo Gallery <ArrowRight size={16} />
          </Link>
        </div>
        </ScrollReveal>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            ✕
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-5xl w-full px-4 sm:px-16" onClick={e => e.stopPropagation()}>
            <img src={room.url} alt={room.caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <p className="text-white text-center font-bold mt-4 text-lg">{room.caption}</p>
            {room.category && room.category !== room.caption && (
              <p className="text-gray-400 text-center text-sm mt-1">{room.category}</p>
            )}
          </div>
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const { data: events } = useApi(() => fetchEvents(), []);
  const { data: news } = useApi(() => fetchNews(), []);
  const { data: cmsContent } = usePageContent('home');

  const displayEvents = (events || []).slice(0, 3);
  const displayNews = (news || []).slice(0, 3);

  // Default content values (fallbacks)
  const heroTitle = cmsContent?.hero?.title || 'Banjul International';
  const heroSubtitle = cmsContent?.hero?.subtitle || 'Convention Centre';
  const heroDescription = cmsContent?.hero?.description || 'Managing the Sir Dawda Kairaba Jawara International Conference Centre — a world-class facility where diplomacy, innovation, and culture converge on the shores of the Atlantic.';
  const heroPrimaryButton = cmsContent?.hero?.primaryButton || 'Explore Our Venues';
  const heroSecondaryButton = cmsContent?.hero?.secondaryButton || 'Book an Event';
  const heroBadge = cmsContent?.hero?.badge || "The Gambia's Premier MICE Destination";
  const heroMediaType = cmsContent?.hero?.mediaType || 'image';
  const heroBackgroundImage = cmsContent?.hero?.backgroundImage || IMAGES.heroBg;
  const heroBackgroundImages = Array.isArray(cmsContent?.hero?.backgroundImages)
    ? cmsContent.hero.backgroundImages.filter(Boolean)
    : [];
  const heroSlideIntervalSeconds = Math.max(1, Number(cmsContent?.hero?.slideIntervalSeconds) || 5);
  const heroBackgroundVideo = cmsContent?.hero?.backgroundVideo || '';
  const heroVideoPoster = cmsContent?.hero?.videoPoster || heroBackgroundImage;
  const useHeroVideo = heroMediaType === 'video' && Boolean(heroBackgroundVideo);

  const rawAboutTitle = cmsContent?.about?.title || 'Where Excellence Meets';
  const aboutHighlightText = cmsContent?.about?.highlightText || (!cmsContent?.about?.title ? 'African Hospitality' : '');
  const aboutTitlePrefix = aboutHighlightText && rawAboutTitle.endsWith(aboutHighlightText)
    ? rawAboutTitle.slice(0, rawAboutTitle.lastIndexOf(aboutHighlightText)).trim()
    : rawAboutTitle;
  const aboutEyebrow = cmsContent?.about?.eyebrow || 'About BICC';
  const aboutParagraphs = [
    cmsContent?.about?.paragraph1 || "The Banjul International Convention Centre (BICC) is The Gambia's national premier event management institution, established by the Government of The Gambia to advance the country's Meetings, Incentives, Conferences and Exhibitions (MICE) industry.",
    cmsContent?.about?.paragraph2 || 'BICC manages the Sir Dawda Kairaba Jawara International Conference Center and the VVIP Lounge at the Banjul International Airport, delivering tailored event solutions for summits, conferences, and special events.',
    cmsContent?.about?.paragraph3 || '',
  ].filter(Boolean);
  const aboutValues = [
    { icon: Star, text: cmsContent?.about?.values?.value1 || 'Excellence' },
    { icon: Globe2, text: cmsContent?.about?.values?.value2 || 'Innovation' },
    { icon: Shield, text: cmsContent?.about?.values?.value3 || 'Integrity' },
    { icon: Award, text: cmsContent?.about?.values?.value4 || 'Sustainability' },
  ].filter((value) => value.text);
  const aboutImage = cmsContent?.about?.image || IMAGES.conferenceHall;
  const aboutImages = Array.isArray(cmsContent?.about?.images)
    ? cmsContent.about.images.filter(Boolean)
    : [];
  const aboutImageStatValue = cmsContent?.about?.imageStat?.value || '14,000';
  const aboutImageStatLabel = cmsContent?.about?.imageStat?.label || 'm² of Event Space';

  const venuesEyebrow = cmsContent?.venues?.eyebrow || 'Our Facilities';
  const venuesTitle = cmsContent?.venues?.title || 'World-Class Event Spaces';
  const venuesDescription = cmsContent?.venues?.description || 'From grand plenary halls to intimate bilateral rooms, our versatile venues cater to events of every scale.';
  const venuesButtonText = cmsContent?.venues?.buttonText || 'View All Venues';
  const venueCards = [
    cmsContent?.venues?.cards?.card1 || { name: 'Plenary Hall', capacity: '1,013 seats', image: IMAGES.conferenceHall, description: 'Our flagship UN General Assembly-style conference hall' },
    cmsContent?.venues?.cards?.card2 || { name: 'Banquet Halls', capacity: '500 guests', image: IMAGES.banquetHall, description: 'Elegant spaces for galas, dinners, and ceremonies' },
    cmsContent?.venues?.cards?.card3 || { name: 'VVIP Airport Lounge', capacity: 'Exclusive', image: IMAGES.vvipLounge, description: 'Ultra-modern arrival experience at Banjul Airport' },
  ].map((card, index) => ({
    ...card,
    image: card?.image || [IMAGES.conferenceHall, IMAGES.banquetHall, IMAGES.vvipLounge][index],
    images: Array.isArray(card?.images) ? card.images.filter(Boolean) : [],
  }));

  const ctaTitle = cmsContent?.cta?.title || 'Ready to Host Your Next Event?';
  const ctaDescription = cmsContent?.cta?.description || "Let BICC deliver a world-class experience. From conferences to galas, we provide comprehensive event management that reflects excellence, innovation, and The Gambia's legendary hospitality.";
  const ctaButtonText = cmsContent?.cta?.buttonText || 'Book an Event';
  const ctaBackgroundImage = cmsContent?.cta?.backgroundImage || IMAGES.banquetHall;

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="BICC — Banjul International Convention Centre"
        description="The Gambia's premier MICE destination. World-class venues for conferences, summits, banquets, and events at the Sir Dawda Kairaba Jawara International Conference Centre."
      />

      <HomeHero
        badge={heroBadge}
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        primaryButton={heroPrimaryButton}
        secondaryButton={heroSecondaryButton}
        backgroundImage={heroBackgroundImage}
        backgroundImages={heroBackgroundImages}
        backgroundVideo={heroBackgroundVideo}
        videoPoster={heroVideoPoster}
        useVideo={useHeroVideo}
        slideIntervalSeconds={heroSlideIntervalSeconds}
      />

      <StatsBar cmsStats={cmsContent?.stats} />

      {/* About Preview */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionHeader
                eyebrow={aboutEyebrow}
                title={`${aboutTitlePrefix}${aboutHighlightText ? ` ${aboutHighlightText}` : ''}`}
                align="left"
                className="mb-8 sm:mb-10"
              />
              {aboutParagraphs.map((paragraph, index) => (
                <ScrollReveal key={index} delay={index * 100} animation="fade-up">
                  <p className={`text-slate-600 leading-relaxed text-base sm:text-lg ${index === aboutParagraphs.length - 1 ? 'mb-8' : 'mb-5'}`}>
                    {paragraph}
                  </p>
                </ScrollReveal>
              ))}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                {aboutValues.map((v, i) => (
                  <ScrollReveal key={i} delay={i * 80} animation="fade-up">
                    <div className="flex items-center gap-3 bg-bicc-primary-light/60 rounded-xl p-3 sm:p-4 border border-bicc-primary/10">
                      <v.icon size={18} className="text-bicc-primary shrink-0" />
                      <span className="font-medium text-slate-800 text-sm">{v.text}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <ScrollReveal animation="fade-up" delay={200}>
                <Link to="/about" className="inline-flex items-center gap-2 text-bicc-primary font-semibold hover:text-bicc-primary-dark motion-safe:transition-colors group">
                  Learn More About Us
                  <ArrowRight size={18} className="motion-safe:transition-transform group-hover:translate-x-1" />
                </Link>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade-right" delay={150}>
              <div className="relative mt-8 lg:mt-0 photo-frame">
                <ImageSlideshow
                  src={aboutImage}
                  images={aboutImages}
                  alt="Conference Centre"
                  intervalSeconds={4.5}
                  showIndicators={aboutImages.length > 0}
                  containerClassName="relative overflow-hidden rounded-2xl shadow-2xl w-full aspect-[4/3]"
                  imageClassName="w-full h-full object-cover motion-safe:animate-image-reveal"
                />
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-gradient-to-br from-bicc-primary to-bicc-primary-dark text-white rounded-xl p-4 sm:p-6 shadow-xl border border-white/10">
                  <div className="font-display text-2xl sm:text-3xl font-semibold">{aboutImageStatValue}</div>
                  <div className="text-xs sm:text-sm text-white/80 mt-1">{aboutImageStatLabel}</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Venues Preview */}
      <section className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={venuesEyebrow} title={venuesTitle} description={venuesDescription} />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {venueCards.map((venue, i) => (
              <ScrollReveal key={i} delay={i * 120} animation="fade-up">
                <div className="group elegant-card h-full">
                  <div className="relative image-reveal-wrap">
                    <ImageSlideshow
                      src={venue.image}
                      images={venue.images}
                      alt={venue.name}
                      intervalSeconds={4.5}
                      showIndicators={venue.images.length > 0}
                      containerClassName="relative w-full aspect-[3/2] overflow-hidden"
                      imageClassName="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-bicc-primary text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide">
                      {venue.capacity}
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="font-display text-xl sm:text-2xl text-slate-900 mb-2">{venue.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{venue.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal animation="fade-up" delay={200} className="text-center mt-12">
            <Link to="/venues" className="btn-elegant-secondary">
              {venuesButtonText} <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <VirtualTour />

      {/* Upcoming Events */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="What's Coming" title="Upcoming Events" />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {displayEvents.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 100} animation="fade-up">
                <div className="group elegant-card h-full">
                  <div className="image-reveal-wrap">
                    <img src={event.image} alt={event.title} className="w-full aspect-[2/1] object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-bicc-primary font-medium mb-3">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="font-display text-lg text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <MapPin size={14} /><span className="line-clamp-1">{event.location}</span>
                    </div>
                    <span className="inline-block bg-bicc-primary-light text-bicc-primary text-xs font-semibold px-3 py-1 rounded-full">{event.category}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal animation="fade-up" className="text-center mt-12">
            <Link to="/events" className="btn-elegant-ghost">
              View All Events <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Stay Updated" title="Latest News" />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {displayNews.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 100} animation="fade-up">
                <div className="group elegant-card h-full">
                  <div className="image-reveal-wrap">
                    <img src={item.image} alt={item.title} className="w-full aspect-[2/1] object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-slate-400 mb-2 tracking-wide uppercase">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="font-display text-lg text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{item.excerpt}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal animation="fade-up" className="text-center mt-12">
            <Link to="/news" className="btn-elegant-secondary">
              All News <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <TestimonialsSection
        eyebrow={cmsContent?.testimonials?.eyebrow}
        title={cmsContent?.testimonials?.title}
        description={cmsContent?.testimonials?.description}
        scrollSeconds={Math.max(10, Number(cmsContent?.testimonials?.scrollSeconds) || 40)}
      />
      <PartnersSection
        eyebrow={cmsContent?.partners?.eyebrow}
        title={cmsContent?.partners?.title}
        description={cmsContent?.partners?.description}
        ctaText={cmsContent?.partners?.ctaText}
      />
      <NewsletterForm />

      {/* CTA */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center motion-safe:animate-ken-burns"
          style={{ backgroundImage: `url(${ctaBackgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bicc-primary/90 via-bicc-primary/80 to-slate-950/85" />
        <ScrollReveal animation="fade-up" className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-bicc-gold/70" />
            <span className="text-bicc-gold text-xs font-semibold tracking-[0.28em] uppercase">Host With Us</span>
            <span className="h-px w-12 bg-bicc-gold/70" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">{ctaTitle}</h2>
          <p className="text-white/80 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">{ctaDescription}</p>
          <Link to="/booking" className="btn-elegant-primary mx-auto">
            {ctaButtonText} <ArrowRight size={20} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
