import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { IMAGES } from '../images';

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
}
function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
function LinkedinIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>;
}

export default function Footer() {
  return (
    <footer className="bg-[#1F85A8] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={IMAGES.logo} alt="BICC Logo" className="h-12 w-auto rounded-md bg-white p-1 object-contain" />
              <div>
                <h3 className="text-white font-bold text-lg">BICC</h3>
                <p className="text-white/70 text-xs">Banjul International Convention Centre</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              The Gambia's national premier event management institution, dedicated to positioning The Gambia as a leading MICE destination in the region.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://www.facebook.com/BICCGM" target="_blank" rel="noopener noreferrer" aria-label="BICC Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#1F85A8] transition-all">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/banjulconventioncentre/" target="_blank" rel="noopener noreferrer" aria-label="BICC Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#1F85A8] transition-all">
                <InstagramIcon />
              </a>
              <a href="https://www.linkedin.com/company/banjul-international-convention-centre/" target="_blank" rel="noopener noreferrer" aria-label="BICC LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#1F85A8] transition-all">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Venues', path: '/venues' },
                { name: 'Upcoming Events', path: '/events' },
                { name: 'Photo Gallery', path: '/gallery' },
                { name: 'Latest News', path: '/news' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Facilities */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Our Facilities</h4>
            <ul className="space-y-3 text-sm">
              <li>Plenary Hall (1,013 seats)</li>
              <li>Banquet Hall A (500 guests)</li>
              <li>Banquet Hall B (250 guests)</li>
              <li>4 Thematic Meeting Rooms</li>
              <li>11 Bilateral Meeting Rooms</li>
              <li>VVIP Airport Lounge</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <span>Sir Dawda Kairaba Jawara International Conference Centre, Bijilo, The Gambia</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-white shrink-0 mt-0.5" />
                <div>
                  <p>+220 7784425</p>
                  <p>+220 3728659</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white shrink-0" />
                <span>info@bicc.gm</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-white shrink-0" />
                <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Banjul International Convention Centre (BICC). All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>Excellence</span>
            <span>•</span>
            <span>Innovation</span>
            <span>•</span>
            <span>Sustainability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}



