import { useState } from 'react';
import { fetchNews } from '../api';
import { useApi } from '../hooks/useApi';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function News() {
  const { data: news, loading } = useApi(() => fetchNews(), []);
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="pt-20">
      <section className="relative py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">News & Updates</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Latest News</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">Stay updated with the latest happenings at the Banjul International Convention Centre.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(news || []).map(item => (
                <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelected(item)}>
                  <div className="relative overflow-hidden"><img src={item.image} alt={item.title} className="w-full aspect-[2/1] object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1"><Calendar size={12} />{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                      <div className="flex items-center gap-1"><User size={12} />{item.author}</div>
                    </div>
                    <h3 className="text-lg font-bold text-[#1F85A8] mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3">{item.excerpt}</p>
                    <span className="inline-block mt-4 text-blue-700 text-sm font-semibold">Read More →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="w-full aspect-[2/1] object-cover rounded-t-2xl" />
            <div className="p-8">
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-4"><ArrowLeft size={14} /> Back to News</button>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1"><Calendar size={14} />{new Date(selected.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div className="flex items-center gap-1"><User size={14} />{selected.author}</div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8] mb-6">{selected.title}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selected.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


