'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Gratuito',
    price: '0',
    description: 'Ideal para experimentar a plataforma',
    features: [
      'Até 5 gerações por mês',
      'Acesso à biblioteca básica de templates',
      'Exportação em PDF',
      'Suporte por email',
    ],
  },
  {
    name: 'Criador',
    price: '29',
    description: 'Perfeito para criadores ocasionais',
    popular: true,
    features: [
      'Até 50 gerações por mês',
      'Biblioteca completa de templates',
      'Personalização avançada',
      'Exportação em múltiplos formatos',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Profissional',
    price: '79',
    description: 'Para quem busca renda passiva',
    features: [
      'Gerações ilimitadas',
      'Recursos exclusivos de personalização',
      'Integração automática com KDP',
      'Análise de mercado e tendências',
      'Suporte VIP 24/7',
      'Consultoria mensal',
    ],
  },
];

export function Pricing() {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos para cada necessidade</h2>
          <p className="text-xl text-gray-600">Escolha o plano ideal para começar sua jornada</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all ${plan.popular ? 'ring-2 ring-primary relative' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">R${plan.price}</span>
                  <span className="text-gray-600 ml-2">/mês</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 hover:bg-gray-200'}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Começar agora
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}