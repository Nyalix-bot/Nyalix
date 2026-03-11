import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useExhibitions } from '@/hooks/useExhibitions';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const Exhibitions = () => {
  const { t } = useTranslation();
  const { data: exhibitions, isLoading } = useExhibitions();

  return (
    <div className="pt-20 md:pt-28 min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-navy py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-3"
          >
            {t('exhibitions.title')}
          </motion.h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">
            {t('exhibitions.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="h-52 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : exhibitions && exhibitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((ex, i) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/exhibitions/${ex.id}`}
                  className="group block bg-card rounded-xl border border-border overflow-hidden shadow-luxury hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {ex.cover_image_url ? (
                      <img
                        src={ex.cover_image_url}
                        alt={ex.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-5">
                    <h3 className="font-display font-bold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {ex.title}
                    </h3>

                    <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
                      {ex.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {format(new Date(ex.date), 'MMM d, yyyy')}
                        </span>
                      )}
                      {ex.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {ex.location}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {ex.description}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                      {t('exhibitions.viewDetails')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('exhibitions.noExhibitions')}</h3>
            <p className="text-muted-foreground">{t('exhibitions.noExhibitionsDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exhibitions;
