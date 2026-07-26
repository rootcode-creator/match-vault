import * as React from "react"

import { cn } from "@/lib/utils"

function Marker({ className, role = "status", children, ...props }: React.ComponentProps<"div"> & { role?: string }) {
  return (
    <div role={role} className={cn("mt-2 flex items-center", className)} {...props}>
      {children}
    </div>
  )
}

function MarkerContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Marker, MarkerContent }
