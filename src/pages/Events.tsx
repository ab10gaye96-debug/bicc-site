import { useState } from 'react';
import { fetchEvents } from '../api';
import { useApi } from '../hooks/useApi';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import { IMAGES } from '../images';

export default function Events() {
  const { data: events, loading } = useApi(() => fetchEvents(), []);
  const [filter, setFilter] = useState('All');
  const allEvents = events || [];
  const categories = ['All', ...Array.from(new Set(allEvents.map(e => e.category)))];
  const filtered = filter === 'All' ? allEvents : allEvents.filter(e => e.category === filter);

  return (
    <div className="pt-20">
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${IMAGES.banquetHall})` }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">Events</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Upcoming Events</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">Stay informed about the latest conferences, summits, and events hosted at the SDKJ International Conference Centre.</p>
        </div>
      </section>
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={18} className="text-gray-400" />
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-blue-600 text-[#1F85A8]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><Calendar className="mx-auto text-gray-300 mb-4" size={48} /><h3 className="text-xl font-bold text-gray-400">No events found</h3></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filtered.map(event => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="relative overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full aspect-[2/1] object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-blue-600 text-[#1F85A8] text-xs font-bold px-3 py-1.5 rounded-full">{event.category}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1F85A8] mb-3">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-600" />{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                      <div className="flex items-center gap-1.5"><Clock size={14} className="text-blue-600" />{event.time}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"><MapPin size={14} className="text-blue-600 shrink-0" /><span className="line-clamp-1">{event.location}</span></div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


