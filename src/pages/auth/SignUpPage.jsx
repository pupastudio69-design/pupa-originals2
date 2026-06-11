import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile, 
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../../firebase';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Chrome } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Save their name
      await updateProfile(userCredential.user, { displayName: name });

      // 3. Send standard email verification
      await sendEmailVerification(userCredential.user, {
        url: window.location.origin + '/login?verified=true',
        handleCodeInApp: false,
      });

      // 4. Sign out immediately — they must verify before using app
      await auth.signOut();

      // 5. Show success message
      setSuccessMessage('Account created! Please check your email and click the verification link to activate your account.');

    } catch (err) {
      setError(getErrorMessage(err.code));
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Google users are already verified, send them to subscription page
      if (result.user.emailVerified) {
        navigate('/welcome');
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const getErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'An account already exists with this email',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/popup-closed-by-user': 'Sign up cancelled',
    };
    return messages[code] || 'Something went wrong. Please try again';
  };

  return (
    <div className="min-h-screen bg-pupa-bg flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Pupa Originals</h1>
          <p className="text-gray-400 text-sm font-body">Create your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
            <p className="text-emerald-400 text-xs font-body">{successMessage}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-2 w-full py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-xs font-body">{error}</p>
          </div>
        )}

        {/* Only show form if no success message */}
        {!successMessage && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-body mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm font-body placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-body mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm font-body placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-body mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm font-body placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-body mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm font-body placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium font-body hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {!successMessage && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs font-body">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGoogleSignUp}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-body hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Chrome size={18} />
              Continue with Google
            </button>
          </>
        )}

        <p className="text-center text-gray-400 text-sm font-body mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-emerald-400 hover:text-emerald-300">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}