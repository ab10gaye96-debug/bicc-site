import { useState } from 'react';
import { submitContact } from '../api';
import { usePageContent } from '../hooks/usePageContent';
import { sendContactConfirmationEmail, sendContactNotificationEmail } from '../emailService';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import HeroBackgroundSlideshow from '../components/ui/HeroBackgroundSlideshow';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { data: cmsContent } = usePageContent('contact');
  const { data: footerContent } = usePageContent('footer');

  const heroEyebrow = cmsContent?.hero?.eyebrow || 'Get in Touch';
  const heroTitle = cmsContent?.hero?.title || 'Contact Us';
  const heroDescription = cmsContent?.hero?.description || "Have a question or want to book an event? We'd love to hear from you.";
  const heroBackgroundImage = cmsContent?.hero?.backgroundImage || '/images/vvip-lounge.jpg';
  const heroBackgroundImages = Array.isArray(cmsContent?.hero?.backgroundImages) ? cmsContent.hero.backgroundImages.filter(Boolean) : [];
  const heroSlideIntervalSeconds = Math.max(1, Number(cmsContent?.hero?.slideIntervalSeconds) || 5);
  const officeTitle = cmsContent?.office?.title || 'Contact Information';
  const contactItems = [
    { icon: MapPin, title: 'Location', text: cmsContent?.office?.address || 'Sir Dawda Kairaba Jawara International Conference Centre, Bijilo, The Gambia' },
    { icon: Phone, title: 'Phone', text: [cmsContent?.office?.phone1 || '+220 7784425', cmsContent?.office?.phone2 || '+220 3728659'].filter(Boolean).join('\n') },
    { icon: Mail, title: 'Email', text: cmsContent?.office?.email || 'info@bicc.gm' },
    { icon: Clock, title: 'Working Hours', text: cmsContent?.office?.hours || 'Monday - Friday\n8:00 AM - 5:00 PM' },
  ];
  const socialTitle = cmsContent?.social?.title || 'Follow Us';
  const formTitle = cmsContent?.form?.title || 'Send Us a Message';
  const formDescription = cmsContent?.form?.description || "Fill in the form below and we'll get back to you as soon as possible.";
  const formSuccessMessage = cmsContent?.form?.successMessage || 'Thank you! Your message has been sent successfully.';
  const submitButtonText = cmsContent?.form?.buttonText || 'Send Message';
  const mapTitle = cmsContent?.map?.title || 'Find Us';
  const mapDescription = cmsContent?.map?.description || 'Sir Dawda Kairaba Jawara International Conference Centre, Bijilo, The Gambia';
  const mapOpenButtonText = cmsContent?.map?.openButtonText || 'Open in Google Maps';
  const mapDirectionsButtonText = cmsContent?.map?.directionsButtonText || 'Get Directions';
  const facebookUrl = footerContent?.social?.facebook || 'https://www.facebook.com/BICCGM';
  const instagramUrl = footerContent?.social?.instagram || 'https://www.instagram.com/banjulconventioncentre/';
  const linkedinUrl = footerContent?.social?.linkedin || 'https://www.linkedin.com/company/banjul-international-convention-centre/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContact(form);
      // Fire both emails — notify staff + confirm to sender
      await Promise.allSettled([
        sendContactNotificationEmail(form),
        sendContactConfirmationEmail(form),
      ]);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-36">
      <SEO
        title="Contact Us"
        description="Get in touch with the Banjul International Convention Centre. Call us, email us, or fill in the contact form for event inquiries and bookings."
      />
      <section className="relative py-24 bg-[#1F85A8]">
        <HeroBackgroundSlideshow
          backgroundImage={heroBackgroundImage}
          images={heroBackgroundImages}
          intervalSeconds={heroSlideIntervalSeconds}
          showIndicators
        >
          <div className="absolute inset-0 bg-black/40" />
        </HeroBackgroundSlideshow>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">{heroEyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">{heroTitle}</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">{heroDescription}</p>
        </div>
      </section>
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8] mb-6">{officeTitle}</h2>
                <div className="space-y-4 sm:space-y-6">
                  {contactItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="text-blue-700" size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1F85A8] text-sm sm:text-base">{item.title}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 whitespace-pre-line break-words">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Social Links */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-[#1F85A8] mb-4 text-sm sm:text-base">{socialTitle}</h3>
                <div className="space-y-2 sm:space-y-3">
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 hover:text-blue-700 transition-colors">
                    <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">📘</span>Facebook
                  </a>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 hover:text-blue-700 transition-colors">
                    <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">📸</span>Instagram
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 hover:text-blue-700 transition-colors">
                    <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">💼</span>LinkedIn
                  </a>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div className="sm:col-span-1 lg:col-span-2">
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F85A8] mb-2">{formTitle}</h2>
                <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">{formDescription}</p>
                {submitted && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <p className="text-green-700 text-xs sm:text-sm font-medium">{formSuccessMessage}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#1F85A8] mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#1F85A8] mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#1F85A8] mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                        placeholder="+220 7784425"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#1F85A8] mb-2">Subject *</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                        placeholder="Event inquiry, booking, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#1F85A8] mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm resize-none"
                      placeholder="Tell us about your event or inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <Send size={18} /> {sending ? 'Sending...' : submitButtonText}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8]">{mapTitle}</h2>
            <p className="text-gray-500 mt-2 text-sm">{mapDescription}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              title="BICC Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.4!2d-16.7189!3d13.4549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec29b4b48d8fa2b%3A0xb3dc0c81c63b3c4e!2sSir%20Dawda%20Kairaba%20Jawara%20International%20Conference%20Centre!5e0!3m2!1sen!2sgm!4v1700000000000!5m2!1sen!2sgm"
              width="100%"
              height="300"
              className="sm:h-[450px]"
              style={{ border: 0, display: 'block', height: 'clamp(250px, 40vw, 450px)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://maps.google.com/?q=Sir+Dawda+Kairaba+Jawara+International+Conference+Centre+Bijilo+Gambia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-semibold hover:bg-[#1a6d8a] transition-all text-sm"
            >
              {mapOpenButtonText}
            </a>
            <a
              href="https://maps.google.com/?q=Sir+Dawda+Kairaba+Jawara+International+Conference+Centre+Bijilo+Gambia&dirflg=d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#1F85A8] text-[#1F85A8] rounded-xl font-semibold hover:bg-[#1F85A8] hover:text-white transition-all text-sm"
            >
              {mapDirectionsButtonText}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


