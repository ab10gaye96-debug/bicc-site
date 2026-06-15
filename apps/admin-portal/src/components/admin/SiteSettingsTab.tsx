import { useState, useEffect } from 'react';
import { Settings, Save, Globe, Phone, Mail, MapPin, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SiteSettings {
  // General
  siteName: string;
  siteTagline: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCTAText: string;
  heroSecondaryCTAText: string;
  
  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutText: string;
  aboutMission: string;
  aboutVision: string;
  
  // Contact Information
  contactEmail: string;
  contactPhone: string;
  contactAlternatePhone: string;
  contactAddress: string;
  contactCity: string;
  contactCountry: string;
  contactHours: string;
  
  // Social Media
  socialFacebook: string;
  socialTwitter: string;
  socialLinkedIn: string;
  socialInstagram: string;
  socialYouTube: string;
  
  // Footer
  footerText: string;
  footerTagline: string;
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // Announcements
  announcementEnabled: boolean;
  announcementText: string;
  announcementType: 'info' | 'warning' | 'success' | 'error';
  
  // Stats (Home page animated counters)
  statCapacity: number;
  statEventSpaces: number;
  statInternationalEvents: number;
  statRating: number;
  
  // Metadata
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'BICC',
  siteTagline: "The Gambia's Premier MICE Destination",
  heroTitle: 'Banjul International Convention Centre',
  heroSubtitle: 'Managing the Sir Dawda Kairaba Jawara International Conference Centre — a world-class facility where diplomacy, innovation, and culture converge on the shores of the Atlantic.',
  heroCTAText: 'Explore Our Venues',
  heroSecondaryCTAText: 'Book an Event',
  aboutTitle: 'Where Excellence Meets African Hospitality',
  aboutSubtitle: 'About BICC',
  aboutText: 'The Banjul International Convention Centre (BICC) is The Gambia\'s premier convention and event management institution, established by the Government of The Gambia to advance the country\'s Meetings, Incentives, Conferences and Exhibitions (MICE) industry.',
  aboutMission: 'To deliver world-class event experiences that showcase The Gambia as a premier destination for international conferences and summits.',
  aboutVision: 'To be recognized as Africa\'s leading convention centre, setting the standard for excellence in hospitality and event management.',
  contactEmail: 'info@bicc.gm',
  contactPhone: '+220 7784425',
  contactAlternatePhone: '+220 3728659',
  contactAddress: 'Bijilo, Kombo North',
  contactCity: 'Banjul',
  contactCountry: 'The Gambia',
  contactHours: 'Monday - Friday: 9:00 AM - 5:00 PM',
  socialFacebook: '',
  socialTwitter: '',
  socialLinkedIn: '',
  socialInstagram: '',
  socialYouTube: '',
  footerText: '© 2026 Banjul International Convention Centre. All rights reserved.',
  footerTagline: 'Where diplomacy meets hospitality.',
  seoTitle: 'BICC - Banjul International Convention Centre | Premier MICE Venue in The Gambia',
  seoDescription: 'The Gambia\'s premier convention centre managing the Sir Dawda Kairaba Jawara International Conference Centre. World-class venues for conferences, summits, and events.',
  seoKeywords: 'BICC, Banjul Convention Centre, Gambia conference venue, MICE Gambia, international conference, event venue, Sir Dawda Kairaba Jawara',
  announcementEnabled: false,
  announcementText: '',
  announcementType: 'info',
  statCapacity: 4000,
  statEventSpaces: 30,
  statInternationalEvents: 50,
  statRating: 5,
};

export default function SiteSettingsTab() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'general' | 'hero' | 'about' | 'contact' | 'social' | 'footer' | 'seo' | 'announcement' | 'stats'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'siteSettings', 'general');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const username = localStorage.getItem('bicc_username') || 'admin';
      const updatedSettings = {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: username,
      };
      
      await setDoc(doc(db, 'siteSettings', 'general'), updatedSettings);
      setSettings(updatedSettings);
      showMessage('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1.5';
  const sectionClass = 'bg-gray-50 rounded-xl p-6';

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: Globe },
    { id: 'about', label: 'About Section', icon: Settings },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'footer', label: 'Footer', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'announcement', label: 'Announcement Banner', icon: AlertCircle },
    { id: 'stats', label: 'Homepage Stats', icon: RefreshCw },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F85A8]">Site Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Control all text content on your website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-white rounded-xl p-4 h-fit">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={e => updateField('siteName', e.target.value)}
                    className={inputClass}
                    placeholder="BICC"
                  />
                </div>
                <div>
                  <label className={labelClass}>Site Tagline</label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={e => updateField('siteTagline', e.target.value)}
                    className={inputClass}
                    placeholder="The Gambia's Premier MICE Destination"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Hero Section (Homepage)</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Hero Title</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={e => updateField('heroTitle', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Subtitle</label>
                  <textarea
                    rows={3}
                    value={settings.heroSubtitle}
                    onChange={e => updateField('heroSubtitle', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={settings.heroCTAText}
                      onChange={e => updateField('heroCTAText', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Secondary CTA Button Text</label>
                    <input
                      type="text"
                      value={settings.heroSecondaryCTAText}
                      onChange={e => updateField('heroSecondaryCTAText', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">About Section (Homepage & About Page)</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Section Title</label>
                  <input
                    type="text"
                    value={settings.aboutTitle}
                    onChange={e => updateField('aboutTitle', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Section Subtitle</label>
                  <input
                    type="text"
                    value={settings.aboutSubtitle}
                    onChange={e => updateField('aboutSubtitle', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>About Text (Main Description)</label>
                  <textarea
                    rows={4}
                    value={settings.aboutText}
                    onChange={e => updateField('aboutText', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mission Statement</label>
                  <textarea
                    rows={3}
                    value={settings.aboutMission}
                    onChange={e => updateField('aboutMission', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Vision Statement</label>
                  <textarea
                    rows={3}
                    value={settings.aboutVision}
                    onChange={e => updateField('aboutVision', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {activeSection === 'contact' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><Mail size={14} className="inline mr-1" />Primary Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={e => updateField('contactEmail', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}><Phone size={14} className="inline mr-1" />Primary Phone</label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={e => updateField('contactPhone', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Alternate Phone</label>
                  <input
                    type="tel"
                    value={settings.contactAlternatePhone}
                    onChange={e => updateField('contactAlternatePhone', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}><MapPin size={14} className="inline mr-1" />Street Address</label>
                  <input
                    type="text"
                    value={settings.contactAddress}
                    onChange={e => updateField('contactAddress', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      value={settings.contactCity}
                      onChange={e => updateField('contactCity', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      type="text"
                      value={settings.contactCountry}
                      onChange={e => updateField('contactCountry', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Operating Hours</label>
                  <input
                    type="text"
                    value={settings.contactHours}
                    onChange={e => updateField('contactHours', e.target.value)}
                    className={inputClass}
                    placeholder="Monday - Friday: 9:00 AM - 5:00 PM"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          {activeSection === 'social' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Social Media Links</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Facebook</label>
                  <input
                    type="url"
                    value={settings.socialFacebook}
                    onChange={e => updateField('socialFacebook', e.target.value)}
                    className={inputClass}
                    placeholder="https://facebook.com/bicc"
                  />
                </div>
                <div>
                  <label className={labelClass}>Twitter / X</label>
                  <input
                    type="url"
                    value={settings.socialTwitter}
                    onChange={e => updateField('socialTwitter', e.target.value)}
                    className={inputClass}
                    placeholder="https://twitter.com/bicc"
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="url"
                    value={settings.socialLinkedIn}
                    onChange={e => updateField('socialLinkedIn', e.target.value)}
                    className={inputClass}
                    placeholder="https://linkedin.com/company/bicc"
                  />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="url"
                    value={settings.socialInstagram}
                    onChange={e => updateField('socialInstagram', e.target.value)}
                    className={inputClass}
                    placeholder="https://instagram.com/bicc"
                  />
                </div>
                <div>
                  <label className={labelClass}>YouTube</label>
                  <input
                    type="url"
                    value={settings.socialYouTube}
                    onChange={e => updateField('socialYouTube', e.target.value)}
                    className={inputClass}
                    placeholder="https://youtube.com/@bicc"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {activeSection === 'footer' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Footer Content</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Footer Copyright Text</label>
                  <input
                    type="text"
                    value={settings.footerText}
                    onChange={e => updateField('footerText', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Footer Tagline</label>
                  <input
                    type="text"
                    value={settings.footerTagline}
                    onChange={e => updateField('footerTagline', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeSection === 'seo' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>SEO Title (60-70 characters)</label>
                  <input
                    type="text"
                    value={settings.seoTitle}
                    onChange={e => updateField('seoTitle', e.target.value)}
                    className={inputClass}
                    maxLength={70}
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seoTitle.length}/70 characters</p>
                </div>
                <div>
                  <label className={labelClass}>SEO Description (150-160 characters)</label>
                  <textarea
                    rows={3}
                    value={settings.seoDescription}
                    onChange={e => updateField('seoDescription', e.target.value)}
                    className={`${inputClass} resize-none`}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seoDescription.length}/160 characters</p>
                </div>
                <div>
                  <label className={labelClass}>SEO Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={settings.seoKeywords}
                    onChange={e => updateField('seoKeywords', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Announcement Banner */}
          {activeSection === 'announcement' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Site-Wide Announcement Banner</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="announcement-enabled"
                    checked={settings.announcementEnabled}
                    onChange={e => updateField('announcementEnabled', e.target.checked)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <label htmlFor="announcement-enabled" className="text-sm font-medium text-gray-700">
                    Show announcement banner on all pages
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Announcement Text</label>
                  <textarea
                    rows={2}
                    value={settings.announcementText}
                    onChange={e => updateField('announcementText', e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Important notice: Limited venue availability for Q4 2026..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Banner Type</label>
                  <select
                    value={settings.announcementType}
                    onChange={e => updateField('announcementType', e.target.value as any)}
                    className={inputClass}
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Yellow)</option>
                    <option value="success">Success (Green)</option>
                    <option value="error">Error (Red)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Homepage Stats */}
          {activeSection === 'stats' && (
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-[#1F85A8] mb-4">Homepage Animated Stats</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Guest Capacity</label>
                    <input
                      type="number"
                      value={settings.statCapacity}
                      onChange={e => updateField('statCapacity', parseInt(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Event Spaces</label>
                    <input
                      type="number"
                      value={settings.statEventSpaces}
                      onChange={e => updateField('statEventSpaces', parseInt(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>International Events</label>
                    <input
                      type="number"
                      value={settings.statInternationalEvents}
                      onChange={e => updateField('statInternationalEvents', parseInt(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Facility Rating</label>
                    <input
                      type="number"
                      value={settings.statRating}
                      onChange={e => updateField('statRating', parseInt(e.target.value) || 0)}
                      className={inputClass}
                      min={1}
                      max={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {settings.updatedAt && (
        <div className="mt-6 text-center text-xs text-gray-400">
          Last updated: {new Date(settings.updatedAt).toLocaleString()} by {settings.updatedBy}
        </div>
      )}
    </div>
  );
}
