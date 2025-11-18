import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-out overflow-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 active:scale-100 [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:scale-110",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-md hover:shadow-lg focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        primary:
          "bg-psi-primary text-white hover:bg-psi-primary/90 shadow-lg hover:shadow-xl",
        secondary:
          "bg-psi-secondary text-white hover:bg-psi-secondary/90 shadow-lg hover:shadow-xl",
        tertiary:
          "bg-psi-tertiary text-psi-tertiary-foreground hover:bg-psi-tertiary/90 shadow-lg hover:shadow-xl",
        dark:
          "bg-psi-dark text-psi-light hover:bg-psi-dark/90 shadow-lg hover:shadow-xl",
        light:
          "bg-psi-light text-psi-light-foreground hover:bg-psi-light/90 shadow-lg hover:shadow-xl",
        ghost:
          "text-black! hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
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
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const hasEffects = variant && !["ghost", "link"].includes(variant)

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {hasEffects && (
        <>
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 
          -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/10 to-white/0 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute inset-0 rounded-full border-2 border-white/0 
          group-hover:border-white/30 transition-all duration-300" />

          {(variant === "primary" || variant === "secondary" || variant === "tertiary") && (
            <div className="absolute -inset-1 bg-linear-to-r from-psi-primary via-psi-secondary to-psi-tertiary 
            rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
          )}
        </>
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
