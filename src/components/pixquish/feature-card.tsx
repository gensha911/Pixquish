import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FeatureCardProps extends React.ComponentProps<"div"> {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  comingSoon?: boolean;
}

/**
 * Reusable feature card used in the Features grid.
 * Built as a custom surface (not the shadcn Card primitive) so we can apply
 * the hover-lift micro-interaction directly.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  comingSoon = false,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border/70 bg-card/50 p-6 transition-all duration-200 hover:border-border hover:shadow-lg hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {comingSoon && (
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 border-transparent bg-brand-muted text-brand"
        >
          Coming Soon
        </Badge>
      )}

      <div className="flex size-11 items-center justify-center rounded-xl bg-brand-muted text-brand transition-transform duration-200 group-hover:scale-105">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-4 font-semibold text-base text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
