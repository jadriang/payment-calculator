import React from "react";

interface SummaryDisplayProps {
  summaryData: {
    basePrice: number;
    vatAmount: number;
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
    vatPercentage: number;
    discountDetails: {
      discountedPrice: number;
      netListPrice: number;
      discountPercentage: number;
    }[];
  };
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summaryData }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Payment details
      </h2>

      <div className="border-b pb-4 mb-4">
        <p className="text-lg font-semibold text-center">
          List Price:{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.basePrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
      </div>
      <div className="border-b pb-4 mb-4">
        {summaryData.discountDetails.map((discount, index) => (
          <div key={index} className=" text-center">
            <p className="text-lg font-semibold">
              {discount.discountPercentage}% discount:{" "}
              <span className="text-sky-700">
                Php{" "}
                {discount.netListPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
            {/* <p className="text-sm text-gray-500">
              Price after discount: Php{" "}
              {discount.discountedPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p> */}
          </div>
        ))}
        {/* show total of discounts and price after discount */}
        <p className="text-lg font-semibold text-center mb-1">
          Total Discount:{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.discountDetails
              .reduce((acc, discount) => acc + discount.netListPrice, 0)
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </p>
        <p className="text-lg font-semibold text-center">
          Price after discount:{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.discountDetails
              .reduce((acc, discount) => acc + discount.discountedPrice, 0)
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </p>
      </div>
      <div className="border-b pb-4 mb-4 text-center">
        <p className="text-lg font-semibold">
          VAT ({summaryData.vatPercentage}%):{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.vatAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
        <p className="text-lg font-semibold">
          Additional Charges ({summaryData.additionalCharges}%):{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.additionalChargesAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
        <p className="text-lg font-semibold">
          Total Payable:{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.totalPayable.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
      </div>
      <div className="border-b pb-4 mb-4">
        {summaryData.downpaymentDetails.map((detail, index) => (
          <div key={index} className="text-center">
            <p className="text-lg font-semibold">
              Downpayment {index + 1}:{" "}
              <span className="text-sky-700">
                Php{" "}
                {detail.downpayment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>

            {detail.payableIn > 1 && (
              <p className="text-lg font-semibold">
                Monthly:{" "}
                <span className="text-sky-700">
                  Php{" "}
                  {detail.monthly.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            )}
            {detail.payableIn > 1 && (
              <p className="text-sm text-gray-500">
                Payable in {detail.payableIn} month(s)
              </p>
            )}
          </div>
        ))}
        {/* <p className="text-lg font-semibold text-center">
          Net Downpayment:{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.netDownpayment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p> */}
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold">
          Balance Percentage: {summaryData.remainingDp}%
        </p>
        <p className="text-lg font-semibold">
          Balance Amount:{" "}
          <span className="text-sky-700">
            Php{" "}
            {summaryData.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <p className="text-sm text-gray-500">In-house / Bank Financing</p>
        </p>
      </div>
    </div>
  );
};

export default SummaryDisplay;
