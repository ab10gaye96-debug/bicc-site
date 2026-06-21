import { useState, useEffect } from 'react';
import { FileText, Save, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import * as api from '../../api';
import { ImageListField, MediaField } from './MediaField';

type ContentSection = 'home' | 'footer' | 'navbar' | 'contact';

interface SectionConfig {
  id: ContentSection;
  label: string;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'home', label: 'Home Page', description: 'Hero section, stats, about preview, CTA' },
  { id: 'footer', label: 'Footer', description: 'Brand info, links, contact, social, facilities' },
  { id: 'navbar', label: 'Navigation Menu', description: 'Menu links, dropdowns, brand, and buttons' },
  { id: 'contact', label: 'Contact Page', description: 'Contact information and office details' },
];

export default function ContentManagementTab() {
  const [activeSection, setActiveSection] = useState<ContentSection>('home');
  const [content, setContent] = useState<any>({});
  const [originalContent, setOriginalContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['hero']);

  useEffect(() => {
    loadContent(activeSection);
  }, [activeSection]);

  const loadContent = async (section: ContentSection) => {
    setLoading(true);
    try {
      const data = await api.fetchContentSection(section);
      const resolved = mergeContent(section, data);
      setContent(resolved);
      setOriginalContent(cloneContent(resolved));
    } catch (error) {
      console.error('Error loading content:', error);
      const fallback = cloneContent(getDefaultContent(section));
      setContent(fallback);
      setOriginalContent(cloneContent(fallback));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await api.updateContentSection(activeSection, content);
      setOriginalContent(cloneContent(content));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm('Reset to last saved version?')) {
      setContent(cloneContent(originalContent));
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionKey)
        ? prev.filter(s => s !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const next = cloneContent(content);
    let current: any = next;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') current[key] = {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    setContent(next);
  };

  const addListItem = (path: string, item: Record<string, string>) => {
    const keys = path.split('.');
    const next = cloneContent(content);
    let current: any = next;

    for (const key of keys) {
      if (!current[key]) current[key] = [];
      current = current[key];
    }

    if (!Array.isArray(current)) return;
    current.push(item);
    setContent(next);
  };

  const removeListItem = (path: string, index: number) => {
    const keys = path.split('.');
    const next = cloneContent(content);
    let current: any = next;

    for (const key of keys) {
      current = current[key];
    }

    if (!Array.isArray(current)) return;
    current.splice(index, 1);
    setContent(next);
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  return (
    <div>
      <div className="mb-6">
        <h2 className="admin-section-title mb-2">Content Management</h2>
        <p className="text-slate-600 text-sm mb-3">
          Edit homepage sections, footer, and navigation. Saved changes appear on the live site automatically.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
          <strong>Not the same as Venues tab:</strong> Home → Venues Preview cards here are static homepage teasers.
          The <strong>Venues tab</strong> manages the full venue list on /venues. Use <strong>Page Content</strong> for other page banners (About, Events, etc.).
        </div>
      </div>

      {/* Section Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => {
              if (hasChanges && !confirm('You have unsaved changes. Switch section anyway?')) return;
              setActiveSection(section.id);
            }}
            className={`p-4 rounded-xl text-left transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <FileText size={20} className={activeSection === section.id ? 'text-blue-200' : 'text-gray-400'} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1">{section.label}</div>
                <div className={`text-xs ${activeSection === section.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {section.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden -mx-1 sm:mx-0">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
              Editing: {SECTIONS.find(s => s.id === activeSection)?.label}
            </h3>
            {hasChanges && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
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

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-3">
            <p className="text-green-800 text-sm font-medium">✅ Changes saved successfully!</p>
          </div>
        )}

        {/* Content Forms */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading content...</div>
          ) : (
            <>
              {activeSection === 'home' && <HomeContentEditor content={content} updateField={updateField} expandedSections={expandedSections} toggleSection={toggleSection} />}
              {activeSection === 'footer' && <FooterContentEditor content={content} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} expandedSections={expandedSections} toggleSection={toggleSection} />}
              {activeSection === 'navbar' && <NavbarContentEditor content={content} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} expandedSections={expandedSections} toggleSection={toggleSection} />}
              {activeSection === 'contact' && <ContactContentEditor content={content} updateField={updateField} expandedSections={expandedSections} toggleSection={toggleSection} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Home Page Editor Component
function HomeContentEditor({ content, updateField, expandedSections, toggleSection }: any) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <CollapsibleSection
        title="Hero Section"
        id="hero"
        expanded={expandedSections.includes('hero')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <p className="font-semibold mb-2">How hero image / video works</p>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li><strong>Image mode:</strong> set Hero Media Type to Image and upload or paste a <strong>Background Image URL</strong>.</li>
              <li><strong>Slideshow:</strong> in Image mode, add multiple images below and choose how many seconds each slide should stay on screen.</li>
              <li><strong>Video mode:</strong> set Hero Media Type to Video, upload a video to <strong>Background Video URL</strong>, and optionally set a poster image.</li>
              <li>Upload files here or use the Media Library tab first, then click &quot;Media library&quot; to pick them.</li>
              <li>Click <strong>Save Changes</strong> at the top of this page when finished.</li>
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Media Type</label>
            <select
              value={content.hero?.mediaType || 'image'}
              onChange={(e) => updateField('hero.mediaType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <TextInput
            label="Hero Badge Text"
            value={content.hero?.badge || ''}
            onChange={(v) => updateField('hero.badge', v)}
            placeholder="The Gambia's Premier MICE Destination"
          />
          <TextInput
            label="Main Title"
            value={content.hero?.title || ''}
            onChange={(v) => updateField('hero.title', v)}
            placeholder="Banjul International Convention Centre"
          />
          <TextInput
            label="Subtitle"
            value={content.hero?.subtitle || ''}
            onChange={(v) => updateField('hero.subtitle', v)}
            placeholder="The Gambia's Premier MICE Destination"
          />
          <TextArea
            label="Description"
            value={content.hero?.description || ''}
            onChange={(v) => updateField('hero.description', v)}
            rows={3}
            placeholder="Brief description about BICC..."
          />
          <TextInput
            label="Primary Button Text"
            value={content.hero?.primaryButton || ''}
            onChange={(v) => updateField('hero.primaryButton', v)}
            placeholder="Book an Event"
          />
          <TextInput
            label="Secondary Button Text"
            value={content.hero?.secondaryButton || ''}
            onChange={(v) => updateField('hero.secondaryButton', v)}
            placeholder="Explore Venues"
          />
          <MediaField
            label="Background Image"
            value={content.hero?.backgroundImage || ''}
            onChange={(v) => updateField('hero.backgroundImage', v)}
            accept="image"
            uploadFolder="hero"
            helpText={content.hero?.mediaType === 'video'
              ? 'Used as the video poster/thumbnail while the video loads.'
              : 'Full-screen background image on the homepage hero.'}
          />
          {content.hero?.mediaType !== 'video' && (
            <>
              <NumberInput
                label="Slide change every (seconds)"
                value={content.hero?.slideIntervalSeconds ?? 5}
                min={1}
                onChange={(value) => updateField('hero.slideIntervalSeconds', value)}
              />
              <ImageListField
                label="Hero slideshow images"
                value={content.hero?.backgroundImages || []}
                onChange={(value) => updateField('hero.backgroundImages', value)}
                uploadFolder="hero"
                helpText="Add more than one image to rotate the homepage hero automatically."
              />
            </>
          )}
          {content.hero?.mediaType === 'video' && (
            <>
              <MediaField
                label="Background Video"
                value={content.hero?.backgroundVideo || ''}
                onChange={(v) => updateField('hero.backgroundVideo', v)}
                accept="video"
                uploadFolder="hero"
                helpText="Upload an MP4/WebM file or paste a direct video URL. YouTube links are not supported for autoplay hero."
              />
              <MediaField
                label="Video Poster Image (optional)"
                value={content.hero?.videoPoster || ''}
                onChange={(v) => updateField('hero.videoPoster', v)}
                accept="image"
                uploadFolder="hero"
                helpText="Shown before the video plays. Falls back to Background Image if empty."
              />
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Stats Section */}
      <CollapsibleSection
        title="Statistics Bar"
        id="stats"
        expanded={expandedSections.includes('stats')}
        onToggle={toggleSection}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput
            label="Stat 1 - Value"
            value={content.stats?.capacity?.value || ''}
            onChange={(v) => updateField('stats.capacity.value', v)}
            placeholder="4000+"
          />
          <TextInput
            label="Stat 1 - Label"
            value={content.stats?.capacity?.label || ''}
            onChange={(v) => updateField('stats.capacity.label', v)}
            placeholder="Guest Capacity"
          />
          <TextInput
            label="Stat 2 - Value"
            value={content.stats?.spaces?.value || ''}
            onChange={(v) => updateField('stats.spaces.value', v)}
            placeholder="30+"
          />
          <TextInput
            label="Stat 2 - Label"
            value={content.stats?.spaces?.label || ''}
            onChange={(v) => updateField('stats.spaces.label', v)}
            placeholder="Event Spaces"
          />
          <TextInput
            label="Stat 3 - Value"
            value={content.stats?.events?.value || ''}
            onChange={(v) => updateField('stats.events.value', v)}
            placeholder="50+"
          />
          <TextInput
            label="Stat 3 - Label"
            value={content.stats?.events?.label || ''}
            onChange={(v) => updateField('stats.events.label', v)}
            placeholder="International Events"
          />
          <TextInput
            label="Stat 4 - Value"
            value={content.stats?.rating?.value || ''}
            onChange={(v) => updateField('stats.rating.value', v)}
            placeholder="5-Star"
          />
          <TextInput
            label="Stat 4 - Label"
            value={content.stats?.rating?.label || ''}
            onChange={(v) => updateField('stats.rating.label', v)}
            placeholder="Facility Rating"
          />
        </div>
      </CollapsibleSection>

      {/* About Preview Section */}
      <CollapsibleSection
        title="About Preview Section"
        id="about"
        expanded={expandedSections.includes('about')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="Section Eyebrow"
            value={content.about?.eyebrow || ''}
            onChange={(v) => updateField('about.eyebrow', v)}
            placeholder="About BICC"
          />
          <TextInput
            label="Section Title"
            value={content.about?.title || ''}
            onChange={(v) => updateField('about.title', v)}
            placeholder="Where Excellence Meets African Hospitality"
          />
          <TextInput
            label="Highlighted Title Text"
            value={content.about?.highlightText || ''}
            onChange={(v) => updateField('about.highlightText', v)}
            placeholder="African Hospitality"
          />
          <TextArea
            label="Paragraph 1"
            value={content.about?.paragraph1 || ''}
            onChange={(v) => updateField('about.paragraph1', v)}
            rows={3}
          />
          <TextArea
            label="Paragraph 2"
            value={content.about?.paragraph2 || ''}
            onChange={(v) => updateField('about.paragraph2', v)}
            rows={3}
          />
          <TextArea
            label="Paragraph 3"
            value={content.about?.paragraph3 || ''}
            onChange={(v) => updateField('about.paragraph3', v)}
            rows={3}
          />
          <TextInput
            label="Feature Value 1"
            value={content.about?.values?.value1 || ''}
            onChange={(v) => updateField('about.values.value1', v)}
            placeholder="Excellence"
          />
          <TextInput
            label="Feature Value 2"
            value={content.about?.values?.value2 || ''}
            onChange={(v) => updateField('about.values.value2', v)}
            placeholder="Innovation"
          />
          <TextInput
            label="Feature Value 3"
            value={content.about?.values?.value3 || ''}
            onChange={(v) => updateField('about.values.value3', v)}
            placeholder="Integrity"
          />
          <TextInput
            label="Feature Value 4"
            value={content.about?.values?.value4 || ''}
            onChange={(v) => updateField('about.values.value4', v)}
            placeholder="Sustainability"
          />
          <TextInput
            label="Preview Image URL"
            value={content.about?.image || ''}
            onChange={(v) => updateField('about.image', v)}
            placeholder="https://example.com/about-preview.jpg"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              label="Image Badge Value"
              value={content.about?.imageStat?.value || ''}
              onChange={(v) => updateField('about.imageStat.value', v)}
              placeholder="14,000"
            />
            <TextInput
              label="Image Badge Label"
              value={content.about?.imageStat?.label || ''}
              onChange={(v) => updateField('about.imageStat.label', v)}
              placeholder="m² of Event Space"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Venues Preview Section"
        id="venues"
        expanded={expandedSections.includes('venues')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="Section Eyebrow"
            value={content.venues?.eyebrow || ''}
            onChange={(v) => updateField('venues.eyebrow', v)}
            placeholder="Our Facilities"
          />
          <TextInput
            label="Section Title"
            value={content.venues?.title || ''}
            onChange={(v) => updateField('venues.title', v)}
            placeholder="World-Class Event Spaces"
          />
          <TextArea
            label="Section Description"
            value={content.venues?.description || ''}
            onChange={(v) => updateField('venues.description', v)}
            rows={2}
            placeholder="From grand plenary halls to intimate bilateral rooms..."
          />
          <TextInput
            label="View All Button Text"
            value={content.venues?.buttonText || ''}
            onChange={(v) => updateField('venues.buttonText', v)}
            placeholder="View All Venues"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              label="Card 1 Title"
              value={content.venues?.cards?.card1?.name || ''}
              onChange={(v) => updateField('venues.cards.card1.name', v)}
              placeholder="Plenary Hall"
            />
            <TextInput
              label="Card 1 Capacity"
              value={content.venues?.cards?.card1?.capacity || ''}
              onChange={(v) => updateField('venues.cards.card1.capacity', v)}
              placeholder="1,013 seats"
            />
            <TextArea
              label="Card 1 Description"
              value={content.venues?.cards?.card1?.description || ''}
              onChange={(v) => updateField('venues.cards.card1.description', v)}
              rows={2}
              placeholder="Our flagship UN General Assembly-style conference hall"
            />
            <MediaField
              label="Card 1 Image (homepage preview only)"
              value={content.venues?.cards?.card1?.image || ''}
              onChange={(v) => updateField('venues.cards.card1.image', v)}
              accept="image"
              uploadFolder="venues"
            />
            <TextInput
              label="Card 2 Title"
              value={content.venues?.cards?.card2?.name || ''}
              onChange={(v) => updateField('venues.cards.card2.name', v)}
              placeholder="Banquet Halls"
            />
            <TextInput
              label="Card 2 Capacity"
              value={content.venues?.cards?.card2?.capacity || ''}
              onChange={(v) => updateField('venues.cards.card2.capacity', v)}
              placeholder="500 guests"
            />
            <TextArea
              label="Card 2 Description"
              value={content.venues?.cards?.card2?.description || ''}
              onChange={(v) => updateField('venues.cards.card2.description', v)}
              rows={2}
              placeholder="Elegant spaces for galas, dinners, and ceremonies"
            />
            <MediaField
              label="Card 2 Image (homepage preview only)"
              value={content.venues?.cards?.card2?.image || ''}
              onChange={(v) => updateField('venues.cards.card2.image', v)}
              accept="image"
              uploadFolder="venues"
            />
            <TextInput
              label="Card 3 Title"
              value={content.venues?.cards?.card3?.name || ''}
              onChange={(v) => updateField('venues.cards.card3.name', v)}
              placeholder="VVIP Airport Lounge"
            />
            <TextInput
              label="Card 3 Capacity"
              value={content.venues?.cards?.card3?.capacity || ''}
              onChange={(v) => updateField('venues.cards.card3.capacity', v)}
              placeholder="Exclusive"
            />
            <TextArea
              label="Card 3 Description"
              value={content.venues?.cards?.card3?.description || ''}
              onChange={(v) => updateField('venues.cards.card3.description', v)}
              rows={2}
              placeholder="Ultra-modern arrival experience at Banjul Airport"
            />
            <MediaField
              label="Card 3 Image (homepage preview only)"
              value={content.venues?.cards?.card3?.image || ''}
              onChange={(v) => updateField('venues.cards.card3.image', v)}
              accept="image"
              uploadFolder="venues"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* CTA Section */}
      <CollapsibleSection
        title="Call-to-Action Section"
        id="cta"
        expanded={expandedSections.includes('cta')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="CTA Title"
            value={content.cta?.title || ''}
            onChange={(v) => updateField('cta.title', v)}
            placeholder="Ready to Host Your Next Event?"
          />
          <TextArea
            label="CTA Description"
            value={content.cta?.description || ''}
            onChange={(v) => updateField('cta.description', v)}
            rows={2}
          />
          <TextInput
            label="Button Text"
            value={content.cta?.buttonText || ''}
            onChange={(v) => updateField('cta.buttonText', v)}
            placeholder="Book an Event"
          />
          <TextInput
            label="Background Image URL"
            value={content.cta?.backgroundImage || ''}
            onChange={(v) => updateField('cta.backgroundImage', v)}
            placeholder="https://example.com/cta-background.jpg"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

// Footer Editor Component
function FooterContentEditor({ content, updateField, addListItem, removeListItem, expandedSections, toggleSection }: any) {
  return (
    <div className="space-y-6">
      <CollapsibleSection
        title="Brand Section"
        id="brand"
        expanded={expandedSections.includes('brand')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="Brand Title"
            value={content.brand?.title || ''}
            onChange={(v) => updateField('brand.title', v)}
            placeholder="BICC"
          />
          <TextInput
            label="Brand Subtitle"
            value={content.brand?.subtitle || ''}
            onChange={(v) => updateField('brand.subtitle', v)}
            placeholder="Banjul International Convention Centre"
          />
          <TextArea
            label="Brand Description"
            value={content.brand?.description || ''}
            onChange={(v) => updateField('brand.description', v)}
            rows={3}
            placeholder="The Gambia's national premier event management institution..."
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Footer Labels"
        id="labels"
        expanded={expandedSections.includes('labels')}
        onToggle={toggleSection}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput
            label="Quick Links Heading"
            value={content.labels?.quickLinks || ''}
            onChange={(v) => updateField('labels.quickLinks', v)}
            placeholder="Quick Links"
          />
          <TextInput
            label="Resources Heading"
            value={content.labels?.resources || ''}
            onChange={(v) => updateField('labels.resources', v)}
            placeholder="Resources"
          />
          <TextInput
            label="Facilities Heading"
            value={content.labels?.facilities || ''}
            onChange={(v) => updateField('labels.facilities', v)}
            placeholder="Our Facilities"
          />
          <TextInput
            label="Contact Heading"
            value={content.labels?.contact || ''}
            onChange={(v) => updateField('labels.contact', v)}
            placeholder="Contact Us"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Quick Links"
        id="quickLinks"
        expanded={expandedSections.includes('quickLinks')}
        onToggle={toggleSection}
      >
        <LinkListEditor
          links={content.quickLinks || []}
          basePath="quickLinks"
          updateField={updateField}
          addListItem={addListItem}
          removeListItem={removeListItem}
          newItemTemplate={{ name: 'New Link', path: '/' }}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Resource Links"
        id="resourceLinks"
        expanded={expandedSections.includes('resourceLinks')}
        onToggle={toggleSection}
      >
        <LinkListEditor
          links={content.resourceLinks || []}
          basePath="resourceLinks"
          updateField={updateField}
          addListItem={addListItem}
          removeListItem={removeListItem}
          newItemTemplate={{ name: 'New Link', path: '/' }}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Contact Information"
        id="contact"
        expanded={expandedSections.includes('contact')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextArea
            label="Address"
            value={content.contact?.address || ''}
            onChange={(v) => updateField('contact.address', v)}
            rows={2}
          />
          <TextInput
            label="Phone 1"
            value={content.contact?.phone1 || ''}
            onChange={(v) => updateField('contact.phone1', v)}
            placeholder="+220 123 4567"
          />
          <TextInput
            label="Phone 2"
            value={content.contact?.phone2 || ''}
            onChange={(v) => updateField('contact.phone2', v)}
            placeholder="+220 765 4321"
          />
          <TextInput
            label="Email"
            value={content.contact?.email || ''}
            onChange={(v) => updateField('contact.email', v)}
            placeholder="info@bicc.gm"
          />
          <TextInput
            label="Working Hours"
            value={content.contact?.hours || ''}
            onChange={(v) => updateField('contact.hours', v)}
            placeholder="Mon - Fri: 9:00 AM - 5:00 PM"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Social Media Links"
        id="social"
        expanded={expandedSections.includes('social')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="Facebook URL"
            value={content.social?.facebook || ''}
            onChange={(v) => updateField('social.facebook', v)}
            placeholder="https://www.facebook.com/BICCGM"
          />
          <TextInput
            label="Instagram URL"
            value={content.social?.instagram || ''}
            onChange={(v) => updateField('social.instagram', v)}
            placeholder="https://www.instagram.com/banjulconventioncentre/"
          />
          <TextInput
            label="LinkedIn URL"
            value={content.social?.linkedin || ''}
            onChange={(v) => updateField('social.linkedin', v)}
            placeholder="https://www.linkedin.com/company/..."
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Facilities List"
        id="facilities"
        expanded={expandedSections.includes('facilities')}
        onToggle={toggleSection}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput
            label="Facility 1"
            value={content.facilities?.item1 || ''}
            onChange={(v) => updateField('facilities.item1', v)}
            placeholder="Plenary Hall (1,013 seats)"
          />
          <TextInput
            label="Facility 2"
            value={content.facilities?.item2 || ''}
            onChange={(v) => updateField('facilities.item2', v)}
            placeholder="Banquet Hall A (500 guests)"
          />
          <TextInput
            label="Facility 3"
            value={content.facilities?.item3 || ''}
            onChange={(v) => updateField('facilities.item3', v)}
            placeholder="Banquet Hall B (250 guests)"
          />
          <TextInput
            label="Facility 4"
            value={content.facilities?.item4 || ''}
            onChange={(v) => updateField('facilities.item4', v)}
            placeholder="4 Thematic Meeting Rooms"
          />
          <TextInput
            label="Facility 5"
            value={content.facilities?.item5 || ''}
            onChange={(v) => updateField('facilities.item5', v)}
            placeholder="11 Bilateral Meeting Rooms"
          />
          <TextInput
            label="Facility 6"
            value={content.facilities?.item6 || ''}
            onChange={(v) => updateField('facilities.item6', v)}
            placeholder="VVIP Airport Lounge"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Copyright Text"
        id="copyright"
        expanded={expandedSections.includes('copyright')}
        onToggle={toggleSection}
      >
        <TextInput
          label="Copyright Line"
          value={content.copyright?.text || ''}
          onChange={(v) => updateField('copyright.text', v)}
          placeholder="© 2026 Banjul International Convention Centre. All rights reserved."
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Bottom Bar Tags"
        id="bottom"
        expanded={expandedSections.includes('bottom')}
        onToggle={toggleSection}
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <TextInput
            label="Tag 1"
            value={content.bottomBar?.tag1 || ''}
            onChange={(v) => updateField('bottomBar.tag1', v)}
            placeholder="Excellence"
          />
          <TextInput
            label="Tag 2"
            value={content.bottomBar?.tag2 || ''}
            onChange={(v) => updateField('bottomBar.tag2', v)}
            placeholder="Innovation"
          />
          <TextInput
            label="Tag 3"
            value={content.bottomBar?.tag3 || ''}
            onChange={(v) => updateField('bottomBar.tag3', v)}
            placeholder="Sustainability"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

// Navbar Editor Component
function NavbarContentEditor({ content, updateField, addListItem, removeListItem, expandedSections, toggleSection }: any) {
  return (
    <div className="space-y-6">
      <CollapsibleSection
        title="Main Navigation Links"
        id="navLinks"
        expanded={expandedSections.includes('navLinks')}
        onToggle={toggleSection}
      >
        <p className="text-xs text-gray-500 mb-4">
          Order matters: links 1–2 appear before Venues, links 3–5 between dropdowns, and the rest after Resources.
        </p>
        <LinkListEditor
          links={content.navLinks || []}
          basePath="navLinks"
          updateField={updateField}
          addListItem={addListItem}
          removeListItem={removeListItem}
          newItemTemplate={{ name: 'New Link', path: '/' }}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Venues Dropdown"
        id="venuesDropdown"
        expanded={expandedSections.includes('venuesDropdown')}
        onToggle={toggleSection}
      >
        <LinkListEditor
          links={content.venuesDropdown || []}
          basePath="venuesDropdown"
          updateField={updateField}
          addListItem={addListItem}
          removeListItem={removeListItem}
          newItemTemplate={{ name: 'New Item', path: '/', desc: 'Short description', icon: 'Building2' }}
          showDescription
          showIcon
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Resources Dropdown"
        id="resourcesDropdown"
        expanded={expandedSections.includes('resourcesDropdown')}
        onToggle={toggleSection}
      >
        <LinkListEditor
          links={content.resourcesDropdown || []}
          basePath="resourcesDropdown"
          updateField={updateField}
          addListItem={addListItem}
          removeListItem={removeListItem}
          newItemTemplate={{ name: 'New Item', path: '/', desc: 'Short description', icon: 'Globe2' }}
          showDescription
          showIcon
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Brand"
        id="brand"
        expanded={expandedSections.includes('brand')}
        onToggle={toggleSection}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput
            label="Short Brand Name"
            value={content.brand?.shortName || ''}
            onChange={(v) => updateField('brand.shortName', v)}
            placeholder="BICC"
          />
          <TextInput
            label="Full Brand Name"
            value={content.brand?.fullName || ''}
            onChange={(v) => updateField('brand.fullName', v)}
            placeholder="Banjul International Convention Centre"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Menu Labels"
        id="labels"
        expanded={expandedSections.includes('labels')}
        onToggle={toggleSection}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput
            label="Venues Menu Label"
            value={content.labels?.venues || ''}
            onChange={(v) => updateField('labels.venues', v)}
            placeholder="Venues"
          />
          <TextInput
            label="Resources Menu Label"
            value={content.labels?.resources || ''}
            onChange={(v) => updateField('labels.resources', v)}
            placeholder="Resources"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Primary Button"
        id="button"
        expanded={expandedSections.includes('button')}
        onToggle={toggleSection}
      >
        <TextInput
          label="Book Button Text"
          value={content.bookButton?.text || ''}
          onChange={(v) => updateField('bookButton.text', v)}
          placeholder="Book an Event"
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Search"
        id="search"
        expanded={expandedSections.includes('search')}
        onToggle={toggleSection}
      >
        <TextInput
          label="Search Placeholder"
          value={content.search?.placeholder || ''}
          onChange={(v) => updateField('search.placeholder', v)}
          placeholder="Search..."
        />
      </CollapsibleSection>
    </div>
  );
}

// Contact Page Editor Component
function ContactContentEditor({ content, updateField, expandedSections, toggleSection }: any) {
  return (
    <div className="space-y-6">
      <CollapsibleSection
        title="Hero Section"
        id="hero"
        expanded={expandedSections.includes('hero')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <p className="font-semibold mb-2">How contact hero slideshow works</p>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li>Set one <strong>Background Image</strong> as the fallback or first image.</li>
              <li>Add more images below to turn the contact hero into a slideshow.</li>
              <li>Choose how many seconds each image should show before changing.</li>
            </ul>
          </div>
          <TextInput
            label="Hero Eyebrow"
            value={content.hero?.eyebrow || ''}
            onChange={(v) => updateField('hero.eyebrow', v)}
            placeholder="Get in Touch"
          />
          <TextInput
            label="Page Title"
            value={content.hero?.title || ''}
            onChange={(v) => updateField('hero.title', v)}
            placeholder="Contact Us"
          />
          <TextArea
            label="Page Description"
            value={content.hero?.description || ''}
            onChange={(v) => updateField('hero.description', v)}
            rows={2}
            placeholder="Get in touch with our team..."
          />
          <MediaField
            label="Background Image"
            value={content.hero?.backgroundImage || ''}
            onChange={(v) => updateField('hero.backgroundImage', v)}
            accept="image"
            uploadFolder="contact"
            helpText="Main fallback image for the contact hero."
          />
          <NumberInput
            label="Slide change every (seconds)"
            value={content.hero?.slideIntervalSeconds ?? 5}
            min={1}
            onChange={(value) => updateField('hero.slideIntervalSeconds', value)}
          />
          <ImageListField
            label="Hero slideshow images"
            value={content.hero?.backgroundImages || []}
            onChange={(value) => updateField('hero.backgroundImages', value)}
            uploadFolder="contact"
            helpText="Add multiple contact hero images here."
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Office Information"
        id="office"
        expanded={expandedSections.includes('office')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextArea
            label="Office Address"
            value={content.office?.address || ''}
            onChange={(v) => updateField('office.address', v)}
            rows={3}
          />
          <TextInput
            label="Phone Number 1"
            value={content.office?.phone1 || ''}
            onChange={(v) => updateField('office.phone1', v)}
          />
          <TextInput
            label="Phone Number 2"
            value={content.office?.phone2 || ''}
            onChange={(v) => updateField('office.phone2', v)}
          />
          <TextInput
            label="Email Address"
            value={content.office?.email || ''}
            onChange={(v) => updateField('office.email', v)}
          />
          <TextInput
            label="Working Hours"
            value={content.office?.hours || ''}
            onChange={(v) => updateField('office.hours', v)}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Social and Form"
        id="form"
        expanded={expandedSections.includes('form')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="Social Section Title"
            value={content.social?.title || ''}
            onChange={(v) => updateField('social.title', v)}
            placeholder="Follow Us"
          />
          <TextInput
            label="Contact Details Heading"
            value={content.office?.title || ''}
            onChange={(v) => updateField('office.title', v)}
            placeholder="Contact Information"
          />
          <TextInput
            label="Form Title"
            value={content.form?.title || ''}
            onChange={(v) => updateField('form.title', v)}
            placeholder="Send Us a Message"
          />
          <TextArea
            label="Form Description"
            value={content.form?.description || ''}
            onChange={(v) => updateField('form.description', v)}
            rows={2}
            placeholder="Fill in the form below and we'll get back to you..."
          />
          <TextInput
            label="Success Message"
            value={content.form?.successMessage || ''}
            onChange={(v) => updateField('form.successMessage', v)}
            placeholder="Thank you! Your message has been sent successfully."
          />
          <TextInput
            label="Submit Button Text"
            value={content.form?.buttonText || ''}
            onChange={(v) => updateField('form.buttonText', v)}
            placeholder="Send Message"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Map Section"
        id="map"
        expanded={expandedSections.includes('map')}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <TextInput
            label="Map Section Title"
            value={content.map?.title || ''}
            onChange={(v) => updateField('map.title', v)}
            placeholder="Find Us"
          />
          <TextArea
            label="Map Description"
            value={content.map?.description || ''}
            onChange={(v) => updateField('map.description', v)}
            rows={2}
            placeholder="Sir Dawda Kairaba Jawara International Conference Centre, Bijilo, The Gambia"
          />
          <TextInput
            label="Open Maps Button Text"
            value={content.map?.openButtonText || ''}
            onChange={(v) => updateField('map.openButtonText', v)}
            placeholder="Open in Google Maps"
          />
          <TextInput
            label="Directions Button Text"
            value={content.map?.directionsButtonText || ''}
            onChange={(v) => updateField('map.directionsButtonText', v)}
            placeholder="Get Directions"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

// Reusable Components
interface CollapsibleSectionProps {
  title: string;
  id: string;
  expanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, id, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {expanded && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}

function TextArea({ label, value, onChange, rows, placeholder }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
      />
    </div>
  );
}

const NAV_ICON_OPTIONS = [
  'Building2',
  'Package',
  'Calendar',
  'Globe2',
  'Download',
  'Briefcase',
  'FileText',
  'ClipboardCheck',
];

interface LinkListEditorProps {
  links: Array<{ name?: string; path?: string; desc?: string; icon?: string }>;
  basePath: string;
  updateField: (path: string, value: any) => void;
  addListItem: (path: string, item: Record<string, string>) => void;
  removeListItem: (path: string, index: number) => void;
  newItemTemplate: Record<string, string>;
  showDescription?: boolean;
  showIcon?: boolean;
}

function LinkListEditor({
  links,
  basePath,
  updateField,
  addListItem,
  removeListItem,
  newItemTemplate,
  showDescription = false,
  showIcon = false,
}: LinkListEditorProps) {
  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div key={`${basePath}-${index}`} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Link {index + 1}</span>
            <button
              type="button"
              onClick={() => removeListItem(basePath, index)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <TextInput
              label="Label"
              value={link.name || ''}
              onChange={(value) => updateField(`${basePath}.${index}.name`, value)}
              placeholder="About Us"
            />
            <TextInput
              label="Path"
              value={link.path || ''}
              onChange={(value) => updateField(`${basePath}.${index}.path`, value)}
              placeholder="/about"
            />
          </div>
          {showDescription && (
            <TextInput
              label="Description"
              value={link.desc || ''}
              onChange={(value) => updateField(`${basePath}.${index}.desc`, value)}
              placeholder="Short description shown in dropdown"
            />
          )}
          {showIcon && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
              <select
                value={link.icon || 'Building2'}
                onChange={(e) => updateField(`${basePath}.${index}.icon`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {NAV_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addListItem(basePath, newItemTemplate)}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add link
      </button>
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

function mergeContent(section: ContentSection, data: any | null): any {
  const defaults = getDefaultContent(section);
  if (!data) return cloneContent(defaults);

  const merged = cloneContent({ ...defaults, ...data });
  const arrayFields: Partial<Record<ContentSection, string[]>> = {
    footer: ['quickLinks', 'resourceLinks'],
    navbar: ['navLinks', 'venuesDropdown', 'resourcesDropdown'],
  };

  for (const field of arrayFields[section] || []) {
    if (!Array.isArray(data[field]) || data[field].length === 0) {
      merged[field] = cloneContent(defaults[field]);
    }
  }

  return merged;
}

// Default content templates
function getDefaultContent(section: ContentSection): any {
  const defaults: Record<ContentSection, any> = {
    home: {
      hero: {
        mediaType: 'image',
        badge: "The Gambia's Premier MICE Destination",
        title: 'Banjul International',
        subtitle: 'Convention Centre',
        description: 'Managing the Sir Dawda Kairaba Jawara International Conference Centre — a world-class facility where diplomacy, innovation, and culture converge on the shores of the Atlantic.',
        primaryButton: 'Explore Our Venues',
        secondaryButton: 'Book an Event',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
        backgroundVideo: '',
        videoPoster: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
      },
      stats: {
        capacity: { value: '4000+', label: 'Guest Capacity' },
        spaces: { value: '30+', label: 'Event Spaces' },
        events: { value: '50+', label: 'International Events' },
        rating: { value: '5-Star', label: 'Facility Rating' },
      },
      about: {
        eyebrow: 'About BICC',
        title: 'Where Excellence Meets African Hospitality',
        highlightText: 'African Hospitality',
        paragraph1: "The Banjul International Convention Centre (BICC) is The Gambia's national premier event management institution, established by the Government of The Gambia to advance the country's Meetings, Incentives, Conferences and Exhibitions (MICE) industry.",
        paragraph2: 'BICC manages the Sir Dawda Kairaba Jawara International Conference Center and the VVIP Lounge at the Banjul International Airport, delivering tailored event solutions for summits, conferences, and special events.',
        paragraph3: '',
        values: {
          value1: 'Excellence',
          value2: 'Innovation',
          value3: 'Integrity',
          value4: 'Sustainability',
        },
        image: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
        imageStat: {
          value: '14,000',
          label: 'm² of Event Space',
        },
      },
      venues: {
        eyebrow: 'Our Facilities',
        title: 'World-Class Event Spaces',
        description: 'From grand plenary halls to intimate bilateral rooms, our versatile venues cater to events of every scale.',
        buttonText: 'View All Venues',
        cards: {
          card1: {
            name: 'Plenary Hall',
            capacity: '1,013 seats',
            description: 'Our flagship UN General Assembly-style conference hall',
            image: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
          },
          card2: {
            name: 'Banquet Halls',
            capacity: '500 guests',
            description: 'Elegant spaces for galas, dinners, and ceremonies',
            image: 'https://www.oicgambia.org/media/nav/conference-center-1.jpg',
          },
          card3: {
            name: 'VVIP Airport Lounge',
            capacity: 'Exclusive',
            description: 'Ultra-modern arrival experience at Banjul Airport',
            image: 'https://www.oicgambia.org/media/file/6374a439e833eb03aadf97d0e51d72e9f242.jpg',
          },
        },
      },
      cta: {
        title: 'Ready to Host Your Next Event?',
        description: "Let BICC deliver a world-class experience. From conferences to galas, we provide comprehensive event management that reflects excellence, innovation, and The Gambia's legendary hospitality.",
        buttonText: 'Book an Event',
        backgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-1.jpg',
      },
    },
    footer: {
      brand: {
        title: 'BICC',
        subtitle: 'Banjul International Convention Centre',
        description: "The Gambia's national premier event management institution, dedicated to positioning The Gambia as a leading MICE destination in the region.",
      },
      labels: {
        quickLinks: 'Quick Links',
        resources: 'Resources',
        facilities: 'Our Facilities',
        contact: 'Contact Us',
      },
      contact: {
        address: 'Sir Dawda Kairaba Jawara International Conference Centre\nBijilo, Kombo North\nThe Gambia',
        phone1: '+220 7784425',
        phone2: '+220 3728659',
        email: 'info@bicc.gm',
        hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
      },
      social: {
        facebook: 'https://www.facebook.com/BICCGM',
        instagram: 'https://www.instagram.com/banjulconventioncentre/',
        linkedin: 'https://www.linkedin.com/company/banjul-international-convention-centre/',
      },
      facilities: {
        item1: 'Plenary Hall (1,013 seats)',
        item2: 'Banquet Hall A (500 guests)',
        item3: 'Banquet Hall B (250 guests)',
        item4: '4 Thematic Meeting Rooms',
        item5: '11 Bilateral Meeting Rooms',
        item6: 'VVIP Airport Lounge',
      },
      copyright: {
        text: '© 2026 Banjul International Convention Centre. All rights reserved.',
      },
      bottomBar: {
        tag1: 'Excellence',
        tag2: 'Innovation',
        tag3: 'Sustainability',
      },
      quickLinks: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Venues', path: '/venues' },
        { name: 'Services & Packages', path: '/services' },
        { name: 'Upcoming Events', path: '/events' },
        { name: 'Photo Gallery', path: '/gallery' },
        { name: 'Latest News', path: '/news' },
        { name: 'Contact Us', path: '/contact' },
      ],
      resourceLinks: [
        { name: 'Destination Gambia', path: '/destination' },
        { name: 'Plan Your Event', path: '/plan-your-event' },
        { name: 'Downloads Centre', path: '/downloads' },
        { name: 'Careers', path: '/careers' },
        { name: 'Procurement & Tenders', path: '/procurement' },
        { name: 'Book an Event', path: '/booking' },
      ],
    },
    navbar: {
      navLinks: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'News', path: '/news' },
        { name: 'Contact', path: '/contact' },
      ],
      venuesDropdown: [
        { name: 'Our Venues', path: '/venues', icon: 'Building2', desc: 'Explore all event spaces' },
        { name: 'Services & Packages', path: '/services', icon: 'Package', desc: 'Conference & banquet packages' },
        { name: 'Check Availability', path: '/availability', icon: 'Calendar', desc: 'View open dates' },
      ],
      resourcesDropdown: [
        { name: 'Destination Gambia', path: '/destination', icon: 'Globe2', desc: 'Explore The Gambia' },
        { name: 'Plan Your Event', path: '/plan-your-event', icon: 'ClipboardCheck', desc: 'Event planning guide' },
        { name: 'Downloads', path: '/downloads', icon: 'Download', desc: 'Brochures & documents' },
        { name: 'Careers', path: '/careers', icon: 'Briefcase', desc: 'Join our team' },
        { name: 'Procurement', path: '/procurement', icon: 'FileText', desc: 'Tenders & opportunities' },
      ],
      brand: {
        shortName: 'BICC',
        fullName: 'Banjul International Convention Centre',
      },
      labels: {
        venues: 'Venues',
        resources: 'Resources',
      },
      bookButton: { text: 'Book an Event' },
      search: { placeholder: 'Search...' },
    },
    contact: {
      hero: {
        eyebrow: 'Get in Touch',
        title: 'Contact Us',
        description: 'Get in touch with our team. We\'re here to help you plan your next event.',
        backgroundImage: 'https://www.oicgambia.org/media/file/6374a439e833eb03aadf97d0e51d72e9f242.jpg',
        backgroundImages: [],
        slideIntervalSeconds: 5,
      },
      office: {
        title: 'Contact Information',
        address: 'Sir Dawda Kairaba Jawara International Conference Centre\nBijilo, Kombo North\nThe Gambia',
        phone1: '+220 7784425',
        phone2: '+220 3728659',
        email: 'info@bicc.gm',
        hours: 'Monday - Friday\n8:00 AM - 5:00 PM',
      },
      social: {
        title: 'Follow Us',
      },
      form: {
        title: 'Send Us a Message',
        description: 'Fill in the form below and we\'ll get back to you as soon as possible.',
        successMessage: 'Thank you! Your message has been sent successfully.',
        buttonText: 'Send Message',
      },
      map: {
        title: 'Find Us',
        description: 'Sir Dawda Kairaba Jawara International Conference Centre, Bijilo, The Gambia',
        openButtonText: 'Open in Google Maps',
        directionsButtonText: 'Get Directions',
      },
    },
  };

  return defaults[section] || {};
}

function cloneContent<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
