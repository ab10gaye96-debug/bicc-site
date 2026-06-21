import { Link } from 'react-router-dom';
import { IMAGES } from '../images';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  linkToHome?: boolean;
}

export default function BrandLogo({
  className = '',
  imageClassName = 'h-14 sm:h-[4.5rem] w-auto max-w-[240px] object-contain',
  linkToHome = true,
}: BrandLogoProps) {
  const image = (
    <img
      src={IMAGES.logo}
      alt="BICC — Banjul International Convention Centre"
      className={`bg-white rounded-xl px-2.5 py-1.5 shadow-lg border border-white/25 ${imageClassName}`}
    />
  );

  if (!linkToHome) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link to="/" className={`inline-flex shrink-0 group ${className}`}>
      <span className="transition-transform duration-300 group-hover:scale-[1.02]">{image}</span>
    </Link>
  );
}
