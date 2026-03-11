import { useTranslation } from 'react-i18next';

const TermsOfUse = () => {
  const { t } = useTranslation();

  const sections = [
    { title: t('terms.acceptanceTitle'), content: t('terms.acceptanceContent') },
    { title: t('terms.useTitle'), content: t('terms.useContent') },
    { title: t('terms.accountTitle'), content: t('terms.accountContent') },
    { title: t('terms.ordersTitle'), content: t('terms.ordersContent') },
    { title: t('terms.ipTitle'), content: t('terms.ipContent') },
    { title: t('terms.liabilityTitle'), content: t('terms.liabilityContent') },
    { title: t('terms.governingTitle'), content: t('terms.governingContent') },
    { title: t('terms.contactTitle'), content: t('terms.contactContent') },
  ];

  return (
    <div className="pt-20 md:pt-24">
      <section className="bg-gradient-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('terms.title')}</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">{t('terms.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <p className="text-muted-foreground text-sm">{t('terms.lastUpdated')}</p>
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">{i + 1}. {s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TermsOfUse;
