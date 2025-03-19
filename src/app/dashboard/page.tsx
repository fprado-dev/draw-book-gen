'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Image as ImageIcon, Zap, } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { format, subMonths } from "date-fns";
import { useState } from "react";

const usageData = () => {
  const data = [];
  const endDate = new Date();
  const startDate = subMonths(endDate, 3);
  const currentDate = new Date(startDate);

  // Generate data for each day in the date range
  while (currentDate <= endDate) {
    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      spend_amount: Math.floor(Math.random() * 30) + 10, // Spend amount between 10-40
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Sort by date
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return data;
}

export default function Dashboard() {
  // Placeholder data - In a real app, this would come from your backend
  const stats = {
    creditsSpent: 150,
    creditsRemaining: 350,
    imagesGenerated: 75,
    projectsCreated: 12
  };

  const fakeData = usageData();

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 15);
    return { from: fifteenDaysAgo, to: today };
  });



  const filteredData = fakeData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
  });


  return (
    <div className="py-4 px-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Spent</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creditsSpent}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.creditsSpent / (stats.creditsSpent + stats.creditsRemaining)) * 100).toFixed(1)}% of total credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creditsRemaining}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.creditsRemaining / (stats.creditsSpent + stats.creditsRemaining)) * 100).toFixed(1)}% of total credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Generated</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.imagesGenerated}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.imagesGenerated / 100) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Created</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsCreated}</div>
            <p className="text-xs text-muted-foreground">
              Average 4 images per project
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Usage Credits Trends</CardTitle>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                      : 'Pick a date range'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to
                    }}
                    onSelect={(range) => {
                      setDateRange(prev => ({
                        from: range?.from || prev.from,
                        to: range?.to || prev.to
                      }));
                    }}
                    disabled={{ after: new Date(), before: subMonths(new Date(), 3) }}
                    initialFocus
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip labelFormatter={(label) => format(new Date(label), 'dd/MM/yyyy')} />
                <Legend />
                <Bar yAxisId="left" dataKey="spend_amount" fill="#8884d8" name="Spend Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for activity list */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Generated 5 new images</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Created new project "Children's Book"</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Usage Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-sm font-medium">Optimize Your Credits</h4>
                  <p className="text-sm text-muted-foreground">
                    Use batch generation to create multiple variations efficiently.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-sm font-medium">Enhance Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide detailed prompts for better image generation results.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
