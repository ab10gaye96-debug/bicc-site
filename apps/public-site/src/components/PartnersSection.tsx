import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  category?: string;
  active?: boolean;
}

interface PartnersSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaText?: string;
}

const FALLBACK_PARTNERS: Partner[] = [
  { id: '1', name: 'Ministry of Tourism', logo: '/images/bicc-logo.svg', category: 'Government' },
  { id: '2', name: 'Gambia Tourism Board', logo: '/images/bicc-logo.svg', category: 'Tourism' },
  { id: '3', name: 'West African Development Bank', logo: '/images/bicc-logo.svg', category: 'Financial' },
  { id: '4', name: 'ECOWAS', logo: '/images/bicc-logo.svg', category: 'Regional' },
  { id: '5', name: 'African Union', logo: '/images/bicc-logo.svg', category: 'International' },
  { id: '6', name: 'United Nations', logo: '/images/bicc-logo.svg', category: 'International' },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  const img = (
    <img
      src={partner.logo}
      alt={partner.name}
      className="max-h-14 sm:max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
      title={partner.name}
    />
  );

  return (
    <div className="flex items-center justify-center px-8 sm:px-12 shrink-0">
      {partner.website ? (
        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block">
          {img}
        </a>
      ) : img}
    </div>
  );
}

export default function PartnersSection({
  eyebrow = 'Our Network',
  title = 'Strategic Partners',
  description = 'Trusted by leading organizations, governments, and international institutions.',
  ctaText = 'Interested in partnering with BICC?',
}: PartnersSectionProps) {
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'partners'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Partner[];
        const activePartners = data.filter((item) => item.active !== false);
        if (activePartners.length > 0) setPartners(activePartners);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const marqueePartners = partners.length < 4 ? [...partners, ...partners, ...partners] : [...partners, ...partners];

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4" />
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">{eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">{title}</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">{description}</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex items-center w-max py-4">
            {marqueePartners.map((partner, index) => (
              <PartnerLogo key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10 px-4">
        <p className="text-gray-500 text-sm">
          {ctaText}{' '}
          <a href="/contact" className="text-blue-700 font-semibold hover:underline">Get in touch</a>
        </p>
      </div>
    </section>
  );
}
