// src/components/ui/Badge.jsx
export const Badge = ({ type, text }) => {
  const getColor = () => {
    if (type === "priority") {
      return {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
      }[text.toLowerCase()];
    }

    if (type === "category") {
      return {
        bug: "bg-red-100 text-red-800",
        feature: "bg-purple-100 text-purple-800",
        enhancement: "bg-blue-100 text-blue-800",
      }[text.toLowerCase()];
    }

    return "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${getColor()}`}
    >
      {text}
    </span>
  );
};
