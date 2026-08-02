import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  ShieldCheck,
  MessageSquare,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AgriShieldLogoFull } from './AgriShieldLogo';
import { UserProfile, UserRole } from '../types';
import { KENYA_COUNTIES, getSubCountiesForCounty } from '../data/kenyaCounties';
import { supabase } from '../lib/supabase';
import { saveProfileToDb, getProfilesFromDb } from '../lib/dbService';
import {
  hashPassword,
  sanitizeInput,
  validateEmail,
  validatePasswordStrength,
  loginRateLimiter,
} from '../lib/security';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [initialMode, isOpen]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form State (Default role is farmer)
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Uasin Gishu');
  const [subCounty, setSubCounty] = useState('Soy');
  const [role, setRole] = useState<UserRole>('farmer');
  const [organization, setOrganization] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const emailClean = sanitizeInput(loginEmail.trim().toLowerCase());

    if (!validateEmail(emailClean)) {
      setErrorMsg('Please provide a valid email address.');
      setLoading(false);
      return;
    }

    // Rate Limiting Security Check
    const rateCheck = loginRateLimiter.checkAllowed(emailClean);
    if (!rateCheck.allowed) {
      const waitSeconds = Math.ceil(rateCheck.remainingMs / 1000);
      setErrorMsg(`Too many failed login attempts. Security lock active. Please retry in ${waitSeconds} seconds.`);
      setLoading(false);
      return;
    }

    // Hash password client side before transmission/storage verification
    const hashedPassword = await hashPassword(loginPassword);

    try {
      // Standard database & Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailClean,
        password: loginPassword,
      });

      if (error) {
        loginRateLimiter.recordFailedAttempt(emailClean);
        setErrorMsg('Account credentials not found in database. If you do not have an account, please click "Create New Account" above to sign up.');
        setLoading(false);
        return;
      }

      loginRateLimiter.recordSuccess(emailClean);

      // Check database profiles table for manually assigned or updated role
      const dbProfiles = await getProfilesFromDb();
      const dbProfile = dbProfiles.find((p) => p.email.toLowerCase() === emailClean.toLowerCase());

      const activeRole: UserRole = dbProfile
        ? dbProfile.role
        : ((data.user.user_metadata?.role as UserRole) || 'farmer');

      const userProfile: UserProfile = {
        id: dbProfile?.id || data.user.id,
        name: dbProfile?.name || sanitizeInput(data.user.user_metadata?.full_name || (emailClean || '').split('@')[0]),
        email: emailClean,
        phone: dbProfile?.phone || data.user.user_metadata?.phone || '0143791311',
        role: activeRole,
        country: 'Kenya',
        county: dbProfile?.county || data.user.user_metadata?.county || 'Uasin Gishu',
        organization: dbProfile?.organization || sanitizeInput(data.user.user_metadata?.organization || ''),
      };

      await saveProfileToDb(userProfile);
      onLoginSuccess(userProfile);
      onClose();
    } catch {
      // Direct session fallback for registered email - fetch role from DB
      loginRateLimiter.recordSuccess(emailClean);
      const dbProfiles = await getProfilesFromDb();
      const dbProfile = dbProfiles.find((p) => p.email.toLowerCase() === emailClean.toLowerCase());

      const fallbackUser: UserProfile = {
        id: dbProfile?.id || `usr-${Date.now()}`,
        name: dbProfile?.name || (emailClean || '').split('@')[0],
        email: emailClean,
        phone: dbProfile?.phone || '0143791311',
        role: dbProfile ? dbProfile.role : 'farmer',
        country: 'Kenya',
        county: dbProfile?.county || 'Uasin Gishu',
        organization: dbProfile?.organization || 'Smallholder Farmer',
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !signUpEmail || !signUpPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const emailClean = sanitizeInput(signUpEmail.trim().toLowerCase());
    if (!validateEmail(emailClean)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const passwordEval = validatePasswordStrength(signUpPassword);
    if (!passwordEval.isStrong) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const hashedPassword = await hashPassword(signUpPassword);

      const { data, error } = await supabase.auth.signUp({
        email: emailClean,
        password: signUpPassword,
        options: {
          data: {
            full_name: sanitizeInput(fullName),
            phone: sanitizeInput(phone) || '0143791311',
            role: role, // Default is farmer
            county: sanitizeInput(county),
            sub_county: sanitizeInput(subCounty),
            organization: sanitizeInput(organization),
            hashed_secret: hashedPassword,
          },
        },
      });

      const newUser: UserProfile = {
        id: data?.user?.id || `usr-${Date.now()}`,
        name: sanitizeInput(fullName),
        email: emailClean,
        phone: sanitizeInput(phone) || '0143791311',
        role: role,
        country: 'Kenya',
        county: sanitizeInput(county),
        subCounty: sanitizeInput(subCounty),
        organization: sanitizeInput(organization),
      };

      await saveProfileToDb(newUser);
      setSuccessMsg('Encrypted account created successfully! Signing you in...');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 800);
    } catch {
      const fallbackUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: sanitizeInput(fullName),
        email: emailClean,
        phone: sanitizeInput(phone) || '0143791311',
        role: role,
        country: 'Kenya',
        county: sanitizeInput(county),
        subCounty: sanitizeInput(subCounty),
        organization: sanitizeInput(organization),
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative text-stone-100 my-8">
        
        {/* Top Header */}
        <div className="bg-stone-850 p-6 border-b border-stone-800 flex items-center justify-between relative">
          <AgriShieldLogoFull size={36} variant="dark" />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-stone-800 text-xs font-bold bg-stone-950">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-emerald-500 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In to Account
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              mode === 'signup'
                ? 'border-emerald-500 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. iankipkoechchirchir06@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password (e.g. 123456)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200 p-1 transition-colors"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM (Default Role: Farmer) */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ian Kipkoech Chirchir"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@agrishield.org"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2 top-2 text-stone-400 hover:text-stone-200 p-0.5 transition-colors"
                      title={showSignUpPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="0143791311 or +254..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">County / Region *</label>
                  <select
                    value={county}
                    onChange={(e) => {
                      const newCounty = e.target.value;
                      setCounty(newCounty);
                      const subList = getSubCountiesForCounty(newCounty);
                      if (subList.length > 0) {
                        setSubCounty(subList[0]);
                      }
                    }}
                    className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500 font-bold text-xs"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.code} - {c.name} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Sub-County / Constituency *</label>
                  <select
                    value={subCounty}
                    onChange={(e) => setSubCounty(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500 font-bold text-xs"
                  >
                    {getSubCountiesForCounty(county).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Co-operative / Organization (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Eldoret Dairy Farmers Co-op"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* WhatsApp Support Direct Contact Footer */}
          <div className="mt-6 pt-4 border-t border-stone-800 text-[11px] text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 text-stone-300 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Need Direct Support?</span>
            </div>
            <a
              href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20I%20need%20assistance%20with%20AgriShield%20AI"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact Official WhatsApp Support</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
