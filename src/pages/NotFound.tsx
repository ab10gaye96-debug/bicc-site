import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Calendar, Building2, Phone } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="max-w-2xl w-full text-center">
        {/* Big 404 */}
        <div className="relative mb-8">
          <div className="text-[160px] sm:text-[200px] font-black text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[#1F85A8] rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="text-white" size={40} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F85A8] mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Home, label: 'Home', path: '/', desc: 'Back to homepage' },
            { icon: Building2, label: 'Venues', path: '/venues', desc: 'Explore our spaces' },
            { icon: Calendar, label: 'Events', path: '/events', desc: 'Upcoming events' },
          ].map(link => (
            <Link key={link.path} to={link.path}
              className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md hover:bg-blue-50 transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <link.icon className="text-blue-700" size={22} />
              </div>
              <span className="font-semibold text-[#1F85A8]">{link.label}</span>
              <span className="text-xs text-gray-400">{link.desc}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all">
            <Home size={18} /> Go to Homepage
          </Link>
          <Link to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#1F85A8] text-[#1F85A8] rounded-xl font-bold hover:bg-[#1F85A8] hover:text-white transition-all">
            <Phone size={18} /> Contact Us
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Need help? Call us at{' '}
          <a href="tel:+2207784425" className="text-[#1F85A8] font-medium hover:underline">
            +220 7784425
          </a>
        </p>
      </div>
    </div>
  );
}
