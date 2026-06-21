import { useEffect, useState } from 'react';
import { BookOpenText, Save, RotateCcw } from 'lucide-react';
import * as api from '../../api';
import { ImageListField, MediaField } from './MediaField';

type PageSection =
  | 'aboutPage'
  | 'venuesPage'
  | 'eventsPage'
  | 'bookingPage'
  | 'downloadsPage'
  | 'careersPage'
  | 'procurementPage'
  | 'galleryPage'
  | 'newsPage'
  | 'servicesPage'
  | 'hotelsPage';

interface SectionConfig {
  id: PageSection;
  label: string;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'aboutPage', label: 'About Page', description: 'About hero, story, mission, values, team section titles' },
  { id: 'venuesPage', label: 'Venues Page', description: 'Venue hero, capacity overview, and CTA section' },
  { id: 'eventsPage', label: 'Events Page', description: 'Events hero and filter/search copy' },
  { id: 'bookingPage', label: 'Booking Page', description: 'Booking hero and success-state messages' },
  { id: 'downloadsPage', label: 'Downloads Page', description: 'Downloads hero, search copy, and CTA section' },
  { id: 'careersPage', label: 'Careers Page', description: 'Careers hero, benefits intro, and careers CTA' },
  { id: 'procurementPage', label: 'Procurement Page', description: 'Procurement hero, guideline notice, and CTA' },
  { id: 'galleryPage', label: 'Gallery Page', description: 'Gallery hero banner and intro text' },
  { id: 'newsPage', label: 'News Page', description: 'News hero banner and intro text' },
  { id: 'servicesPage', label: 'Services Page', description: 'Services hero, packages intro, FAQs, and CTA' },
  { id: 'hotelsPage', label: 'Hotels Page', description: 'Hotels hero banner and CTA section' },
];

export default function PagesContentTab() {
  const [activeSection, setActiveSection] = useState<PageSection>('aboutPage');
  const [content, setContent] = useState<any>({});
  const [originalContent, setOriginalContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadContent(activeSection);
  }, [activeSection]);

  const loadContent = async (section: PageSection) => {
    setLoading(true);
    try {
      const data = await api.fetchContentSection(section);
      const resolved = cloneContent(data || getDefaultContent(section));
      setContent(resolved);
      setOriginalContent(cloneContent(resolved));
    } catch (error) {
      console.error('Error loading page content:', error);
      const fallback = cloneContent(getDefaultContent(section));
      setContent(fallback);
      setOriginalContent(cloneContent(fallback));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const next = cloneContent(content);
    let current = next;

    for (let index = 0; index < keys.length - 1; index += 1) {
      const key = keys[index];
      if (!current[key] || typeof current[key] !== 'object') current[key] = {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    setContent(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await api.updateContentSection(activeSection, content);
      setOriginalContent(cloneContent(content));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      console.error('Error saving page content:', error);
      alert('Failed to save page content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to the last saved values?')) {
      setContent(cloneContent(originalContent));
    }
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="admin-section-title mb-2">Page Content Studio</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <p className="font-semibold mb-2">Where to edit images on the website</p>
        <ul className="list-disc pl-5 space-y-1 text-blue-800">
          <li><strong>Team & Board tab</strong> — photos, names, and titles for Board of Directors and BICC Team on the About page.</li>
          <li><strong>Page Content (here)</strong> — banner/hero image at the top of each page (About, Venues, Events, etc.).</li>
          <li><strong>Content tab → Home Page</strong> — homepage hero, homepage sections, footer, and menu.</li>
          <li><strong>Venues tab</strong> — individual venue cards on the /venues listing (photos + videos per venue). Not the same as homepage preview cards.</li>
        </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-4 rounded-xl text-left transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <BookOpenText size={18} className={activeSection === section.id ? 'text-blue-100' : 'text-gray-400'} />
              <div>
                <div className="font-semibold text-sm mb-1">{section.label}</div>
                <div className={`text-xs ${activeSection === section.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {section.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden -mx-1 sm:mx-0">
        <div className="admin-toolbar">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
              Editing: {SECTIONS.find((section) => section.id === activeSection)?.label}
            </h3>
            {hasChanges && <p className="text-xs text-yellow-700 mt-1">Unsaved changes</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                hasChanges && !saving
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-3">
            <p className="text-green-700 text-sm font-medium">Page content saved successfully.</p>
          </div>
        )}

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading page content...</div>
          ) : (
            <div className="space-y-6">
              <EditorCard title="Hero Section">
                <div className="grid sm:grid-cols-2 gap-4">
                  <TextInput label="Eyebrow" value={content.hero?.eyebrow || ''} onChange={(value) => updateField('hero.eyebrow', value)} />
                  <NumberInput
                    label="Slide change every (seconds)"
                    value={content.hero?.slideIntervalSeconds ?? 5}
                    min={1}
                    onChange={(value) => updateField('hero.slideIntervalSeconds', value)}
                  />
                </div>
                <MediaField
                  label="Page banner image"
                  value={content.hero?.backgroundImage || ''}
                  onChange={(value) => updateField('hero.backgroundImage', value)}
                  accept="image"
                  uploadFolder="pages"
                  helpText="Large background image behind the page title. Upload here or pick from Media Library."
                />
                <ImageListField
                  label="Hero slideshow images"
                  value={content.hero?.backgroundImages || []}
                  onChange={(value) => updateField('hero.backgroundImages', value)}
                  uploadFolder="pages"
                  helpText="Add multiple hero images here. If you add more than one, the hero will rotate through them automatically."
                />
                <TextInput label="Hero Title" value={content.hero?.title || ''} onChange={(value) => updateField('hero.title', value)} />
                <TextArea label="Hero Description" rows={3} value={content.hero?.description || ''} onChange={(value) => updateField('hero.description', value)} />
              </EditorCard>

              <EditorCard title="Intro Section">
                <TextInput label="Intro Title" value={content.intro?.title || ''} onChange={(value) => updateField('intro.title', value)} />
                <TextArea label="Intro Description" rows={3} value={content.intro?.description || ''} onChange={(value) => updateField('intro.description', value)} />
              </EditorCard>

              {activeSection === 'aboutPage' && (
                <>
                  <EditorCard title="Story Section">
                    <MediaField
                      label="Story Image"
                      value={content.story?.image || ''}
                      onChange={(value) => updateField('story.image', value)}
                      accept="image"
                      uploadFolder="pages"
                      helpText="Photo shown beside the Our Story text on the About page."
                    />
                    <TextArea label="Story Paragraph 1" rows={4} value={content.story?.paragraph1 || ''} onChange={(value) => updateField('story.paragraph1', value)} />
                    <TextArea label="Story Paragraph 2" rows={3} value={content.story?.paragraph2 || ''} onChange={(value) => updateField('story.paragraph2', value)} />
                    <TextArea label="Story Paragraph 3" rows={3} value={content.story?.paragraph3 || ''} onChange={(value) => updateField('story.paragraph3', value)} />
                  </EditorCard>

                  <EditorCard title="Mission & Vision">
                    <TextInput label="Mission Title" value={content.mission?.title || ''} onChange={(value) => updateField('mission.title', value)} />
                    <TextArea label="Mission Description" rows={4} value={content.mission?.description || ''} onChange={(value) => updateField('mission.description', value)} />
                    <TextInput label="Vision Title" value={content.vision?.title || ''} onChange={(value) => updateField('vision.title', value)} />
                    <TextArea label="Vision Description" rows={4} value={content.vision?.description || ''} onChange={(value) => updateField('vision.description', value)} />
                  </EditorCard>

                  <EditorCard title="Board of Directors Section">
                    <p className="text-xs text-gray-500 -mt-2 mb-2">
                      Add individual board members in the <strong>Team & Board</strong> tab. Their photos can be added there by
                      uploading/importing an image, choosing one from Media Library, or pasting a direct image link. Edit the section headings here.
                    </p>
                    <TextInput label="Eyebrow" value={content.boardSection?.eyebrow || ''} onChange={(value) => updateField('boardSection.eyebrow', value)} />
                    <TextInput label="Section Title" value={content.boardSection?.title || ''} onChange={(value) => updateField('boardSection.title', value)} />
                    <TextArea label="Section Description" rows={2} value={content.boardSection?.description || ''} onChange={(value) => updateField('boardSection.description', value)} />
                  </EditorCard>

                  <EditorCard title="BICC Team Section">
                    <p className="text-xs text-gray-500 -mt-2 mb-2">
                      Add individual team members in the <strong>Team & Board</strong> tab. Their photos can be added there by
                      uploading/importing an image, choosing one from Media Library, or pasting a direct image link. Edit the section headings here.
                    </p>
                    <TextInput label="Eyebrow" value={content.teamSection?.eyebrow || ''} onChange={(value) => updateField('teamSection.eyebrow', value)} />
                    <TextInput label="Section Title" value={content.teamSection?.title || ''} onChange={(value) => updateField('teamSection.title', value)} />
                    <TextArea label="Section Description" rows={2} value={content.teamSection?.description || ''} onChange={(value) => updateField('teamSection.description', value)} />
                  </EditorCard>

                  <EditorCard title="Core Values">
                    <TextInput label="Eyebrow" value={content.values?.eyebrow || ''} onChange={(value) => updateField('values.eyebrow', value)} />
                    <TextInput label="Section Title" value={content.values?.title || ''} onChange={(value) => updateField('values.title', value)} />
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <TextInput
                          label={`Value ${i + 1} Title`}
                          value={content.values?.items?.[i]?.title || ''}
                          onChange={(value) => {
                            const items = [...(content.values?.items || getDefaultContent('aboutPage').values.items)];
                            items[i] = { ...items[i], title: value };
                            updateField('values.items', items);
                          }}
                        />
                        <TextInput
                          label={`Value ${i + 1} Description`}
                          value={content.values?.items?.[i]?.desc || ''}
                          onChange={(value) => {
                            const items = [...(content.values?.items || getDefaultContent('aboutPage').values.items)];
                            items[i] = { ...items[i], desc: value };
                            updateField('values.items', items);
                          }}
                        />
                      </div>
                    ))}
                  </EditorCard>

                  <EditorCard title="Key Facts">
                    <TextInput label="Section Title" value={content.facts?.title || ''} onChange={(value) => updateField('facts.title', value)} />
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <TextInput
                          label={`Fact ${i + 1} Value`}
                          value={content.facts?.items?.[i]?.value || ''}
                          onChange={(value) => {
                            const items = [...(content.facts?.items || getDefaultContent('aboutPage').facts.items)];
                            items[i] = { ...items[i], value };
                            updateField('facts.items', items);
                          }}
                        />
                        <TextInput
                          label={`Fact ${i + 1} Label`}
                          value={content.facts?.items?.[i]?.label || ''}
                          onChange={(value) => {
                            const items = [...(content.facts?.items || getDefaultContent('aboutPage').facts.items)];
                            items[i] = { ...items[i], label: value };
                            updateField('facts.items', items);
                          }}
                        />
                      </div>
                    ))}
                  </EditorCard>
                </>
              )}

              {(activeSection === 'eventsPage' || activeSection === 'downloadsPage' || activeSection === 'procurementPage' || activeSection === 'careersPage') && (
                <EditorCard title="Search and Filter Copy">
                  <TextInput label="Search Placeholder" value={content.search?.placeholder || ''} onChange={(value) => updateField('search.placeholder', value)} />
                  <TextInput label="Empty State Title" value={content.search?.emptyTitle || ''} onChange={(value) => updateField('search.emptyTitle', value)} />
                  <TextInput label="Empty State Description" value={content.search?.emptyDescription || ''} onChange={(value) => updateField('search.emptyDescription', value)} />
                </EditorCard>
              )}

              {(activeSection === 'procurementPage' || activeSection === 'bookingPage') && (
                <EditorCard title="Notice Panel">
                  <TextInput label="Notice Title" value={content.notice?.title || ''} onChange={(value) => updateField('notice.title', value)} />
                  <TextArea label="Notice Description" rows={3} value={content.notice?.description || ''} onChange={(value) => updateField('notice.description', value)} />
                </EditorCard>
              )}

              {(activeSection === 'venuesPage' || activeSection === 'downloadsPage' || activeSection === 'careersPage' || activeSection === 'procurementPage') && (
                <EditorCard title="CTA Section">
                  <TextInput label="CTA Title" value={content.cta?.title || ''} onChange={(value) => updateField('cta.title', value)} />
                  <TextArea label="CTA Description" rows={3} value={content.cta?.description || ''} onChange={(value) => updateField('cta.description', value)} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextInput label="Primary Button Text" value={content.cta?.primaryButtonText || ''} onChange={(value) => updateField('cta.primaryButtonText', value)} />
                    <TextInput label="Secondary Button Text" value={content.cta?.secondaryButtonText || ''} onChange={(value) => updateField('cta.secondaryButtonText', value)} />
                  </div>
                </EditorCard>
              )}

              {activeSection === 'bookingPage' && (
                <EditorCard title="Success Message">
                  <TextInput label="Success Title" value={content.success?.title || ''} onChange={(value) => updateField('success.title', value)} />
                  <TextArea label="Success Description" rows={3} value={content.success?.description || ''} onChange={(value) => updateField('success.description', value)} />
                  <TextInput label="Reference Label" value={content.success?.referenceLabel || ''} onChange={(value) => updateField('success.referenceLabel', value)} />
                  <TextArea label="Confirmation Note" rows={2} value={content.success?.confirmationText || ''} onChange={(value) => updateField('success.confirmationText', value)} />
                </EditorCard>
              )}

              {activeSection === 'servicesPage' && (
                <>
                  <EditorCard title="Packages Section">
                    <TextInput label="Eyebrow" value={content.packages?.eyebrow || ''} onChange={(value) => updateField('packages.eyebrow', value)} />
                    <TextInput label="Title" value={content.packages?.title || ''} onChange={(value) => updateField('packages.title', value)} />
                    <TextArea label="Description" rows={2} value={content.packages?.description || ''} onChange={(value) => updateField('packages.description', value)} />
                    <TextInput label="Footnote" value={content.packages?.footnote || ''} onChange={(value) => updateField('packages.footnote', value)} />
                  </EditorCard>
                  <EditorCard title="Add-On Services Section">
                    <TextInput label="Eyebrow" value={content.addons?.eyebrow || ''} onChange={(value) => updateField('addons.eyebrow', value)} />
                    <TextInput label="Title" value={content.addons?.title || ''} onChange={(value) => updateField('addons.title', value)} />
                    <TextArea label="Description" rows={2} value={content.addons?.description || ''} onChange={(value) => updateField('addons.description', value)} />
                  </EditorCard>
                  <EditorCard title="FAQ Section">
                    <TextInput label="Eyebrow" value={content.faq?.eyebrow || ''} onChange={(value) => updateField('faq.eyebrow', value)} />
                    <TextInput label="Title" value={content.faq?.title || ''} onChange={(value) => updateField('faq.title', value)} />
                    <TextArea label="Description" rows={2} value={content.faq?.description || ''} onChange={(value) => updateField('faq.description', value)} />
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="pt-2 border-t border-gray-100 space-y-2">
                        <TextInput
                          label={`FAQ ${i + 1} Question`}
                          value={content.faq?.items?.[i]?.q || ''}
                          onChange={(value) => {
                            const items = [...(content.faq?.items || getDefaultContent('servicesPage').faq.items)];
                            items[i] = { ...items[i], q: value };
                            updateField('faq.items', items);
                          }}
                        />
                        <TextArea
                          label={`FAQ ${i + 1} Answer`}
                          rows={2}
                          value={content.faq?.items?.[i]?.a || ''}
                          onChange={(value) => {
                            const items = [...(content.faq?.items || getDefaultContent('servicesPage').faq.items)];
                            items[i] = { ...items[i], a: value };
                            updateField('faq.items', items);
                          }}
                        />
                      </div>
                    ))}
                  </EditorCard>
                  <EditorCard title="CTA Section">
                    <TextInput label="Title" value={content.cta?.title || ''} onChange={(value) => updateField('cta.title', value)} />
                    <TextArea label="Description" rows={2} value={content.cta?.description || ''} onChange={(value) => updateField('cta.description', value)} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <TextInput label="Primary Button" value={content.cta?.primaryButtonText || ''} onChange={(value) => updateField('cta.primaryButtonText', value)} />
                      <TextInput label="Secondary Button" value={content.cta?.secondaryButtonText || ''} onChange={(value) => updateField('cta.secondaryButtonText', value)} />
                    </div>
                  </EditorCard>
                </>
              )}

              {activeSection === 'hotelsPage' && (
                <EditorCard title="CTA Section">
                  <TextInput label="CTA Title" value={content.cta?.title || ''} onChange={(value) => updateField('cta.title', value)} />
                  <TextArea label="CTA Description" rows={3} value={content.cta?.description || ''} onChange={(value) => updateField('cta.description', value)} />
                  <TextInput label="Primary Button Text" value={content.cta?.primaryButtonText || ''} onChange={(value) => updateField('cta.primaryButtonText', value)} />
                </EditorCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-4">
      <h4 className="font-semibold text-[#1F85A8]">{title}</h4>
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) => onChange(Math.max(min, parseInt(event.target.value, 10) || min))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}

function getDefaultContent(section: PageSection) {
  const defaults: Record<PageSection, any> = {
    aboutPage: {
      hero: {
        eyebrow: 'About Us',
        title: "Positioning The Gambia as Africa's Leading MICE Destination",
        description: "Established by the Government of The Gambia to advance the country's Meetings, Incentives, Conferences and Exhibitions industry.",
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Our Story',
        description: '',
      },
      story: {
        image: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
        paragraph1: "The Banjul International Convention Centre (BICC) was born from The Gambia's ambition to become a premier destination for international events and diplomacy. Originally established as the OIC Secretariat in preparation for the 15th OIC Islamic Summit held in Banjul in May 2024, the organization was officially renamed and restructured as BICC — a limited liability company with a broader mandate.",
        paragraph2: 'BICC manages two landmark facilities: the Sir Dawda Kairaba Jawara International Conference Centre (SDKJ-ICC) — a $50 million, 14,000m² state-of-the-art complex inaugurated by President Adama Barrow in January 2020, and the VVIP Lounge at Banjul International Airport.',
        paragraph3: "The Conference Centre is named after Sir Dawda Kairaba Jawara, The Gambia's first president and father of the nation, honoring his towering legacy. Nestled in the scenic Bijilo National Park and overlooking the Atlantic Ocean, it stands as the largest conference centre in the sub-region.",
      },
      mission: {
        title: 'Our Mission',
        description: 'To provide comprehensive event management services that ensure every conference, meeting, and ceremony reflects our core values of Excellence, Innovation, Sustainability, Service, and Integrity. We are committed to delivering tailored event solutions for summits, conferences, and special events that connect people, ideas, and opportunities.',
      },
      vision: {
        title: 'Our Vision',
        description: "To position The Gambia as a leading Meetings, Incentives, Conferences, and Exhibitions (MICE) destination in Africa and beyond. As a national asset, BICC plays a central role in promoting The Gambia's diplomacy, culture, and economic growth by hosting world-class events that inspire collaboration and progress.",
      },
      boardSection: {
        eyebrow: 'Governance',
        title: 'Board of Directors',
        description: "The leadership guiding BICC's strategic direction and commitment to excellence.",
      },
      teamSection: {
        eyebrow: 'Our People',
        title: 'Team at BICC',
        description: 'The dedicated professionals delivering world-class events and experiences every day.',
      },
      values: {
        eyebrow: 'What Drives Us',
        title: 'Our Core Values',
        items: [
          { title: 'Excellence', desc: 'Striving for the highest standards in everything we do' },
          { title: 'Innovation', desc: 'Embracing creative solutions and cutting-edge technology' },
          { title: 'Sustainability', desc: 'Building a responsible and lasting impact for future generations' },
          { title: 'Service', desc: 'Going above and beyond with Gambian hospitality' },
          { title: 'Integrity', desc: 'Operating with transparency, honesty, and accountability' },
        ],
      },
      facts: {
        title: 'Key Facts',
        items: [
          { value: '$50M', label: 'Investment in the facility' },
          { value: '51-200', label: 'Dedicated employees' },
          { value: '2020', label: 'Year inaugurated' },
          { value: '#1', label: 'Largest in the sub-region' },
        ],
      },
    },
    venuesPage: {
      hero: {
        eyebrow: 'Our Facilities',
        title: 'World-Class Venues',
        description: 'With the capacity to accommodate over 4,000 guests, the Sir Dawda Kairaba Jawara International Conference Center can host events of any size or shape.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Venue Capacity Overview',
        description: 'Quick reference for all event spaces',
      },
      cta: {
        title: 'Ready to Book an Event?',
        description: 'Submit a booking request and our team will get back to you within 1–2 business days.',
        primaryButtonText: 'Book an Event',
        secondaryButtonText: 'Contact Us',
      },
    },
    eventsPage: {
      hero: {
        eyebrow: 'Events',
        title: 'Events at BICC',
        description: 'Stay informed about the latest conferences, summits, and events hosted at the SDKJ International Conference Centre.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-1.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Discover What Is Happening',
        description: 'Use the filters below to browse upcoming and past events.',
      },
      search: {
        placeholder: 'Filter events...',
        emptyTitle: 'No events found',
        emptyDescription: 'Try changing the filters above.',
      },
    },
    bookingPage: {
      hero: {
        eyebrow: 'Reserve Your Space',
        title: 'Book an Event',
        description: 'Complete the form below to request a venue booking at the Banjul International Convention Centre. Our team will review your request and get back to you promptly.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Booking Form',
        description: 'Use this page to collect structured booking requests from clients and partners.',
      },
      notice: {
        title: 'Availability Notice',
        description: 'Venue conflicts are checked before the request is submitted to prevent overlapping bookings.',
      },
      success: {
        title: 'Booking Request Submitted!',
        description: 'Thank you. Our team will review your request and contact you within 1–2 business days to confirm availability and discuss further details.',
        referenceLabel: 'Your Booking Reference',
        confirmationText: 'A confirmation email has been sent to your email address. Please quote your reference number in any correspondence.',
      },
    },
    downloadsPage: {
      hero: {
        eyebrow: 'Resource Centre',
        title: 'Downloads Centre',
        description: 'Access brochures, floor plans, technical specifications, and event planning resources',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Document Library',
        description: 'Make key BICC documents available for clients, partners, and event planners.',
      },
      search: {
        placeholder: 'Search documents...',
        emptyTitle: 'No documents found',
        emptyDescription: 'Try adjusting your search or filter criteria',
      },
      cta: {
        title: 'Need a Custom Document?',
        description: "Can't find what you're looking for? Contact us and we'll prepare the information you need.",
        primaryButtonText: 'Contact Us',
        secondaryButtonText: '',
      },
    },
    careersPage: {
      hero: {
        eyebrow: 'Join Our Team',
        title: 'Careers at BICC',
        description: "Be part of Africa's premier convention centre team and help shape the future of MICE in The Gambia",
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Why Work at BICC?',
        description: 'Join a dynamic team delivering world-class events and conferences',
      },
      search: {
        placeholder: 'Search by job title or department...',
        emptyTitle: 'No vacancies found',
        emptyDescription: 'Check back soon for new opportunities',
      },
      cta: {
        title: 'Questions About Careers at BICC?',
        description: 'Our Human Resources team is here to help with any questions about careers, applications, or our recruitment process.',
        primaryButtonText: 'Contact HR Team',
        secondaryButtonText: '',
      },
    },
    procurementPage: {
      hero: {
        eyebrow: 'Business Opportunities',
        title: 'Procurement & Tenders',
        description: 'Browse open tenders, procurement notices, and business opportunities with BICC',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: {
        title: 'Open Tenders',
        description: 'Review active procurement opportunities and required submission documents.',
      },
      search: {
        placeholder: 'Search tenders...',
        emptyTitle: 'No open tenders',
        emptyDescription: 'Check back soon for new opportunities',
      },
      notice: {
        title: 'Procurement Guidelines',
        description: 'BICC follows transparent procurement procedures in accordance with The Gambia Public Procurement Authority (GPPA) regulations. All bids must be submitted before the closing date and time. Late submissions will not be accepted.',
      },
      cta: {
        title: 'Procurement Inquiries',
        description: 'For questions about procurement procedures, tender documents, or submission requirements, please contact our Procurement Office.',
        primaryButtonText: 'Email Procurement Office',
        secondaryButtonText: '+220 778 4425',
      },
    },
    galleryPage: {
      hero: {
        eyebrow: 'Gallery',
        title: 'Photos & Videos',
        description: 'Explore our world-class facilities, events, and the stunning setting of the SDKJ International Conference Centre.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: { title: '', description: '' },
    },
    newsPage: {
      hero: {
        eyebrow: 'News & Updates',
        title: 'Latest News',
        description: 'Stay updated with the latest happenings at the Banjul International Convention Centre.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      intro: { title: '', description: '' },
    },
    servicesPage: {
      hero: {
        eyebrow: 'What We Offer',
        title: 'Services & Packages',
        description: 'From intimate boardroom meetings to full-scale international summits — BICC delivers tailored event solutions that reflect excellence and African hospitality.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      packages: {
        eyebrow: 'Event Packages',
        title: 'Choose Your Package',
        description: 'All packages are fully customisable. Contact our events team for a tailored quote.',
        footnote: 'All packages are subject to availability and final confirmation by BICC. Prices provided upon request.',
      },
      addons: {
        eyebrow: 'Enhance Your Event',
        title: 'Add-On Services',
        description: 'Customise any package with additional services tailored to your event needs.',
      },
      faq: {
        eyebrow: 'Got Questions?',
        title: 'Frequently Asked Questions',
        description: 'Everything event planners need to know before booking with BICC.',
        items: [
          { q: 'Do you provide catering in-house?', a: 'Yes. BICC has a full in-house catering team offering breakfast, lunch, dinner, and refreshment packages. We also accommodate dietary requirements including halal, vegetarian, and vegan menus.' },
          { q: 'Can we bring our own vendors or caterers?', a: 'External vendors are permitted for specific services such as décor and entertainment, subject to prior approval by BICC management. In-house catering is preferred for all food and beverage services.' },
          { q: 'What is the cancellation policy?', a: 'Cancellations made more than 14 days before the event incur no charge. Cancellations within 7–14 days attract a 25% fee. Cancellations within 7 days or less attract a 50% fee. Full terms are included in the booking agreement.' },
          { q: 'How far in advance should we book?', a: 'We recommend booking at least 4–6 weeks in advance for standard events, and 3–6 months for large international summits or multi-day conferences to ensure full availability and preparation time.' },
          { q: 'Is the venue accessible for people with disabilities?', a: 'Yes. The SDKJ International Conference Centre is fully accessible, with ramp access, lifts, accessible restrooms, and reserved seating areas for delegates with mobility needs.' },
          { q: 'Do you offer on-site technical support?', a: 'Yes. A dedicated AV and technical team is available throughout your event to manage sound, lighting, projection, and live streaming needs.' },
          { q: 'Can we arrange accommodation for delegates?', a: 'BICC works with partner hotels in the Bijilo and Kololi area to arrange preferential rates for delegates. Our events team can coordinate accommodation on your behalf.' },
          { q: 'What payment methods do you accept?', a: 'We accept bank transfers, company cheques, and cash payments. A deposit is required to confirm the booking. Full payment details are provided upon receipt of your booking confirmation.' },
        ],
      },
      cta: {
        title: 'Still have questions?',
        description: 'Our events team is happy to help with anything not covered above.',
        primaryButtonText: 'Contact Us',
        secondaryButtonText: 'Submit a Booking Request',
      },
    },
    hotelsPage: {
      hero: {
        eyebrow: 'Destination Gambia',
        title: 'Hotels & Accommodation',
        description: 'Choose from our partner hotels offering world-class hospitality near the convention centre.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      cta: {
        title: 'Need Help with Accommodation?',
        description: 'Our team can assist with group bookings and accommodation arrangements for your event.',
        primaryButtonText: 'Contact Us',
        secondaryButtonText: '',
      },
    },
  };

  return defaults[section];
}

function cloneContent<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
