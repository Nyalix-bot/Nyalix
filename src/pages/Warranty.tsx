import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, Clock, Phone } from 'lucide-react';

const Warranty = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 md:pt-24">
      <section className="bg-gradient-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('warranty.title')}</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">{t('warranty.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: Shield, title: t('warranty.coverage'), desc: t('warranty.coverageDesc') },
              { icon: Clock, title: t('warranty.duration'), desc: t('warranty.durationDesc') },
              { icon: CheckCircle, title: t('warranty.process'), desc: t('warranty.processDesc') },
              { icon: Phone, title: t('warranty.support'), desc: t('warranty.supportDesc') },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-luxury border border-border">
                <item.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">{t('warranty.termsTitle')}</h2>
            <p>{t('warranty.terms1')}</p>
            <p>{t('warranty.terms2')}</p>
            <p>{t('warranty.terms3')}</p>
            <p>{t('warranty.terms4')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Warranty;
