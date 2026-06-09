import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Briefcase, Upload, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

// This would fetch from Firestore in production
const MOCK_JOB = {
  id: '1',
  title: 'Event Coordinator',
  department: 'Operations',
  type: 'Full-time',
};

export default function CareerApply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    education: '',
    institution: '',
    graduationYear: '',
    experience: '',
    coverLetter: '',
    resumeFile: null as File | null,
  });

  const set = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      set('resumeFile', e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // In production:
      // 1. Upload resume to Firebase Storage
      // 2. Save application to Firestore
      // 3. Send email notification
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Application Error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all';
  const labelClass = 'block text-sm font-medium text-[#1F85A8] mb-1.5';

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <SEO title="Application Submitted — BICC Careers" />
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-[#1F85A8] mb-4">Application Submitted!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for applying to {MOCK_JOB.title} at BICC. 
                Our HR team will review your application and contact you within 2 weeks if your qualifications match our requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/careers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1F85A8] text-white rounded-xl font-bold hover:bg-[#1a6d8a] transition-all"
                >
                  Back to Careers
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO title={`Apply for ${MOCK_JOB.title} — BICC Careers`} />

      {/* Header */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={18} />
            Back to Careers
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase className="text-[#1F85A8]" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1F85A8] mb-2">
                Apply for {MOCK_JOB.title}
              </h1>
              <p className="text-gray-600">{MOCK_JOB.department} • {MOCK_JOB.type}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    required
                    type="text"
                    value={form.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    required
                    type="text"
                    value={form.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Education</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Highest Level of Education *</label>
                  <select
                    required
                    value={form.education}
                    onChange={(e) => set('education', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select education level</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Institution *</label>
                    <input
                      required
                      type="text"
                      value={form.institution}
                      onChange={(e) => set('institution', e.target.value)}
                      className={inputClass}
                      placeholder="e.g., University of The Gambia"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Year of Graduation *</label>
                    <input
                      required
                      type="number"
                      min="1970"
                      max="2030"
                      value={form.graduationYear}
                      onChange={(e) => set('graduationYear', e.target.value)}
                      className={inputClass}
                      placeholder="e.g., 2022"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Experience & Qualifications</h2>
              <div>
                <label className={labelClass}>Relevant Work Experience</label>
                <textarea
                  rows={6}
                  value={form.experience}
                  onChange={(e) => set('experience', e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your relevant work experience, skills, and qualifications..."
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Cover Letter *</h2>
              <div>
                <label className={labelClass}>Why are you interested in this position?</label>
                <textarea
                  required
                  rows={8}
                  value={form.coverLetter}
                  onChange={(e) => set('coverLetter', e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us why you're the right fit for this role..."
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F85A8] mb-6">Resume / CV *</h2>
              <div>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="text-gray-400 mb-3" size={40} />
                    {form.resumeFile ? (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-green-600 mb-1">File selected:</p>
                        <p className="text-sm text-gray-600">{form.resumeFile.name}</p>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PDF, DOC, DOCX (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    required
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50"
              >
                <Send size={20} />
                {sending ? 'Submitting Application...' : 'Submit Application'}
              </button>
              <p className="text-sm text-gray-500 text-center">
                By submitting this application, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
