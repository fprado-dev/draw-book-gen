'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comece a criar livros de colorir profissionais hoje mesmo
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Junte-se a milhares de criadores que estão monetizando sua criatividade sem habilidades técnicas
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="from-primary to-primary/80 bg-gradient-to-r text-white hover:bg-primary/90 min-w-[200px] animate-pulse"
            >
              Criar minha conta gratuitamente
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 min-w-[200px]"
            >
              Agendar demonstração
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}