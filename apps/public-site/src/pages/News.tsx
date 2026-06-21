import { useState } from 'react';
import { fetchNews } from '../api';
import { useApi } from '../hooks/useApi';
import { usePageContent } from '../hooks/usePageContent';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import { SkeletonList } from '../components/Skeleton';
import { IMAGES } from '../images';

export default function News() {
  const { data: news, loading } = useApi(() => fetchNews(), []);
  const { data: pageContent } = usePageContent('newsPage');
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div>
      <SEO
        title="News & Updates"
        description="Stay updated with the latest news, announcements, and happenings at the Banjul International Convention Centre."
      />
      <PageHero
        eyebrow={pageContent?.hero?.eyebrow || 'News & Updates'}
        title={pageContent?.hero?.title || 'Latest News'}
        description={pageContent?.hero?.description || 'Stay updated with the latest happenings at the Banjul International Convention Centre.'}
        backgroundImage={pageContent?.hero?.backgroundImage || IMAGES.heroBg}
        compact
      />
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonList count={6} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="w-full aspect-[2/1] object-cover rounded-t-2xl" />
            <div className="p-5 sm:p-8">
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-4"><ArrowLeft size={14} /> Back to News</button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1"><Calendar size={14} />{new Date(selected.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div className="flex items-center gap-1"><User size={14} />{selected.author}</div>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F85A8] mb-5">{selected.title}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">{selected.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
