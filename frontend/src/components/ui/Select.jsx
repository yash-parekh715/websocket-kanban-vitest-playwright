// src/components/ui/Select.jsx
import ReactSelect from "react-select";

export const Select = ({ options, value, onChange, placeholder }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#eff6ff"
        : null,
      color: state.isSelected ? "white" : "#111827",
    }),
  };

  return (
    <ReactSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customStyles}
      className="w-full"
    />
  );
};
