'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  BookUp,
  Cog,
  Coins,
  CreditCard,
  HandPlatter,
  Headset,
  ImageUp,
  PlusCircle,
  Sparkle,
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
import { getUserStats, getUserSubscriptionsData, handleStripeCheckout } from '@/services/dashboard.service';
import { loadStripe } from '@stripe/stripe-js';
import { SkeletonCards } from './components/skeleton-cards';



export default function Page() {
  const { data: userSubscriptions, isLoading: isLoadingUserSubscriptions } = useQuery({
    queryKey: ['all-prices'],
    queryFn: getUserSubscriptionsData
  });

  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats
  });


  const handleSelectedPlan = async (plan: string) => {
    const selectedPlanData = userSubscriptions?.plans.find((p) => p.name === plan);
    if (!selectedPlanData) return;
    try {
      const { id } = await handleStripeCheckout({
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

      {isLoadingUserSubscriptions || isLoadingUserStats ? (
        <SkeletonCards />
      ) : (
        <>
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

              </CardContent>
              <CardFooter>
                <div className="relative grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1 flex flex-col justify-center items-center gap-2">
                    <Card className='min-h-1/4 w-[200px] items-center justify-center gap-2'>
                      <CardTitle className="text-2xl font-bold">
                        {userStats?.totalImages}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs flex gap-2">
                        <ImageUp className="text-primary h-4 w-4" />
                        Images Generated
                      </CardDescription>
                    </Card>
                  </div>
                  <div className="space-y-1 flex flex-col justify-center items-center">
                    <Card className='min-h-1/4 w-[200px] items-center justify-center gap-2'>
                      <CardTitle className="text-2xl font-bold">
                        {userStats?.totalOutlines}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs flex gap-2">
                        <Sparkle className="text-primary h-4 w-4" />
                        Prompt Ideas
                      </CardDescription>
                    </Card>
                  </div>
                  <div className="space-y-1 flex flex-col justify-center items-center">
                    <Card className='min-h-1/4 w-[200px] items-center justify-center gap-2'>
                      <CardTitle className="text-2xl font-bold">
                        {userStats?.totalBooks}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs flex gap-2">
                        <BookUp className="text-primary h-4 w-4" />
                        Books Created
                      </CardDescription>
                    </Card>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Calculator</CardTitle>
                <CardDescription>
                  See how much you save with Aillustra
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
                      $10/image
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="text-primary h-4 w-4" />
                      <CardDescription>Aillustra Outlines Cost:</CardDescription>
                    </div>
                    <CardDescription className="font-bold">
                      $0/outlines
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="text-primary h-4 w-4" />
                      <CardDescription>Aillustra Images Cost:</CardDescription>
                    </div>
                    <CardDescription className="font-bold">
                      $0.015/image
                    </CardDescription>
                  </div>

                </div>
              </CardContent>
              <CardFooter>
                <div className="border-t pt-4 w-full">
                  <div className="text-primary flex items-center justify-between">
                    <CardDescription className="font-semibold">
                      Your Savings
                    </CardDescription>
                    <CardDescription className="font-bold">
                      99.85%
                    </CardDescription>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="monthly" className="w-full mt-18">
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
        </>
      )}

    </div>
  );
}
