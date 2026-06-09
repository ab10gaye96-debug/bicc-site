import { Quote, Star } from 'lucide-react';
import { useApi } from '../hooks/useApi';

// Fetch testimonials from Firestore
async function fetchTestimonials() {
  try {
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    const q = query(collection(db, 'testimonials'), where('published', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

// Fallback testimonials
const FALLBACK_TESTIMONIALS = [
  {
    id: '1',
    name: 'Dr. Fatou Bensouda',
    position: 'International Conference Organizer',
    organization: 'African Union',
    content: 'BICC provided exceptional service for our Pan-African Summit. The facilities are world-class, and the staff went above and beyond to ensure our event was a success.',
    rating: 5,
    image: '',
  },
  {
    id: '2',
    name: 'Ambassador John Smith',
    position: 'Diplomatic Corps',
    organization: 'ECOWAS',
    content: 'The Sir Dawda Kairaba Jawara International Conference Centre is a gem in West Africa. We have hosted multiple regional summits here with outstanding results.',
    rating: 5,
    image: '',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    position: 'Corporate Events Manager',
    organization: 'Global Tech Corporation',
    content: 'Professional service, modern facilities, and beautiful location. BICC exceeded our expectations for our annual corporate retreat. Highly recommended!',
    rating: 5,
    image: '',
  },
  {
    id: '4',
    name: 'Dr. Mamadou Diallo',
    position: 'Conference Chair',
    organization: 'West African Health Association',
    content: 'The technical capabilities and support at BICC are impressive. Our medical conference with 500+ delegates ran smoothly thanks to their experienced team.',
    rating: 5,
    image: '',
  },
];

export default function TestimonialsSection() {
  const { data: dbTestimonials } = useApi(fetchTestimonials, []);
  const testimonials = (dbTestimonials && dbTestimonials.length > 0) ? dbTestimonials : FALLBACK_TESTIMONIALS;

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Client Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">What Our Clients Say</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Trusted by organizations, governments, and corporations across Africa and beyond
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.slice(0, 4).map((testimonial: any) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="text-blue-200 mb-3" size={32} />
              
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                "{testimonial.content}"
              </p>
              
              <div className="border-t pt-4">
                {testimonial.image && (
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mb-3" />
                )}
                <h4 className="font-bold text-[#1F85A8] text-sm">{testimonial.name}</h4>
                <p className="text-xs text-gray-600">{testimonial.position}</p>
                <p className="text-xs text-gray-500 mt-1">{testimonial.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
