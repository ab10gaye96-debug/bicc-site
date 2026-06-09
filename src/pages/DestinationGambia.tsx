import { Link } from 'react-router-dom';
import { Plane, Hotel, Briefcase, Palmtree, ArrowRight, Globe2, Users, Shield, TrendingUp } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

export default function DestinationGambia() {
  const sections = [
    {
      title: 'Why The Gambia',
      description: 'Discover what makes The Gambia the perfect MICE destination',
      icon: Globe2,
      path: '/destination/why-gambia',
      color: 'bg-blue-500',
    },
    {
      title: 'Attractions',
      description: 'Explore beaches, nature reserves, cultural and historical sites',
      icon: Palmtree,
      path: '/destination/attractions',
      color: 'bg-green-500',
    },
    {
      title: 'Hotels & Accommodation',
      description: 'Browse partner hotels and accommodation options',
      icon: Hotel,
      path: '/destination/hotels',
      color: 'bg-purple-500',
    },
    {
      title: 'Travel Information',
      description: 'Visa, airport, currency, health and safety information',
      icon: Plane,
      path: '/destination/travel-info',
      color: 'bg-orange-500',
    },
    {
      title: 'Investment Opportunities',
      description: 'Conference tourism and business investment resources',
      icon: Briefcase,
      path: '/destination/investment',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="pt-20">
      <SEO
        title="Destination Gambia — MICE Destination Overview"
        description="Discover The Gambia as a premier MICE destination. Explore attractions, hotels, travel info, and investment opportunities."
      />

      {/* Hero */}
      <section className="relative py-32 bg-gradient-to-br from-[#1F85A8] to-blue-700">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.heroBg})` }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
            <Globe2 size={16} />
            Gateway to West Africa
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Destination <span className="text-blue-300">Gambia</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            The Smiling Coast of Africa awaits. Discover why The Gambia is West Africa's premier destination for conferences, meetings, and events.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Population', value: '2.5M+' },
              { icon: Globe2, label: 'Languages', value: 'English' },
              { icon: Shield, label: 'Stability', value: 'Peaceful' },
              { icon: TrendingUp, label: 'Growing Economy', value: '5.6% GDP' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="mx-auto text-[#1F85A8] mb-3" size={32} />
                <p className="text-2xl font-bold text-[#1F85A8] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Explore The Gambia</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about The Gambia as your next event destination
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Link
                key={section.path}
                to={section.path}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`${section.color} p-6 flex items-center justify-center h-32`}>
                  <section.icon className="text-white" size={48} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1F85A8] mb-2 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                  <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1F85A8] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Experience The Gambia?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Plan your event at the Banjul International Convention Centre and discover the warmth of African hospitality.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Book Your Event <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
