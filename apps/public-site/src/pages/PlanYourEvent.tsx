import { Link } from 'react-router-dom';
import { CheckCircle, Utensils, Monitor, Shield, Hotel, Car, ClipboardCheck, Download, ArrowRight, Phone, Mail } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

export default function PlanYourEvent() {
  const services = [
    {
      icon: Utensils,
      title: 'Catering Services',
      description: 'Professional catering for all types of events',
      features: [
        'Customized menus for conferences, banquets, and receptions',
        'International and local cuisine options',
        'Dietary requirements accommodation (vegetarian, halal, etc.)',
        'Coffee breaks, cocktail receptions, and gala dinners',
        'Professional waitstaff and service',
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Monitor,
      title: 'Audio Visual Services',
      description: 'State-of-the-art audio-visual equipment and support',
      features: [
        'High-definition projectors and LED screens',
        'Professional sound systems and microphones',
        'Video conferencing and livestreaming capabilities',
        'Stage lighting and multimedia production',
        'On-site technical support team',
      ],
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Security Services',
      description: 'Comprehensive security for your event',
      features: [
        'Trained security personnel',
        'VIP protection and escort services',
        'Access control and credential management',
        'CCTV monitoring',
        'Emergency response protocols',
      ],
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Hotel,
      title: 'Accommodation Support',
      description: 'Hotel and lodging arrangements',
      features: [
        'Preferred rates at partner hotels',
        'Block booking management',
        'VIP and delegate accommodation coordination',
        'Airport transfer arrangements',
        'Extended stay options',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Car,
      title: 'Transportation Services',
      description: 'Reliable transport for delegates',
      features: [
        'Airport pickup and drop-off',
        'Shuttle services between venues',
        'VIP transport and chauffeur services',
        'Coach hire for large groups',
        'Local tour arrangements',
      ],
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const checklist = [
    { step: 1, title: 'Define Your Event', items: ['Event type and objectives', 'Expected number of participants', 'Preferred dates', 'Budget estimate'] },
    { step: 2, title: 'Choose Your Venue', items: ['Select appropriate hall/room', 'Confirm seating arrangement', 'Check availability', 'Book venue'] },
    { step: 3, title: 'Select Services', items: ['Catering requirements', 'A/V equipment needs', 'Security level', 'Accommodation and transport'] },
    { step: 4, title: 'Plan Logistics', items: ['Event schedule/agenda', 'Registration process', 'Signage and branding', 'Media coverage'] },
    { step: 5, title: 'Finalize Details', items: ['Confirm all bookings', 'Review quotation', 'Sign contracts', 'Make deposit payment'] },
    { step: 6, title: 'Pre-Event Coordination', items: ['Site visit and walkthrough', 'Technical rehearsal', 'Final headcount', 'Emergency contacts'] },
  ];

  return (
    <div className="pt-20">
      <SEO
        title="Plan Your Event — BICC Event Planning Guide"
        description="Comprehensive event planning guide with information on catering, A/V services, security, accommodation, and transportation at BICC."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F85A8] to-purple-600">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.conferenceHall})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
            <ClipboardCheck size={16} />
            Event Planning Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Plan Your Event at BICC</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Everything you need to know to plan and execute a successful event at the Banjul International Convention Centre
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
          >
            Start Planning Your Event <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Event Planning Checklist */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Event Planning Checklist</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow this step-by-step guide to ensure your event is a success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklist.map((phase) => (
              <div key={phase.step} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#1F85A8] text-white rounded-xl flex items-center justify-center font-bold text-xl">
                    {phase.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#1F85A8]">{phase.title}</h3>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1F85A8] text-[#1F85A8] rounded-xl font-bold hover:bg-[#1F85A8] hover:text-white transition-all">
              <Download size={20} />
              Download Full Checklist (PDF)
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive event services to meet all your needs
            </p>
          </div>

          <div className="space-y-12">
            {services.map((service, i) => (
              <div
                key={i}
                className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                    <service.icon className="text-gray-700" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F85A8] mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''} bg-gradient-to-br ${service.color} rounded-2xl p-12 flex items-center justify-center`}>
                  <service.icon className="text-white" size={120} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Toolkit */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1F85A8] to-blue-700 rounded-2xl p-12">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Event Planning Toolkit</h2>
              <p className="text-xl text-gray-200 mb-8">
                Download our comprehensive event planning toolkit with templates, checklists, and guidelines
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  'Event Planning Checklist',
                  'Venue Selection Guide',
                  'Technical Specifications',
                  'Catering Menu Options',
                  'Budget Template',
                  'Timeline Template',
                ].map((doc, i) => (
                  <button
                    key={i}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-medium"
                  >
                    <Download size={16} />
                    {doc}
                  </button>
                ))}
              </div>
              <button className="px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all">
                Download Complete Toolkit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F85A8] mb-4">Need Help Planning Your Event?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced event coordinators are here to help you every step of the way
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-[#1F85A8]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1F85A8] mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak with our event planning team</p>
              <a
                href="tel:+2207784425"
                className="inline-block px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all"
              >
                +220 778 4425
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-[#1F85A8]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1F85A8] mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us your event requirements</p>
              <a
                href="mailto:events@bicc.gm"
                className="inline-block px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all"
              >
                events@bicc.gm
              </a>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
            >
              Submit Event Booking Request <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
