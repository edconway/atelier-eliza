import type { Metadata } from "next";
import { ChartWizard } from "@/components/chart/chart-wizard";

export const metadata: Metadata = {
  title: "Draw a chart",
};

export default function NewChartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ChartWizard />
    </div>
  );
}
