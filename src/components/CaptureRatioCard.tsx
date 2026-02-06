import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { CaptureRatios } from "@/utils/portfolioAnalysis";

interface CaptureRatioCardProps {
  captureRatios: CaptureRatios;
}

function getCaptureColor(up: number, down: number): string {
  // Ideal: high up capture, low down capture
  if (up > 100 && down < 100) return "text-green-600";
  if (up > down) return "text-yellow-600";
  return "text-red-600";
}

function getRatioColor(ratio: number): string {
  if (ratio > 1.2) return "text-green-600";
  if (ratio > 0.8) return "text-yellow-600";
  return "text-red-600";
}

export function CaptureRatioCard({ captureRatios }: CaptureRatioCardProps) {
  const benchmarks = [
    { key: 'sha' as const, label: 'SHA' },
    { key: 'she' as const, label: 'SHE' },
    { key: 'csi300' as const, label: 'CSI 300' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Up/Down Capture Ratios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {benchmarks.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">vs {label}</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Up Capture</div>
                  <Badge variant="outline" className={captureRatios.upCapture[key] > 100 ? "text-green-600" : "text-yellow-600"}>
                    {captureRatios.upCapture[key].toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Down Capture</div>
                  <Badge variant="outline" className={captureRatios.downCapture[key] < 100 ? "text-green-600" : "text-red-600"}>
                    {captureRatios.downCapture[key].toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Capture Ratio</div>
                  <Badge variant="outline" className={getRatioColor(captureRatios.captureRatio[key])}>
                    {captureRatios.captureRatio[key].toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p><strong>Up Capture:</strong> Percentage of market gains captured. Above 100% means outperforming in up markets.</p>
          <p><strong>Down Capture:</strong> Percentage of market losses captured. Below 100% means less loss in down markets.</p>
          <p><strong>Capture Ratio:</strong> Up capture ÷ Down capture. Above 1.0 indicates favorable asymmetry — capturing more upside than downside.</p>
        </div>
      </CardContent>
    </Card>
  );
}
