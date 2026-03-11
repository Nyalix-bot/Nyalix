import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ChevronLeft, ChevronRight, X, Play, Image as ImageIcon } from 'lucide-react';
import { useExhibition } from '@/hooks/useExhibitions';
import { format } from 'date-fns';
import type { ExhibitionMedia } from '@/hooks/useExhibitions';
import { useTranslation } from 'react-i18next';

// ── Lightbox ──
const Lightbox = ({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: ExhibitionMedia[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const current = items[index];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {index + 1} / {items.length}
        </div>

        {/* Prev */}
        {index > 0 && (
          <button
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next */}
        {index < items.length - 1 && (
          <button
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Media */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {current.type === 'video' ? (
            <video
              src={current.url}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src={current.url}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page ──
const ExhibitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: exhibition, isLoading } = useExhibition(id!);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="pt-28 min-h-screen bg-background container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-muted rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Exhibition not found</h2>
          <Link to="/exhibitions" className="text-primary hover:underline">Back to Exhibitions</Link>
        </div>
      </div>
    );
  }

  const allMedia = exhibition.exhibition_media ?? [];
  const images = allMedia.filter((m) => m.type === 'image');
  const videos = allMedia.filter((m) => m.type === 'video');

  return (
    <div className="pt-20 md:pt-28 min-h-screen bg-background">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={allMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex((i) => (i !== null && i < allMedia.length - 1 ? i + 1 : i))}
        />
      )}

      {/* Cover Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-muted">
        {exhibition.cover_image_url ? (
          <img
            src={exhibition.cover_image_url}
            alt={exhibition.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-navy flex items-center justify-center">
            <ImageIcon className="w-20 h-20 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Link to="/exhibitions" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t('exhibitions.backToAll')}
          </Link>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white">{exhibition.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/70">
            {exhibition.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {format(new Date(exhibition.date), 'MMMM d, yyyy')}
              </span>
            )}
            {exhibition.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                {exhibition.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Description */}
        {exhibition.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6 mb-10 shadow-luxury"
          >
            <h2 className="font-display font-semibold text-foreground text-lg mb-3">{t('exhibitions.aboutExhibition')}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{exhibition.description}</p>
          </motion.div>
        )}

        {/* Photos Gallery */}
        {images.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display font-bold text-foreground text-xl mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> {t('exhibitions.photoGallery')}
              <span className="text-sm font-normal text-muted-foreground">({images.length} {t('exhibitions.photos')})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => {
                const mediaIndex = allMedia.findIndex((m) => m.id === img.id);
                return (
                  <motion.button
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setLightboxIndex(mediaIndex)}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-primary transition-all hover:shadow-lg"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all scale-0 group-hover:scale-100">
                        <ImageIcon className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Videos Gallery */}
        {videos.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display font-bold text-foreground text-xl mb-5 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" /> Videos
              <span className="text-sm font-normal text-muted-foreground">({videos.length} {t('exhibitions.videos')})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((vid, i) => {
                const mediaIndex = allMedia.findIndex((m) => m.id === vid.id);
                return (
                  <motion.button
                    key={vid.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setLightboxIndex(mediaIndex)}
                    className="group relative rounded-xl overflow-hidden bg-muted border border-border hover:border-primary transition-all hover:shadow-lg"
                  >
                    <video
                      src={vid.url}
                      className="w-full aspect-video object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-all shadow-lg group-hover:scale-110">
                        <Play className="w-6 h-6 text-primary ml-1" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {allMedia.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>{t('exhibitions.noMedia')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExhibitionDetail;
