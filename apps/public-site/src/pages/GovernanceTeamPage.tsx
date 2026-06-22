import { usePageContent } from '../hooks/usePageContent';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import TeamSection from '../components/TeamSection';

interface GovernanceTeamPageProps {
  group: 'board' | 'team';
  pageKey: 'boardPage' | 'teamPage';
  seoTitle: string;
  seoDescription: string;
  defaultHero: { eyebrow: string; title: string; description: string };
  defaultSection: { eyebrow: string; title: string; description: string };
}

export default function GovernanceTeamPage({
  group,
  pageKey,
  seoTitle,
  seoDescription,
  defaultHero,
  defaultSection,
}: GovernanceTeamPageProps) {
  const { data: pageContent } = usePageContent(pageKey);
  const hero = pageContent?.hero || {};
  const section = pageContent?.section || {};

  return (
    <div>
      <SEO title={seoTitle} description={seoDescription} />
      <PageHero
        eyebrow={hero.eyebrow || defaultHero.eyebrow}
        title={hero.title || defaultHero.title}
        description={hero.description || defaultHero.description}
        backgroundImage={hero.backgroundImage || IMAGES.heroBg}
        backgroundImages={Array.isArray(hero.backgroundImages) ? hero.backgroundImages.filter(Boolean) : []}
        slideIntervalSeconds={Math.max(1, Number(hero.slideIntervalSeconds) || 5)}
      />
      <TeamSection
        group={group}
        variant="governance"
        eyebrow={section.eyebrow || defaultSection.eyebrow}
        title={section.title || defaultSection.title}
        description={section.description || defaultSection.description}
        useFallbackMembers
      />
    </div>
  );
}
