import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart3 } from "lucide-react";
import { ReturnDistribution } from "@/utils/portfolioAnalysis";

interface ReturnDistributionChartProps {
  distribution: ReturnDistribution;
}

function getSkewnessLabel(skewness: number): string {
  if (skewness > 0.5) return "Right-skewed (more large gains)";
  if (skewness < -0.5) return "Left-skewed (more large losses)";
  return "Approximately symmetric";
}

function getKurtosisLabel(kurtosis: number): string {
  if (kurtosis > 1) return "Fat tails (higher tail risk)";
  if (kurtosis < -1) return "Thin tails (lower tail risk)";
  return "Near-normal tails";
}

export function ReturnDistributionChart({ distribution }: ReturnDistributionChartProps) {
  const { bins, mean, median, skewness, kurtosis } = distribution;

  const zeroIndex = bins.findIndex(b => b.midpoint >= 0);
  const zeroRefLine = zeroIndex > 0 ? bins[zeroIndex].range : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Return Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Mean Daily</div>
            <Badge variant="outline" className={mean >= 0 ? "text-green-600" : "text-red-600"}>
              {mean.toFixed(4)}%
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Median Daily</div>
            <Badge variant="outline" className={median >= 0 ? "text-green-600" : "text-red-600"}>
              {median.toFixed(4)}%
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Skewness</div>
            <Badge variant="outline">
              {skewness.toFixed(3)}
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Excess Kurtosis</div>
            <Badge variant="outline">
              {kurtosis.toFixed(3)}
            </Badge>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bins}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [value, 'Count']}
              labelFormatter={(label) => `Return: ${label}`}
            />
            <ReferenceLine x={zeroRefLine} stroke="#6b7280" strokeDasharray="2 2" />
            <Bar
              dataKey="count"
              fill="#6366f1"
              fillOpacity={0.8}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          <p><strong>Skewness:</strong> {getSkewnessLabel(skewness)}</p>
          <p><strong>Kurtosis:</strong> {getKurtosisLabel(kurtosis)}</p>
          <p>A normal distribution has skewness of 0 and excess kurtosis of 0. Negative skewness or positive excess kurtosis suggest greater downside risk than a normal distribution implies.</p>
        </div>
      </CardContent>
    </Card>
  );
}
