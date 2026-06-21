import { Phone, Mail } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-slate-950 text-white/90 text-xs sm:text-sm border-b border-bicc-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="font-medium tracking-wide text-bicc-gold-light">
          Official website — Banjul International Convention Centre
        </p>
        <div className="flex flex-wrap items-center gap-4 text-white/75">
          <a href="tel:+2207784425" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone size={13} className="text-bicc-gold" />
            +220 778 4425
          </a>
          <a href="mailto:info@bicc.gm" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail size={13} className="text-bicc-gold" />
            info@bicc.gm
          </a>
        </div>
      </div>
    </div>
  );
}
