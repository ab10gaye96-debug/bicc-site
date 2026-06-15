import { useState } from 'react';
import { Mail, CheckCircle, Send } from 'lucide-react';

// Subscribe to newsletter
async function subscribeNewsletter(email: string) {
  try {
    const { addDoc, collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    
    // Check if already subscribed
    const q = query(collection(db, 'subscribers'), where('email', '==', email));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      return { success: false, message: 'Already subscribed' };
    }
    
    // Add new subscriber
    await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: new Date().toISOString(),
      active: true,
    });
    
    return { success: true, message: 'Successfully subscribed' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, message: 'Failed to subscribe' };
  }
}

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const result = await subscribeNewsletter(email);

    if (result.success) {
      setStatus('success');
      setEmail('');
      setMessage('Thank you for subscribing!');
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setMessage(
        result.message === 'Already subscribed'
          ? 'This email is already subscribed to our newsletter.'
          : 'Failed to subscribe. Please try again.'
      );
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#1F85A8] to-blue-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
          <Mail className="text-white" size={32} />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest news, events, and special offers
        </p>

        {status === 'success' ? (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <CheckCircle className="text-green-300 mx-auto mb-3" size={48} />
            <p className="text-white font-semibold">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'loading'}
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1F85A8] rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#1F85A8] border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Subscribe
                  </>
                )}
              </button>
            </div>
            {status === 'error' && (
              <p className="mt-3 text-red-200 text-sm">{message}</p>
            )}
            <p className="mt-4 text-sm text-gray-300">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
