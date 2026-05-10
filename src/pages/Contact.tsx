import { useState } from 'react';
import { submitContact } from '../api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContact(form);
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
    <div className="pt-20">
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/images/vvip-lounge.jpg)' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">Have a question or want to book an event? We'd love to hear from you.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1F85A8] mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, title: 'Location', text: 'Sir Dawda Kairaba Jawara International Conference Centre, Bijilo, The Gambia' },
                    { icon: Phone, title: 'Phone', text: '+220 7784425 / +220 3728659' },
                    { icon: Mail, title: 'Email', text: 'info@bicc.gm' },
                    { icon: Clock, title: 'Working Hours', text: 'Monday - Friday\n8:00 AM - 5:00 PM' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0"><item.icon className="text-blue-700" size={20} /></div>
                      <div><h3 className="font-semibold text-[#1F85A8]">{item.title}</h3><p className="text-gray-500 text-sm mt-1 whitespace-pre-line">{item.text}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-[#1F85A8] mb-4">Follow Us</h3>
                <div className="space-y-3">
                  <a href="https://www.facebook.com/BICCGM" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-700 transition-colors"><span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">📘</span>Facebook</a>
                  <a href="https://www.instagram.com/banjulconventioncentre/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-700 transition-colors"><span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">📸</span>Instagram</a>
                  <a href="https://www.linkedin.com/company/banjul-international-convention-centre/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-700 transition-colors"><span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">💼</span>LinkedIn</a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#1F85A8] mb-2">Send Us a Message</h2>
                <p className="text-gray-500 mb-8">Fill in the form below and we'll get back to you as soon as possible.</p>
                {submitted && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <p className="text-green-700 text-sm font-medium">Thank you! Your message has been sent successfully.</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-[#1F85A8] mb-2">Full Name *</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" placeholder="Your full name" /></div>
                    <div><label className="block text-sm font-medium text-[#1F85A8] mb-2">Email Address *</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" placeholder="your@email.com" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-[#1F85A8] mb-2">Phone Number</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" placeholder="+220 7784425" /></div>
                    <div><label className="block text-sm font-medium text-[#1F85A8] mb-2">Subject *</label><input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" placeholder="Event inquiry, booking, etc." /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-[#1F85A8] mb-2">Message *</label><textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none" placeholder="Tell us about your event or inquiry..." /></div>
                  <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-[#1F85A8] rounded-xl font-bold hover:from-blue-400 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50">
                    <Send size={18} /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


