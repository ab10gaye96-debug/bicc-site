import { useEffect, useState } from 'react';
import { BookOpenText, Save, RotateCcw } from 'lucide-react';
import * as api from '../../api';

type PageSection =
  | 'aboutPage'
  | 'venuesPage'
  | 'eventsPage'
  | 'bookingPage'
  | 'downloadsPage'
  | 'careersPage'
  | 'procurementPage';

interface SectionConfig {
  id: PageSection;
  label: string;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'aboutPage', label: 'About Page', description: 'About hero, story intro, and value section title' },
  { id: 'venuesPage', label: 'Venues Page', description: 'Venue hero, capacity overview, and CTA section' },
  { id: 'eventsPage', label: 'Events Page', description: 'Events hero and filter/search copy' },
  { id: 'bookingPage', label: 'Booking Page', description: 'Booking hero and success-state messages' },
  { id: 'downloadsPage', label: 'Downloads Page', description: 'Downloads hero, search copy, and CTA section' },
  { id: 'careersPage', label: 'Careers Page', description: 'Careers hero, benefits intro, and careers CTA' },
  { id: 'procurementPage', label: 'Procurement Page', description: 'Procurement hero, guideline notice, and CTA' },
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
        <p className="text-slate-600 text-sm">
          Manage the main public page headlines, descriptions, notices, CTA blocks, and search copy.
        </p>
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
                  <TextInput label="Background Image URL" value={content.hero?.backgroundImage || ''} onChange={(value) => updateField('hero.backgroundImage', value)} />
                </div>
                <TextInput label="Hero Title" value={content.hero?.title || ''} onChange={(value) => updateField('hero.title', value)} />
                <TextArea label="Hero Description" rows={3} value={content.hero?.description || ''} onChange={(value) => updateField('hero.description', value)} />
              </EditorCard>

              <EditorCard title="Intro Section">
                <TextInput label="Intro Title" value={content.intro?.title || ''} onChange={(value) => updateField('intro.title', value)} />
                <TextArea label="Intro Description" rows={3} value={content.intro?.description || ''} onChange={(value) => updateField('intro.description', value)} />
              </EditorCard>

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

function getDefaultContent(section: PageSection) {
  const defaults: Record<PageSection, any> = {
    aboutPage: {
      hero: {
        eyebrow: 'About Us',
        title: "Positioning The Gambia as Africa's Leading MICE Destination",
        description: "Established by the Government of The Gambia to advance the country's Meetings, Incentives, Conferences and Exhibitions industry.",
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
      },
      intro: {
        title: 'Our Story',
        description: 'Share the BICC story, milestone background, mission, vision, and value headings from this section.',
      },
    },
    venuesPage: {
      hero: {
        eyebrow: 'Our Facilities',
        title: 'World-Class Venues',
        description: 'With the capacity to accommodate over 4,000 guests, the Sir Dawda Kairaba Jawara International Conference Center can host events of any size or shape.',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
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
  };

  return defaults[section];
}

function cloneContent<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
