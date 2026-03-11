import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, Package, Users, Calendar, Wrench, Plane, Building2, CheckCircle2, Eye, MessageSquare } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Globe, value: "50+", label: t('about.stats.countries') },
    { icon: Package, value: "200+", label: t('about.stats.products') },
    { icon: Users, value: "1,500+", label: t('about.stats.clients') },
    { icon: Calendar, value: "10+", label: t('about.stats.years') },
  ];

  const services: string[] = t('about.servicesItems', { returnObjects: true }) as string[];
  const clientsItems: string[] = t('about.clientsItems', { returnObjects: true }) as string[];

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">{t('about.title')}</h1>
          <p className="text-primary-foreground/70">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 text-center shadow-luxury"
            >
              <s.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* About the Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl border border-border p-8 shadow-luxury"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
            <Building2 className="w-7 h-7 text-gray-50" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">{t('about.companyTitle')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('about.companyText')}</p>
        </motion.div>

        {/* Vision & Mission side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-8 shadow-luxury"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
              <Eye className="w-7 h-7 text-gray-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">{t('about.vision')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('about.visionText')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-8 shadow-luxury"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
              <MessageSquare className="w-7 h-7 text-gray-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">{t('about.mission')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('about.missionText')}</p>
          </motion.div>
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl border border-border p-8 shadow-luxury"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
            <Wrench className="w-7 h-7 text-gray-50" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-5">{t('about.services')}</h2>
          <ul className="space-y-3">
            {Array.isArray(services) && services.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Export Scope + Clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-8 shadow-luxury"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
              <Plane className="w-7 h-7 text-gray-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">{t('about.exportTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('about.exportDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-8 shadow-luxury"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
              <Users className="w-7 h-7 text-gray-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-5">{t('about.clientsTitle')}</h2>
            <ul className="space-y-3">
              {Array.isArray(clientsItems) && clientsItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default About;
