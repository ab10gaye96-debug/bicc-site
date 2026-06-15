import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe2, Star, Calendar, MapPin, Award, Shield, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchEvents, fetchNews, fetchGallery, fetchHomeContent } from '../api';
import { useApi } from '../hooks/useApi';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import TestimonialsSection from '../components/TestimonialsSection';
import PartnersSection from '../components/PartnersSection';
import NewsletterForm from '../components/NewsletterForm';
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
    <section ref={ref} className="bg-[#1F85A8] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <StatItem key={i} {...stat} animate={visible} />
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
      <Icon className="mx-auto text-white mb-2" size={28} />
      <div className="text-2xl sm:text-3xl font-bold text-white">
        {animate ? count.toLocaleString() : '0'}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
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
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">Explore the Facility</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Virtual Tour</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Browse through the spaces of the Sir Dawda Kairaba Jawara International Conference Centre.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* Main image */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setLightbox(true)}>
            <img
              src={room.url}
              alt={room.caption}
              className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
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
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
                {active + 1} / {total}
              </p>
              <h3 className="text-white text-base sm:text-xl font-bold">{room.caption}</h3>
              {room.category && room.category !== room.caption && (
                <p className="text-gray-300 text-sm mt-1">{room.category}</p>
              )}
            </div>
          </div>

          {/* Thumbnail strip — horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:max-h-[480px] lg:overflow-y-auto lg:overflow-x-visible pr-0 lg:pr-1">
            {tourImages.map((r, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative rounded-xl overflow-hidden transition-all shrink-0 w-28 sm:w-32 lg:w-auto ${
                  i === active ? 'ring-2 ring-blue-400 scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={r.url} alt={r.caption} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 text-white text-xs font-semibold line-clamp-1">{r.caption}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
            View Full Photo Gallery <ArrowRight size={16} />
          </Link>
          <p className="text-gray-500 text-xs self-center">
            Tour images are managed from the Admin → Gallery panel
          </p>
        </div>
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
  const [cmsContent, setCmsContent] = useState<any>(null);
  
  const displayEvents = (events || []).slice(0, 3);
  const displayNews = (news || []).slice(0, 3);

  // Fetch CMS content for home page
  useEffect(() => {
    fetchHomeContent().then(data => {
      if (data) setCmsContent(data);
    });
  }, []);

  // Default content values (fallbacks)
  const heroTitle = cmsContent?.hero?.title || 'Banjul International';
  const heroSubtitle = cmsContent?.hero?.subtitle || 'Convention Centre';
  const heroDescription = cmsContent?.hero?.description || 'Managing the Sir Dawda Kairaba Jawara International Conference Centre — a world-class facility where diplomacy, innovation, and culture converge on the shores of the Atlantic.';
  const heroPrimaryButton = cmsContent?.hero?.primaryButton || 'Explore Our Venues';
  const heroSecondaryButton = cmsContent?.hero?.secondaryButton || 'Book an Event';
  const heroBadge = cmsContent?.hero?.badge || "The Gambia's Premier MICE Destination";
  const heroMediaType = cmsContent?.hero?.mediaType || 'image';
  const heroBackgroundImage = cmsContent?.hero?.backgroundImage || IMAGES.heroBg;
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
  }));

  const ctaTitle = cmsContent?.cta?.title || 'Ready to Host Your Next Event?';
  const ctaDescription = cmsContent?.cta?.description || "Let BICC deliver a world-class experience. From conferences to galas, we provide comprehensive event management that reflects excellence, innovation, and The Gambia's legendary hospitality.";
  const ctaButtonText = cmsContent?.cta?.buttonText || 'Book an Event';
  const ctaBackgroundImage = cmsContent?.cta?.backgroundImage || IMAGES.banquetHall;

  return (
    <div>
      <SEO
        title="BICC — Banjul International Convention Centre"
        description="The Gambia's premier MICE destination. World-class venues for conferences, summits, banquets, and events at the Sir Dawda Kairaba Jawara International Conference Centre."
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {useHeroVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={heroVideoPoster}
          >
            <source src={heroBackgroundVideo} />
          </video>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBackgroundImage})` }} />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-8 backdrop-blur-sm">
            <Star size={14} />
            {heroBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {heroTitle}
            <span className="block text-blue-400">{heroSubtitle}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/venues" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/30">
              {heroPrimaryButton} <ArrowRight size={20} />
            </Link>
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
              {heroSecondaryButton}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>

      {/* Stats Bar — animated counters */}
      <StatsBar cmsStats={cmsContent?.stats} />

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">{aboutEyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3 mb-6">
                {aboutTitlePrefix}
                {aboutHighlightText && <span className="text-blue-700"> {aboutHighlightText}</span>}
              </h2>
              {aboutParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-gray-600 leading-relaxed ${index === aboutParagraphs.length - 1 ? 'mb-8' : 'mb-6'}`}
                >
                  {paragraph}
                </p>
              ))}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {aboutValues.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                    <v.icon size={20} className="text-blue-700" />
                    <span className="font-medium text-[#1F85A8]">{v.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition-colors">Learn More About Us <ArrowRight size={18} /></Link>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <img src={aboutImage} alt="Conference Centre" className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover" />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-xl">
                <div className="text-2xl sm:text-3xl font-bold">{aboutImageStatValue}</div>
                <div className="text-xs sm:text-sm font-medium">{aboutImageStatLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venues Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">{venuesEyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">{venuesTitle}</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">{venuesDescription}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {venueCards.map((venue, i) => (
              <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img src={venue.image} alt={venue.name} className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-[#1F85A8]/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">{venue.capacity}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1F85A8] mb-2">{venue.name}</h3>
                  <p className="text-gray-500 text-sm">{venue.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/venues" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-semibold hover:bg-[#1a6d8a] transition-all">{venuesButtonText} <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <VirtualTour />

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">What's Coming</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Upcoming Events</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {displayEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <img src={event.image} alt={event.title} className="w-full aspect-[2/1] object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-blue-700 font-medium mb-3">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-bold text-[#1F85A8] mb-2 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <MapPin size={14} /><span className="line-clamp-1">{event.location}</span>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{event.category}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1F85A8] text-[#1F85A8] rounded-xl font-semibold hover:bg-[#1F85A8] hover:text-white transition-all">View All Events <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Stay Updated</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Latest News</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {displayNews.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                <img src={item.image} alt={item.title} className="w-full aspect-[2/1] object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <h3 className="text-lg font-bold text-[#1F85A8] mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-semibold hover:bg-[#1a6d8a] transition-all">All News <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Partners */}
      <PartnersSection />

      {/* Newsletter */}
      <NewsletterForm />

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ctaBackgroundImage})` }} />
        <div className="absolute inset-0 bg-[#1F85A8]/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{ctaTitle}</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">{ctaDescription}</p>
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/30">{ctaButtonText} <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
