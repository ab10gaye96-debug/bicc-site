import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        name: name || null,
        subscribedAt: serverTimestamp(),
        status: 'active',
      });

      setSuccess(true);
      setEmail('');
      setName('');

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Mail className="text-white" size={32} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stay Connected with BICC
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Subscribe to receive updates on upcoming events, facility news, and exclusive offers.
          </p>
        </div>

        {success ? (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're Subscribed!</h3>
            <p className="text-blue-100">
              Thank you for subscribing. You'll receive our latest updates in your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500/30 text-white rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
              </button>

              <p className="text-blue-100 text-xs mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
