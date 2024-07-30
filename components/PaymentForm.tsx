"use client";

import { useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import Checkbox from "@/components/Checkbox";
import FormInput from "@/components/FormInput";
import SummaryDisplay from "@/components/SummaryDisplay";

type DownpaymentTerm = {
  downpayment: string;
  payableIn: string;
};

type FormFields = {
  listPrice: string;
  discounts: string[];
  vatToggle: boolean;
  vatPercentage: string;
  additionalCharges: string;
  downpaymentTerms: DownpaymentTerm[];
  reservation: string;
};

type SummaryData = {
  basePrice: number;
  // discountedPrices: number[];
  // netListPrices: number[];
  discountDetails: {
    discountedPrice: number;
    netListPrice: number;
    discountPercentage: number;
  }[];
  vatAmount: number;
  vatPercentage: number;
  additionalChargesAmount: number;
  additionalCharges: number;
  totalPayable: number;
  netDownpayment: number;
  downpaymentDetails: {
    downpayment: number;
    payableIn: number;
    monthly: number;
  }[];
  remainingDp: number;
  balance: number;
};

export default function PaymentForm() {
  const [formFields, setFormFields] = useState<FormFields>({
    listPrice: "",
    discounts: [""],
    vatToggle: false,
    vatPercentage: "8",
    additionalCharges: "",
    downpaymentTerms: [{ downpayment: "", payableIn: "" }],
    reservation: "",
  });
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setFormFields((prevFields) => ({
        ...prevFields,
        [name]: checked,
      }));
    } else {
      setFormFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
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

    let discountDetails: {
      discountedPrice: number;
      netListPrice: number;
      discountPercentage: number;
    }[] = [];

    formFields.discounts.forEach((discount) => {
      let discountValue = parseFloat(discount) || 0;
      let discountedPrice = tempListPrice * (1 - discountValue / 100);
      let netListPrice = tempListPrice - discountedPrice;
      tempListPrice = discountedPrice;
      // discountedPrices.push(discountedPrice);
      // netListPrices.push(netListPrice);
      discountDetails.push({
        discountedPrice,
        netListPrice,
        discountPercentage: discountValue,
      });
    });

    let vatAmount = 0;
    let additionalChargesAmount = 0;

    if (formFields.vatToggle) {
      let vat = parseFloat(formFields.vatPercentage);
      let additionalChargesValue = parseFloat(formFields.additionalCharges);

      if (isNaN(vat) || isNaN(additionalChargesValue)) {
        alert("Please enter valid numbers for VAT and Additional Charges.");
        return;
      }

      vatAmount = tempListPrice * (vat / 100);
      additionalChargesAmount = tempListPrice * (additionalChargesValue / 100);
    }

    let totalPayable = tempListPrice + vatAmount + additionalChargesAmount;

    let netDownpayment = 0;
    let downpaymentDetails: {
      downpayment: number;
      payableIn: number;
      monthly: number;
    }[] = [];

    formFields.downpaymentTerms.forEach((term) => {
      let downpaymentValue = parseFloat(term.downpayment) || 0;
      let payableInValue = parseFloat(term.payableIn) || 0;
      netDownpayment += (totalPayable * downpaymentValue) / 100;
      downpaymentDetails.push({
        downpayment: (totalPayable * downpaymentValue) / 100,
        monthly: payableInValue
          ? (totalPayable * downpaymentValue) / 100 / payableInValue
          : 0,
        payableIn: payableInValue,
      });
    });

    netDownpayment -= parseFloat(formFields.reservation) || 0;

    let remainingDp =
      100 -
      formFields.downpaymentTerms.reduce(
        (acc, term) => acc + (parseFloat(term.downpayment) || 0),
        0
      );
    let balance = totalPayable * (remainingDp / 100);

    setSummaryData({
      basePrice: parseFloat(formFields.listPrice),
      discountDetails,
      vatAmount,
      additionalChargesAmount,
      totalPayable,
      netDownpayment,
      downpaymentDetails,
      remainingDp,
      balance,
      vatPercentage: parseFloat(formFields.vatPercentage),
      additionalCharges: parseFloat(formFields.additionalCharges),
    });

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center p-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full"
        onSubmit={calculateDetails}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Payment Term Generator
        </h1>
        <div className="flex flex-col">
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

          <div className="mb-1">
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
                    label={`Discount ${index + 1} (%)`}
                    name={`discounts.${index}`}
                    type="number"
                    placeholder="Enter discount"
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

          <div className="mb-1">
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
                    label={`Downpayment ${index + 1} (%)`}
                    name={`downpaymentTerms.${index}.downpayment`}
                    type="number"
                    placeholder="Enter downpayment"
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
                    label={`Payable in (months)`}
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

          <div className="flex items-center mb-3">
            <Checkbox
              name="vatToggle"
              label="Include VAT"
              checked={formFields.vatToggle}
              onChange={handleChange}
            />

            {formFields.vatToggle && (
              <select
                name="vatPercentage"
                value={formFields.vatPercentage}
                onChange={handleChange}
                className="ml-2 p-2 border rounded"
              >
                <option value="8">8%</option>
                <option value="12">12%</option>
              </select>
            )}

            <small className="text-gray-500 ml-2">This is automatic VAT.</small>
          </div>

          <hr className="mb-6 border-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
            <FormInput
              label="Additional Charges (%)"
              name="additionalCharges"
              type="number"
              placeholder="Enter additional charges"
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

          <hr className="mb-6 border-gray-300" />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 mt-4"
        >
          Calculate Payment Term
        </button>
      </form>
      {summaryData && <SummaryDisplay summaryData={summaryData} />}
    </div>
  );
}
