import { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  position?: string;
  organization: string;
  content: string;
  rating: number;
  image?: string;
  published?: boolean;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Isatou Touray',
    role: 'Minister',
    organization: 'Ministry of Health',
    content: 'The BICC provided exceptional service for our regional health summit. The facilities were world-class and the staff was incredibly professional.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ambassador John Smith',
    role: 'Diplomatic Envoy',
    organization: 'United Nations',
    content: 'An outstanding venue that rivals the best conference centers in the world. The Sir Dawda Kairaba Jawara Hall is truly magnificent.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Fatou Jallow',
    role: 'CEO',
    organization: 'West African Development Bank',
    content: 'We have hosted multiple events at BICC. The attention to detail and commitment to excellence is unmatched in the sub-region.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[];
        
        const publishedTestimonials = data.filter((item) => item.published !== false);

        if (publishedTestimonials.length > 0) {
          setTestimonials(publishedTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Client Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">What Our Clients Say</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Hear from organizations and dignitaries who have experienced excellence at BICC.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-all">
              <Quote className="absolute top-6 right-6 text-blue-200" size={48} />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-[#1F85A8]">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role || testimonial.position || 'Guest'}, {testimonial.organization}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
