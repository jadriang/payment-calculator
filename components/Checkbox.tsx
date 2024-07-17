import React from "react";

interface CheckboxProps {
  label: string;
  id?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  checked,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1" htmlFor={id}>
      {label}
    </label>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
  </div>
);

export default Checkbox;
