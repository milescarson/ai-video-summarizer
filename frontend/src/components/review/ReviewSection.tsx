import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ReactNode } from "react";

interface ReviewSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function ReviewSection({ title, children, icon }: ReviewSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
