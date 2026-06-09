import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, Coffee, Mic2, Camera, Utensils, Wifi, Car, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

const PACKAGES = [
  {
    name: 'Half-Day Conference',
    duration: '4 hours',
    highlight: false,
    icon: Mic2,
    description: 'Perfect for morning or afternoon meetings, workshops, and training sessions.',
    includes: [
      'Conference room setup (theatre or boardroom style)',
      'Projector & screen',
      'Sound system & microphones',
      'High-speed Wi-Fi',
      'Welcome refreshments (tea & coffee)',
      'Dedicated event coordinator',
      'Parking for delegates',
    ],
  },
  {
    name: 'Full-Day Conference',
    duration: '8 hours',
    highlight: true,
    icon: Star,
    description: 'Our most popular package — ideal for summits, seminars, and all-day workshops.',
    includes: [
      'Main hall or thematic room (choice of layout)',
      'Projector, screen & AV equipment',
      'Sound system with wireless microphones',
      'High-speed Wi-Fi throughout',
      'Morning & afternoon refreshments',
      'Buffet lunch for delegates',
      'Dedicated event coordinator',
      'Parking & security',
      'Branding space (banners/signage areas)',
    ],
  },
  {
    name: 'Gala Dinner & Banquet',
    duration: 'Evening',
    highlight: false,
    icon: Utensils,
    description: 'Elegant dining experiences for award ceremonies, state dinners, and corporate galas.',
    includes: [
      'Banquet Hall A or B (up to 500 guests)',
      'Round-table or banquet seating setup',
      '3-course dinner with menu selection',
      'Bar & beverage service',
      'Ambient lighting & décor',
      'Sound system & background music',
      'MC & event coordination',
      'VIP table arrangement',
      'Parking & security',
    ],
  },
  {
    name: 'International Summit',
    duration: 'Multi-day',
    highlight: false,
    icon: Users,
    description: 'Comprehensive end-to-end management for heads of state, ministerial, and AU/ECOWAS-level events.',
    includes: [
      'Plenary Hall (1,013 seats)',
      'All bilateral & breakout rooms',
      'Full AV & simultaneous translation booths',
      'Press room & media facilities',
      'VVIP protocol & airport lounge access',
      'Full catering (all meals & breaks)',
      'Dedicated security & protocol team',
      'Event branding & signage throughout',
      'On-site technical support',
      'Post-event report & documentation',
    ],
  },
];

const ADD_ONS = [
  { icon: Camera, name: 'Photography & Video', desc: 'Professional event coverage and post-production' },
  { icon: Utensils, name: 'Custom Catering', desc: 'Tailored menus — Gambian, continental, halal options' },
  { icon: Wifi, name: 'Dedicated Internet', desc: 'Dedicated high-speed line for large conferences' },
  { icon: Coffee, name: 'VIP Hospitality', desc: 'Premium lounge setup, butler service, gift packs' },
  { icon: Car, name: 'Transport & Logistics', desc: 'Delegate transfers, airport pickups, fleet coordination' },
  { icon: Mic2, name: 'Translation Services', desc: 'Simultaneous interpretation in multiple languages' },
];

const FAQS = [
  {
    q: 'Do you provide catering in-house?',
    a: 'Yes. BICC has a full in-house catering team offering breakfast, lunch, dinner, and refreshment packages. We also accommodate dietary requirements including halal, vegetarian, and vegan menus.',
  },
  {
    q: 'Can we bring our own vendors or caterers?',
    a: 'External vendors are permitted for specific services such as décor and entertainment, subject to prior approval by BICC management. In-house catering is preferred for all food and beverage services.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancellations made more than 14 days before the event incur no charge. Cancellations within 7–14 days attract a 25% fee. Cancellations within 7 days or less attract a 50% fee. Full terms are included in the booking agreement.',
  },
  {
    q: 'How far in advance should we book?',
    a: 'We recommend booking at least 4–6 weeks in advance for standard events, and 3–6 months for large international summits or multi-day conferences to ensure full availability and preparation time.',
  },
  {
    q: 'Is the venue accessible for people with disabilities?',
    a: 'Yes. The SDKJ International Conference Centre is fully accessible, with ramp access, lifts, accessible restrooms, and reserved seating areas for delegates with mobility needs.',
  },
  {
    q: 'Do you offer on-site technical support?',
    a: 'Yes. A dedicated AV and technical team is available throughout your event to manage sound, lighting, projection, and live streaming needs.',
  },
  {
    q: 'Can we arrange accommodation for delegates?',
    a: 'BICC works with partner hotels in the Bijilo and Kololi area to arrange preferential rates for delegates. Our events team can coordinate accommodation on your behalf.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers, company cheques, and cash payments. A deposit is required to confirm the booking. Full payment details are provided upon receipt of your booking confirmation.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-blue-50 transition-colors"
      >
        <span className="font-semibold text-[#1F85A8] text-sm sm:text-base pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-blue-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Services() {
  return (
    <div className="pt-20">
      <SEO
        title="Services & Packages"
        description="Explore BICC's event packages — from half-day conferences to full international summits. Tailored solutions for every event at the Sir Dawda Kairaba Jawara International Conference Centre."
      />

      {/* Hero */}
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.conferenceHall})` }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-300 font-semibold text-sm tracking-widest uppercase">What We Offer</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Services & Packages</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            From intimate boardroom meetings to full-scale international summits — BICC delivers
            tailored event solutions that reflect excellence and African hospitality.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Event Packages</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Choose Your Package</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              All packages are fully customisable. Contact our events team for a tailored quote.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((pkg, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  pkg.highlight
                    ? 'bg-[#1F85A8] text-white ring-2 ring-blue-400'
                    : 'bg-white text-gray-800'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pkg.highlight ? 'bg-white/20' : 'bg-blue-100'}`}>
                    <pkg.icon size={22} className={pkg.highlight ? 'text-white' : 'text-blue-700'} />
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${pkg.highlight ? 'text-blue-200' : 'text-blue-500'}`}>
                    {pkg.duration}
                  </p>
                  <h3 className={`text-xl font-bold mb-3 ${pkg.highlight ? 'text-white' : 'text-[#1F85A8]'}`}>{pkg.name}</h3>
                  <p className={`text-sm leading-relaxed mb-5 ${pkg.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{pkg.description}</p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check size={14} className={`mt-0.5 shrink-0 ${pkg.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                        <span className={pkg.highlight ? 'text-blue-50' : 'text-gray-600'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to="/booking"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      pkg.highlight
                        ? 'bg-white text-[#1F85A8] hover:bg-gray-100'
                        : 'bg-[#1F85A8] text-white hover:bg-[#1a6d8a]'
                    }`}
                  >
                    Get a Quote <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            All packages are subject to availability and final confirmation by BICC. Prices provided upon request.
          </p>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Enhance Your Event</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Add-On Services</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Customise any package with additional services tailored to your event needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADD_ONS.map((addon, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1F85A8] transition-colors">
                  <addon.icon size={22} className="text-blue-700 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F85A8] mb-1">{addon.name}</h3>
                  <p className="text-sm text-gray-500">{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 mt-4">
              Everything event planners need to know before booking with BICC.
            </p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="mt-10 bg-[#1F85A8] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-blue-100 text-sm mb-6">Our events team is happy to help with anything not covered above.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all">
                Contact Us
              </Link>
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                Submit a Booking Request <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
