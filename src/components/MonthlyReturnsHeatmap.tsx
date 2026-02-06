import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { MonthlyReturn } from "@/utils/portfolioAnalysis";

interface MonthlyReturnsHeatmapProps {
  monthlyReturns: MonthlyReturn[];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getHeatmapColor(value: number): string {
  if (value > 5) return "bg-green-600 text-white";
  if (value > 3) return "bg-green-500 text-white";
  if (value > 1) return "bg-green-400 text-white";
  if (value > 0) return "bg-green-200 text-green-900";
  if (value === 0) return "bg-gray-100 text-gray-500";
  if (value > -1) return "bg-red-200 text-red-900";
  if (value > -3) return "bg-red-400 text-white";
  if (value > -5) return "bg-red-500 text-white";
  return "bg-red-600 text-white";
}

export function MonthlyReturnsHeatmap({ monthlyReturns }: MonthlyReturnsHeatmapProps) {
  // Build a map: year -> month -> return
  const years = [...new Set(monthlyReturns.map(r => r.year))].sort();
  const dataMap = new Map<string, number>();
  monthlyReturns.forEach(r => {
    dataMap.set(`${r.year}-${r.month}`, r.return);
  });

  // Calculate yearly totals
  const yearlyTotals = new Map<number, number>();
  years.forEach(year => {
    const yearReturns = monthlyReturns.filter(r => r.year === year);
    // Compound monthly returns for the year
    const compounded = yearReturns.reduce((acc, r) => acc * (1 + r.return / 100), 1);
    yearlyTotals.set(year, (compounded - 1) * 100);
  });

  const renderMonthCell = (year: number, monthIndex: number) => {
    const val = dataMap.get(`${year}-${monthIndex}`);
    if (val === undefined) {
      return <td key={monthIndex} className="p-1 text-center"><div className="bg-gray-50 rounded px-1 py-0.5">-</div></td>;
    }
    return (
      <td key={monthIndex} className="p-1 text-center">
        <div className={`rounded px-1 py-0.5 font-mono ${getHeatmapColor(val)}`}>
          {val.toFixed(1)}%
        </div>
      </td>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Monthly Returns Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-1 font-medium text-muted-foreground">Year</th>
                {MONTH_LABELS.map(m => (
                  <th key={m} className="text-center p-1 font-medium text-muted-foreground">{m}</th>
                ))}
                <th className="text-center p-1 font-medium text-muted-foreground">Year</th>
              </tr>
            </thead>
            <tbody>
              {years.map(year => (
                <tr key={year}>
                  <td className="p-1 font-medium">{year}</td>
                  {Array.from({ length: 12 }, (_, i) => renderMonthCell(year, i))}
                  <td className="p-1 text-center">
                    <div className={`rounded px-1 py-0.5 font-mono font-bold ${getHeatmapColor(yearlyTotals.get(year) || 0)}`}>
                      {(yearlyTotals.get(year) || 0).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>Loss</span>
          <div className="flex gap-0.5">
            <div className="w-4 h-3 bg-red-600 rounded-sm" />
            <div className="w-4 h-3 bg-red-400 rounded-sm" />
            <div className="w-4 h-3 bg-red-200 rounded-sm" />
            <div className="w-4 h-3 bg-gray-100 rounded-sm" />
            <div className="w-4 h-3 bg-green-200 rounded-sm" />
            <div className="w-4 h-3 bg-green-400 rounded-sm" />
            <div className="w-4 h-3 bg-green-600 rounded-sm" />
          </div>
          <span>Gain</span>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          <p>Monthly returns heatmap shows the percentage change in portfolio value for each month. Green indicates positive returns, red indicates negative returns. The rightmost column shows compounded annual returns.</p>
        </div>
      </CardContent>
    </Card>
  );
}
