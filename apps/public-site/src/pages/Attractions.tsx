import { Link } from 'react-router-dom';
import { Waves, TreePine, Palmtree, Landmark, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import AttractionCard from '../components/destination/AttractionCard';
import OfficialResourcesGrid from '../components/destination/OfficialResourcesGrid';
import ExternalSiteLink from '../components/destination/ExternalSiteLink';
import {
  BEACHES,
  CULTURAL_SITES,
  HISTORICAL_SITES,
  NATURE_RESERVES,
  OFFICIAL_RESOURCES,
} from '../data/destinationData';

export default function Attractions() {
  return (
    <div>
      <SEO
        title="Attractions in The Gambia — Beaches, Nature, Culture & History"
        description="Discover The Gambia's top attractions: pristine beaches, nature reserves, cultural sites, and UNESCO World Heritage landmarks."
      />

      <PageHero
        eyebrow="Destination Gambia"
        title="Attractions in The Gambia"
        description="From pristine Atlantic beaches to sacred forests, ancient stone circles to vibrant markets — unforgettable experiences await."
        backgroundImage="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/James_Island_%28Kunta_Kinteh%29.jpg/1280px-James_Island_%28Kunta_Kinteh%29.jpg"
        compact
      >
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link to="/destination" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium transition-colors">
            <ArrowRight size={16} className="rotate-180" /> Back to Destination Gambia
          </Link>
          <ExternalSiteLink
            href="https://visitthegambia.com/"
            label="Official tourism guide"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
          />
        </div>
      </PageHero>

      {/* Beaches */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading icon={Waves} color="blue" title="Beaches" subtitle="Golden sands along the Atlantic coastline" />
          <div className="grid md:grid-cols-2 gap-6">
            {BEACHES.map((beach) => (
              <AttractionCard key={beach.name} item={beach} layout="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* Nature */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading icon={TreePine} color="green" title="Nature Reserves" subtitle="Diverse ecosystems and wildlife" />
          <div className="grid sm:grid-cols-2 gap-6">
            {NATURE_RESERVES.map((item) => (
              <AttractionCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Cultural */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading icon={Palmtree} color="purple" title="Cultural Attractions" subtitle="Gambian culture and traditions" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURAL_SITES.map((item) => (
              <AttractionCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Historical */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading icon={Landmark} color="orange" title="Historical Sites" subtitle="Rich history and UNESCO heritage" />
          <div className="grid sm:grid-cols-2 gap-6">
            {HISTORICAL_SITES.map((item) => (
              <AttractionCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      <OfficialResourcesGrid
        resources={OFFICIAL_RESOURCES.filter((r) => ['Tourism', 'Heritage', 'Government'].includes(r.category))}
        title="Plan Your Visit"
        description="Official tourism and heritage resources for delegates and visitors"
      />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Plan Your Visit to The Gambia</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Combine your conference or event with an unforgettable cultural and natural experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition-all">
              Book Your Event <ArrowRight size={20} />
            </Link>
            <a href="https://visitthegambia.com/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all">
              Visit The Gambia Official Site
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  color,
  title,
  subtitle,
}: {
  icon: typeof Waves;
  color: 'blue' | 'green' | 'purple' | 'orange';
  title: string;
  subtitle: string;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[#1F85A8]">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
