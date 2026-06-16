import { useState } from 'react';
import { Download, FileText, FolderOpen, Search } from 'lucide-react';
import { fetchPageContent } from '../api';
import { useApi } from '../hooks/useApi';
import SEO from '../components/SEO';
import { IMAGES } from '../images';

// Fetch downloads from Firestore
async function fetchDownloads() {
  try {
    const { getDocs, collection } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    const snap = await getDocs(collection(db, 'downloads'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

// Fallback data if Firestore is empty
const FALLBACK_DOWNLOADS = [
  {
    id: '1',
    title: 'BICC Corporate Profile',
    category: 'Corporate Profile',
    description: 'Comprehensive overview of BICC facilities, services, and capabilities',
    fileUrl: '#',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'BICC Venue Brochure',
    category: 'Brochure',
    description: 'Detailed brochure of our conference and banquet venues',
    fileUrl: '#',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Plenary Hall Floor Plan',
    category: 'Floor Plans',
    description: 'Technical floor plan of the main plenary hall',
    fileUrl: '#',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Technical Specifications',
    category: 'Technical Specs',
    description: 'Audio-visual and technical specifications for all venues',
    fileUrl: '#',
    fileSize: '890 KB',
    fileType: 'PDF',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Event Planning Checklist',
    category: 'Event Packages',
    description: 'Comprehensive checklist for event organizers',
    fileUrl: '#',
    fileSize: '450 KB',
    fileType: 'PDF',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Media Kit 2026',
    category: 'Media Kit',
    description: 'Logos, images, and media resources',
    fileUrl: '#',
    fileSize: '12.5 MB',
    fileType: 'ZIP',
    uploadedAt: new Date().toISOString(),
  },
];

const CATEGORIES = [
  'All',
  'Corporate Profile',
  'Brochure',
  'Venue Guide',
  'Floor Plans',
  'Technical Specs',
  'Event Packages',
  'Media Kit',
  'Annual Reports',
  'Policies & Procedures',
];

export default function Downloads() {
  const { data: dbDownloads } = useApi(fetchDownloads, []);
  const { data: pageContent } = useApi(() => fetchPageContent('downloadsPage'), []);
  const downloads = (dbDownloads && dbDownloads.length > 0) ? dbDownloads : FALLBACK_DOWNLOADS;

  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = downloads.filter((doc: any) => {
    const matchesCategory = category === 'All' || doc.category === category;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: any) => {
    if (doc.fileUrl && doc.fileUrl !== '#') {
      window.open(doc.fileUrl, '_blank');
    } else {
      alert('This is a demo file. In production, this would download the actual file.');
    }
  };

  return (
    <div className="pt-20">
      <SEO
        title="Downloads Centre — BICC Documents & Resources"
        description={pageContent?.hero?.description || 'Download BICC brochures, floor plans, technical specifications, and event planning resources.'}
      />

      {/* Hero */}
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${pageContent?.hero?.backgroundImage || IMAGES.conferenceHall})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
            <FileText size={16} />
            {pageContent?.hero?.eyebrow || 'Resource Centre'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{pageContent?.hero?.title || 'Downloads Centre'}</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {pageContent?.hero?.description || 'Access brochures, floor plans, technical specifications, and event planning resources'}
          </p>
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
                placeholder={pageContent?.search?.placeholder || 'Search documents...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-[#1F85A8] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Downloads List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-600 mb-2">{pageContent?.search?.emptyTitle || 'No documents found'}</h3>
              <p className="text-gray-500">{pageContent?.search?.emptyDescription || 'Try adjusting your search or filter criteria'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc: any) => (
                <div key={doc.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 flex items-center justify-center">
                    <FileText className="text-white" size={48} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {doc.category}
                      </span>
                      <span className="text-xs text-gray-500">{doc.fileType}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1F85A8] mb-2">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{doc.fileSize}</span>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F85A8] text-white rounded-lg font-semibold hover:bg-[#1a6d8a] transition-all text-sm"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1F85A8] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{pageContent?.cta?.title || 'Need a Custom Document?'}</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {pageContent?.cta?.description || "Can't find what you're looking for? Contact us and we'll prepare the information you need."}
          </p>
          <a
            href="mailto:info@bicc.gm"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            {pageContent?.cta?.primaryButtonText || 'Contact Us'}
          </a>
        </div>
      </section>
    </div>
  );
}
