import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { IMAGES } from '../../images';

interface DestinationImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function DestinationImage({
  src,
  alt,
  className = '',
  fallback = IMAGES.heroBg,
}: DestinationImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-[#1F85A8]/20 to-blue-100 flex items-center justify-center ${className}`}>
        <ImageIcon className="text-[#1F85A8]/40" size={40} />
      </div>
    );
  }

  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
