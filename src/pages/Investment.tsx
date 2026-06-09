import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Building2, Users, Globe2, ArrowRight, CheckCircle, FileText, Phone, Mail } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

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

  const resources = [
    { name: 'Gambia Investment and Export Promotion Agency (GIEPA)', description: 'One-stop shop for investors', contact: 'www.giepa.gm', icon: Globe2 },
    { name: 'Ministry of Tourism & Culture', description: 'Tourism sector development', contact: '+220 446 2491', icon: Phone },
    { name: 'Gambia Chamber of Commerce', description: 'Business networking and support', contact: 'www.gcc.gm', icon: Building2 },
  ];

  return (
    <div className="pt-20">
      <SEO
        title="Investment Opportunities in The Gambia"
        description="Explore investment opportunities in The Gambia's growing MICE and tourism sectors."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 to-green-600">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.conferenceExterior})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Link to="/destination" className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors">
            <ArrowRight size={16} className="rotate-180" />
            <span className="text-sm font-medium">Back to Destination Gambia</span>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Investment <span className="text-green-300">Opportunities</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover business opportunities in The Gambia's expanding MICE and tourism sectors
          </p>
        </div>
      </section>

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
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''} bg-gradient-to-br ${i === 0 ? 'from-blue-500 to-blue-600' : i === 1 ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} rounded-2xl p-12 flex items-center justify-center`}>
                  <sector.icon className="text-white" size={120} />
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
            {resources.map((resource, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="bg-[#1F85A8] p-8 flex items-center justify-center">
                  <resource.icon className="text-white" size={48} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1F85A8] mb-2">{resource.name}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="text-sm text-blue-600 font-medium">{resource.contact}</div>
                </div>
              </div>
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
