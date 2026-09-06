import React, { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const styles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-700 hover:via-rose-600 hover:to-pink-700 text-white shadow-sm hover:shadow-md hover:shadow-pink-500/25 hover:-translate-y-0.5",
  secondary: "bg-white text-gray-700 border border-gray-200/90 hover:border-pink-300 hover:text-pink-700 hover:bg-pink-50/40 shadow-xs hover:-translate-y-0.5",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow-md hover:-translate-y-0.5",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md hover:-translate-y-0.5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg",
  md: "px-5 py-2.5 text-sm font-semibold rounded-xl",
  lg: "px-7 py-3.5 text-base font-bold rounded-2xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 select-none font-medium transition-all duration-200
        ${styles[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed transform-none shadow-none" : "active:translate-y-0 active:scale-[0.98] cursor-pointer"}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;