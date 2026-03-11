import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Globe, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp, user, userRole, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '', country: '' });

  // Redirect based on role after authentication
  useEffect(() => {
    if (!authLoading && user) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, userRole, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      setLoading(false);
      if (error) {toast.error(error.message);return;}
      toast.success('Password reset link sent to your email');
      setMode('login');
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(form.email, form.password, form.fullName, form.phone, form.country);
      setLoading(false);
      if (error) {toast.error(error.message);return;}
      toast.success('Account created! Please check your email to verify your account.');
      setMode('login');
      return;
    }

    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) {toast.error(error.message);return;}
    toast.success('Welcome back!');
    // Redirect will be handled by the useEffect above
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4">
        
        <div className="bg-card rounded-xl border border-border p-8 shadow-luxury">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-lg bg-gradient-gold flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-bold text-primary-foreground text-xl">N</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {mode === 'login' ? t('nav.login') : mode === 'signup' ? t('nav.signup') : 'Reset Password'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' &&
            <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
                </div>
              </>
            }

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>

            {mode !== 'forgot' &&
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass} />
              
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            }

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-gradient-gold rounded-lg font-semibold hover:opacity-90 transition-all shadow-gold disabled:opacity-50 text-gray-50 bg-primary border border-primary shadow-none">
              
              {loading ? '...' : mode === 'login' ? t('nav.login') : mode === 'signup' ? t('nav.signup') : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            {mode === 'login' &&
            <>
                <button onClick={() => setMode('forgot')} className="text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </button>
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-accent font-medium hover:underline">{t('nav.signup')}</button>
                </p>
              </>
            }
            {mode === 'signup' &&
            <p className="text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-accent font-medium hover:underline">{t('nav.login')}</button>
              </p>
            }
            {mode === 'forgot' &&
            <button onClick={() => setMode('login')} className="text-accent font-medium hover:underline">Back to login</button>
            }
          </div>
        </div>
      </motion.div>
    </div>);

};

export default Auth;