import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring", className)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
