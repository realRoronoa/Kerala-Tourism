import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, User, Lock } from 'lucide-react';

interface AdminAuthPageProps {
  onLoginSuccess: () => void;
}

const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onLoginSuccess }) => {
  // Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Feedback
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter your Officer Email / ID and Password.');
      return;
    }
    setIsVerifying(true);
    setSuccessMsg('Authenticating credentials...');
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="w-full bg-[#f0f4f8] py-4 px-4 flex flex-col items-center justify-center font-sans rounded-xl border border-gray-200 my-2">
      
      {/* Top Single Sign-On Badge */}
      <div className="mb-3 flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-blue-200 text-xs text-gov-blue-primary font-semibold shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-accent-orange" />
        <span>Kerala Govt Unified SSO — NATPAC Officer Portal</span>
      </div>

      {/* Main Login Compact Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-lg shadow-blue-900/5 border border-blue-100 transition-all">
        
        {/* Header Title Bar */}
        <div className="mb-4 pb-2 border-b border-gray-100">
          <span className="text-xs uppercase font-bold tracking-wider text-gov-blue-primary border-b-2 border-gov-blue-primary pb-2 inline-block">
            Officer Login
          </span>
        </div>

        {/* Card Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Officer Access Login
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter your official email address and password to proceed
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Email / Officer ID Input */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1 uppercase tracking-wider">
              Official Email / Officer ID
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.id@kerala.gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 focus:border-gov-blue-primary rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 focus:border-gov-blue-primary rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Action Button: Web Gov Blue Fill */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full mt-2 py-3 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isVerifying ? (
              <RefreshCw className="w-4 h-4 animate-spin text-accent-orange" />
            ) : (
              <span>Authenticate & Access</span>
            )}
          </button>
        </form>

        {/* Terms of Service Notice */}
        <p className="text-[11px] text-gray-500 text-center mt-3">
          By continuing, I agree to the{' '}
          <a href="#terms" className="text-accent-orange underline font-semibold hover:text-orange-700">
            Terms of Service
          </a>
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-3 text-center text-[11px] text-gray-500 font-medium">
        <p>© NATPAC — Government of Kerala</p>
      </div>
    </div>
  );
};

export default AdminAuthPage;
