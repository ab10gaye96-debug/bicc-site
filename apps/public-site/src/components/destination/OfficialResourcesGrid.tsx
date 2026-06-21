import { ExternalLink } from 'lucide-react';
import type { OfficialResource } from '../../data/destinationData';
import DestinationImage from './DestinationImage';

interface OfficialResourcesGridProps {
  resources: OfficialResource[];
  title?: string;
  description?: string;
}

export default function OfficialResourcesGrid({
  resources,
  title = 'Official Resources & Partner Sites',
  description = 'Verified links to government, tourism, and travel authorities in The Gambia',
}: OfficialResourcesGridProps) {
  return (
    <section className="py-16 bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F85A8] mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">{description}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md hover:bg-white transition-all"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-100 shrink-0 flex items-center justify-center">
                {resource.image ? (
                  <DestinationImage
                    src={resource.image}
                    alt={resource.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#1F85A8] text-center px-1 leading-tight">
                    {resource.category}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#1F85A8] text-sm group-hover:text-blue-700">
                    {resource.name}
                  </h3>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wide rounded">
                  {resource.category}
                </span>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
