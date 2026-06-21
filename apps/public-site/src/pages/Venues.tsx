import { useState } from 'react';
import { fetchVenues } from '../api';
import { usePageContent } from '../hooks/usePageContent';
import { useApi } from '../hooks/useApi';
import { Users, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import HeroBackgroundSlideshow from '../components/ui/HeroBackgroundSlideshow';
import { SkeletonVenue } from '../components/Skeleton';

function VenueCard({ venue, index }: { venue: any; index: number }) {
  const [mediaIndex, setMediaIndex] = useState(0);

  const mediaItems: { type: 'image' | 'video'; url: string }[] = [
    ...(Array.isArray(venue.images) ? venue.images : venue.image ? [venue.image] : []).map((url: string) => ({
      type: 'image' as const,
      url,
    })),
    ...(Array.isArray(venue.videos) ? venue.videos : []).map((url: string) => ({
      type: 'video' as const,
      url,
    })),
  ];

  const slides = mediaItems.length > 0 ? mediaItems : [{ type: 'image' as const, url: IMAGES.conferenceHall }];
  const current = slides[mediaIndex];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaIndex((i) => (i - 1 + slides.length) % slides.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaIndex((i) => (i + 1) % slides.length);
  };

  return (
    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
      <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
          {current.type === 'video' ? (
            <video
              key={current.url}
              src={current.url}
              controls
              className="w-full aspect-[4/3] object-cover bg-black"
            />
          ) : (
            <img
              src={current.url}
              alt={venue.name}
              className="w-full aspect-[4/3] object-cover transition-all duration-500"
            />
          )}
          {slides.length > 1 && (
            <>
              <button onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((slide, i) => (
                  <button key={i} onClick={e => { e.stopPropagation(); setMediaIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${i === mediaIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                    aria-label={slide.type === 'video' ? 'Video slide' : 'Image slide'}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Users size={14} />{venue.capacity}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8] mb-4">{venue.name}</h2>
        <p className="text-gray-600 leading-relaxed mb-6">{venue.description}</p>
        {(venue.features || []).length > 0 && (
          <div className="grid sm:grid-cols-2 gap-2 mb-8">
            {(venue.features || []).map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={15} className="text-green-500 shrink-0" />{feature}
              </div>
            ))}
          </div>
        )}
        <Link to="/booking"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all shadow-md">
          Book an Event <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function Venues() {
  const { data: venues, loading } = useApi(() => fetchVenues(), []);
  const { data: pageContent } = usePageContent('venuesPage');

  return (
    <div className="pt-36">
      <SEO
        title="Venues"
        description="Explore world-class event venues at BICC — from the 1,013-seat Plenary Hall to intimate bilateral rooms. Book your venue today."
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-24 bg-[#1F85A8]">
        <HeroBackgroundSlideshow
          backgroundImage={pageContent?.hero?.backgroundImage || IMAGES.conferenceHall}
          images={Array.isArray(pageContent?.hero?.backgroundImages) ? pageContent.hero.backgroundImages.filter(Boolean) : []}
          intervalSeconds={Math.max(1, Number(pageContent?.hero?.slideIntervalSeconds) || 5)}
          showIndicators
        >
          <div className="absolute inset-0 bg-black/40" />
        </HeroBackgroundSlideshow>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-300 font-semibold text-sm tracking-widest uppercase">{pageContent?.hero?.eyebrow || 'Our Facilities'}</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-4 mb-6">{pageContent?.hero?.title || 'World-Class Venues'}</h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
            {pageContent?.hero?.description || 'With the capacity to accommodate over 4,000 guests, the Sir Dawda Kairaba Jawara International Conference Center can host events of any size or shape.'}
          </p>
        </div>
      </section>

      {/* Venue list */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-16">
              {[0, 1, 2].map(i => <SkeletonVenue key={i} />)}
            </div>
          ) : (venues || []).length === 0 ? (
            <div className="text-center py-20 text-gray-400">No venues found.</div>
          ) : (
            <div className="space-y-16 sm:space-y-24">
              {(venues || []).map((venue, index) => (
                <VenueCard key={venue.id} venue={venue} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Capacity table */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8]">{pageContent?.intro?.title || 'Venue Capacity Overview'}</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">{pageContent?.intro?.description || 'Quick reference for all event spaces'}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px]">
                <thead className="bg-[#1F85A8] text-white">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">Event Space</th>
                    <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold">Capacity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { space: 'Plenary Hall', capacity: '1,013 seats' },
                    { space: 'Banquet Hall A', capacity: '500 guests' },
                    { space: 'Banquet Hall B', capacity: '250 guests' },
                    { space: '4 Thematic Rooms', capacity: '200 each' },
                    { space: '11 Bilateral Rooms', capacity: '25 each' },
                    { space: '4 Press Rooms', capacity: '40 each' },
                    { space: 'Cafeteria', capacity: '40 guests' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-[#1F85A8]">{row.space}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-right text-gray-600">{row.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[#1F85A8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{pageContent?.cta?.title || 'Ready to Book an Event?'}</h2>
          <p className="text-white/70 text-base sm:text-lg mb-8">
            {pageContent?.cta?.description || 'Submit a booking request and our team will get back to you within 1–2 business days.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold text-base hover:bg-gray-100 transition-all shadow-lg">
              {pageContent?.cta?.primaryButtonText || 'Book an Event'} <ArrowRight size={18} />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-base hover:bg-white/10 transition-all">
              {pageContent?.cta?.secondaryButtonText || 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
