'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Empreendedor Digital',
    image: '/placeholder-image.png',
    text: 'Mesmo sem experiência em design, consegui criar uma coleção de livros de colorir que já vendeu mais de 1000 cópias na Amazon.',
  },
  {
    name: 'Ana Martins',
    role: 'Professora',
    image: '/placeholder-image.png',
    text: 'O AIllustra me permitiu criar materiais personalizados para meus alunos. A facilidade de uso é impressionante!',
  },
  {
    name: 'Pedro Santos',
    role: 'Ilustrador Part-time',
    image: '/placeholder-image.png',
    text: 'Aumentei minha produtividade em 300% usando o AIllustra. Agora consigo criar muito mais livros em menos tempo.',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">O que dizem nossos usuários</h2>
          <p className="text-xl text-gray-600">Histórias reais de sucesso com o AIllustra</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};