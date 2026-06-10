import { useState } from 'react';
import { fetchEvents } from '../api';
import { useApi } from '../hooks/useApi';
import { Calendar, MapPin, Clock, Filter, X, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import { SkeletonList } from '../components/Skeleton';

function EventModal({ event, onClose }: { event: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={event.image} alt={event.title}
            className="w-full aspect-[2/1] object-cover rounded-t-2xl" />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
            <X size={18} />
          </button>
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {event.category}
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F85A8] mb-4">{event.title}</h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Calendar size={16} className="text-blue-600 shrink-0" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Clock size={16} className="text-blue-600 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <MapPin size={16} className="text-blue-600 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-8">{event.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/booking" onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all">
              Book a Venue <ArrowRight size={16} />
            </Link>
            <button onClick={onClose}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const { data: events, loading } = useApi(() => fetchEvents(), []);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past' | 'all'>('all');
  const [selected, setSelected] = useState<any | null>(null);

  const allEvents = events || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const categories = ['All', ...Array.from(new Set(allEvents.map(e => e.category).filter(Boolean)))];

  const filtered = allEvents.filter(e => {
    const eventDate = new Date(e.date);
    const catMatch = categoryFilter === 'All' || e.category === categoryFilter;
    const timeMatch =
      timeFilter === 'all' ? true :
      timeFilter === 'upcoming' ? eventDate >= today :
      eventDate < today;
    return catMatch && timeMatch;
  });

  const upcomingCount = allEvents.filter(e => new Date(e.date) >= today).length;
  const pastCount = allEvents.filter(e => new Date(e.date) < today).length;

  return (
    <div className="pt-20">
      <SEO
        title="Events"
        description="Stay informed about upcoming conferences, summits, exhibitions, and events hosted at the BICC — Banjul International Convention Centre."
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.banquetHall})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-300 font-semibold text-sm tracking-widest uppercase">Events</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-4 mb-6">Events at BICC</h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
            Stay informed about the latest conferences, summits, and events hosted at the
            SDKJ International Conference Centre.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-5 bg-white border-b sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Time filter tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {([
              { key: 'all', label: `All Events (${allEvents.length})` },
              { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
              { key: 'past', label: `Past (${pastCount})` },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setTimeFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  timeFilter === tab.key
                    ? 'bg-[#1F85A8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-gray-400 shrink-0" />
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events grid */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonList count={6} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No events found</h3>
              <p className="text-gray-400 text-sm">Try changing the filters above.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map(event => {
                const isPast = new Date(event.date) < today;
                return (
                  <div key={event.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer ${isPast ? 'opacity-75' : ''}`}
                    onClick={() => setSelected(event)}>
                    <div className="relative overflow-hidden">
                      <img src={event.image} alt={event.title}
                        className="w-full aspect-[2/1] object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {event.category}
                        </span>
                        {isPast && (
                          <span className="bg-gray-700 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            Past
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base sm:text-lg font-bold text-[#1F85A8] mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-1.5 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-blue-600 shrink-0" />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-blue-600 shrink-0" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-blue-600 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                      <span className="inline-block mt-3 text-blue-600 text-sm font-semibold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event detail modal */}
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
