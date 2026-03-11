import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { type LucideIcon, Shield, Award, FileCheck, ExternalLink, Pencil, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  title: string;
  title_ar: string;
  type: string;
  file_url: string;
}

const typeIcons: Record<string, LucideIcon> = { ISO: Shield, CE: Award, FDA: FileCheck };
const typeColors: Record<string, string> = {
  ISO: 'from-blue-500 to-blue-700',
  CE: 'from-green-500 to-green-700',
  FDA: 'from-amber-500 to-amber-700'
};

const Certifications = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Certificate>>({});

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
    setCerts(data as unknown as Certificate[] ?? []);
  };

  const startEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setEditData({ title: cert.title, title_ar: cert.title_ar, type: cert.type });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from('certificates').update({
      title: editData.title,
      title_ar: editData.title_ar,
      type: editData.type
    }).eq('id', editingId);
    if (error) {toast.error(error.message);return;}
    toast.success('Certificate updated');
    setEditingId(null);
    fetchCerts();
  };

  // Static cards for types that may not have uploaded certs
  const staticCerts = [
  { icon: Shield, title: t('certifications.iso'), desc: t('certifications.isoDesc'), color: 'from-blue-500 to-blue-700' },
  { icon: Award, title: t('certifications.ce'), desc: t('certifications.ceDesc'), color: 'from-green-500 to-green-700' },
  { icon: FileCheck, title: t('certifications.fda'), desc: t('certifications.fdaDesc'), color: 'from-amber-500 to-amber-700' }];


  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="bg-gradient-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">{t('certifications.title')}</h1>
          <p className="text-primary-foreground/70">{t('certifications.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Static info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {staticCerts.map((cert, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.15 }}
          className="bg-card rounded-xl border border-border overflow-hidden shadow-luxury group hover:shadow-gold transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${cert.color}`} />
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-gold mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <cert.icon className="w-10 h-10 text-gray-50" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">{cert.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{cert.desc}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Uploaded certificates from DB */}
        {certs.length > 0 &&
        <>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Uploaded Certificates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert, i) => {
              const Icon = typeIcons[cert.type] || Shield;
              const color = typeColors[cert.type] || 'from-gray-500 to-gray-700';
              const isEditing = editingId === cert.id;

              return (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-luxury group relative">
                    <div className={`h-2 bg-gradient-to-r ${color}`} />
                    <div className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>

                      {isEditing ?
                    <div className="space-y-2">
                          <input value={editData.title ?? ''} onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center"
                      placeholder="Title (EN)" />
                          <input value={editData.title_ar ?? ''} onChange={(e) => setEditData((d) => ({ ...d, title_ar: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center"
                      placeholder="Title (AR)" />
                          <select value={editData.type ?? 'ISO'} onChange={(e) => setEditData((d) => ({ ...d, type: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm">
                            <option value="ISO">ISO</option>
                            <option value="CE">CE</option>
                            <option value="FDA">FDA</option>
                          </select>
                          <div className="flex gap-2 justify-center pt-1">
                            <button onClick={saveEdit} className="p-1.5 rounded-lg bg-primary text-primary-foreground"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-muted text-foreground"><X className="w-4 h-4" /></button>
                          </div>
                        </div> :

                    <>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 bg-gradient-to-r ${color} text-white`}>{cert.type}</span>
                          <h3 className="text-lg font-display font-bold text-foreground mb-2">
                            {i18n.language === 'ar' && cert.title_ar ? cert.title_ar : cert.title}
                          </h3>
                          <a href={cert.file_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> View
                          </a>
                          {isAdmin &&
                      <button onClick={() => startEdit(cert)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-muted hover:bg-border text-muted-foreground hover:text-foreground transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                      }
                        </>
                    }
                    </div>
                  </motion.div>);

            })}
            </div>
          </>
        }
      </div>
    </div>);

};

export default Certifications;