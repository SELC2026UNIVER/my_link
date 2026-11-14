"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ theme = "light", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-[#1d1d1f]" />
        ),
        info: (
          <InfoIcon className="size-4 text-[#1d1d1f]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-[#1d1d1f]" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-[#e30000]" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-[#6e6e73]" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "14px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast rounded-[14px] border border-black/[0.08] bg-card/95 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md",
          description: "text-muted-foreground text-[12px]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
