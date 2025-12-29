import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ReactNode } from "react";

interface SummarySectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SummarySection({
  title,
  children,
  icon,
  className,
}: SummarySectionProps) {
  return (
    <Card
      className={`glass-effect shadow-xl hover:shadow-2xl transition-all duration-300 ${
        className || ""
      }`}
    >
      <CardHeader className="border-b border-slate-800/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-slate-800/50">{icon}</div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
