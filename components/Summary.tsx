import React from "react";

interface SummaryProps {
  output: string;
}

const Summary: React.FC<SummaryProps> = ({ output }) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">Summary</h2>
    <div
      className="text-gray-700"
      dangerouslySetInnerHTML={{ __html: output }}
    ></div>
  </div>
);

export default Summary;
