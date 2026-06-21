import { Link } from 'react-router-dom';
import { ArrowRight, Globe2, Users, Shield, TrendingUp, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import OfficialResourcesGrid from '../components/destination/OfficialResourcesGrid';
import DestinationImage from '../components/destination/DestinationImage';
import ExternalSiteLink from '../components/destination/ExternalSiteLink';
import {
  DESTINATION_HERO_IMAGE,
  DESTINATION_SECTIONS,
  OFFICIAL_RESOURCES,
} from '../data/destinationData';

export default function DestinationGambia() {
  return (
    <div>
      <SEO
        title="Destination Gambia — MICE Destination Overview"
        description="Discover The Gambia as a premier MICE destination. Explore attractions, hotels, travel info, and investment opportunities."
      />

      <PageHero
        eyebrow="Gateway to West Africa"
        title="Destination Gambia"
        description="The Smiling Coast of Africa awaits. Discover why The Gambia is West Africa's premier destination for conferences, meetings, and events."
        backgroundImage={DESTINATION_HERO_IMAGE}
        compact
      >
        <ExternalSiteLink
          href="https://visitthegambia.com/"
          label="Official tourism site — Visit The Gambia"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
        />
      </PageHero>

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
            {DESTINATION_SECTIONS.map((section) => (
              <div
                key={section.path}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link to={section.path} className="block">
                  <DestinationImage
                    src={section.image}
                    alt={section.title}
                    className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1F85A8] mb-2 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      Explore section <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
                {section.externalUrl && (
                  <div className="px-6 pb-6 mt-auto pt-0 border-t border-gray-100">
                    <a
                      href={section.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 mt-4 transition-colors"
                    >
                      <ExternalLink size={13} />
                      {section.externalLabel}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <OfficialResourcesGrid resources={OFFICIAL_RESOURCES} />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1F85A8] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Experience The Gambia?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Plan your event at the Banjul International Convention Centre and discover the warmth of African hospitality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Book Your Event <ArrowRight size={20} />
            </Link>
            <a
              href="https://visitthegambia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Visit The Gambia <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
