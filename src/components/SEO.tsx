import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

const SITE_NAME = 'Banjul International Convention Centre';
const DEFAULT_DESC =
  'The Gambia\'s premier MICE destination — world-class venues for conferences, summits, banquets, and events at the Sir Dawda Kairaba Jawara International Conference Centre.';

export default function SEO({ title, description }: SEOProps) {
  const fullTitle = title
    ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
    : SITE_NAME;
  const metaDesc = description || DEFAULT_DESC;

  useEffect(() => {
    document.title = fullTitle;

    let metaTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'description';
      document.head.appendChild(metaTag);
    }
    metaTag.content = metaDesc;

    // Open Graph
    const setOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setOG('og:title', fullTitle);
    setOG('og:description', metaDesc);
    setOG('og:site_name', SITE_NAME);
  }, [fullTitle, metaDesc]);

  return null;
}
