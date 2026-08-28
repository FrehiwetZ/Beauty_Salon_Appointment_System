import React, { ComponentPropsWithoutRef } from "react";

// Define allowed variants and sizes
type ButtonVariant = "primary" | "secondary" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

// Extend native HTML button attributes so standard props like `className`, `aria-*`, etc., work out of the box
interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const styles: Record<ButtonVariant, string> = {
  primary: "bg-pink-600 text-white hover:bg-pink-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-5 py-2",
  lg: "px-7 py-3 text-lg",
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
        rounded-lg font-medium transition
        ${styles[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;