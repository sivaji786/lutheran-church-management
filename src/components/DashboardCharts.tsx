import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Member, Offering } from '../App';

type DashboardChartsProps = {
  members: Member[];
  offerings: Offering[];
};

type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

export function DashboardCharts({ members, offerings }: DashboardChartsProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  // Calculate date range based on time period
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date();

    switch (timePeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { startDate, endDate: now };
  };

  // Get label based on time period
  const getTimeLabel = () => {
    switch (timePeriod) {
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'quarter':
        return 'Last 3 Months';
      case 'year':
        return 'Last 12 Months';
    }
  };

  // Process member registration data
  const memberData = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    const dataMap = new Map<string, number>();

    // Initialize all dates with 0
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      let key: string;

      if (timePeriod === 'week') {
        key = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timePeriod === 'month') {
        key = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timePeriod === 'quarter' || timePeriod === 'year') {
        key = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      } else {
        key = currentDate.toLocaleDateString('en-US', { month: 'short' });
      }

      dataMap.set(key, 0);

      // Increment based on period
      if (timePeriod === 'week' || timePeriod === 'month') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Count members added in this period
    members.forEach((member) => {
      const registrationDate = new Date(member.registrationDate);

      if (registrationDate >= startDate && registrationDate <= endDate) {
        let key: string;

        if (timePeriod === 'week' || timePeriod === 'month') {
          key = registrationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          key = registrationDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }

        dataMap.set(key, (dataMap.get(key) || 0) + 1);
      }
    });

    return Array.from(dataMap.entries()).map(([name, count]) => ({
      name,
      members: count,
    }));
  }, [members, timePeriod]);

  // Process offerings data
  const offeringsData = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    const dataMap = new Map<string, number>();

    // Initialize all dates with 0
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      let key: string;

      if (timePeriod === 'week') {
        key = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timePeriod === 'month') {
        key = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timePeriod === 'quarter' || timePeriod === 'year') {
        key = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      } else {
        key = currentDate.toLocaleDateString('en-US', { month: 'short' });
      }

      dataMap.set(key, 0);

      // Increment based on period
      if (timePeriod === 'week' || timePeriod === 'month') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Sum offerings
    offerings.forEach((offering) => {
      const offeringDate = new Date(offering.date);

      if (offeringDate >= startDate && offeringDate <= endDate) {
        let key: string;

        if (timePeriod === 'week' || timePeriod === 'month') {
          key = offeringDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          key = offeringDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }

        dataMap.set(key, (dataMap.get(key) || 0) + Number(offering.amount));
      }
    });

    return Array.from(dataMap.entries()).map(([name, amount]) => ({
      name,
      amount: amount,
    }));
  }, [offerings, timePeriod]);

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="flex justify-end">
        <div className="w-48 space-y-2">
          <Label htmlFor="timePeriod" className="text-sm text-slate-600">Time Period</Label>
          <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
            <SelectTrigger id="timePeriod" className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Members Chart */}
        <Card className="border-blue-100 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-blue-900">New Members Added</CardTitle>
            <CardDescription>{getTimeLabel()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickMargin={8}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Bar
                  dataKey="members"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  name="New Members"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Offerings Chart */}
        <Card className="border-green-100 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-green-900">Offerings Received</CardTitle>
            <CardDescription>{getTimeLabel()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={offeringsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickMargin={8}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickMargin={8}
                  tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Offerings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
