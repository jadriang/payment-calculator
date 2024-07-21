"use client";

import { useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import Checkbox from "@/components/Checkbox";
import FormInput from "@/components/FormInput";
import Summary from "@/components/Summary";

type DownpaymentTerm = {
  downpayment: string;
  payableIn: string;
};

type FormFields = {
  listPrice: string;
  discounts: string[];
  vatToggle: boolean;
  additionalCharges: string;
  downpaymentTerms: DownpaymentTerm[];
  reservation: string;
};

export default function Home() {
  const [formFields, setFormFields] = useState<FormFields>({
    listPrice: "",
    discounts: [""],
    vatToggle: false,
    additionalCharges: "",
    downpaymentTerms: [{ downpayment: "", payableIn: "" }],
    reservation: "",
  });
  const [output, setOutput] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDiscountChange = (index: number, value: string) => {
    const newDiscounts = [...formFields.discounts];
    newDiscounts[index] = value;
    setFormFields((prevFields) => ({
      ...prevFields,
      discounts: newDiscounts,
    }));
  };

  const addDiscount = () => {
    if (formFields.discounts.length < 3) {
      setFormFields((prevFields) => ({
        ...prevFields,
        discounts: [...prevFields.discounts, ""],
      }));
    }
  };

  const removeDiscount = (index: number) => {
    const newDiscounts = formFields.discounts.filter((_, i) => i !== index);
    setFormFields((prevFields) => ({
      ...prevFields,
      discounts: newDiscounts,
    }));
  };

  const handleDownpaymentChange = (
    index: number,
    field: keyof DownpaymentTerm,
    value: string
  ) => {
    const newDownpaymentTerms = [...formFields.downpaymentTerms];
    newDownpaymentTerms[index][field] = value;
    setFormFields((prevFields) => ({
      ...prevFields,
      downpaymentTerms: newDownpaymentTerms,
    }));
  };

  const addDownpaymentTerm = () => {
    if (formFields.downpaymentTerms.length < 3) {
      setFormFields((prevFields) => ({
        ...prevFields,
        downpaymentTerms: [
          ...prevFields.downpaymentTerms,
          { downpayment: "", payableIn: "" },
        ],
      }));
    }
  };

  const removeDownpaymentTerm = (index: number) => {
    const newDownpaymentTerms = formFields.downpaymentTerms.filter(
      (_, i) => i !== index
    );
    setFormFields((prevFields) => ({
      ...prevFields,
      downpaymentTerms: newDownpaymentTerms,
    }));
  };

  const calculateDetails = (event: React.FormEvent) => {
    event.preventDefault();
    let tempListPrice = parseFloat(formFields.listPrice);

    if (isNaN(tempListPrice)) {
      alert("Please enter a valid number for List Price.");
      return;
    }

    let outputHTML = "";

    formFields.discounts.forEach((discount, i) => {
      let discountValue = parseFloat(discount) || 0;

      let discountedPrice = tempListPrice * (1 - discountValue / 100);
      let netListPrice = tempListPrice - discountedPrice;
      tempListPrice = discountedPrice;

      outputHTML += `
        <div class="border-b py-2">
          <p class="text-lg font-semibold">Discounted Price ${
            i + 1
          }: <span class="text-green-500">Php${discountedPrice.toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}</span></p>
          <p class="text-sm text-gray-500">Net List Price ${
            i + 1
          }: Php${netListPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
        </div>
      `;
    });

    let vatAmount = 0;
    let additionalChargesAmount = 0;

    if (formFields.vatToggle) {
      let vat = 8;
      let additionalChargesValue = parseFloat(formFields.additionalCharges);

      if (isNaN(vat) || isNaN(additionalChargesValue)) {
        alert("Please enter valid numbers for VAT and Additional Charges.");
        return;
      }

      vatAmount = tempListPrice * (vat / 100);
      additionalChargesAmount = tempListPrice * (additionalChargesValue / 100);

      outputHTML += `
        <div class="border-b py-2">
          <p class="text-lg font-semibold">VAT (8%): <span class="text-green-500">Php${vatAmount.toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}</span></p>
          <p class="text-sm text-gray-500">Additional Charges: Php${additionalChargesAmount.toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}</p>
        </div>
      `;
    }

    let totalPayable = tempListPrice + vatAmount + additionalChargesAmount;

    outputHTML += `
      <div class="border-b py-2">
        <p class="text-lg font-semibold">Total Payable: <span class="text-green-500">Php${totalPayable.toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}</span></p>
      </div>
    `;

    let netDownpayment = 0;

    formFields.downpaymentTerms.forEach((term, i) => {
      let downpaymentValue = parseFloat(term.downpayment) || 0;
      let payableInValue = parseFloat(term.payableIn) || 0;

      netDownpayment += (totalPayable * downpaymentValue) / 100;

      let payableIn = (totalPayable * downpaymentValue) / 100 / payableInValue;

      outputHTML += `
        <div class="border-b py-2">
          <p class="text-lg font-semibold">Downpayment ${
            i + 1
          }: <span class="text-green-500">Php${(
        (totalPayable * downpaymentValue) /
        100
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</span></p>
          <p class="text-sm text-gray-500">Payable in ${payableInValue} months: Php${payableIn.toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )} per month</p>
        </div>
      `;
    });

    netDownpayment -= parseFloat(formFields.reservation) || 0;

    outputHTML += `
      <div class="border-b py-2">
        <p class="text-lg font-semibold">Net Downpayment: <span class="text-green-500">Php${netDownpayment.toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}</span></p>
      </div>
    `;

    let remainingDp =
      100 -
      formFields.downpaymentTerms.reduce(
        (acc, term) => acc + (parseFloat(term.downpayment) || 0),
        0
      );
    let balance = totalPayable * (remainingDp / 100);

    outputHTML += `
      <div class="border-b py-2">
        <p class="text-lg font-semibold">Balance Percentage: ${remainingDp}%</p>
        <p class="text-lg font-semibold">Balance Amount: <span class="text-green-500">Php${balance.toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}</span></p>
      </div>
    `;

    setOutput(outputHTML);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
        onSubmit={calculateDetails}
      >
        <div>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Payment Term Generator
          </h1>
          <div className="mb-1">
            <FormInput
              label="List Price"
              name="listPrice"
              type="number"
              placeholder="Enter list price"
              value={formFields.listPrice}
              onChange={handleChange}
            />
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Discounts</h2>
              {formFields.discounts.length < 3 && (
                <button
                  type="button"
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  onClick={addDiscount}
                >
                  <PlusCircleIcon className="w-6 h-6" />
                </button>
              )}
            </div>
            {formFields.discounts.map((discount, index) => (
              <div key={index} className="flex items-center mb-4 w-full">
                <div className="flex-grow">
                  <FormInput
                    label={`Discount ${index + 1}`}
                    name={`discounts.${index}`}
                    type="number"
                    placeholder="Enter discount percentage"
                    value={discount}
                    onChange={(e) =>
                      handleDiscountChange(index, e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => removeDiscount(index)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Downpayment Terms
              </h2>
              {formFields.downpaymentTerms.length < 3 && (
                <button
                  type="button"
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  onClick={addDownpaymentTerm}
                >
                  <PlusCircleIcon className="w-6 h-6" />
                </button>
              )}
            </div>
            {formFields.downpaymentTerms.map((term, index) => (
              <div key={index} className="flex items-center mb-4 w-full">
                <div className="flex-grow mr-2">
                  <FormInput
                    label={`Downpayment ${index + 1}`}
                    name={`downpaymentTerms.${index}.downpayment`}
                    type="number"
                    placeholder="Enter downpayment percentage"
                    value={term.downpayment}
                    onChange={(e) =>
                      handleDownpaymentChange(
                        index,
                        "downpayment",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex-grow">
                  <FormInput
                    label={`Payable in ${index + 1}`}
                    name={`downpaymentTerms.${index}.payableIn`}
                    type="number"
                    placeholder="Enter payable months"
                    value={term.payableIn}
                    onChange={(e) =>
                      handleDownpaymentChange(
                        index,
                        "payableIn",
                        e.target.value
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => removeDownpaymentTerm(index)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="flex items-center">
            <Checkbox
              name="vatToggle"
              label="Include VAT (8%)"
              checked={formFields.vatToggle}
              onChange={handleChange}
            />

            <small className="ml-2 text-gray-500 w-7/12">
              This is automatic VAT. Computed automatically Computed
              automatically Computed automatically.
            </small>
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Additional Charges (%)"
              name="additionalCharges"
              type="number"
              placeholder="Enter additional charges percentage"
              value={formFields.additionalCharges}
              onChange={handleChange}
            />
            <FormInput
              label="Reservation"
              name="reservation"
              type="number"
              placeholder="Enter reservation fee"
              value={formFields.reservation}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 mt-4"
          >
            Calculate Payment Term
          </button>
        </div>

        <Summary output={output} />
      </form>
    </div>
  );
}
