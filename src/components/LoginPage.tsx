import React, { useState } from 'react';
import { BookOpen, User, Key, Loader2 } from 'lucide-react';
import { signIn } from '../services/auth';

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      onLogin();
    } catch (err: any) {
      console.error("Login failed:", err);
      let message = "Login failed: Please check your credentials.";
      if (err.code === 'auth/invalid-credential') {
        message = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      }
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2">Welcome Back</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Sign in to continue your learning journey.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <button onClick={onNavigateToSignup} className="text-emerald-600 font-bold hover:underline">
            Sign Up
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
