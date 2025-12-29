import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

type DashboardChartsProps = {
  chartData: {
    members: { date: string; count: number }[];
    offerings: { date: string; total: number }[];
  };
};

export function DashboardCharts({ chartData }: DashboardChartsProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  // Helper to filter data based on time period
  const filterData = (data: any[], dateKey: string, valueKey: string) => {
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

    // Filter data within range
    const filtered = data.filter(item => {
      const itemDate = new Date(item[dateKey]);
      return itemDate >= startDate && itemDate <= now;
    });

    // Group by period for display
    const dataMap = new Map<string, number>();

    // Initialize all periods (optional, skipping for simplicity or can be added back if needed)
    // For now, let's just map the filtered data to the display format

    filtered.forEach(item => {
      const itemDate = new Date(item[dateKey]);
      let key: string;

      if (timePeriod === 'week' || timePeriod === 'month') {
        key = itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        key = itemDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }

      const val = Number(item[valueKey]);
      dataMap.set(key, (dataMap.get(key) || 0) + val);
    });

    // Sort keys if necessary, or just rely on input order (which is date sorted)
    // Re-sorting by date might be needed if grouping changed order
    return Array.from(dataMap.entries()).map(([name, value]) => ({
      name,
      [valueKey === 'count' ? 'members' : 'amount']: value
    }));
  };

  const memberData = useMemo(() => {
    return filterData(chartData.members || [], 'date', 'count');
  }, [chartData.members, timePeriod]);

  const offeringsData = useMemo(() => {
    return filterData(chartData.offerings || [], 'date', 'total');
  }, [chartData.offerings, timePeriod]);

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
