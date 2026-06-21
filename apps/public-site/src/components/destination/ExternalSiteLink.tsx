import { ExternalLink } from 'lucide-react';

interface ExternalSiteLinkProps {
  href: string;
  label?: string;
  className?: string;
  variant?: 'button' | 'text';
}

export default function ExternalSiteLink({
  href,
  label = 'Visit official site',
  className = '',
  variant = 'button',
}: ExternalSiteLinkProps) {
  const url = href.startsWith('http') ? href : `https://${href}`;

  if (variant === 'text') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors ${className}`}
      >
        {label} <ExternalLink size={14} />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all ${className}`}
    >
      {label} <ExternalLink size={14} />
    </a>
  );
}
