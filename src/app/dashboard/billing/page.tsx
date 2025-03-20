"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BadgeCheck, CreditCard, LineChart, Sparkles, Star, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const creditPackages = [
  {
    name: "Starter",
    credits: 100,
    price: 9.99,
    features: [
      "100 AI Image Credits",
      "Basic Image Resolution",
      "Standard Support",
      "24-hour Generation"
    ],
    popular: false
  },
  {
    name: "Pro",
    credits: 500,
    price: 39.99,
    features: [
      "500 AI Image Credits",
      "HD Image Resolution",
      "Priority Support",
      "Instant Generation",
      "Advanced Customization"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    credits: 2000,
    price: 149.99,
    features: [
      "2000 AI Image Credits",
      "4K Image Resolution",
      "24/7 Premium Support",
      "Instant Generation",
      "Custom Art Styles",
      "API Access"
    ],
    popular: false
  }
]

const usageStats = {
  creditsUsed: 450,
  totalCredits: 500,
  imagesGenerated: 89,
  averageQuality: 4.8,
  savedTime: 45
}

export default function BillingPage() {
  const [, setSelectedPackage] = React.useState(creditPackages[1])

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-primary">Billing & Credits</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and credit usage</p>
        </div>
        <Button variant="secondary" className="bg-gradient-to-r from-primary  to-primary/80 text-white">
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Usage</CardTitle>
            <CardDescription>Track your current credit consumption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <CardDescription>Credits Used: {usageStats.creditsUsed}</CardDescription>
                <CardDescription>Total Credits: {usageStats.totalCredits}</CardDescription>
              </div>
              <Progress value={(usageStats.creditsUsed / usageStats.totalCredits) * 100} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <LineChart className="h-4 w-4 mx-auto text-primary" />
                <CardDescription className="text-2xl font-bold">{usageStats.imagesGenerated}</CardDescription>
                <CardDescription className="text-xs text-muted-foreground">Images Generated</CardDescription>
              </div>
              <div className="space-y-1">
                <Star className="h-4 w-4 mx-auto text-primary" />
                <CardDescription className="text-2xl font-bold">{usageStats.averageQuality}</CardDescription>
                <CardDescription className="text-xs text-muted-foreground">Avg. Quality</CardDescription>
              </div>
              <div className="space-y-1">
                <TrendingUp className="h-4 w-4 mx-auto text-primary" />
                <CardDescription className="text-2xl font-bold">{usageStats.savedTime}h</CardDescription>
                <CardDescription className="text-xs text-muted-foreground">Time Saved</CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Calculator</CardTitle>
            <CardDescription>See how much you save with Illustra AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <CardDescription>Traditional Design Cost</CardDescription>
                </div>
                <CardDescription className="font-bold">$50/image</CardDescription>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <CardDescription>Illustra AI Cost</CardDescription>
                </div>
                <CardDescription className="font-bold">$0.08/image</CardDescription>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-primary">
                  <CardDescription className="font-semibold">Your Savings</CardDescription>
                  <CardDescription className="font-bold">99.84%</CardDescription>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
          <TabsTrigger value="yearly">Yearly Billing (Save 20%)</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {creditPackages.map((pkg) => (
              <motion.div
                key={pkg.name}
                whileHover={{ scale: 1.02 }}
                className={`relative ${pkg.popular ? 'ring-2 ring-primary rounded-lg' : ''}`}
              >
                {pkg.popular && (

                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary/100 border border-primary text-white px-3 py-1 rounded-full text-sm">

                    Most Popular
                  </span>
                )}
                <Card className={`h-full ${pkg.popular ? 'mt-4' : ''}}`}>
                  <CardHeader>
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">${pkg.price}</span>/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {pkg.popular ? "Upgrade Now" : "Get Started"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="yearly" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {creditPackages.map((pkg) => {
              const yearlyPrice = (pkg.price * 12 * 0.8).toFixed(2)
              return (
                <motion.div
                  key={pkg.name}
                  whileHover={{ scale: 1.02 }}
                  className={`relative ${pkg.popular ? 'ring-2 ring-primary rounded-lg' : ''}`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary/100 border border-primary text-white px-3 py-1 rounded-full text-sm">

                      Most Popular
                    </span>
                  )}
                  <Card className={`h-full ${pkg.popular ? 'mt-4' : ''}}`}>
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>
                        <span className="text-3xl font-bold">${yearlyPrice}</span>/year
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <BadgeCheck className="h-4 w-4 text-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={pkg.popular ? "default" : "outline"}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        {pkg.popular ? "Upgrade Now" : "Get Started"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}