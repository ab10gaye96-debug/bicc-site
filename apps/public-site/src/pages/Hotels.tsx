import { Link } from 'react-router-dom';
import { Hotel, Star, MapPin, Phone, Mail, Globe, ArrowRight } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { usePageContent } from '../hooks/usePageContent';
import { fetchHotels } from '../api';
import { useState } from 'react';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import { IMAGES } from '../images';

// Fallback hotels if Firestore is empty
const FALLBACK_HOTELS = [
  {
    id: '1',
    name: 'Coco Ocean Resort & Spa',
    category: '5-Star',
    description: 'Luxury beachfront resort with world-class amenities, spa, and multiple dining options.',
    location: 'Bijilo',
    rooms: 180,
    image: IMAGES.banquetHall,
    phone: '+220 446 9600',
    email: 'info@cocoocean.com',
    website: 'www.cocoocean.com',
    amenities: ['Wi-Fi', 'Spa', 'Pool', 'Restaurant', 'Bar', 'Beach Access', 'Gym'],
    distanceToVenue: '2 km',
  },
  {
    id: '2',
    name: 'Kairaba Beach Hotel',
    category: '4-Star',
    description: 'Premier beach hotel offering comfortable accommodation, conference facilities, and leisure activities.',
    location: 'Kololi',
    rooms: 232,
    image: IMAGES.hospitalityAlt,
    phone: '+220 446 2940',
    email: 'reservations@kairababeachhotel.com',
    website: 'www.kairababeachhotel.com',
    amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Bar', 'Gym', 'Conference Rooms'],
    distanceToVenue: '3 km',
  },
  {
    id: '3',
    name: 'Coral Beach Hotel & Spa',
    category: '4-Star',
    description: 'Stylish hotel with modern facilities, spa services, and direct beach access.',
    location: 'Cape Point',
    rooms: 150,
    image: IMAGES.vvipLounge,
    phone: '+220 449 1111',
    email: 'info@coralbeachhotel.gm',
    website: 'www.coralbeachhotel.gm',
    amenities: ['Wi-Fi', 'Spa', 'Pool', 'Restaurant', 'Beach Access'],
    distanceToVenue: '4 km',
  },
  {
    id: '4',
    name: 'The Residence Mauritania',
    category: '4-Star',
    description: 'Boutique hotel with personalized service and elegant accommodations.',
    location: 'Fajara',
    rooms: 48,
    image: IMAGES.conferenceHall,
    phone: '+220 449 5000',
    email: 'reservations@theresidence.gm',
    website: 'www.theresidence.gm',
    amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Bar'],
    distanceToVenue: '5 km',
  },
  {
    id: '5',
    name: 'Kombo Beach Hotel',
    category: '3-Star',
    description: 'Comfortable beachfront accommodation with friendly service and good value.',
    location: 'Kotu',
    rooms: 120,
    image: IMAGES.banquetHall,
    phone: '+220 446 2940',
    email: 'info@kombobeach.com',
    website: 'www.kombobeach.com',
    amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Bar', 'Beach Access'],
    distanceToVenue: '3 km',
  },
  {
    id: '6',
    name: 'Ocean Bay Hotel & Resort',
    category: '3-Star',
    description: 'Family-friendly hotel with spacious rooms and leisure facilities.',
    location: 'Cape Point',
    rooms: 96,
    image: IMAGES.hospitalityAlt,
    phone: '+220 449 7800',
    email: 'reservations@oceanbay.gm',
    website: 'www.oceanbay.gm',
    amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Bar'],
    distanceToVenue: '4 km',
  },
];

export default function Hotels() {
  const { data: dbHotels } = useApi(fetchHotels, []);
  const { data: pageContent } = usePageContent('hotelsPage');
  const hotels = (dbHotels && dbHotels.length > 0) ? dbHotels : FALLBACK_HOTELS;
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(hotels.map((h: any) => h.category).filter(Boolean)))];
  const filtered = filter === 'All' ? hotels : hotels.filter((h: any) => h.category === filter);

  return (
    <div>
      <SEO
        title="Hotels & Accommodation in The Gambia"
        description="Browse partner hotels and accommodation options near the Banjul International Convention Centre."
      />

      <PageHero
        eyebrow={pageContent?.hero?.eyebrow || 'Destination Gambia'}
        title={pageContent?.hero?.title || 'Hotels & Accommodation'}
        description={pageContent?.hero?.description || 'Choose from our partner hotels offering world-class hospitality near the convention centre.'}
        backgroundImage={pageContent?.hero?.backgroundImage || IMAGES.banquetHall}
        compact
      >
        <Link to="/destination" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mt-6 transition-colors text-sm font-medium">
          <ArrowRight size={16} className="rotate-180" />
          Back to Destination Gambia
        </Link>
      </PageHero>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === cat
                    ? 'bg-[#1F85A8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {filtered.map((hotel: any) => (
              <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <img src={hotel.image} alt={hotel.name} className="w-full aspect-[16/9] object-cover" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1F85A8] mb-1">{hotel.name}</h3>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{hotel.location}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                      {hotel.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{hotel.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hotel size={16} className="text-[#1F85A8]" />
                      <span className="text-gray-700">{hotel.rooms} Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#1F85A8]" />
                      <span className="text-gray-700">{hotel.distanceToVenue} to BICC</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 6).map((amenity: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <a href={`tel:${hotel.phone}`} className="hover:text-[#1F85A8]">{hotel.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} />
                      <a href={`mailto:${hotel.email}`} className="hover:text-[#1F85A8]">{hotel.email}</a>
                    </div>
                    {hotel.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe size={14} />
                        <a href={`https://${hotel.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#1F85A8]">
                          {hotel.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1F85A8] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{pageContent?.cta?.title || 'Need Help with Accommodation?'}</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {pageContent?.cta?.description || 'Our team can assist with group bookings and accommodation arrangements for your event.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            {pageContent?.cta?.primaryButtonText || 'Contact Us'} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
