import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Globe2, Star, Calendar, MapPin, Award, Shield } from 'lucide-react';
import { fetchEvents, fetchNews } from '../api';
import { useApi } from '../hooks/useApi';
import { IMAGES } from '../images';

export default function Home() {
  const { data: events } = useApi(() => fetchEvents(), []);
  const { data: news } = useApi(() => fetchNews(), []);
  const displayEvents = (events || []).slice(0, 3);
  const displayNews = (news || []).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F85A8]/70 via-[#1F85A8]/50 to-[#1F85A8]/90" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-8 backdrop-blur-sm">
            <Star size={14} />
            The Gambia's Premier MICE Destination
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Banjul International
            <span className="block text-blue-400">Convention Centre</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Managing the Sir Dawda Kairaba Jawara International Conference Centre — 
            a world-class facility where diplomacy, innovation, and culture converge on the shores of the Atlantic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/venues" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/30">
              Explore Our Venues <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
              Book an Event
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#1F85A8] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: '4,000+', label: 'Guest Capacity' },
            { icon: Building2, value: '30+', label: 'Event Spaces' },
            { icon: Globe2, value: '50+', label: 'International Events' },
            { icon: Award, value: '5-Star', label: 'Facility Rating' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="mx-auto text-white mb-2" size={28} />
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">About BICC</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3 mb-6">Where Excellence Meets <span className="text-blue-700">African Hospitality</span></h2>
              <p className="text-gray-600 leading-relaxed mb-6">The Banjul International Convention Centre (BICC) is The Gambia's national premier event management institution, established by the Government of The Gambia to advance the country's Meetings, Incentives, Conferences and Exhibitions (MICE) industry.</p>
              <p className="text-gray-600 leading-relaxed mb-8">BICC manages the Sir Dawda Kairaba Jawara International Conference Center and the VVIP Lounge at the Banjul International Airport, delivering tailored event solutions for summits, conferences, and special events.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Star, text: 'Excellence' },
                  { icon: Globe2, text: 'Innovation' },
                  { icon: Shield, text: 'Integrity' },
                  { icon: Award, text: 'Sustainability' },
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                    <v.icon size={20} className="text-blue-700" />
                    <span className="font-medium text-[#1F85A8]">{v.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition-colors">Learn More About Us <ArrowRight size={18} /></Link>
            </div>
            <div className="relative">
              <img src={IMAGES.conferenceHall} alt="Conference Centre" className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white rounded-xl p-6 shadow-xl">
                <div className="text-3xl font-bold">14,000</div>
                <div className="text-sm font-medium">m² of Event Space</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venues Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Our Facilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">World-Class Event Spaces</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">From grand plenary halls to intimate bilateral rooms, our versatile venues cater to events of every scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Plenary Hall', capacity: '1,013 seats', img: IMAGES.conferenceHall, desc: 'Our flagship UN General Assembly-style conference hall' },
              { name: 'Banquet Halls', capacity: '500 guests', img: IMAGES.banquetHall, desc: 'Elegant spaces for galas, dinners, and ceremonies' },
              { name: 'VVIP Airport Lounge', capacity: 'Exclusive', img: IMAGES.vvipLounge, desc: 'Ultra-modern arrival experience at Banjul Airport' },
            ].map((venue, i) => (
              <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img src={venue.img} alt={venue.name} className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-[#1F85A8]/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">{venue.capacity}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1F85A8] mb-2">{venue.name}</h3>
                  <p className="text-gray-500 text-sm">{venue.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/venues" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-semibold hover:bg-[#1a6d8a] transition-all">View All Venues <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

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

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.banquetHall})` }} />
        <div className="absolute inset-0 bg-[#1F85A8]/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Host Your Next Event?</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">Let BICC deliver a world-class experience. From conferences to galas, we provide comprehensive event management that reflects excellence, innovation, and The Gambia's legendary hospitality.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/30">Contact Us Today <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}

