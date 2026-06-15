import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, MapPin, DollarSign, Users, ArrowRight, Search, Filter } from 'lucide-react';
import { where } from 'firebase/firestore';
import { useRealtimeCollection } from '../hooks/useRealtimeFirestore';
import SEO from '../components/SEO';
import { IMAGES } from '../images';

// Fallback data
const FALLBACK_VACANCIES = [
  {
    id: '1',
    title: 'Event Coordinator',
    department: 'Operations',
    type: 'Full-time',
    location: 'Bijilo, The Gambia',
    salary: 'Competitive',
    description: 'Coordinate and manage conference and event operations at BICC',
    requirements: [
      'Bachelor\'s degree in Hospitality, Event Management or related field',
      '3+ years experience in event coordination',
      'Excellent organizational and communication skills',
      'Proficiency in MS Office and event management software',
    ],
    responsibilities: [
      'Plan and execute events from concept to completion',
      'Coordinate with clients, vendors, and internal teams',
      'Manage event logistics, timelines, and budgets',
      'Ensure high-quality service delivery',
    ],
    postedDate: '2026-06-01',
    closingDate: '2026-07-15',
    status: 'Open',
  },
  {
    id: '2',
    title: 'IT Support Specialist',
    department: 'Information Technology',
    type: 'Full-time',
    location: 'Bijilo, The Gambia',
    salary: 'Competitive',
    description: 'Provide technical support for conference technology systems',
    requirements: [
      'Diploma or degree in Computer Science or IT',
      '2+ years experience in IT support',
      'Knowledge of audio-visual systems',
      'Strong troubleshooting skills',
    ],
    responsibilities: [
      'Manage audio-visual equipment during events',
      'Provide technical support to clients and staff',
      'Maintain IT infrastructure and systems',
      'Troubleshoot technical issues',
    ],
    postedDate: '2026-05-28',
    closingDate: '2026-07-10',
    status: 'Open',
  },
  {
    id: '3',
    title: 'Marketing & Communications Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Bijilo, The Gambia',
    salary: 'Stipend provided',
    description: '6-month internship opportunity in marketing and communications',
    requirements: [
      'Currently pursuing or recently completed degree in Marketing, Communications, or related field',
      'Strong written and verbal communication skills',
      'Social media and digital marketing knowledge',
      'Creative and detail-oriented',
    ],
    responsibilities: [
      'Assist with social media content creation',
      'Support marketing campaigns and events',
      'Help manage website and online presence',
      'Conduct market research',
    ],
    postedDate: '2026-06-05',
    closingDate: '2026-06-30',
    status: 'Open',
  },
];

const JOB_TYPES = ['All', 'Full-time', 'Internship', 'Graduate Programme', 'Contract'];

export default function Careers() {
  const vacancyFilters = useMemo(() => [where('status', '==', 'Open')], []);
  const { data: dbVacancies } = useRealtimeCollection<any>('vacancies', [], vacancyFilters);
  const vacancies = (dbVacancies && dbVacancies.length > 0) ? dbVacancies : FALLBACK_VACANCIES;

  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('All');

  const filtered = vacancies.filter((job: any) => {
    const matchesType = jobType === 'All' || job.type === jobType;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="pt-20">
      <SEO
        title="Careers at BICC — Join Our Team"
        description="Explore career opportunities at the Banjul International Convention Centre. View current vacancies and apply online."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${IMAGES.conferenceHall})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
            <Briefcase size={16} />
            Join Our Team
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Careers at BICC</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Be part of Africa's premier convention centre team and help shape the future of MICE in The Gambia
          </p>
        </div>
      </section>

      {/* Why Work at BICC */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1F85A8] mb-4">Why Work at BICC?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a dynamic team delivering world-class events and conferences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Great Team', desc: 'Work with passionate professionals' },
              { icon: Briefcase, title: 'Career Growth', desc: 'Professional development opportunities' },
              { icon: DollarSign, title: 'Competitive Pay', desc: 'Attractive compensation packages' },
              { icon: MapPin, title: 'Prime Location', desc: 'Beautiful coastal workplace' },
            ].map((benefit, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-[#1F85A8]" size={28} />
                </div>
                <h3 className="font-bold text-[#1F85A8] mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-gray-50 border-y sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by job title or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Job Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {JOB_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setJobType(type)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    jobType === type
                      ? 'bg-[#1F85A8] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vacancies List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1F85A8] mb-8">
            Current Openings ({filtered.length})
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <Briefcase className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No vacancies found</h3>
              <p className="text-gray-500">Check back soon for new opportunities</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((job: any) => (
                <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                          <Briefcase className="text-[#1F85A8]" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#1F85A8] mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.department}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Posted: {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          {' • '}
                          Closes: {new Date(job.closingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:w-48">
                      <Link
                        to={`/careers/apply/${job.id}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all"
                      >
                        Apply Now <ArrowRight size={18} />
                      </Link>
                      <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Graduate Programme Callout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Graduate Programme</h2>
              <p className="text-xl text-gray-200 mb-8">
                Launch your career in the MICE industry with our comprehensive graduate development programme
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/careers?type=Graduate"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  View Opportunities <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1F85A8] mb-6">Questions About Careers at BICC?</h2>
          <p className="text-gray-600 mb-8">
            Our Human Resources team is here to help with any questions about careers, applications, or our recruitment process.
          </p>
          <a
            href="mailto:hr@bicc.gm"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all"
          >
            Contact HR Team
          </a>
        </div>
      </section>
    </div>
  );
}
