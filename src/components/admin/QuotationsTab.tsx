import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Download, X } from 'lucide-react';
import * as api from '../../api';
import { generateQuotationPdf, computeTotals, QuotationLine } from '../../utils/quotationPdf';

const emptyClient = {
  clientName: '',
  institution: '',
  email: '',
  eventType: '',
  eventDates: '',
};

function genQuoteNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QT-${year}-${rand}`;
}

export default function QuotationsTab() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [client, setClient] = useState({ ...emptyClient });
  const [lines, setLines] = useState<QuotationLine[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [currency, setCurrency] = useState('GMD');
  const [notes, setNotes] = useState('');

  const load = () => api.fetchQuotations().then(setQuotations).catch(() => {});
  useEffect(() => {
    load();
    api.fetchPricing().then(setPricing).catch(() => {});
    api.fetchBookings().then(setBookings).catch(() => {});
  }, []);

  const resetForm = () => {
    setClient({ ...emptyClient });
    setLines([{ description: '', quantity: 1, unitPrice: 0 }]);
    setTaxRate(0);
    setCurrency('GMD');
    setNotes('');
    setShowForm(false);
  };

  const updateLine = (i: number, patch: Partial<QuotationLine>) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };

  const addLine = () => setLines((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i));

  const addFromPricing = (id: string) => {
    const p = pricing.find((x) => x.id === id);
    if (!p) return;
    setLines((prev) => [...prev, { description: `${p.name} (${p.unit})`, quantity: 1, unitPrice: Number(p.unitPrice) || 0 }]);
  };

  const loadFromBooking = (id: string) => {
    const b = bookings.find((x) => x.id === id);
    if (!b) return;
    setClient({
      clientName: `${b.firstName || ''} ${b.lastName || ''}`.trim(),
      institution: b.institutionName || '',
      email: b.email || '',
      eventType: b.eventType === 'Other' ? b.otherEventType || 'Other' : b.eventType || '',
      eventDates: [b.startDate, b.endDate].filter(Boolean).join(' → '),
    });
    // Build line items from the booking's venues/services, pulling prices when known.
    const priceFor = (name: string) => {
      const match = pricing.find((p) => p.name.toLowerCase() === name.toLowerCase());
      return match ? Number(match.unitPrice) || 0 : 0;
    };
    const venueLines: QuotationLine[] = (b.venues || []).map((v: string) => ({ description: `Venue: ${v}`, quantity: 1, unitPrice: priceFor(v) }));
    const serviceLines: QuotationLine[] = (b.services || []).map((s: string) => ({ description: `Service: ${s}`, quantity: 1, unitPrice: priceFor(s) }));
    const combined = [...venueLines, ...serviceLines];
    setLines(combined.length ? combined : [{ description: '', quantity: 1, unitPrice: 0 }]);
  };

  const totals = computeTotals(lines, taxRate);

  const buildQuoteData = (quoteNumber: string) => ({
    quoteNumber,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    ...client,
    currency,
    lines: lines.filter((l) => l.description.trim()),
    taxRate,
    notes,
  });

  const handleSave = async (downloadPdf: boolean) => {
    const validLines = lines.filter((l) => l.description.trim());
    if (!client.clientName.trim() || validLines.length === 0) {
      alert('Add a client name and at least one line item.');
      return;
    }
    const quoteNumber = genQuoteNumber();
    const data = { quoteNumber, ...client, currency, lines: validLines, taxRate, notes, total: totals.total };
    try {
      await api.createQuotation(data);
      await load();
      if (downloadPdf) generateQuotationPdf(buildQuoteData(quoteNumber));
      resetForm();
    } catch {
      alert('Error saving quotation');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this quotation?')) {
      await api.deleteQuotation(id);
      await load();
    }
  };

  const downloadExisting = (q: any) => {
    generateQuotationPdf({
      quoteNumber: q.quoteNumber,
      date: q.created_at ? new Date(q.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
      clientName: q.clientName,
      institution: q.institution,
      email: q.email,
      eventType: q.eventType,
      eventDates: q.eventDates,
      currency: q.currency || 'GMD',
      lines: q.lines || [],
      taxRate: q.taxRate || 0,
      notes: q.notes,
    });
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1';
  const money = (n: number) => `${currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Quotations</h2>
        {api.canEdit() && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
            <Plus size={16} /> New Quotation
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-5">
          {bookings.length > 0 && (
            <div>
              <label className={labelClass}>Prefill from booking (optional)</label>
              <select onChange={(e) => e.target.value && loadFromBooking(e.target.value)} defaultValue="" className={inputClass}>
                <option value="">— Select a booking —</option>
                {bookings.map((b) => <option key={b.id} value={b.id}>{b.institutionName} · {b.firstName} {b.lastName} ({b.refNumber || b.id})</option>)}
              </select>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Client Name *</label>
              <input value={client.clientName} onChange={(e) => setClient({ ...client, clientName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Institution</label>
              <input value={client.institution} onChange={(e) => setClient({ ...client, institution: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Event Type</label>
              <input value={client.eventType} onChange={(e) => setClient({ ...client, eventType: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Event Dates</label>
              <input value={client.eventDates} onChange={(e) => setClient({ ...client, eventDates: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass + ' mb-0'}>Line Items</label>
              {pricing.length > 0 && (
                <select onChange={(e) => { addFromPricing(e.target.value); e.target.value = ''; }} defaultValue="" className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                  <option value="">+ Add from pricing</option>
                  {pricing.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.currency || 'GMD'} {Number(p.unitPrice).toLocaleString()}</option>)}
                </select>
              )}
            </div>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={line.description} onChange={(e) => updateLine(i, { description: e.target.value })} placeholder="Description" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                  <input type="number" min="0" value={line.quantity} onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })} className="w-16 px-2 py-2 rounded-lg border border-gray-200 text-sm" title="Quantity" />
                  <input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })} className="w-28 px-2 py-2 rounded-lg border border-gray-200 text-sm" title="Unit price" />
                  <span className="w-28 text-right text-sm text-gray-600">{money((Number(line.quantity) || 0) * (Number(line.unitPrice) || 0))}</span>
                  <button onClick={() => removeLine(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>
                </div>
              ))}
            </div>
            <button onClick={addLine} className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"><Plus size={14} /> Add line</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tax Rate (%)</label>
              <input type="number" min="0" step="0.01" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
          </div>

          {/* Totals */}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1 max-w-xs ml-auto">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{money(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax ({taxRate}%)</span><span>{money(totals.tax)}</span></div>
            <div className="flex justify-between font-bold text-[#1F85A8] text-base pt-1 border-t border-gray-100"><span>Total</span><span>{money(totals.total)}</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleSave(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Download size={16} /> Save & Download PDF</button>
            <button onClick={() => handleSave(false)} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">Save Only</button>
            <button onClick={resetForm} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {quotations.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No quotations yet. Click "New Quotation" to create one.</div>
        ) : (
          quotations.map((q) => (
            <div key={q.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#1F85A8] text-sm truncate">{q.clientName}</h3>
                  <span className="text-xs font-mono text-blue-500">{q.quoteNumber}</span>
                </div>
                <p className="text-xs text-gray-500">{q.institution || '—'} · {q.currency || 'GMD'} {Number(q.total || 0).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => downloadExisting(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Download PDF"><Download size={16} /></button>
                {api.canDelete() && <button onClick={() => handleDelete(q.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
