import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    { title: t('privacy.collectTitle'), content: t('privacy.collectContent') },
    { title: t('privacy.useTitle'), content: t('privacy.useContent') },
    { title: t('privacy.shareTitle'), content: t('privacy.shareContent') },
    { title: t('privacy.securityTitle'), content: t('privacy.securityContent') },
    { title: t('privacy.cookiesTitle'), content: t('privacy.cookiesContent') },
    { title: t('privacy.rightsTitle'), content: t('privacy.rightsContent') },
    { title: t('privacy.changesTitle'), content: t('privacy.changesContent') },
    { title: t('privacy.contactTitle'), content: t('privacy.contactContent') },
  ];

  return (
    <div className="pt-20 md:pt-24">
      <section className="bg-gradient-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('privacy.title')}</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">{t('privacy.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <p className="text-muted-foreground text-sm">{t('privacy.lastUpdated')}</p>
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

export default PrivacyPolicy;
