import { Link } from 'react-router-dom';
import { Shield, Heart, Plane, Building2, Users, Globe2, ArrowRight, CheckCircle } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

export default function WhyGambia() {
  const reasons = [
    {
      icon: Shield,
      title: 'Political Stability',
      description: 'The Gambia enjoys a peaceful and stable democracy with a strong track record of hosting international events and diplomatic missions.',
      points: [
        'Democratic governance since 1965',
        'Active member of ECOWAS, AU, UN, and Commonwealth',
        'Safe and secure environment for international events',
        'Respected neutral ground for regional diplomacy',
      ],
    },
    {
      icon: Heart,
      title: 'Legendary Hospitality',
      description: 'Known as "The Smiling Coast of Africa," The Gambia offers warm, welcoming service that makes every visitor feel at home.',
      points: [
        'Friendly, English-speaking population',
        'Rich cultural heritage and traditions',
        'World-class hotels and hospitality infrastructure',
        'Exceptional customer service standards',
      ],
    },
    {
      icon: Plane,
      title: 'Accessibility & Connectivity',
      description: 'Strategically located in West Africa with excellent air connections and modern transport infrastructure.',
      points: [
        'Direct flights from Europe, Africa, and Middle East',
        'Banjul International Airport with modern facilities',
        'Visa-on-arrival for most nationalities',
        'Only 6 hours from major European cities',
      ],
    },
    {
      icon: Building2,
      title: 'World-Class Infrastructure',
      description: 'State-of-the-art conference facilities, luxury hotels, and modern amenities meet international standards.',
      points: [
        'Sir Dawda Kairaba Jawara International Conference Centre',
        '5-star hotels and boutique resorts',
        'Reliable telecommunications and internet',
        'Modern business and banking services',
      ],
    },
  ];

  const stats = [
    { label: 'Years of Democracy', value: '50+' },
    { label: 'International Events Hosted', value: '500+' },
    { label: 'Hotel Rooms Available', value: '5,000+' },
    { label: 'Annual Tourist Arrivals', value: '200K+' },
  ];

  return (
    <div className="pt-20">
      <SEO
        title="Why The Gambia — Premier MICE Destination"
        description="Discover why The Gambia is West Africa's leading destination for conferences, meetings, and events. Political stability, legendary hospitality, and world-class infrastructure."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F85A8] to-blue-700">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.conferenceExterior})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Link to="/destination" className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors">
            <ArrowRight size={16} className="rotate-180" />
            <span className="text-sm font-medium">Back to Destination Gambia</span>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Why The <span className="text-blue-300">Gambia?</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            A premier MICE destination combining political stability, world-class infrastructure, and the warmth of African hospitality.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-[#1F85A8] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                    <reason.icon className="text-[#1F85A8]" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-[#1F85A8] mb-4">{reason.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{reason.description}</p>
                  <ul className="space-y-3">
                    {reason.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={20} />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <img
                    src={i === 0 ? IMAGES.conferenceHall : i === 1 ? IMAGES.banquetHall : i === 2 ? IMAGES.conferenceExterior : IMAGES.vvipLounge}
                    alt={reason.title}
                    className="rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8] mb-6">A Growing MICE Destination</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Gambia's Meetings, Incentives, Conferences, and Exhibitions (MICE) industry has experienced significant growth over the past decade. As the smallest country in mainland Africa, The Gambia offers a unique combination of accessibility, safety, and cultural richness.
                </p>
                <p>
                  The opening of the Sir Dawda Kairaba Jawara International Conference Centre has positioned The Gambia as a serious contender in the regional MICE market. The country has successfully hosted African Union summits, ECOWAS meetings, international conferences, and corporate events.
                </p>
                <p>
                  With ongoing investment in hospitality infrastructure, improved air connectivity, and a government committed to tourism development, The Gambia continues to attract event planners seeking an authentic African experience combined with modern facilities.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { icon: Globe2, title: 'Strategic Location', desc: 'Gateway to West Africa with easy regional access' },
                { icon: Users, title: 'English-Speaking', desc: 'Official language is English, facilitating international events' },
                { icon: Shield, title: 'Safe & Secure', desc: 'Low crime rate and stable political environment' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-gray-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="text-[#1F85A8]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F85A8] mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1F85A8] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Experience The Gambia for Your Next Event</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Discover why international organizations and corporate clients choose The Gambia for their conferences and events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              Book an Event <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
