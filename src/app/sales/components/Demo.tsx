'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const examples = [
  {
    title: 'Livro de Animais',
    image: '/placeholder-image.png',
  },
  {
    title: 'Mandalas',
    image: '/placeholder-image.png',
  },
  {
    title: 'Flores e Jardins',
    image: '/placeholder-image.png',
  },
  {
    title: 'Paisagens',
    image: '/placeholder-image.png',
  },
];

export function Demo() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Veja o AIllustra em ação</h2>
          <p className="text-xl text-gray-600">Transforme suas ideias em livros de colorir profissionais</p>
        </motion.div>

        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg"
          >
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-600">Vídeo demonstrativo</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={example.image}
                  alt={example.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}