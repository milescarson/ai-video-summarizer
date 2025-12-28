import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface IssueListProps {
  items: string[];
  variant: "high" | "medium" | "low";
}

export function IssueList({ items, variant }: IssueListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No{" "}
        {variant === "high" ? "high" : variant === "medium" ? "medium" : "low"}{" "}
        risk issues found.
      </p>
    );
  }

  const Icon =
    variant === "high"
      ? AlertCircle
      : variant === "medium"
      ? AlertTriangle
      : Info;

  const iconColor =
    variant === "high"
      ? "text-red-600"
      : variant === "medium"
      ? "text-yellow-600"
      : "text-blue-600";

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  );
}
