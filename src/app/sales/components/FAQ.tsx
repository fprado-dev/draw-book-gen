'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Preciso ter experiência em design?',
    answer: 'Não! O AIllustra foi criado especialmente para pessoas sem experiência em design. Nossa IA cuida de todo o processo criativo, você só precisa descrever sua ideia.',
  },
  {
    question: 'Como funciona a integração com a Amazon KDP?',
    answer: 'O AIllustra gera seus livros no formato exato exigido pela Amazon KDP. Com apenas alguns cliques, você pode publicar seu livro diretamente na plataforma e começar a vender.',
  },
  {
    question: 'Quais são os nichos mais lucrativos atualmente?',
    answer: 'Os nichos mais populares incluem livros infantis, mandalas, animais e padrões florais. Nossa plataforma fornece insights de mercado para ajudar você a escolher os melhores nichos.',
  },
  {
    question: 'Os designs gerados são livres de direitos autorais?',
    answer: 'Sim! Todos os designs gerados pelo AIllustra são 100% originais e livres de direitos autorais. Você tem total propriedade sobre suas criações.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-gray-600">Tire suas dúvidas sobre o AIllustra</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 text-left">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-white border border-gray-100 rounded-b-lg">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}