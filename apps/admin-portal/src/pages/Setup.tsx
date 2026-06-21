import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Lock, AlertCircle, Check } from 'lucide-react';

export default function Setup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      console.log('Creating Firebase Auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('✅ Auth user created:', uid);

      // Create user document in Firestore with UID as document ID
      console.log('Creating Firestore document with UID:', uid);
      const userData = {
        uid,
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        role: 'Super Admin',
        status: 'active',
        permissions: ['dashboard', 'settings', 'pages', 'media', 'events', 'news', 'contacts', 'bookings', 'gallery', 'venues', 'users', 'testimonials', 'partners', 'downloads', 'careers', 'tenders', 'subscribers', 'pricing', 'quotations'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Use UID as document ID to match Firestore rules
      await setDoc(doc(db, 'users', uid), userData);
      await setDoc(doc(db, 'adminUsernames', userData.username), {
        uid,
        username: userData.username,
        email: userData.email,
        status: 'active',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      console.log('✅ Firestore document created with UID:', uid);

      setSuccess(true);
      setError('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err: any) {
      console.error('Error creating user:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in with your credentials.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#1F85A8] mb-2">Account Created!</h1>
            <p className="text-gray-600 mb-4">Your Super Admin account has been created successfully.</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-4">
              <p className="text-sm text-green-800">
                <strong>✅ Email:</strong> {email}<br />
                <strong>✅ Username:</strong> {username}<br />
                <strong>✅ Role:</strong> Super Admin
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to login in 2 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1F85A8] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#1F85A8]">Create First Admin</h1>
          <p className="text-gray-500 text-sm mt-2">Set up your Super Admin account</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
          <p className="text-xs text-blue-800">
            <strong>⚠️ First Time Setup</strong><br />
            Create your first Super Admin account to access the full admin portal.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-6">
            <AlertCircle className="text-red-500 shrink-0" size={16} />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="admin@bicc.gm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              pattern="[a-zA-Z0-9_]+"
              title="Only letters, numbers, and underscores"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F85A8] mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-gray-600">
              <strong>Role:</strong> Super Admin (Full Access)<br />
              You will have access to all features including user management.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-400 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Super Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
