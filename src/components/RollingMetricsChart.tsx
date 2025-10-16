import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RollingMetrics } from "@/utils/portfolioAnalysis";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RollingMetricsChartProps {
  rollingMetrics: RollingMetrics[];
}

export function RollingMetricsChart({ rollingMetrics }: RollingMetricsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'volatility' | 'sharpe' | 'correlation'>('volatility');
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '60d' | '90d'>('30d');

  const formatData = () => {
    return rollingMetrics.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      fullDate: item.date,
      volatility30d: item.volatility30d,
      volatility60d: item.volatility60d,
      volatility90d: item.volatility90d,
      sharpe30d: item.sharpe30d,
      sharpe60d: item.sharpe60d,
      sharpe90d: item.sharpe90d,
      correlation30d: item.correlation30d.csi300,
      correlation60d: item.correlation60d.csi300,
      correlation90d: item.correlation90d.csi300,
    }));
  };

  const getChartData = () => {
    const data = formatData();
    return data.map(item => ({
      ...item,
      value: selectedMetric === 'volatility' 
        ? item[`volatility${selectedPeriod}` as keyof typeof item] as number
        : selectedMetric === 'sharpe'
        ? item[`sharpe${selectedPeriod}` as keyof typeof item] as number
        : item[`correlation${selectedPeriod}` as keyof typeof item] as number
    }));
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'volatility': return 'Volatility (%)';
      case 'sharpe': return 'Sharpe Ratio';
      case 'correlation': return 'Correlation';
      default: return '';
    }
  };

  const getTitle = () => {
    const period = selectedPeriod === '30d' ? '30-Day' : selectedPeriod === '60d' ? '60-Day' : '90-Day';
    switch (selectedMetric) {
      case 'volatility': return `${period} Rolling Volatility`;
      case 'sharpe': return `${period} Rolling Sharpe Ratio`;
      case 'correlation': return `${period} Rolling Correlation vs CSI 300`;
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            <Button
              variant={selectedMetric === 'volatility' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('volatility')}
            >
              Volatility
            </Button>
            <Button
              variant={selectedMetric === 'sharpe' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('sharpe')}
            >
              Sharpe Ratio
            </Button>
            <Button
              variant={selectedMetric === 'correlation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('correlation')}
            >
              Correlation
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              variant={selectedPeriod === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('30d')}
            >
              30D
            </Button>
            <Button
              variant={selectedPeriod === '60d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('60d')}
            >
              60D
            </Button>
            <Button
              variant={selectedPeriod === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('90d')}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [
                selectedMetric === 'volatility' ? `${value.toFixed(2)}%` : value.toFixed(3),
                selectedMetric === 'volatility' ? 'Volatility' : 
                selectedMetric === 'sharpe' ? 'Sharpe Ratio' : 'Correlation'
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  const fullDate = new Date(payload[0].payload.fullDate);
                  return `Date: ${fullDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`;
                }
                return `Date: ${label}`;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}