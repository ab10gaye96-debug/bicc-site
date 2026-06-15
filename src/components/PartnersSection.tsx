import { useMemo } from 'react';
import { where } from 'firebase/firestore';
import { useRealtimeCollection } from '../hooks/useRealtimeFirestore';
import { IMAGES } from '../images';

// Fallback partners - using placeholder for demo
const FALLBACK_PARTNERS = [
  { id: '1', name: 'African Union', logo: IMAGES.logo, category: 'International Organizations' },
  { id: '2', name: 'ECOWAS', logo: IMAGES.logo, category: 'International Organizations' },
  { id: '3', name: 'United Nations', logo: IMAGES.logo, category: 'International Organizations' },
  { id: '4', name: 'Commonwealth', logo: IMAGES.logo, category: 'International Organizations' },
  { id: '5', name: 'Gambia Tourism Board', logo: IMAGES.logo, category: 'Government' },
  { id: '6', name: 'Coco Ocean Resort', logo: IMAGES.logo, category: 'Hospitality Partners' },
  { id: '7', name: 'Kairaba Beach Hotel', logo: IMAGES.logo, category: 'Hospitality Partners' },
  { id: '8', name: 'Trust Bank', logo: IMAGES.logo, category: 'Corporate Partners' },
];

export default function PartnersSection() {
  const partnerFilters = useMemo(() => [where('active', '==', true)], []);
  const { data: dbPartners } = useRealtimeCollection<any>('partners', [], partnerFilters);
  const partners = (dbPartners && dbPartners.length > 0) ? dbPartners : FALLBACK_PARTNERS;

  if (partners.length === 0) return null;

  return (
    <section className="py-20 bg-white border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Our Partners</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Strategic Partnerships</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Working with leading organizations to deliver world-class events
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {partners.map((partner: any) => (
            <div
              key={partner.id}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-auto max-h-16 object-contain"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Interested in becoming a partner?{' '}
            <a href="mailto:partnerships@bicc.gm" className="text-blue-600 font-semibold hover:text-blue-700">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
