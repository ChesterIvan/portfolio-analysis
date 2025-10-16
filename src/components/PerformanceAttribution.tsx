import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { PortfolioData, RiskMetrics } from "@/utils/portfolioAnalysis";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceAttributionProps {
  data: PortfolioData[];
  riskMetrics: RiskMetrics;
  annualizedReturn: number;
  benchmarkReturns: {
    sha: number;
    she: number;
    csi300: number;
    avgBenchmark: number;
  };
}

export function PerformanceAttribution({ 
  data, 
  riskMetrics, 
  annualizedReturn, 
  benchmarkReturns 
}: PerformanceAttributionProps) {
  // Calculate performance attribution
  const calculateAttribution = () => {
    const totalReturn = annualizedReturn;
    const avgBenchmark = benchmarkReturns.avgBenchmark;
    
    // Risk-free rate assumption (2% annual)
    const riskFreeRate = 2;
    
    // Market return component (Beta * Market Return)
    const marketReturnComponent = riskMetrics.beta.csi300 * (benchmarkReturns.csi300 - riskFreeRate);
    
    // Alpha component (excess return after adjusting for market risk)
    const alphaComponent = riskMetrics.alpha.csi300;
    
    // Risk-free component
    const riskFreeComponent = riskFreeRate;
    
    // Unexplained component (residual)
    const unexplainedComponent = totalReturn - marketReturnComponent - alphaComponent - riskFreeComponent;
    
    return {
      totalReturn,
      riskFreeComponent,
      marketReturnComponent,
      alphaComponent,
      unexplainedComponent,
      benchmarkReturn: avgBenchmark
    };
  };

  const attribution = calculateAttribution();

  // Calculate rolling performance vs benchmark
  const calculateRollingPerformance = () => {
    const window = 90; // 90-day rolling window
    const results = [];
    
    for (let i = window; i < data.length; i++) {
      const portfolioReturn = ((data[i].shareValue - data[i - window].shareValue) / data[i - window].shareValue) * 100;
      const benchmarkReturn = ((data[i].csi300 - data[i - window].csi300) / data[i - window].csi300) * 100;
      
      results.push({
        date: new Date(data[i].date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }),
        fullDate: data[i].date,
        portfolioReturn,
        benchmarkReturn,
        excessReturn: portfolioReturn - benchmarkReturn
      });
    }
    
    return results;
  };

  const rollingData = calculateRollingPerformance();
  
  // Debug: Log the data range to understand what's happening
  if (rollingData.length > 0) {
    console.log('Rolling Performance Data Range:', {
      firstDate: rollingData[0].fullDate,
      lastDate: rollingData[rollingData.length - 1].fullDate,
      totalPoints: rollingData.length,
      firstFewDates: rollingData.slice(0, 5).map(d => d.fullDate),
      lastFewDates: rollingData.slice(-5).map(d => d.fullDate)
    });
  }
  
  // Sample data for better visualization (every 10th point to show full range)
  const sampledRollingData = rollingData.filter((_, index) => index % 10 === 0 || index === rollingData.length - 1);

  // Performance attribution data for pie chart
  const attributionData = [
    { name: 'Risk-Free Rate', value: Math.abs(attribution.riskFreeComponent), color: '#10b981' },
    { name: 'Market Return', value: Math.abs(attribution.marketReturnComponent), color: '#3b82f6' },
    { name: 'Alpha (Skill)', value: Math.abs(attribution.alphaComponent), color: '#f59e0b' },
    { name: 'Unexplained', value: Math.abs(attribution.unexplainedComponent), color: '#6b7280' }
  ].filter(item => item.value > 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Performance Attribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Attribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-2xl font-bold">
              {attribution.totalReturn.toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Total Annualized Return
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              >
                {attributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Risk-Free Rate:</span>
              <span className={attribution.riskFreeComponent >= 0 ? "text-green-600" : "text-red-600"}>
                {attribution.riskFreeComponent >= 0 ? "+" : ""}{attribution.riskFreeComponent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Market Return (β×Market):</span>
              <span className={attribution.marketReturnComponent >= 0 ? "text-green-600" : "text-red-600"}>
                {attribution.marketReturnComponent >= 0 ? "+" : ""}{attribution.marketReturnComponent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Alpha (Skill):</span>
              <span className={attribution.alphaComponent >= 0 ? "text-green-600" : "text-red-600"}>
                {attribution.alphaComponent >= 0 ? "+" : ""}{attribution.alphaComponent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Unexplained:</span>
              <span className={attribution.unexplainedComponent >= 0 ? "text-green-600" : "text-red-600"}>
                {attribution.unexplainedComponent >= 0 ? "+" : ""}{attribution.unexplainedComponent.toFixed(2)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rolling Performance vs Benchmark */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rolling Performance vs Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-2xl font-bold text-green-600">
              {(attribution.totalReturn - attribution.benchmarkReturn).toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Excess Return vs Average Benchmark
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Data points: {rollingData.length} | Showing: {sampledRollingData.length} samples
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sampledRollingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'portfolioReturn') return [`${value.toFixed(2)}%`, 'Portfolio'];
                  if (name === 'benchmarkReturn') return [`${value.toFixed(2)}%`, 'Benchmark'];
                  if (name === 'excessReturn') return [`${value.toFixed(2)}%`, 'Excess Return'];
                  return [value, name];
                }}
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
              <Bar dataKey="portfolioReturn" fill="#3b82f6" name="Portfolio" />
              <Bar dataKey="benchmarkReturn" fill="#6b7280" name="Benchmark" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>90-day rolling returns showing portfolio performance relative to CSI 300 benchmark.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}