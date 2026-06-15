import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { IMAGES } from '../images';
import { useState, useEffect } from 'react';
import { fetchFooterContent } from '../api';

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
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    fetchFooterContent().then(data => {
      if (data) setCmsContent(data);
    });
  }, []);

  const brandTitle = cmsContent?.brand?.title || 'BICC';
  const brandSubtitle = cmsContent?.brand?.subtitle || 'Banjul International Convention Centre';
  const brandDescription = cmsContent?.brand?.description || "The Gambia's national premier event management institution, dedicated to positioning The Gambia as a leading MICE destination in the region.";
  const quickLinksLabel = cmsContent?.labels?.quickLinks || 'Quick Links';
  const resourcesLabel = cmsContent?.labels?.resources || 'Resources';
  const facilitiesLabel = cmsContent?.labels?.facilities || 'Our Facilities';
  const contactLabel = cmsContent?.labels?.contact || 'Contact Us';
  const address = cmsContent?.contact?.address || 'Sir Dawda Kairaba Jawara International Conference Centre\nBijilo, Kombo North\nThe Gambia';
  const phone1 = cmsContent?.contact?.phone1 || '+220 7784425';
  const phone2 = cmsContent?.contact?.phone2 || '+220 3728659';
  const email = cmsContent?.contact?.email || 'info@bicc.gm';
  const hours = cmsContent?.contact?.hours || 'Mon - Fri: 8:00 AM - 5:00 PM';
  const facebookUrl = cmsContent?.social?.facebook || "https://www.facebook.com/BICCGM";
  const instagramUrl = cmsContent?.social?.instagram || "https://www.instagram.com/banjulconventioncentre/";
  const linkedinUrl = cmsContent?.social?.linkedin || "https://www.linkedin.com/company/banjul-international-convention-centre/";
  const copyrightText = cmsContent?.copyright?.text || `© ${new Date().getFullYear()} Banjul International Convention Centre (BICC). All rights reserved.`;
  const bottomTags = [
    cmsContent?.bottomBar?.tag1 || 'Excellence',
    cmsContent?.bottomBar?.tag2 || 'Innovation',
    cmsContent?.bottomBar?.tag3 || 'Sustainability',
  ].filter(Boolean);
  const facilities = [
    cmsContent?.facilities?.item1 || 'Plenary Hall (1,013 seats)',
    cmsContent?.facilities?.item2 || 'Banquet Hall A (500 guests)',
    cmsContent?.facilities?.item3 || 'Banquet Hall B (250 guests)',
    cmsContent?.facilities?.item4 || '4 Thematic Meeting Rooms',
    cmsContent?.facilities?.item5 || '11 Bilateral Meeting Rooms',
    cmsContent?.facilities?.item6 || 'VVIP Airport Lounge',
  ].filter(Boolean);

  return (
    <footer className="bg-[#1F85A8] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={IMAGES.logo} alt="BICC Logo" className="h-12 w-auto rounded-md bg-white p-1 object-contain" />
              <div>
                <h3 className="text-white font-bold text-lg">{brandTitle}</h3>
                <p className="text-white/70 text-xs">{brandSubtitle}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {brandDescription}
            </p>
            <div className="flex gap-3 mt-6">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="BICC Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#1F85A8] transition-all">
                <FacebookIcon />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="BICC Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#1F85A8] transition-all">
                <InstagramIcon />
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="BICC LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#1F85A8] transition-all">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">{quickLinksLabel}</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Venues', path: '/venues' },
                { name: 'Services & Packages', path: '/services' },
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

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">{resourcesLabel}</h4>
            <ul className="space-y-3">
              {[
                { name: 'Destination Gambia', path: '/destination' },
                { name: 'Plan Your Event', path: '/plan-your-event' },
                { name: 'Downloads Centre', path: '/downloads' },
                { name: 'Careers', path: '/careers' },
                { name: 'Procurement & Tenders', path: '/procurement' },
                { name: 'Book an Event', path: '/booking' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Facilities */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">{facilitiesLabel}</h4>
            <ul className="space-y-3 text-sm">
              {facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">{contactLabel}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-white shrink-0 mt-0.5" />
                <div>
                  <p>{phone1}</p>
                  <p>{phone2}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-white shrink-0" />
                <span className="whitespace-pre-line">{hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {copyrightText}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            {bottomTags.map((tag, index) => (
              <span key={tag}>
                {index > 0 && <span className="mr-6">•</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


