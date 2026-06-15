import { useRealtimeDoc } from './useRealtimeFirestore';

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  navBookButtonText: string;
  navSearchPlaceholder: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCTAText: string;
  heroSecondaryCTAText: string;
  heroBackgroundImage: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutText: string;
  aboutMission: string;
  aboutVision: string;
  aboutImage: string;
  aboutStatValue: string;
  aboutStatLabel: string;
  coreValue1: string;
  coreValue2: string;
  coreValue3: string;
  coreValue4: string;
  venuesSectionTitle: string;
  venuesSectionDescription: string;
  virtualTourTitle: string;
  virtualTourDescription: string;
  eventsSectionTitle: string;
  newsSectionTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaBackgroundImage: string;
  contactEmail: string;
  contactPhone: string;
  contactAlternatePhone: string;
  contactAddress: string;
  contactCity: string;
  contactCountry: string;
  contactHours: string;
  contactHeroEyebrow: string;
  contactHeroTitle: string;
  contactHeroDescription: string;
  contactHeroBackgroundImage: string;
  contactFormTitle: string;
  contactFormDescription: string;
  contactMapTitle: string;
  socialFacebook: string;
  socialTwitter: string;
  socialLinkedIn: string;
  socialInstagram: string;
  socialYouTube: string;
  footerText: string;
  footerTagline: string;
  footerHighlight1: string;
  footerHighlight2: string;
  footerHighlight3: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementType: 'info' | 'warning' | 'success' | 'error';
  statCapacity: number;
  statEventSpaces: number;
  statInternationalEvents: number;
  statRating: number;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'BICC',
  siteTagline: "The Gambia's Premier MICE Destination",
  navBookButtonText: 'Book an Event',
  navSearchPlaceholder: 'Search events, news...',
  heroTitle: 'Banjul International Convention Centre',
  heroSubtitle: 'Managing the Sir Dawda Kairaba Jawara International Conference Centre — a world-class facility where diplomacy, innovation, and culture converge on the shores of the Atlantic.',
  heroCTAText: 'Explore Our Venues',
  heroSecondaryCTAText: 'Book an Event',
  heroBackgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-3.jpg',
  aboutTitle: 'Where Excellence Meets African Hospitality',
  aboutSubtitle: 'About BICC',
  aboutText: 'The Banjul International Convention Centre (BICC) is The Gambia\'s premier convention and event management institution, established by the Government of The Gambia to advance the country\'s Meetings, Incentives, Conferences and Exhibitions (MICE) industry.',
  aboutMission: 'To deliver world-class event experiences that showcase The Gambia as a premier destination for international conferences and summits.',
  aboutVision: 'To be recognized as Africa\'s leading convention centre, setting the standard for excellence in hospitality and event management.',
  aboutImage: 'https://www.oicgambia.org/media/nav/conference-center-8.jpg',
  aboutStatValue: '14,000',
  aboutStatLabel: 'm² of Event Space',
  coreValue1: 'Excellence',
  coreValue2: 'Innovation',
  coreValue3: 'Integrity',
  coreValue4: 'Sustainability',
  venuesSectionTitle: 'World-Class Event Spaces',
  venuesSectionDescription: 'From grand plenary halls to intimate bilateral rooms, our versatile venues cater to events of every scale.',
  virtualTourTitle: 'Virtual Tour',
  virtualTourDescription: 'Browse through the spaces of the Sir Dawda Kairaba Jawara International Conference Centre.',
  eventsSectionTitle: 'Upcoming Events',
  newsSectionTitle: 'Latest News',
  ctaTitle: 'Ready to Host Your Next Event?',
  ctaDescription: 'Let BICC deliver a world-class experience. From conferences to galas, we provide comprehensive event management that reflects excellence, innovation, and The Gambia\'s legendary hospitality.',
  ctaButtonText: 'Book an Event',
  ctaBackgroundImage: 'https://www.oicgambia.org/media/nav/conference-center-1.jpg',
  contactEmail: 'info@bicc.gm',
  contactPhone: '+220 7784425',
  contactAlternatePhone: '+220 3728659',
  contactAddress: 'Bijilo, Kombo North',
  contactCity: 'Banjul',
  contactCountry: 'The Gambia',
  contactHours: 'Monday - Friday: 9:00 AM - 5:00 PM',
  contactHeroEyebrow: 'Get in Touch',
  contactHeroTitle: 'Contact Us',
  contactHeroDescription: 'Have a question or want to book an event? We\'d love to hear from you.',
  contactHeroBackgroundImage: '/images/vvip-lounge.jpg',
  contactFormTitle: 'Send Us a Message',
  contactFormDescription: 'Fill in the form below and we\'ll get back to you as soon as possible.',
  contactMapTitle: 'Find Us',
  socialFacebook: '',
  socialTwitter: '',
  socialLinkedIn: '',
  socialInstagram: '',
  socialYouTube: '',
  footerText: '© 2026 Banjul International Convention Centre. All rights reserved.',
  footerTagline: 'Where diplomacy meets hospitality.',
  footerHighlight1: 'Excellence',
  footerHighlight2: 'Innovation',
  footerHighlight3: 'Sustainability',
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

export function useSiteSettings() {
  const { data: settings, loading, error } = useRealtimeDoc<SiteSettings>(
    'siteSettings',
    'general',
    DEFAULT_SETTINGS,
  );

  return { settings, loading, error };
}
