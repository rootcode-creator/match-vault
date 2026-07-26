import * as React from "react"

import { cn } from "@/lib/utils"

type BubbleProps = React.ComponentProps<"div"> & {
  variant?: "default" | "muted" | "ghost"
}

function Bubble({ className, variant = "default", children, ...props }: BubbleProps) {
  const base =
    "inline-block max-w-[66%] lg:max-w-[56%] xl:max-w-[48%] break-words rounded-[18px] px-4 py-2 text-sm shadow-sm"

  const variants: Record<string, string> = {
    // Sent message (primary blue)
    default: "bg-blue-600 text-white",
    // Received message (light card)
    muted: "bg-white border border-gray-200 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100",
    ghost: "bg-transparent text-muted-foreground",
  }

  // Sent messages (align=end) will usually use `default` variant (blue).
  // Received messages use `muted` (light gray bubble).
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      className={cn(base, variants[variant] ?? variants.default, className)}
      {...props}
    >
      {children}
    </div>
  )
}

function BubbleContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("leading-5", className)} {...props}>
      {children}
    </div>
  )
}

function BubbleGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  )
}

function BubbleReactions({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      className={cn("mt-1 flex items-center gap-1 text-xs", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions }
