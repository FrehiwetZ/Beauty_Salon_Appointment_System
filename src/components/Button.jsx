function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
}) {
  const styles = {
    primary: "bg-pink-600 text-white hover:bg-pink-700",

    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",

    danger: "bg-red-600 text-white hover:bg-red-700",

    success: "bg-green-600 text-white hover:bg-green-700",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        rounded-lg font-medium transition
        ${styles[variant]}
        ${sizes[size]}
        ${disabled && "opacity-50 cursor-not-allowed"}
      `}
    >
      {children}
    </button>
  );
}

export default Button;
