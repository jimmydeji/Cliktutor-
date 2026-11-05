import React, { useState } from 'react';
import { BookOpen, User, Key, Mail, School, Loader2 } from 'lucide-react';
import { signUp } from '../services/auth';
import { DEFAULT_PROFILE } from '../services/storage';

interface SignupPageProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password, {
        ...DEFAULT_PROFILE,
        name,
        schoolName,
        email,
        phoneNumber,
      });
      onSignup();
    } catch (err: any) {
      console.error("Signup failed:", err);
      if (err.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Redirecting you to the login page.");
        onNavigateToLogin();
      } else {
        alert("Signup failed: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-6">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">School Name</label>
            <input type="text" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <button onClick={onNavigateToLogin} className="text-emerald-600 font-bold hover:underline">
            Login
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Customer Care</p>
            <a href="tel:08036151691" className="text-sm font-bold text-emerald-600 hover:underline">
              08036151691
            </a>
            <p className="text-[10px] text-slate-400 mt-1">WhatsApp & Call Available</p>
        </div>
      </div>
    </div>
  );
};
