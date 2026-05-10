import { Award, Globe2, Heart, Lightbulb, Shield, Target, Users, Building2 } from 'lucide-react';
import { IMAGES } from '../images';

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${IMAGES.heroBg})` }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">About Us</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Positioning The Gambia as Africa's Leading MICE Destination
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Established by the Government of The Gambia to advance the country's Meetings, Incentives, Conferences and Exhibitions industry.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8] mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Banjul International Convention Centre (BICC) was born from The Gambia's ambition to become a premier destination 
                for international events and diplomacy. Originally established as the OIC Secretariat in preparation for the 15th OIC 
                Islamic Summit held in Banjul in May 2024, the organization was officially renamed and restructured as BICC — a limited 
                liability company with a broader mandate.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                BICC manages two landmark facilities: the Sir Dawda Kairaba Jawara International Conference Centre (SDKJ-ICC) — a $50 million, 
                14,000m² state-of-the-art complex inaugurated by President Adama Barrow in January 2020, and the VVIP Lounge at Banjul 
                International Airport.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The Conference Centre is named after Sir Dawda Kairaba Jawara, The Gambia's first president and father of the nation, 
                honoring his towering legacy. Nestled in the scenic Bijilo National Park and overlooking the Atlantic Ocean, it stands as 
                the largest conference centre in the sub-region.
              </p>
            </div>
            <div className="space-y-4">
              <img src={IMAGES.heroBg} alt="SDKJ Conference Centre" className="rounded-2xl shadow-lg w-full aspect-[4/3] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-10 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-blue-700" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#1F85A8] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide comprehensive event management services that ensure every conference, meeting, and ceremony reflects 
                our core values of Excellence, Innovation, Sustainability, Service, and Integrity. We are committed to delivering 
                tailored event solutions for summits, conferences, and special events that connect people, ideas, and opportunities.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-10 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Globe2 className="text-blue-700" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#1F85A8] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To position The Gambia as a leading Meetings, Incentives, Conferences, and Exhibitions (MICE) destination in Africa 
                and beyond. As a national asset, BICC plays a central role in promoting The Gambia's diplomacy, culture, and economic 
                growth by hosting world-class events that inspire collaboration and progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Award, title: 'Excellence', desc: 'Striving for the highest standards in everything we do' },
              { icon: Lightbulb, title: 'Innovation', desc: 'Embracing creative solutions and cutting-edge technology' },
              { icon: Globe2, title: 'Sustainability', desc: 'Building a responsible and lasting impact for future generations' },
              { icon: Heart, title: 'Service', desc: 'Going above and beyond with Gambian hospitality' },
              { icon: Shield, title: 'Integrity', desc: 'Operating with transparency, honesty, and accountability' },
            ].map((value, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-blue-700" size={24} />
                </div>
                <h3 className="font-bold text-[#1F85A8] mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-20 bg-[#1F85A8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Key Facts</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: '$50M', label: 'Investment in the facility' },
              { icon: Users, value: '51-200', label: 'Dedicated employees' },
              { icon: Globe2, value: '2020', label: 'Year inaugurated' },
              { icon: Award, value: '#1', label: 'Largest in the sub-region' },
            ].map((fact, i) => (
              <div key={i} className="text-center bg-white/5 rounded-2xl p-8 border border-white/10">
                <fact.icon className="mx-auto text-blue-400 mb-4" size={32} />
                <div className="text-3xl font-bold text-white mb-2">{fact.value}</div>
                <div className="text-gray-400">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


