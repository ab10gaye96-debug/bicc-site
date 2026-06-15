import { useState } from 'react';
import { RESERVED_BOOKING_STATUSES, fetchBookings } from '../api';
import { useApi } from '../hooks/useApi';
import { ChevronLeft, ChevronRight, Calendar, Info, Send, X, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const STATUS_COLORS: Record<string, string> = {
  Approved:  'bg-red-500',
  Pending:   'bg-yellow-400',
  'Under Review': 'bg-orange-500',
  Confirmed: 'bg-teal-500',
  Completed: 'bg-gray-400',
};

export default function Availability() {
  const { data: bookings } = useApi(() => fetchBookings(), []);
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<any[] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showQuickBook, setShowQuickBook] = useState(false);

  const reservedBookings = (bookings || []).filter(b => RESERVED_BOOKING_STATUSES.includes(b.status));

  // Build a map of date → bookings
  const bookingMap: Record<string, any[]> = {};
  reservedBookings.forEach(b => {
    if (!b.startDate || !b.endDate) return;
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    const cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().split('T')[0];
      if (!bookingMap[key]) bookingMap[key] = [];
      bookingMap[key].push(b);
      cur.setDate(cur.getDate() + 1);
    }
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayBookings = bookingMap[dateStr] || [];
    setSelectedDate(dateStr);
    setSelected(dayBookings);
    setShowQuickBook(false);
  };

  const handleBookThisDate = () => {
    navigate(`/booking?date=${selectedDate}`);
  };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const isAvailable = selected !== null && selected.length === 0;
  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : '';

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO
        title="Venue Availability"
        description="Check venue availability at the Banjul International Convention Centre. View booked dates and plan your event."
      />

      {/* Hero */}
      <section className="bg-[#1F85A8] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-300 font-semibold text-sm tracking-widest uppercase">Plan Your Event</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">Venue Availability</h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Click any date to check availability. Available dates can be booked instantly.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-8 bg-white rounded-2xl p-4 shadow-sm">
            <span className="text-sm font-semibold text-gray-600">Legend:</span>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-sm text-gray-600">Available</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span className="text-sm text-gray-600">Pending</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-sm text-gray-600">Under Review</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-sm text-gray-600">Approved</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500" /><span className="text-sm text-gray-600">Confirmed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-400" /><span className="text-sm text-gray-600">Completed</span></div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-[#1F85A8]">
                <button onClick={prevMonth}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-white font-bold text-lg">{MONTHS[month]} {year}</h2>
                <button onClick={nextMonth}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-7 border-b">
                {DAYS.map(d => (
                  <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  if (!day) return <div key={i} className="aspect-square border-b border-r border-gray-50" />;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayBookings = bookingMap[dateStr] || [];
                  const hasBooking = dayBookings.length > 0;
                  const topStatus = dayBookings[0]?.status;
                  const dotColor = STATUS_COLORS[topStatus] || '';
                  const past = isPast(day);
                  const isSelected = selectedDate === dateStr;
                  const available = !hasBooking && !past;

                  return (
                    <button key={i}
                      onClick={() => !past && handleDayClick(day)}
                      disabled={past}
                      title={available ? 'Available — click to book' : hasBooking ? 'Already booked' : ''}
                      className={`aspect-square border-b border-r border-gray-50 flex flex-col items-center justify-center gap-1 transition-all text-sm font-medium relative
                        ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : available ? 'hover:bg-green-50 cursor-pointer' : hasBooking ? 'hover:bg-red-50 cursor-pointer' : ''}
                        ${isToday(day) ? 'font-bold' : ''}
                        ${past ? 'text-gray-300 cursor-default' : 'text-gray-700'}
                      `}>
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm
                        ${isToday(day) ? 'bg-[#1F85A8] text-white' : ''}
                        ${available && !isToday(day) ? 'group-hover:bg-green-100' : ''}
                      `}>
                        {day}
                      </span>
                      {hasBooking && <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      {!hasBooking && !past && (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-60" />
                      )}
                      {dayBookings.length > 1 && (
                        <span className="absolute top-1 right-1 text-xs bg-blue-100 text-blue-700 rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          {dayBookings.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {selected !== null ? (
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-blue-600" />
                    <h3 className="font-bold text-[#1F85A8] text-sm leading-tight">{formattedDate}</h3>
                  </div>

                  {isAvailable ? (
                    /* ── Available ── */
                    <div>
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
                        <CheckCircle size={18} className="text-green-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-green-700 text-sm">Date is Available</p>
                          <p className="text-xs text-green-600">No existing bookings on this date</p>
                        </div>
                      </div>

                      {!showQuickBook ? (
                        <div className="space-y-2">
                          <button
                            onClick={handleBookThisDate}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1F85A8] text-white rounded-xl text-sm font-bold hover:bg-[#1a6d8a] transition-all"
                          >
                            <Send size={15} /> Book This Date
                          </button>
                          <p className="text-xs text-gray-400 text-center">
                            Takes you to the full booking form with this date pre-filled
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    /* ── Booked ── */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-2">
                        <X size={16} className="text-red-500 shrink-0" />
                        <p className="text-sm font-semibold text-red-700">Date has reserved bookings</p>
                      </div>
                      {selected.map((b, i) => (
                        <div key={i} className={`rounded-xl p-4 border-l-4 ${
                          b.status === 'Approved' ? 'bg-red-50 border-red-400' :
                          b.status === 'Pending' ? 'bg-yellow-50 border-yellow-400' :
                          'bg-gray-50 border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-gray-800 line-clamp-1">{b.institutionName}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              b.status === 'Approved' ? 'bg-red-100 text-red-700' :
                              b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{b.status}</span>
                          </div>
                          <p className="text-xs text-gray-500">{b.eventType}</p>
                          <p className="text-xs text-gray-400 mt-1">{b.startDate} {b.startTime || '00:00'} → {b.endDate} {b.endTime || '23:59'}</p>
                        </div>
                      ))}
                      <p className="text-xs text-gray-400 text-center pt-1">
                        Use the booking form to check exact venue and time availability for this date.
                      </p>
                      <Link to="/booking"
                        className="block text-center px-5 py-2.5 border-2 border-[#1F85A8] text-[#1F85A8] rounded-xl text-sm font-bold hover:bg-[#1F85A8] hover:text-white transition-all">
                        Submit a Request Anyway
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
                  <Info size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm font-medium mb-1">Select a date</p>
                  <p className="text-gray-400 text-xs">Click any date on the calendar to check availability and book instantly</p>
                </div>
              )}

              {/* Quick book CTA */}
              <div className="bg-[#1F85A8] rounded-2xl p-5 text-center">
                <h3 className="font-bold text-white mb-2">Ready to Book?</h3>
                <p className="text-white/70 text-sm mb-4">Submit a booking request and our team will confirm within 1–2 business days.</p>
                <Link to="/booking"
                  className="block px-5 py-2.5 bg-white text-[#1F85A8] rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                  Open Booking Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
