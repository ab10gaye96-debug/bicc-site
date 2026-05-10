import { useState } from 'react';
import { fetchGallery } from '../api';
import { useApi } from '../hooks/useApi';
import { X, Filter } from 'lucide-react';
import { IMAGES } from '../images';

export default function Gallery() {
  const { data: images, loading } = useApi(() => fetchGallery(), []);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const allImages = images || [];
  const categories = ['All', ...Array.from(new Set(allImages.map(i => i.category)))];
  const filtered = filter === 'All' ? allImages : allImages.filter(i => i.category === filter);

  return (
    <div className="pt-20">
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${IMAGES.heroBg})` }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">Gallery</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Photo Gallery</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">Explore our world-class facilities, events, and the stunning setting of the SDKJ International Conference Centre.</p>
        </div>
      </section>
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={18} className="text-gray-400" />
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-blue-600 text-[#1F85A8]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(img => (
                <div key={img.id} className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all" onClick={() => setLightbox(img.url)}>
                  <div className="relative overflow-hidden">
                    <img src={img.url} alt={img.caption} className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white font-medium text-sm">{img.caption}</p>
                      <span className="text-blue-400 text-xs">{img.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors" onClick={() => setLightbox(null)}><X size={32} /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}


