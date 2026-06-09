import { Link } from 'react-router-dom';
import { Plane, FileText, DollarSign, Shield, AlertCircle, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';

export default function TravelInfo() {
  const visaInfo = [
    { country: 'ECOWAS Member States', requirement: 'Visa-free for up to 90 days', color: 'bg-green-100 text-green-800' },
    { country: 'Commonwealth Nations', requirement: 'Visa-free for up to 28 days', color: 'bg-green-100 text-green-800' },
    { country: 'UK, EU, USA, Canada', requirement: 'Visa-on-arrival available', color: 'bg-blue-100 text-blue-800' },
    { country: 'Other Countries', requirement: 'Visa required (apply at embassy)', color: 'bg-orange-100 text-orange-800' },
  ];

  const currencies = [
    { name: 'Gambian Dalasi (GMD)', symbol: 'D', rate: 'Approximately D60 = 1 USD' },
    { name: 'US Dollar', symbol: '$', note: 'Widely accepted' },
    { name: 'British Pound', symbol: '£', note: 'Accepted in major establishments' },
    { name: 'Euro', symbol: '€', note: 'Accepted in tourist areas' },
  ];

  const healthTips = [
    { title: 'Yellow Fever', description: 'Vaccination certificate required for travelers from endemic countries', required: true },
    { title: 'Malaria Prophylaxis', description: 'Recommended for all travelers', required: false },
    { title: 'COVID-19', description: 'Check current entry requirements before travel', required: false },
    { title: 'Travel Insurance', description: 'Comprehensive health insurance strongly recommended', required: false },
  ];

  const safetyTips = [
    'The Gambia is generally safe with low crime rates',
    'Use licensed taxis and ride-sharing services',
    'Keep valuables secure and avoid displaying expensive items',
    'Respect local customs and dress modestly outside tourist areas',
    'Drink bottled water and eat at reputable establishments',
    'Emergency Services: Police (117), Fire (118), Ambulance (116)',
  ];

  return (
    <div className="pt-20">
      <SEO
        title="Travel Information — The Gambia"
        description="Essential travel information for visiting The Gambia: visa requirements, airport info, currency, health, and safety tips."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-orange-600 to-red-600">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.conferenceExterior})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Link to="/destination" className="inline-flex items-center gap-2 text-orange-300 hover:text-white mb-6 transition-colors">
            <ArrowRight size={16} className="rotate-180" />
            <span className="text-sm font-medium">Back to Destination Gambia</span>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Travel <span className="text-orange-300">Information</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know to plan your visit to The Gambia
          </p>
        </div>
      </section>

      {/* Visa Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Visa Requirements</h2>
              <p className="text-gray-600">Entry requirements by nationality</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {visaInfo.map((info, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg text-[#1F85A8] mb-2">{info.country}</h3>
                <span className={`inline-block px-3 py-1 ${info.color} rounded-full text-sm font-semibold`}>
                  {info.requirement}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-3">
              <Info className="text-blue-600 shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Important Notes</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Passport must be valid for at least 6 months from arrival date</li>
                  <li>• Visa-on-arrival fee: Approximately $20-$50 USD (varies by nationality)</li>
                  <li>• Keep a copy of your passport and visa at all times</li>
                  <li>• For official delegations, contact the Ministry of Foreign Affairs for diplomatic arrangements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Airport Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Plane className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Airport Information</h2>
              <p className="text-gray-600">Banjul International Airport (BJL)</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#1F85A8] mb-4">Arrivals</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Modern terminal with duty-free shopping and restaurants</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Currency exchange and ATMs available</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>VVIP Lounge managed by BICC for official delegations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Licensed taxi services and car rentals</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#1F85A8] mb-4">Transportation</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Airport to BICC</p>
                  <p className="text-sm text-gray-600">Distance: Approximately 20 km (30-40 minutes)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Options:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Airport taxi: D500-700 (~$8-12)</li>
                    <li>• Hotel shuttle (arranged by hotel)</li>
                    <li>• Private car hire</li>
                    <li>• BICC can arrange transfers for event delegates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1F85A8]">Currency Information</h2>
              <p className="text-gray-600">Money matters and exchange</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {currencies.map((currency, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#1F85A8] mb-2">{currency.symbol}</div>
                <h3 className="font-bold text-gray-800 mb-1">{currency.name}</h3>
                <p className="text-sm text-gray-600">{currency.rate || currency.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-900 mb-3">Tips for Managing Money</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="shrink-0 mt-0.5" size={16} />
                <span>ATMs available in major towns and hotels</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="shrink-0 mt-0.5" size={16} />
                <span>Credit cards accepted at major establishments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="shrink-0 mt-0.5" size={16} />
                <span>Carry some cash for small vendors</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="shrink-0 mt-0.5" size={16} />
                <span>Banks open Mon-Fri 8am-3pm</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Health & Safety */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Health */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Shield className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#1F85A8]">Health Information</h2>
                  <p className="text-gray-600">Stay healthy during your visit</p>
                </div>
              </div>

              <div className="space-y-4">
                {healthTips.map((tip, i) => (
                  <div key={i} className="bg-white rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      {tip.required ? (
                        <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
                      ) : (
                        <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                      )}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                        {tip.required && (
                          <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                            REQUIRED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#1F85A8]">Safety Information</h2>
                  <p className="text-gray-600">Stay safe during your visit</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <ul className="space-y-3">
                  {safetyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-3">Important Contacts</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Police:</strong> 117</p>
                  <p><strong>Fire Service:</strong> 118</p>
                  <p><strong>Ambulance:</strong> 116</p>
                  <p><strong>Tourist Police:</strong> +220 422 7230</p>
                  <p><strong>BICC Security:</strong> +220 777 4425</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Need Assistance with Travel Arrangements?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Our team can help coordinate travel, visas, and accommodation for your event delegates.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Contact Us <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
