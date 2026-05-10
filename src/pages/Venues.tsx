import { fetchVenues } from '../api';
import { useApi } from '../hooks/useApi';
import { Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../images';

export default function Venues() {
  const { data: venues, loading } = useApi(() => fetchVenues(), []);

  return (
    <div className="pt-20">
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${IMAGES.conferenceHall})` }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">Our Facilities</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">World-Class Venues</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">With the capacity to accommodate over 4,000 guests, the Sir Dawda Kairaba Jawara International Conference Center can host events of any size or shape.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="space-y-16">
              {(venues || []).map((venue, index) => (
                <div key={venue.id} className={`grid lg:grid-cols-2 gap-12 items-center`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <img src={venue.image} alt={venue.name} className="rounded-2xl shadow-lg w-full aspect-[4/3] object-cover" />
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-semibold w-fit mb-4"><Users size={14} />{venue.capacity}</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8] mb-4">{venue.name}</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{venue.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(venue.features || []).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-500 shrink-0" />{feature}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-[#1F85A8]">Venue Capacity Overview</h2></div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1F85A8] text-white"><tr><th className="px-6 py-4 text-left text-sm font-semibold">Event Space</th><th className="px-6 py-4 text-right text-sm font-semibold">Capacity</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {[{ space: 'Plenary Hall', capacity: '1,013' },{ space: 'Banquet Hall A', capacity: '500' },{ space: 'Banquet Hall B', capacity: '250' },{ space: '4 Thematic Rooms', capacity: '200 each' },{ space: '11 Bilateral Rooms', capacity: '25 each' },{ space: '4 Press Rooms', capacity: '40 each' },{ space: 'Cafeteria', capacity: '40' }].map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors"><td className="px-6 py-4 text-sm font-medium text-[#1F85A8]">{row.space}</td><td className="px-6 py-4 text-sm text-right text-gray-600">{row.capacity}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1F85A8] mb-4">Ready to Book a Venue?</h2>
          <p className="text-[#1F85A8]/70 text-lg mb-8">Contact us today to discuss your event requirements and find the perfect space.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1F85A8] text-white rounded-xl font-bold text-lg hover:bg-[#1a6d8a] transition-all">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}


