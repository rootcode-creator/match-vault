import * as React from "react"

import { cn } from "@/lib/utils"

function Avatar({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium ring-1 ring-border/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function AvatarImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
