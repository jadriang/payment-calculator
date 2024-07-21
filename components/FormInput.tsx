import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default FormInput;
