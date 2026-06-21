import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Building2, Users, Globe2, ArrowRight, CheckCircle, Phone, Mail, ExternalLink } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import DestinationImage from '../components/destination/DestinationImage';
import ExternalSiteLink from '../components/destination/ExternalSiteLink';
import { INVESTMENT_RESOURCES } from '../data/destinationData';

export default function Investment() {
  const sectors = [
    {
      title: 'Conference Tourism',
      description: 'Growing MICE industry with government support and strategic location',
      opportunities: [
        'Hotel and accommodation development',
        'Conference support services',
        'Event management companies',
        'Audio-visual and technical services',
      ],
      icon: Users,
    },
    {
      title: 'Hospitality Infrastructure',
      description: 'Expanding tourism sector with increasing international arrivals',
      opportunities: [
        'Boutique hotels and resorts',
        'Restaurants and dining establishments',
        'Entertainment and leisure facilities',
        'Transportation services',
      ],
      icon: Building2,
    },
    {
      title: 'Business Services',
      description: 'Supporting the MICE industry with professional services',
      opportunities: [
        'Translation and interpretation services',
        'Catering and food services',
        'Security services',
        'Event production and staging',
      ],
      icon: Briefcase,
    },
  ];

  const incentives = [
    { title: 'Tax Holidays', description: 'Up to 5 years for tourism investments' },
    { title: 'Investment Guarantees', description: 'Protection against nationalization' },
    { title: 'Repatriation Rights', description: 'Free repatriation of profits and capital' },
    { title: 'Duty Exemptions', description: 'Import duty relief for capital equipment' },
  ];

  const resources = INVESTMENT_RESOURCES;

  const sectorImages = [
    'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Senegambia_area%2C_Gambia.jpg/800px-Senegambia_area%2C_Gambia.jpg',
    'https://www.oicgambia.org/media/nav/conference-center-2.jpg',
  ];

  return (
    <div>
      <SEO
        title="Investment Opportunities in The Gambia"
        description="Explore investment opportunities in The Gambia's growing MICE and tourism sectors."
      />

      <PageHero
        eyebrow="Destination Gambia"
        title="Investment Opportunities"
        description="Discover business opportunities in The Gambia's expanding MICE and tourism sectors"
        backgroundImage="https://www.oicgambia.org/media/nav/conference-center-4.jpg"
        compact
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/destination" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium transition-colors">
            <ArrowRight size={16} className="rotate-180" /> Back to Destination Gambia
          </Link>
          <ExternalSiteLink href="https://giepa.gm/" label="GIEPA Official Site" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white" />
        </div>
      </PageHero>

      {/* Why Invest */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Why Invest in The Gambia?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              A stable, welcoming environment for business with strong government support for tourism and MICE industry development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: TrendingUp, title: 'Growing Economy', desc: '5.6% GDP growth rate' },
              { icon: Users, title: 'Strategic Location', desc: 'Gateway to West Africa' },
              { icon: Building2, title: 'Modern Infrastructure', desc: 'World-class conference facilities' },
              { icon: Globe2, title: 'Business-Friendly', desc: 'Investor-friendly policies' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-[#1F85A8]" size={32} />
                </div>
                <h3 className="font-bold text-[#1F85A8] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Sectors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Key Investment Sectors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across the MICE and tourism value chain
            </p>
          </div>

          <div className="space-y-12">
            {sectors.map((sector, i) => (
              <div
                key={i}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                    <sector.icon className="text-[#1F85A8]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F85A8] mb-3">{sector.title}</h3>
                  <p className="text-gray-600 mb-6">{sector.description}</p>
                  <h4 className="font-bold text-gray-800 mb-3">Investment Opportunities:</h4>
                  <ul className="space-y-2">
                    {sector.opportunities.map((opp, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                        <span className="text-gray-700">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''} rounded-2xl overflow-hidden shadow-lg`}>
                  <DestinationImage
                    src={sectorImages[i]}
                    alt={sector.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Incentives */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Investment Incentives</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The Government of The Gambia offers attractive incentives for tourism and MICE investments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {incentives.map((incentive, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <h3 className="font-bold text-[#1F85A8] mb-2">{incentive.title}</h3>
                <p className="text-sm text-gray-600">{incentive.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mb-4">Investment Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key organizations supporting investors in The Gambia
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <DestinationImage
                  src={resource.image || IMAGES.conferenceExterior}
                  alt={resource.name}
                  className="w-full aspect-[16/9] object-cover"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#1F85A8] group-hover:text-blue-700">{resource.name}</h3>
                    <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 shrink-0" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{resource.description}</p>
                  {resource.phone && <p className="text-sm text-gray-500">{resource.phone}</p>}
                  {resource.email && (
                    <p className="text-sm text-blue-600 mt-1">{resource.email}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 mt-4">
                    Visit website <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BICC Partnership */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1F85A8] to-blue-700 rounded-2xl p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Partner with BICC</h2>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  The Banjul International Convention Centre welcomes partnerships with service providers, hospitality businesses, and investors in the MICE sector.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Preferred vendor opportunities',
                    'Access to event organizers and delegates',
                    'Collaborative marketing initiatives',
                    'Business development support',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-green-300 mt-0.5 shrink-0" size={18} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} />
                    <div>
                      <p className="text-sm text-gray-300">Email</p>
                      <a href="mailto:partnerships@bicc.gm" className="font-semibold hover:text-blue-300">partnerships@bicc.gm</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} />
                    <div>
                      <p className="text-sm text-gray-300">Phone</p>
                      <a href="tel:+2207784425" className="font-semibold hover:text-blue-300">+220 778 4425</a>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all mt-6"
                  >
                    Contact Us <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
