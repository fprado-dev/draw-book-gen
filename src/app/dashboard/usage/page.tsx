'use client';

import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';
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
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  getUserStats,
  getUserSubscriptionsData,
  handleStripeCustomerPortal,
} from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
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
import { SkeletonCards } from './components/skeleton-cards';

export default function Page() {
  const { data: userSubscriptions, isLoading: isLoadingUserSubscriptions } =
    useQuery({
      queryKey: ['all-prices'],
      queryFn: getUserSubscriptionsData,
    });

  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
  });

  const handleManageSubscription = async () => {
    const { url } = await handleStripeCustomerPortal();
    window.location.href = url;
  };

  return (
    <PageWrapper>
      <PageHeader
        titleText="Billing & Credits"
        description="Manage your subscription and credit usage"
        icon={<Cog className="h-4 w-4" />}
        button_text="Manage Subscription"
        onClick={handleManageSubscription}
      />
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
                      {userSubscriptions?.credits_usage}/
                      {userSubscriptions?.credits!}
                    </CardDescription>
                  </div>
                  <Progress
                    value={
                      (Number(userSubscriptions?.credits_usage!) /
                        Number(userSubscriptions?.credits!)) *
                      100
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="relative grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 space-y-1">
                    <Card className="min-h-1/4 w-[200px] items-center justify-center gap-2">
                      <CardTitle className="text-2xl font-bold">
                        {userStats?.totalImages}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground flex gap-2 text-xs">
                        <ImageUp className="text-primary h-4 w-4" />
                        Images Generated
                      </CardDescription>
                    </Card>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Card className="min-h-1/4 w-[200px] items-center justify-center gap-2">
                      <CardTitle className="text-2xl font-bold">
                        {userStats?.totalOutlines}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground flex gap-2 text-xs">
                        <Sparkle className="text-primary h-4 w-4" />
                        Prompt Ideas
                      </CardDescription>
                    </Card>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Card className="min-h-1/4 w-[200px] items-center justify-center gap-2">
                      <CardTitle className="text-2xl font-bold">
                        {userStats?.totalBooks}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground flex gap-2 text-xs">
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
                      <CardDescription>
                        Aillustra Outlines Cost:
                      </CardDescription>
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
                <div className="w-full border-t pt-4">
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

          <Tabs defaultValue="monthly" className="mt-18 w-full">
            <TabsContent value="monthly" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {userSubscriptions?.plans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    whileHover={{ scale: 1.02 }}
                    className={`relative ${plan.name === 'PRO' ? 'ring-primary rounded-lg ring-2' : ''}`}
                  >
                    {plan.name === 'PRO' && (
                      <span className="bg-primary border-primary text-primary-foreground absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-sm">
                        Most Popular
                      </span>
                    )}
                    <Card
                      className={`h-full ${plan.name === 'PRO' ? 'mt-4' : ''}}`}
                    >
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>
                          <span className="text-3xl font-bold">
                            ${plan.price}
                          </span>
                          /month
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li
                            key={plan.features.credits_available}
                            className="flex items-center"
                          >
                            <Coins className="text-primary mr-2 h-4 w-4" />
                            {plan.features.credits_available}
                          </li>
                          <li
                            key={plan.features.support}
                            className="flex items-center"
                          >
                            <Headset className="text-primary mr-2 h-4 w-4" />
                            {plan.features.support}
                          </li>
                          <li
                            key={plan.features.resolution}
                            className="flex items-center"
                          >
                            <ImageUp className="text-primary mr-2 h-4 w-4" />
                            {plan.features.resolution}
                          </li>
                          <li
                            key={plan.features.online}
                            className="flex items-center"
                          >
                            <HandPlatter className="text-primary mr-2 h-4 w-4" />
                            {plan.features.online}
                          </li>
                          {plan.features.plus !== 'x' && (
                            <li
                              key={plan.features.id}
                              className="flex items-center"
                            >
                              <PlusCircle className="text-primary mr-2 h-4 w-4" />
                              {plan.features.plus}
                            </li>
                          )}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          disabled={plan.name === userSubscriptions.plan}
                          className="w-full"
                          variant={plan.name === 'PRO' ? 'default' : 'outline'}
                          onClick={handleManageSubscription}
                        >
                          {plan.name === userSubscriptions.plan
                            ? 'Current Plan'
                            : 'Manage Subscription'}
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
    </PageWrapper>
  );
}
