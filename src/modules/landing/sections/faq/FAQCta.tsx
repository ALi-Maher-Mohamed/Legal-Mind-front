'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card } from '@/components/ui';
import { scrollToChat } from '../../lib/scrollToChat';

export default function FAQCta() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card
        glowColor="rgba(246, 196, 83, 0.15)"
        className="p-8 border border-white/5 bg-gradient-to-br from-[#181818] to-[#131313] hover:border-white/10 text-center flex flex-col items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F6C453]/5 blur-xl rounded-full" />
        <h3 className="text-lg font-bold text-white md:text-xl relative z-10">{t.faq.ctaTitle}</h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed relative z-10">{t.faq.ctaDesc}</p>
        <Button variant="gold" size="md" className="relative z-10" onClick={scrollToChat}>
          {t.faq.ctaBtn}
        </Button>
      </Card>
    </motion.div>
  );
}
