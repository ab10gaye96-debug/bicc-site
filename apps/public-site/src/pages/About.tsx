import { usePageContent } from '../hooks/usePageContent';
import { Award, Globe2, Heart, Lightbulb, Shield, Target, Building2, Users } from 'lucide-react';
import { IMAGES } from '../images';
import SEO from '../components/SEO';
import PageHero from '../components/ui/PageHero';
import ImageSlideshow from '../components/ui/ImageSlideshow';
import SectionHeader from '../components/ui/SectionHeader';
import ScrollReveal from '../components/motion/ScrollReveal';

const VALUE_ICONS = [Award, Lightbulb, Globe2, Heart, Shield];
const FACT_ICONS = [Building2, Users, Globe2, Award];

export default function About() {
  const { data: pageContent } = usePageContent('aboutPage');
  const story = pageContent?.story || {};
  const mission = pageContent?.mission || {};
  const vision = pageContent?.vision || {};
  const values = pageContent?.values || {};
  const facts = pageContent?.facts || {};
  const storyImages = Array.isArray(story?.images) ? story.images.filter(Boolean) : [];
  const valueItems = Array.isArray(values.items) ? values.items.filter((v: { title?: string }) => v?.title) : [];
  const factItems = Array.isArray(facts.items) ? facts.items.filter((f: { value?: string }) => f?.value) : [];

  return (
    <div>
      <SEO
        title="About Us"
        description="Learn about the Banjul International Convention Centre — established by the Government of The Gambia to advance the country's MICE industry."
      />
      <PageHero
        eyebrow={pageContent?.hero?.eyebrow || 'About Us'}
        title={pageContent?.hero?.title || 'About BICC'}
        description={pageContent?.hero?.description || 'Edit this content in Admin → Page Content → About Page.'}
        backgroundImage={pageContent?.hero?.backgroundImage || IMAGES.heroBg}
        backgroundImages={Array.isArray(pageContent?.hero?.backgroundImages) ? pageContent.hero.backgroundImages.filter(Boolean) : []}
        slideIntervalSeconds={Math.max(1, Number(pageContent?.hero?.slideIntervalSeconds) || 5)}
      />

      {(story.paragraph1 || story.paragraph2 || story.paragraph3 || pageContent?.intro?.description) && (
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal animation="fade-left">
                <div>
                  <SectionHeader
                    eyebrow="Our Story"
                    title={pageContent?.intro?.title || 'Our Story'}
                    align="left"
                    className="mb-6"
                  />
                  {story.paragraph1 && <p className="text-slate-600 leading-relaxed mb-4">{story.paragraph1}</p>}
                  {pageContent?.intro?.description && (
                    <p className="text-slate-600 leading-relaxed mb-4">{pageContent.intro.description}</p>
                  )}
                  {story.paragraph2 && <p className="text-slate-600 leading-relaxed mb-4">{story.paragraph2}</p>}
                  {story.paragraph3 && <p className="text-slate-600 leading-relaxed">{story.paragraph3}</p>}
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-right" delay={120}>
                <div className="photo-frame mt-8 lg:mt-0">
                  <ImageSlideshow
                    src={story.image || IMAGES.heroBg}
                    images={storyImages}
                    alt="BICC facility"
                    intervalSeconds={4.5}
                    showIndicators={storyImages.length > 0}
                    containerClassName="relative overflow-hidden rounded-2xl shadow-2xl w-full aspect-[4/3]"
                    imageClassName="w-full h-full object-cover motion-safe:animate-image-reveal"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {(mission.description || vision.description) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {mission.description && (
                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Target className="text-blue-700" size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1F85A8] mb-4">
                    {mission.title || 'Our Mission'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                </div>
              )}
              {vision.description && (
                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Globe2 className="text-blue-700" size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1F85A8] mb-4">
                    {vision.title || 'Our Vision'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{vision.description}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {valueItems.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">
                {values.eyebrow || 'What Drives Us'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F85A8] mt-3">
                {values.title || 'Our Core Values'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {valueItems.map((value: { title: string; desc: string }, i: number) => {
                const Icon = VALUE_ICONS[i] || Award;
                return (
                  <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-blue-700" size={24} />
                    </div>
                    <h3 className="font-bold text-[#1F85A8] mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-500">{value.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {factItems.length > 0 && (
        <section className="py-20 bg-[#1F85A8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                {facts.title || 'Key Facts'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {factItems.map((fact: { value: string; label: string }, i: number) => {
                const Icon = FACT_ICONS[i] || Building2;
                return (
                  <div key={i} className="text-center bg-white/5 rounded-2xl p-8 border border-white/10">
                    <Icon className="mx-auto text-blue-400 mb-4" size={32} />
                    <div className="text-3xl font-bold text-white mb-2">{fact.value}</div>
                    <div className="text-gray-400">{fact.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
