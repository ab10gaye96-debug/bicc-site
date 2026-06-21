import { useState, useEffect } from 'react';
import { submitBooking, checkAvailability, fetchContentSection } from '../api';
import { sendBookingNotificationEmail, sendBookingConfirmationEmail } from '../emailService';
import { Building2, Calendar, Users, CheckCircle, Send, ChevronDown, Hash, Printer, AlertTriangle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const EVENT_TYPES = [
  'Conference', 'Workshop', 'Banquet', 'Training', 'Exhibition',
  'Graduation', 'Meeting', 'Seminar', 'Press Conference', 'Product Launch',
  'Wedding Reception', 'Other',
];



const VENUES = [
  { id: 'plenary-hall', name: 'Plenary Hall', capacity: '1,013 seats' },
  { id: 'banquet-hall-a', name: 'Banquet Hall A', capacity: '500 guests' },
  { id: 'banquet-hall-b', name: 'Banquet Hall B', capacity: '250 guests' },
  { id: 'meeting-room-1', name: 'Meeting Room 1', capacity: '50 people' },
  { id: 'meeting-room-2', name: 'Meeting Room 2', capacity: '50 people' },
  { id: 'meeting-room-3', name: 'Meeting Room 3', capacity: '50 people' },
  { id: 'meeting-room-4', name: 'Meeting Room 4', capacity: '50 people' },
  { id: 'vvip-lounge', name: 'VVIP Lounge', capacity: '100 people' },
  { id: 'outdoor-space', name: 'Outdoor Space', capacity: 'Flexible' },
];

const ENHANCED_SERVICES = [
  'Food Catering',
  'Beverages',
  'Photography',
  'Video Services',
  'On-Site Banners/Billboards',
  'E-Conferencing',
  'Sound System',
  'Projector & Screen',
  'Decoration',
  'VIP Setup',
  'Translation Services',
  'Security Services',
  'Parking Requirements',
  'Accommodation Arrangements',
  'Transport Services',
  'Livestream Services',
  'Exhibition Booth Setup',
  'Other',
];

const initialForm = {
  institutionName: '',
  firstName: '',
  lastName: '',
  email: '',
  primaryPhone: '',
  alternatePhone: '',
  streetAddress: '',
  city: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  participants: '',
  eventType: '',
  otherEventType: '',
  venues: [] as string[],
  services: [] as string[],
  otherService: '',
  eventDescription: '',
  specialRequirements: '',
};

function generateRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BICC-${year}-${rand}`;
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const prefilledDate = searchParams.get('date') || '';

  const [form, setForm] = useState({ ...initialForm, startDate: prefilledDate });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [availability, setAvailability] = useState<{ checking: boolean; conflicts: any[] | null }>({ checking: false, conflicts: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [pageContent, setPageContent] = useState<any>({
    hero: {
      eyebrow: 'Reserve Your Space',
      title: 'Book an Event',
      description: 'Complete the form below to request a venue booking at the Banjul International Convention Centre. Our team will review your request and get back to you promptly.',
      backgroundImage: '/images/conference-hall.jpg',
    },
    success: {
      title: 'Booking Request Submitted!',
      description: 'Thank you. Our team will review your request and contact you within 1–2 business days to confirm availability and discuss further details.',
      referenceLabel: 'Your Booking Reference',
      confirmationText: 'A confirmation email has been sent to your email address. Please quote your reference number in any correspondence.',
    },
  });

  // Check availability whenever dates or selected venues change.
  useEffect(() => {
    if (!form.startDate) { setAvailability({ checking: false, conflicts: null }); return; }
    let cancelled = false;
    setAvailability(prev => ({ ...prev, checking: true }));
    const handle = setTimeout(() => {
      checkAvailability(form.startDate, form.endDate || form.startDate, form.venues)
        .then(conflicts => { if (!cancelled) setAvailability({ checking: false, conflicts }); })
        .catch(() => { if (!cancelled) setAvailability({ checking: false, conflicts: null }); });
    }, 400);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [form.startDate, form.endDate, form.venues]);

  // Fetch managed page content
  useEffect(() => {
    fetchContentSection('bookingPage')
      .then(content => {
        if (content) {
          setPageContent(content);
        }
      })
      .catch(err => {
        console.error('Error loading booking page content:', err);
      });
  }, []);

  // If date param changes after mount, update form
  useEffect(() => {
    if (prefilledDate) {
      setForm(prev => ({ ...prev, startDate: prefilledDate }));
    }
  }, [prefilledDate]);

  const set = (field: keyof typeof initialForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleVenue = (venueId: string) => {
    setForm(prev => ({
      ...prev,
      venues: prev.venues.includes(venueId)
        ? prev.venues.filter(v => v !== venueId)
        : [...prev.venues, venueId],
    }));
  };

  const toggleService = (service: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (availability.conflicts && availability.conflicts.length > 0) {
      const proceed = confirm(
        `The selected dates overlap with ${availability.conflicts.length} existing booking(s). ` +
        `You can still submit your request and our team will confirm availability. Continue?`
      );
      if (!proceed) return;
    }
    setSending(true);
    try {
      const ref = generateRef();
      await submitBooking({ ...form, refNumber: ref });

      // Fire both emails — don't block on failure
      const emailData = {
        refNumber: ref,
        institutionName: form.institutionName,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        primaryPhone: form.primaryPhone,
        eventType: form.eventType === 'Other' ? form.otherEventType : form.eventType,
        startDate: form.startDate,
        endDate: form.endDate,
        participants: form.participants,
      };
      await Promise.allSettled([
        sendBookingNotificationEmail(emailData),
        sendBookingConfirmationEmail(emailData),
      ]);

      setRefNumber(ref);
      setSubmitted(true);
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Booking Error:', error);
      setErrorMessage('Failed to submit your booking request. Please try again.');
    } finally {
      setSending(false);
    }
  };
  const inputClass =
    'w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm';
  const labelClass = 'block text-xs sm:text-sm font-medium text-[#1F85A8] mb-1.5';

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${pageContent.hero?.backgroundImage || '/images/conference-hall.jpg'})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-300 font-semibold text-sm tracking-widest uppercase">{pageContent.hero?.eyebrow || 'Reserve Your Space'}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">{pageContent.hero?.title || 'Book an Event'}</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {pageContent.hero?.description || 'Complete the form below to request a venue booking at the Banjul International Convention Centre. Our team will review your request and get back to you promptly.'}
          </p>
        </div>
      </section>

      {/* Form / Success */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">

          {submitted ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-10 text-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F85A8] mb-2 sm:mb-3">{pageContent.success?.title || 'Booking Request Submitted!'}</h2>
              <p className="text-gray-500 mb-4 sm:mb-6 max-w-lg mx-auto text-sm sm:text-base">
                {pageContent.success?.description || 'Thank you. Our team will review your request and contact you within 1–2 business days to confirm availability and discuss further details.'}
              </p>
              <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 mb-6 sm:mb-8">
                <Hash className="text-blue-600 shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{pageContent.success?.referenceLabel || 'Your Booking Reference'}</p>
                  <p className="text-lg sm:text-xl font-bold text-[#1F85A8] tracking-wider">{refNumber}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                {pageContent.success?.confirmationText || 'A confirmation email has been sent to your email address. Please quote your reference number in any correspondence.'}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#1F85A8] text-[#1F85A8] rounded-lg sm:rounded-xl font-bold hover:bg-[#1F85A8] hover:text-white transition-all text-sm sm:text-base"
                >
                  <Printer size={18} /> Print / Save PDF
                </button>
                <button
                  onClick={() => { setSubmitted(false); setRefNumber(''); }}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1F85A8] text-white rounded-lg sm:rounded-xl font-bold hover:bg-[#1a6d8a] transition-all text-sm sm:text-base"
                >
                  Submit Another Booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Organisation Information */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="text-blue-700" size={20} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F85A8]">Organisation Information</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Institution / Organisation Name *</label>
                    <input required type="text" value={form.institutionName}
                      onChange={e => set('institutionName', e.target.value)}
                      placeholder="e.g., Ministry of Finance" className={inputClass} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>First Name *</label>
                      <input required type="text" value={form.firstName}
                        onChange={e => set('firstName', e.target.value)}
                        placeholder="First name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name *</label>
                      <input required type="text" value={form.lastName}
                        onChange={e => set('lastName', e.target.value)}
                        placeholder="Last name" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input required type="email" value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="your@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Primary Phone *</label>
                      <input required type="tel" value={form.primaryPhone}
                        onChange={e => set('primaryPhone', e.target.value)}
                        placeholder="+220 7784425" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Alternate Phone</label>
                      <input type="tel" value={form.alternatePhone}
                        onChange={e => set('alternatePhone', e.target.value)}
                        placeholder="+220 3728659" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>City</label>
                      <input type="text" value={form.city}
                        onChange={e => set('city', e.target.value)}
                        placeholder="e.g., Banjul" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input type="text" value={form.streetAddress}
                      onChange={e => set('streetAddress', e.target.value)}
                      placeholder="Street address" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Venue Selection */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="text-blue-700" size={20} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F85A8]">Venue Selection</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6 pl-0 sm:pl-13">Select the venue(s) you need for your event.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {VENUES.map(venue => (
                    <label key={venue.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.venues.includes(venue.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}>
                      <input type="checkbox" checked={form.venues.includes(venue.id)}
                        onChange={() => toggleVenue(venue.id)} className="w-4 h-4 accent-blue-600 mt-1" />
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-800 block">{venue.name}</span>
                        <span className="text-xs text-gray-500">{venue.capacity}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Event Schedule */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="text-blue-700" size={20} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F85A8]">Event Schedule</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Start Date *</label>
                    <input required type="date" value={form.startDate}
                      onChange={e => set('startDate', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Start Time *</label>
                    <input required type="time" value={form.startTime}
                      onChange={e => set('startTime', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date *</label>
                    <input required type="date" value={form.endDate}
                      onChange={e => set('endDate', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Time *</label>
                    <input required type="time" value={form.endTime}
                      onChange={e => set('endTime', e.target.value)} className={inputClass} />
                  </div>
                </div>

                {/* Live availability feedback */}
                {form.startDate && (
                  <div className="mt-5">
                    {availability.checking ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 size={16} className="animate-spin" /> Checking availability…
                      </div>
                    ) : availability.conflicts && availability.conflicts.length > 0 ? (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span>
                          These dates overlap with {availability.conflicts.length} existing booking(s).
                          You can still submit — our team will confirm final availability
                          {form.venues.length === 0 ? '. Tip: select specific venues above for a more precise check.' : '.'}
                        </span>
                      </div>
                    ) : availability.conflicts && availability.conflicts.length === 0 ? (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                        <CheckCircle size={18} className="shrink-0" /> These dates appear to be available.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="text-blue-700" size={20} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F85A8]">Event Details</h2>
                </div>
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Number of Participants *</label>
                      <input required type="number" min="1" value={form.participants}
                        onChange={e => set('participants', e.target.value)}
                        placeholder="e.g., 200" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Event Type *</label>
                      <div className="relative">
                        <select required value={form.eventType}
                          onChange={e => set('eventType', e.target.value)}
                          className={`${inputClass} appearance-none pr-10`}>
                          <option value="">Select event type</option>
                          {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  {form.eventType === 'Other' && (
                    <div>
                      <label className={labelClass}>Specify Event Type *</label>
                      <input required type="text" value={form.otherEventType}
                        onChange={e => set('otherEventType', e.target.value)}
                        placeholder="Please describe the event type" className={inputClass} />
                    </div>
                  )}
                </div>
              </div>

              {/* Services Required */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="text-blue-700" size={20} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F85A8]">Services Required</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6 pl-0 sm:pl-13">Select all services you require for your event.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ENHANCED_SERVICES.map(service => (
                    <label key={service}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        form.services.includes(service)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}>
                      <input type="checkbox" checked={form.services.includes(service)}
                        onChange={() => toggleService(service)} className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
                {form.services.includes('Other') && (
                  <div className="mt-5">
                    <label className={labelClass}>Specify Service Required *</label>
                    <input required type="text" value={form.otherService}
                      onChange={e => set('otherService', e.target.value)}
                      placeholder="Please describe the additional service" className={inputClass} />
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-[#1F85A8] mb-6">Additional Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Event Description</label>
                    <textarea rows={4} value={form.eventDescription}
                      onChange={e => set('eventDescription', e.target.value)}
                      placeholder="Provide a brief description of your event, its purpose, and any relevant background..."
                      className={`${inputClass} resize-none`} />
                  </div>
                  <div>
                    <label className={labelClass}>Special Requirements</label>
                    <textarea rows={3} value={form.specialRequirements}
                      onChange={e => set('specialRequirements', e.target.value)}
                      placeholder="Any special setup, accessibility needs, or other requirements..."
                      className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4">
                <button type="submit" disabled={sending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 text-base">
                  <Send size={18} />
                  {sending ? 'Submitting...' : 'Submit Booking Request'}
                </button>
                <p className="text-gray-500 text-sm">
                  Fields marked <span className="text-red-500 font-bold">*</span> are required.
                  We'll respond within 1–2 business days.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  ) ;
}
