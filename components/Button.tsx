import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

export function Button({ children, className = "", variant = "primary", icon, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-navy text-white hover:bg-[#102b50]",
    secondary: "bg-white text-navy border border-slate-200 hover:border-teal hover:text-teal",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "bg-red-50 text-red-700 hover:bg-red-100"
  };

  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
