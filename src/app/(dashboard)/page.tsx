"use client";

import { Card, Metric, Text, AreaChart, BarList, Title } from "@tremor/react";

const meetingsData = [
  { date: "Jan", Meetings: 12 },
  { date: "Feb", Meetings: 18 },
  { date: "Mar", Meetings: 24 },
  { date: "Apr", Meetings: 31 },
  { date: "May", Meetings: 28 },
  { date: "Jun", Meetings: 36 },
];

const campaignPerformance = [
  { name: "Series A Founders", value: 156 },
  { name: "VP Engineering", value: 132 },
  { name: "CTO Outreach", value: 98 },
  { name: "DevTools Buyers", value: 76 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your LinkedIn outreach performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Meetings Booked</Text>
          <Metric>36</Metric>
        </Card>
        <Card decoration="top" decorationColor="green">
          <Text>Reply Rate</Text>
          <Metric>24.3%</Metric>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <Text>Messages Sent</Text>
          <Metric>1,247</Metric>
        </Card>
        <Card decoration="top" decorationColor="rose">
          <Text>Active Prospects</Text>
          <Metric>892</Metric>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Title>Meetings Over Time</Title>
          <AreaChart
            className="mt-4 h-72"
            data={meetingsData}
            index="date"
            categories={["Meetings"]}
            colors={["blue"]}
            showAnimation
          />
        </Card>
        <Card>
          <Title>Campaign Performance (Replies)</Title>
          <BarList data={campaignPerformance} className="mt-4" />
        </Card>
      </div>
    </div>
  );
}
