import { useTranslation } from 'react-i18next';
import { Award, Microscope, ClipboardCheck, TrendingUp } from 'lucide-react';

const Quality = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 md:pt-24">
      <section className="bg-gradient-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('quality.title')}</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">{t('quality.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: Microscope, title: t('quality.testing'), desc: t('quality.testingDesc') },
              { icon: Award, title: t('quality.standards'), desc: t('quality.standardsDesc') },
              { icon: ClipboardCheck, title: t('quality.inspection'), desc: t('quality.inspectionDesc') },
              { icon: TrendingUp, title: t('quality.improvement'), desc: t('quality.improvementDesc') },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-luxury border border-border">
                <item.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">{t('quality.commitmentTitle')}</h2>
            <p>{t('quality.commitment1')}</p>
            <p>{t('quality.commitment2')}</p>
            <p>{t('quality.commitment3')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quality;
