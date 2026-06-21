import { MapPin } from 'lucide-react';
import type { AttractionItem } from '../../data/destinationData';
import DestinationImage from './DestinationImage';
import ExternalSiteLink from './ExternalSiteLink';

interface AttractionCardProps {
  item: AttractionItem;
  layout?: 'horizontal' | 'vertical';
}

export default function AttractionCard({ item, layout = 'vertical' }: AttractionCardProps) {
  if (layout === 'horizontal') {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row">
        <DestinationImage
          src={item.image}
          alt={item.name}
          className="sm:w-48 h-40 sm:h-auto object-cover shrink-0"
        />
        <div className="p-5 flex-1">
          <h3 className="text-lg font-bold text-[#1F85A8] mb-2">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
          {item.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <MapPin size={12} /> {item.location}
            </div>
          )}
          {item.website && (
            <ExternalSiteLink href={item.website} label={item.websiteLabel || 'Learn more'} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
      <DestinationImage
        src={item.image}
        alt={item.name}
        className="w-full aspect-[16/10] object-cover"
      />
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-[#1F85A8] mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-3 flex-1">{item.description}</p>
        {item.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <MapPin size={12} /> {item.location}
          </div>
        )}
        {item.activities && (
          <p className="text-xs text-blue-600 font-medium mb-3">{item.activities}</p>
        )}
        {item.significance && (
          <span className="inline-block mb-3 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full w-fit">
            {item.significance}
          </span>
        )}
        {item.highlights && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.highlights.map((h) => (
              <span key={h} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {h}
              </span>
            ))}
          </div>
        )}
        {item.website && (
          <ExternalSiteLink href={item.website} label={item.websiteLabel || 'Visit site'} className="mt-auto" />
        )}
      </div>
    </div>
  );
}
