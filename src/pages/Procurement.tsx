import { useState } from 'react';
import { FileText, Clock, Calendar, Download, Search, AlertCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import SEO from '../components/SEO';
import { IMAGES } from '../images';

// Fetch tenders from Firestore
async function fetchTenders() {
  try {
    const { getDocs, collection } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    const snap = await getDocs(collection(db, 'tenders'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

// Fallback data
const FALLBACK_TENDERS = [
  {
    id: '1',
    title: 'Supply of Audio-Visual Equipment',
    reference: 'BICC/PROC/2026/001',
    category: 'Goods',
    description: 'Supply and installation of modern audio-visual equipment for conference halls',
    publishedDate: '2026-06-01',
    closingDate: '2026-07-15',
    estimatedValue: 'GMD 2,500,000',
    status: 'Open',
    documents: [
      { name: 'Tender Notice', url: '#', size: '450 KB' },
      { name: 'Technical Specifications', url: '#', size: '1.2 MB' },
      { name: 'Bidding Instructions', url: '#', size: '680 KB' },
    ],
  },
  {
    id: '2',
    title: 'Catering Services Contract',
    reference: 'BICC/PROC/2026/002',
    category: 'Services',
    description: 'Provision of catering services for conferences and events (12-month contract)',
    publishedDate: '2026-05-20',
    closingDate: '2026-07-01',
    estimatedValue: 'GMD 1,800,000',
    status: 'Open',
    documents: [
      { name: 'Tender Notice', url: '#', size: '380 KB' },
      { name: 'Terms of Reference', url: '#', size: '920 KB' },
      { name: 'Application Form', url: '#', size: '540 KB' },
    ],
  },
  {
    id: '3',
    title: 'Landscaping and Maintenance Services',
    reference: 'BICC/PROC/2026/003',
    category: 'Services',
    description: 'Grounds maintenance and landscaping services for BICC premises',
    publishedDate: '2026-04-15',
    closingDate: '2026-05-30',
    estimatedValue: 'GMD 450,000',
    status: 'Closed',
    documents: [
      { name: 'Tender Notice', url: '#', size: '320 KB' },
      { name: 'Scope of Work', url: '#', size: '780 KB' },
    ],
  },
];

const CATEGORIES = ['All', 'Open', 'Closed'];
const TYPES = ['All', 'Goods', 'Services', 'Works'];

export default function Procurement() {
  const { data: dbTenders } = useApi(fetchTenders, []);
  const tenders = (dbTenders && dbTenders.length > 0) ? dbTenders : FALLBACK_TENDERS;

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = tenders.filter((tender: any) => {
    const matchesStatus = statusFilter === 'All' || tender.status === statusFilter;
    const matchesType = typeFilter === 'All' || tender.category === typeFilter;
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tender.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const openTenders = filtered.filter((t: any) => t.status === 'Open');
  const closedTenders = filtered.filter((t: any) => t.status === 'Closed');

  const handleDownload = (doc: any) => {
    if (doc.url && doc.url !== '#') {
      window.open(doc.url, '_blank');
    } else {
      alert('This is a demo document. In production, this would download the actual file.');
    }
  };

  return (
    <div className="pt-20">
      <SEO
        title="Procurement & Tenders — BICC"
        description="View open tenders, closed tenders, and procurement notices from the Banjul International Convention Centre."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 to-green-600">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.conferenceHall})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
            <FileText size={16} />
            Business Opportunities
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Procurement & Tenders</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Browse open tenders, procurement notices, and business opportunities with BICC
          </p>
        </div>
      </section>

      {/* Procurement Notice */}
      <section className="py-8 bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Procurement Guidelines</h3>
              <p className="text-sm text-blue-800">
                BICC follows transparent procurement procedures in accordance with The Gambia Public Procurement Authority (GPPA) regulations. 
                All bids must be submitted before the closing date and time. Late submissions will not be accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat} Tenders</option>)}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {TYPES.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Open Tenders */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-[#1F85A8]">
              Open Tenders ({openTenders.length})
            </h2>
          </div>

          {openTenders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <FileText className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No open tenders</h3>
              <p className="text-gray-500">Check back soon for new opportunities</p>
            </div>
          ) : (
            <div className="space-y-6">
              {openTenders.map((tender: any) => (
                <div key={tender.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          OPEN
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                          {tender.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1F85A8] mb-1">{tender.title}</h3>
                      <p className="text-sm text-gray-500">Reference: {tender.reference}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{tender.description}</p>

                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Published</p>
                        <p className="font-medium">{new Date(tender.publishedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Closing Date</p>
                        <p className="font-medium text-red-600">{new Date(tender.closingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Estimated Value</p>
                        <p className="font-medium">{tender.estimatedValue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Tender Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {tender.documents.map((doc: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleDownload(doc)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all"
                        >
                          <Download size={16} />
                          <span className="text-sm font-medium">{doc.name}</span>
                          <span className="text-xs text-gray-500">({doc.size})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closed Tenders */}
      {closedTenders.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <h2 className="text-2xl font-bold text-[#1F85A8]">
                Closed Tenders ({closedTenders.length})
              </h2>
            </div>

            <div className="space-y-4">
              {closedTenders.map((tender: any) => (
                <div key={tender.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                          CLOSED
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                          {tender.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-1">{tender.title}</h3>
                      <p className="text-sm text-gray-500">Reference: {tender.reference}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Closed: {new Date(tender.closingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1F85A8] mb-6">Procurement Inquiries</h2>
          <p className="text-gray-600 mb-8">
            For questions about procurement procedures, tender documents, or submission requirements, 
            please contact our Procurement Office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:procurement@bicc.gm"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all"
            >
              Email Procurement Office
            </a>
            <a
              href="tel:+2207784425"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#1F85A8] text-[#1F85A8] rounded-xl font-bold hover:bg-[#1F85A8] hover:text-white transition-all"
            >
              +220 778 4425
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
