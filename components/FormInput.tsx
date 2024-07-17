import React from "react";

interface FormInputProps {
  label: string;
  type: string;
  id?: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
}) => (
  <div>
    <label className="block font-semibold mb-1" htmlFor={id}>
      {label}
    </label>
    <input
      className="w-full mb-4 p-2 border border-gray-300 rounded"
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default FormInput;
