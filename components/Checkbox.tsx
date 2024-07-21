import React from "react";

interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
}) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-2 leading-tight"
      />
      <label htmlFor={name} className="text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
