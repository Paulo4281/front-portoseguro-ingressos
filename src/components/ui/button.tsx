import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        primary:
          "bg-psi-primary text-white hover:bg-psi-primary/90",
        secondary:
          "bg-psi-secondary text-white hover:bg-psi-secondary/90",
        tertiary:
          "bg-psi-tertiary text-psi-tertiary-foreground hover:bg-psi-tertiary/90",
        dark:
          "bg-psi-dark text-psi-dark-foreground hover:bg-psi-dark/90",
        light:
          "bg-psi-light text-psi-light-foreground hover:bg-psi-light/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 has-[>svg]:px-5",
        "2xl": "h-14 px-10 has-[>svg]:px-6",
        "3xl": "h-16 px-12 has-[>svg]:px-7",
        "4xl": "h-18 px-14 has-[>svg]:px-8",
        "5xl": "h-20 px-16 has-[>svg]:px-9",
        "6xl": "h-22 px-18 has-[>svg]:px-10",
        "7xl": "h-24 px-20 has-[>svg]:px-11",
        "8xl": "h-26 px-22 has-[>svg]:px-12",
        "9xl": "h-28 px-24 has-[>svg]:px-13",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
