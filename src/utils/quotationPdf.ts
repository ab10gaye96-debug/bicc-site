import jsPDF from 'jspdf';

export interface QuotationLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotationData {
  quoteNumber: string;
  date: string;
  clientName: string;
  institution?: string;
  email?: string;
  eventType?: string;
  eventDates?: string;
  currency: string;
  lines: QuotationLine[];
  taxRate: number;
  notes?: string;
}

const BRAND = '#1F85A8';

export function computeTotals(lines: QuotationLine[], taxRate: number) {
  const subtotal = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);
  const tax = subtotal * ((Number(taxRate) || 0) / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

/** Generates and downloads a BICC quotation PDF. */
export function generateQuotationPdf(q: QuotationData): void {
  const doc = new jsPDF();
  const money = (n: number) => `${q.currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  let y = 18;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(BRAND);
  doc.text('Banjul International Convention Centre', 14, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor('#666666');
  doc.text('Bijilo, The Gambia  ·  info@bicc.gm  ·  +220 7784425', 14, y);

  y += 12;
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.text('QUOTATION', 14, y);
  doc.setFontSize(10);
  doc.setTextColor('#666666');
  doc.text(`Quote #: ${q.quoteNumber}`, 150, y - 6);
  doc.text(`Date: ${q.date}`, 150, y);

  // Client block
  y += 10;
  doc.setTextColor('#000000');
  doc.setFontSize(11);
  doc.text('Prepared for:', 14, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor('#333333');
  doc.text(q.clientName || '', 14, y);
  if (q.institution) { y += 5; doc.text(q.institution, 14, y); }
  if (q.email) { y += 5; doc.text(q.email, 14, y); }
  if (q.eventType) { y += 5; doc.text(`Event: ${q.eventType}`, 14, y); }
  if (q.eventDates) { y += 5; doc.text(`Dates: ${q.eventDates}`, 14, y); }

  // Table header
  y += 12;
  doc.setFillColor(31, 133, 168);
  doc.rect(14, y - 5, 182, 8, 'F');
  doc.setTextColor('#ffffff');
  doc.setFontSize(10);
  doc.text('Description', 16, y);
  doc.text('Qty', 120, y);
  doc.text('Unit Price', 138, y);
  doc.text('Amount', 172, y);

  // Table rows
  y += 9;
  doc.setTextColor('#333333');
  q.lines.forEach((line) => {
    const amount = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
    doc.text(String(line.description).substring(0, 60), 16, y);
    doc.text(String(line.quantity), 120, y);
    doc.text(money(Number(line.unitPrice) || 0), 138, y);
    doc.text(money(amount), 172, y);
    y += 7;
    if (y > 260) { doc.addPage(); y = 20; }
  });

  // Totals
  const { subtotal, tax, total } = computeTotals(q.lines, q.taxRate);
  y += 4;
  doc.setDrawColor('#cccccc');
  doc.line(120, y - 2, 196, y - 2);
  doc.text('Subtotal:', 138, y + 4);
  doc.text(money(subtotal), 172, y + 4);
  doc.text(`Tax (${q.taxRate}%):`, 138, y + 11);
  doc.text(money(tax), 172, y + 11);
  doc.setFontSize(12);
  doc.setTextColor(BRAND);
  doc.text('Total:', 138, y + 19);
  doc.text(money(total), 172, y + 19);

  if (q.notes) {
    y += 30;
    doc.setFontSize(9);
    doc.setTextColor('#666666');
    doc.text('Notes:', 14, y);
    const split = doc.splitTextToSize(q.notes, 180);
    doc.text(split, 14, y + 5);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor('#999999');
  doc.text('This quotation is valid for 30 days from the date of issue.', 14, 285);

  doc.save(`BICC-Quotation-${q.quoteNumber}.pdf`);
}
