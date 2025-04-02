'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Cog,
  Coins,
  CreditCard,
  HandPlatter,
  Headset,
  ImageUp,
  LineChart,
  PlusCircle,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getUserSubscriptionsData, handleStripeCheckout } from '@/services/dashboard.service';
import { loadStripe } from '@stripe/stripe-js';

const creditPackages = [
  {
    name: 'Starter',
    credits: 100,
    price: 9.99,
    features: [
      '100 AI Image Credits',
      'Basic Image Resolution',
      'Standard Support',
      '24-hour Generation',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    credits: 500,
    price: 39.99,
    features: [
      '500 AI Image Credits',
      'HD Image Resolution',
      'Priority Support',
      'Instant Generation',
      'Advanced Customization',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    credits: 2000,
    price: 149.99,
    features: [
      '2000 AI Image Credits',
      '4K Image Resolution',
      '24/7 Premium Support',
      'Instant Generation',
      'Custom Art Styles',
      'API Access',
    ],
    popular: false,
  },
];

const usageStats = {
  creditsUsed: 450,
  totalCredits: 500,
  imagesGenerated: 89,
  averageQuality: 4.8,
  savedTime: 45,
};

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = React.useState("PRO");


  const { data: userSubscriptions } = useQuery({
    queryKey: ['all-prices'],
    queryFn: getUserSubscriptionsData
  });


  const handleSelectedPlan = async (plan: string) => {
    setSelectedPlan(plan);
    const selectedPlanData = userSubscriptions?.plans.find((p) => p.name === plan);
    if (!selectedPlanData) return;
    try {
      const { id, url } = await handleStripeCheckout({
        planId: selectedPlanData.id,
        stripe_customer_id: userSubscriptions?.stripe_costumer_id!
      });
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
      });
      stripe?.redirectToCheckout({
        sessionId: id,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-primary text-3xl font-bold">Billing & Credits</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and credit usage
          </p>
        </div>
        <Button
          variant="secondary"
          className="from-primary to-primary/80  bg-gradient-to-r text-white"
        >
          <Cog className="h-4 w-4" />
          Manage Subscription
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Usage</CardTitle>
            <CardDescription>
              Track your current credit consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">

                <CardDescription>
                  {userSubscriptions?.credits_usage}/{userSubscriptions?.credits!}
                </CardDescription>
              </div>
              <Progress
                value={(Number(userSubscriptions?.credits_usage!) / Number(userSubscriptions?.credits!)) * 100}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <LineChart className="text-primary mx-auto h-4 w-4" />
                <CardDescription className="text-2xl font-bold">
                  {usageStats.imagesGenerated}
                </CardDescription>
                <CardDescription className="text-muted-foreground text-xs">
                  Images Generated
                </CardDescription>
              </div>
              <div className="space-y-1">
                <Star className="text-primary mx-auto h-4 w-4" />
                <CardDescription className="text-2xl font-bold">
                  {usageStats.averageQuality}
                </CardDescription>
                <CardDescription className="text-muted-foreground text-xs">
                  Avg. Quality
                </CardDescription>
              </div>
              <div className="space-y-1">
                <TrendingUp className="text-primary mx-auto h-4 w-4" />
                <CardDescription className="text-2xl font-bold">
                  {usageStats.savedTime}h
                </CardDescription>
                <CardDescription className="text-muted-foreground text-xs">
                  Time Saved
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Calculator</CardTitle>
            <CardDescription>
              See how much you save with Illustra AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="text-primary h-4 w-4" />
                  <CardDescription>Traditional Design Cost</CardDescription>
                </div>
                <CardDescription className="font-bold">
                  $50/image
                </CardDescription>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="text-primary h-4 w-4" />
                  <CardDescription>Illustra AI Cost</CardDescription>
                </div>
                <CardDescription className="font-bold">
                  $0.08/image
                </CardDescription>
              </div>
              <div className="border-t pt-4">
                <div className="text-primary flex items-center justify-between">
                  <CardDescription className="font-semibold">
                    Your Savings
                  </CardDescription>
                  <CardDescription className="font-bold">
                    99.84%
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {userSubscriptions?.plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.02 }}
                className={`relative ${plan.name === "PRO" ? 'ring-primary rounded-lg ring-2' : ''}`}
              >
                {plan.name === "PRO" && (
                  <span className="bg-primary/100 border-primary absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-sm text-white">
                    Most Popular
                  </span>
                )}
                <Card className={`h-full ${plan.name === "PRO" ? 'mt-4' : ''}}`}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      /month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">

                      <li key={plan.features.credits_available} className="flex items-center">
                        <Coins className="text-primary mr-2 h-4 w-4" />
                        {plan.features.credits_available}
                      </li>
                      <li key={plan.features.support} className="flex items-center">
                        <Headset className="text-primary mr-2 h-4 w-4" />
                        {plan.features.support}
                      </li>
                      <li key={plan.features.resolution} className="flex items-center">
                        <ImageUp className="text-primary mr-2 h-4 w-4" />
                        {plan.features.resolution}
                      </li>
                      <li key={plan.features.online} className="flex items-center">
                        <HandPlatter className="text-primary mr-2 h-4 w-4" />
                        {plan.features.online}
                      </li>
                      {plan.features.plus !== "x" && <li key={plan.features.id} className="flex items-center">
                        <PlusCircle className="text-primary mr-2 h-4 w-4" />
                        {plan.features.plus}
                      </li>}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      disabled={plan.name === userSubscriptions.plan}
                      className="w-full"
                      variant={plan.name === "PRO" ? 'default' : 'outline'}
                      onClick={() => handleSelectedPlan(plan.name)}
                    >
                      {plan.name === userSubscriptions.plan ? 'Current Plan' : 'Upgrade Now'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
