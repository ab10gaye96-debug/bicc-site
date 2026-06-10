import { Link } from 'react-router-dom';
import { Palmtree, Waves, TreePine, Landmark, Camera, ArrowRight, MapPin } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

export default function Attractions() {
  const beaches = [
    { name: 'Kotu Beach', description: 'Popular golden sand beach with water sports and beach bars', activities: 'Swimming, Jet Skiing, Beach Volleyball' },
    { name: 'Cape Point Beach', description: 'Pristine coastline perfect for sunset watching and relaxation', activities: 'Swimming, Sunbathing, Photography' },
    { name: 'Sanyang Beach', description: 'Scenic beach with local fishing village atmosphere', activities: 'Fishing, Swimming, Cultural Experience' },
    { name: 'Kololi Beach', description: 'Vibrant beach strip with restaurants and nightlife', activities: 'Dining, Swimming, Entertainment' },
  ];

  const nature = [
    {
      name: 'Abuko Nature Reserve',
      description: 'The Gambia\'s first nature reserve featuring diverse wildlife including monkeys, crocodiles, and over 270 bird species',
      highlights: ['Birdwatching', 'Walking Trails', 'Wildlife Photography'],
    },
    {
      name: 'Makasutu Culture Forest',
      description: 'Sacred forest and wildlife preserve offering canopy walks, boat trips, and traditional cultural experiences',
      highlights: ['Eco-Tourism', 'Cultural Tours', 'Boat Safaris'],
    },
    {
      name: 'Kiang West National Park',
      description: 'Largest protected area featuring bushbuck, warthogs, baboons, and diverse birdlife',
      highlights: ['Game Drives', 'Wildlife Viewing', 'Nature Trails'],
    },
    {
      name: 'Bijilo Forest Park',
      description: 'Coastal forest reserve known for its monkey populations and nature trails',
      highlights: ['Monkey Watching', 'Birdwatching', 'Nature Walks'],
    },
  ];

  const cultural = [
    {
      name: 'National Museum',
      description: 'Showcases Gambian history, culture, and archaeology with artifacts spanning centuries',
      location: 'Banjul',
    },
    {
      name: 'Kachikally Crocodile Pool',
      description: 'Sacred crocodile pool with cultural and spiritual significance, home to over 100 Nile crocodiles',
      location: 'Bakau',
    },
    {
      name: 'Craft Markets',
      description: 'Vibrant markets selling traditional crafts, textiles, wood carvings, and jewelry',
      location: 'Banjul, Serrekunda',
    },
    {
      name: 'Tanji Fishing Village',
      description: 'Authentic fishing community showcasing traditional livelihoods and boat-building',
      location: 'Tanji',
    },
  ];

  const historical = [
    {
      name: 'Kunta Kinteh Island (James Island)',
      description: 'UNESCO World Heritage Site, former slave trading post with ruins and historical significance',
      significance: 'Major site in trans-Atlantic slave trade history',
    },
    {
      name: 'Fort Bullen',
      description: 'Colonial-era fort built to suppress slave trade, now a protected historical monument',
      significance: '19th-century British military fortification',
    },
    {
      name: 'Arch 22',
      description: 'Gateway monument commemorating the 1994 coup, offering panoramic views of Banjul',
      significance: 'Iconic landmark and observation tower',
    },
    {
      name: 'Wassu Stone Circles',
      description: 'Ancient megalithic stone circles dating back over 1,000 years, UNESCO World Heritage Site',
      significance: 'Sacred burial ground and archaeological marvel',
    },
  ];

  return (
    <div className="pt-20">
      <SEO
        title="Attractions in The Gambia — Beaches, Nature, Culture & History"
        description="Discover The Gambia's top attractions: pristine beaches, nature reserves, cultural sites, and historical landmarks."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.heroBg})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Link to="/destination" className="inline-flex items-center gap-2 text-green-300 hover:text-white mb-6 transition-colors">
            <ArrowRight size={16} className="rotate-180" />
            <span className="text-sm font-medium">Back to Destination Gambia</span>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Attractions in <span className="text-green-300">The Gambia</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            From pristine Atlantic beaches to sacred forests, ancient stone circles to vibrant markets — The Gambia offers unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Beaches */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Waves className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Beaches</h2>
              <p className="text-gray-600">Golden sands along the Atlantic coastline</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {beaches.map((beach, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-[#1F85A8] mb-2">{beach.name}</h3>
                <p className="text-gray-600 mb-4">{beach.description}</p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Camera size={16} />
                  <span className="font-medium">{beach.activities}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nature Reserves */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TreePine className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Nature Reserves</h2>
              <p className="text-gray-600">Explore diverse ecosystems and wildlife</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {nature.map((reserve, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 flex items-center justify-center">
                  <TreePine className="text-white" size={64} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1F85A8] mb-3">{reserve.name}</h3>
                  <p className="text-gray-600 mb-4">{reserve.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {reserve.highlights.map((h, j) => (
                      <span key={j} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Attractions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Palmtree className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Cultural Attractions</h2>
              <p className="text-gray-600">Immerse yourself in Gambian culture and traditions</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultural.map((site, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-[#1F85A8] mb-2">{site.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{site.description}</p>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <MapPin size={14} />
                  <span className="font-medium">{site.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Sites */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Landmark className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Historical Sites</h2>
              <p className="text-gray-600">Discover The Gambia's rich history</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {historical.map((site, i) => (
              <div key={i} className="bg-white rounded-xl p-6 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-[#1F85A8] mb-2">{site.name}</h3>
                <p className="text-gray-600 mb-3">{site.description}</p>
                <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                  {site.significance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Plan Your Visit to The Gambia</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Combine your conference or event with an unforgettable cultural and natural experience.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Book Your Event <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
