import type { VideoSummaryResponse } from "@/features/summary";
import { SummarySection } from ".";
import { FileText, List, Lightbulb, Target, Clock } from "lucide-react";

interface SummaryResultProps {
  summary: VideoSummaryResponse;
}

export function SummaryResult({ summary }: SummaryResultProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-700 slide-in-from-bottom-4">
      <SummarySection
        title="Summary"
        icon={<FileText className="h-5 w-5 text-slate-400" />}
        className="border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50"
      >
        <p className="text-sm leading-relaxed text-slate-300">
          {summary.summary}
        </p>
      </SummarySection>

      <SummarySection
        title="Main Points"
        icon={<List className="h-5 w-5 text-blue-400" />}
        className="border-slate-800/50 bg-gradient-to-br from-blue-500/5 to-slate-900/50"
      >
        {summary.main_points.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No main points identified.
          </p>
        ) : (
          <ul className="space-y-3">
            {summary.main_points.map((point, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <span className="text-blue-400 mt-0.5 text-lg group-hover:scale-110 transition-transform">
                  •
                </span>
                <span className="text-sm text-slate-300 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SummarySection>

      <SummarySection
        title="Key Insights"
        icon={<Lightbulb className="h-5 w-5 text-yellow-400" />}
        className="border-slate-800/50 bg-gradient-to-br from-yellow-500/5 to-slate-900/50"
      >
        {summary.key_insights.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No key insights identified.
          </p>
        ) : (
          <ul className="space-y-3">
            {summary.key_insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <span className="text-yellow-400 mt-0.5 text-lg group-hover:scale-110 transition-transform">
                  💡
                </span>
                <span className="text-sm text-slate-300 leading-relaxed">
                  {insight}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SummarySection>

      <SummarySection
        title="Actionable Takeaways"
        icon={<Target className="h-5 w-5 text-green-400" />}
        className="border-slate-800/50 bg-gradient-to-br from-green-500/5 to-slate-900/50"
      >
        {summary.actionable_takeaways.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No actionable takeaways identified.
          </p>
        ) : (
          <ul className="space-y-3">
            {summary.actionable_takeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <span className="text-green-400 mt-0.5 text-lg group-hover:scale-110 transition-transform">
                  ✓
                </span>
                <span className="text-sm text-slate-300 leading-relaxed">
                  {takeaway}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SummarySection>

      {summary.notable_timestamps.length > 0 && (
        <SummarySection
          title="Notable Timestamps"
          icon={<Clock className="h-5 w-5 text-purple-400" />}
          className="border-slate-800/50 bg-gradient-to-br from-purple-500/5 to-slate-900/50"
        >
          <ul className="space-y-3">
            {summary.notable_timestamps.map((timestamp, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <span className="text-purple-400 mt-0.5 text-lg group-hover:scale-110 transition-transform">
                  ⏱
                </span>
                <span className="text-sm font-mono text-slate-300">
                  {timestamp}
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>
      )}
    </div>
  );
}
