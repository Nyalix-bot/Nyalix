import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Globe, Award, Headphones } from 'lucide-react';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const items = [
    { icon: Shield, title: t('whyUs.trust.title'), desc: t('whyUs.trust.desc') },
    { icon: Globe, title: t('whyUs.global.title'), desc: t('whyUs.global.desc') },
    { icon: Award, title: t('whyUs.quality.title'), desc: t('whyUs.quality.desc') },
    { icon: Headphones, title: t('whyUs.support.title'), desc: t('whyUs.support.desc') },
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t('whyUs.title')}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t('whyUs.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-8 text-center shadow-luxury hover:shadow-gold transition-all duration-300 border border-border group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
