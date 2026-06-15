import { useState, useEffect, useCallback } from 'react';
import { useRealtimeCollection } from '../hooks/useRealtimeFirestore';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import { SkeletonGallery } from '../components/Skeleton';

// ── helpers ───────────────────────────────────────────────────────────────────
function isVideoItem(item: any) {
  if (item.mediaType === 'video') return true;
  const url: string = item.url || '';
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || /\.(mp4|mov|avi|webm)(\?|$)/i.test(url);
}

function getYouTubeEmbed(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

function getYouTubeThumbnail(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

// ── Lightbox (images only — videos play inline) ───────────────────────────────
function Lightbox({ images, index, onClose }: { images: any[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  const item = images[current];
  const isVid = isVideoItem(item);
  const embedUrl = isVid ? getYouTubeEmbed(item.url) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-10">
        <X size={20} />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
        {current + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center z-10">
          <ChevronLeft size={22} />
        </button>
      )}

      <div className="px-4 sm:px-16 sm:px-20 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        {isVid ? (
          embedUrl ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={item.caption} />
            </div>
          ) : (
            <video src={item.url} controls autoPlay className="max-h-[80vh] w-full rounded-xl bg-black" />
          )
        ) : (
          <img src={item.url} alt={item.caption} className="max-h-[80vh] w-full object-contain rounded-lg" />
        )}
        {item.caption && (
          <div className="text-center mt-4">
            <p className="text-white font-medium text-sm sm:text-base">{item.caption}</p>
            {item.category && <p className="text-blue-400 text-xs mt-1">{item.category}</p>}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center z-10">
          <ChevronRight size={22} />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-xs sm:max-w-lg px-2">
          {images.map((img, i) => {
            const thumb = isVideoItem(img) ? getYouTubeThumbnail(img.url) : null;
            return (
              <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all relative ${
                  i === current ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                }`}>
                {thumb ? (
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                ) : isVideoItem(img) ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play size={14} className="text-white" />
                  </div>
                ) : (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Gallery page ─────────────────────────────────────────────────────────
export default function Gallery() {
  const { data: images, loading } = useRealtimeCollection<any>('gallery', []);
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allItems = images;
  const categories = ['All', ...Array.from(new Set(allItems.map((i: any) => i.category).filter(Boolean)))];
  const filtered = filter === 'All' ? allItems : allItems.filter((i: any) => i.category === filter);

  const videoCount = allItems.filter(isVideoItem).length;
  const imageCount = allItems.length - videoCount;

  return (
    <div className="pt-20">
      <SEO
        title="Gallery"
        description="Explore photos and videos of BICC's world-class facilities, events, and the stunning setting of the Sir Dawda Kairaba Jawara International Conference Centre."
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-24 bg-[#1F85A8]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.heroBg})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-blue-300 font-semibold text-sm tracking-widest uppercase">Gallery</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-4 mb-6">Photos & Videos</h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
            Explore our world-class facilities, events, and the stunning setting of the SDKJ International Conference Centre.
          </p>
          {(imageCount > 0 || videoCount > 0) && (
            <div className="flex items-center justify-center gap-4 mt-6">
              {imageCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-sm px-3 py-1.5 rounded-full">
                  🖼 {imageCount} Photo{imageCount !== 1 ? 's' : ''}
                </span>
              )}
              {videoCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-sm px-3 py-1.5 rounded-full">
                  🎬 {videoCount} Video{videoCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Category tabs */}
      <section className="py-4 bg-white border-b sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat ? 'bg-[#1F85A8] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({allItems.filter((i: any) => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
            {filter !== 'All' && (
              <span className="text-xs text-gray-400 ml-2">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => <SkeletonGallery key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No items in this category.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((item: any, i: number) => {
                const isVid = isVideoItem(item);
                const ytThumb = isVid ? getYouTubeThumbnail(item.url) : null;
                const embedUrl = isVid ? getYouTubeEmbed(item.url) : null;

                return (
                  <div
                    key={item.id}
                    className="group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <div className="relative overflow-hidden aspect-[4/3] bg-gray-900">
                      {/* Thumbnail */}
                      {isVid ? (
                        ytThumb ? (
                          <img src={ytThumb} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <video src={item.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                        )
                      ) : (
                        <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Play button for videos */}
                      {isVid && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:bg-white/30 transition-all">
                            <Play size={20} className="text-white ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Zoom icon for images */}
                      {!isVid && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ZoomIn size={18} className="text-white" />
                          </div>
                        </div>
                      )}

                      {/* Video badge */}
                      {isVid && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          🎬 Video
                        </div>
                      )}

                      {/* Caption on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-medium line-clamp-1">{item.caption}</p>
                        {item.category && <span className="text-blue-300 text-xs">{item.category}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
