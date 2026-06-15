import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  category?: string;
}

const FALLBACK_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Ministry of Tourism',
    logo: '/images/logo.png',
    category: 'Government',
  },
  {
    id: '2',
    name: 'Gambia Tourism Board',
    logo: '/images/logo.png',
    category: 'Tourism',
  },
  {
    id: '3',
    name: 'West African Development Bank',
    logo: '/images/logo.png',
    category: 'Financial',
  },
  {
    id: '4',
    name: 'ECOWAS',
    logo: '/images/logo.png',
    category: 'Regional',
  },
  {
    id: '5',
    name: 'African Union',
    logo: '/images/logo.png',
    category: 'International',
  },
  {
    id: '6',
    name: 'United Nations',
    logo: '/images/logo.png',
    category: 'International',
  },
];

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'partners'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Partner[];
        
        if (data.length > 0) {
          setPartners(data);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Our Network</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Strategic Partners</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Trusted by leading organizations, governments, and international institutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all group"
            >
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all mx-auto"
                    title={partner.name}
                  />
                </a>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all mx-auto"
                  title={partner.name}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            Interested in partnering with BICC? <a href="/contact" className="text-blue-700 font-semibold hover:underline">Get in touch</a>
          </p>
        </div>
      </div>
    </section>
  );
}
