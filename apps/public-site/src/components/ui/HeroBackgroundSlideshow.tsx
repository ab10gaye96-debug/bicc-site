import { ReactNode, useEffect, useMemo, useState } from 'react';

interface HeroBackgroundSlideshowProps {
  backgroundImage?: string;
  images?: string[];
  intervalSeconds?: number;
  imageClassName?: string;
  showIndicators?: boolean;
  children?: ReactNode;
}

export default function HeroBackgroundSlideshow({
  backgroundImage,
  images = [],
  intervalSeconds = 5,
  imageClassName = 'absolute inset-0 bg-cover bg-center motion-safe:animate-ken-burns',
  showIndicators = false,
  children,
}: HeroBackgroundSlideshowProps) {
  const resolvedImages = useMemo(() => {
    const validImages = images.filter(Boolean);
    if (validImages.length > 0) return validImages;
    return backgroundImage ? [backgroundImage] : [];
  }, [backgroundImage, images]);
  const imagesKey = resolvedImages.join('||');

  const safeIntervalSeconds = Math.max(1, Number(intervalSeconds) || 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [imagesKey]);

  useEffect(() => {
    if (resolvedImages.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % resolvedImages.length);
    }, safeIntervalSeconds * 1000);

    return () => window.clearInterval(intervalId);
  }, [imagesKey, resolvedImages.length, safeIntervalSeconds]);

  return (
    <div className="absolute inset-0">
      {resolvedImages.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`${imageClassName} transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      {children}

      {showIndicators && resolvedImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-2">
          {resolvedImages.map((_, index) => (
            <button
              key={`indicator-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
