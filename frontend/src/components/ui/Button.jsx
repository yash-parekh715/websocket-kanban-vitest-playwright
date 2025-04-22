// src/components/ui/Button.jsx
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    };
    return sizes[size];
  };

  return (
    <button
      className={`rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getVariantClasses()} ${getSizeClasses()}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
