import React from "react";
import { cn } from "../utils/cn";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className,
  noPadding = false,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white overflow-hidden shadow rounded-lg",
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-4 py-5 sm:px-6">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "border-t border-gray-200",
          noPadding ? "" : "px-4 py-5 sm:p-6"
        )}
      >
        {children}
      </div>
    </div>
  );
}