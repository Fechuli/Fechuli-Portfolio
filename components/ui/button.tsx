import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center font-mono transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-[#330014] text-[#FFF5F5] border-2 border-[#330014] hover:bg-[#FFF5F5] hover:text-[#330014] hover:border-[#330014]",
                outline:
                    "bg-transparent text-white border border-white/30 hover:border-white/50 hover:text-white",
                ghost:
                    "bg-transparent text-white/70 hover:text-white hover:bg-white/10",
                minimal:
                    "bg-transparent text-white/40 hover:text-white border border-white/10 hover:border-white/30",
                entity:
                    "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:border-white/40",
            },
            size: {
                sm: "px-4 py-2 text-sm",
                md: "px-6 py-3 text-base",
                lg: "px-8 py-4 text-lg",
                icon: "p-2",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
