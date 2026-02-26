import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download } from "lucide-react";

export default function InvoicePrint() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const invoice = state?.invoice;

  useEffect(() => {
    if (!invoice) {
      console.error("No invoice data found");
    }
  }, [invoice]);

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invoice data not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { seller, buyer, items, pricing, invoiceNo, invoiceDate } = invoice;

  // Calculate totals if pricing data is missing
  const calculateFallbackTotals = (items) => {
    const baseAmount = items.reduce((sum, item) => sum + item.total, 0);
    const cgst = baseAmount * 0.09;
    const sgst = baseAmount * 0.09;
    const totalTax = cgst + sgst;
    const grandTotal = baseAmount + totalTax;

    return {
      baseAmount,
      discountAmount: 0,
      taxableAmount: baseAmount,
      cgst,
      sgst,
      totalTax,
      grandTotal,
    };
  };

  const invoicePricing = pricing || calculateFallbackTotals(items);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:py-0 print:px-0 print:bg-white">
      {/* Action Buttons - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex gap-3 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 print:bg-indigo-600 print:from-indigo-600 print:to-indigo-600">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">TAX INVOICE</h1>
              <p className="text-indigo-100">Original for Recipient</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{seller.name}</div>
              <div className="text-indigo-100 text-sm mt-1">
                {seller.address}
              </div>
              <div className="text-indigo-100 text-sm">
                GSTIN: {seller.gstin}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            {/* Bill To */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Bill To
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 text-lg">
                  {buyer.name}
                </div>
                <div className="text-gray-600 mt-1">{buyer.address}</div>
              </div>
            </div>

            {/* Invoice Info */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Invoice Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="font-semibold text-gray-900">
                    {invoiceNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date:</span>
                  <span className="font-semibold text-gray-900">
                    {invoiceDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold text-gray-900"> {(() => {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + 15);
    return date.toLocaleDateString("en-IN");
  })()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Item Description
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  HSN
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Qty
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rate (₹)
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{i + 1}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {item.name}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">
                    {item.hsn}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {item.unitPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900 font-medium">
                    {item.total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="px-8 pb-8">
          <div className="flex justify-end">
            <div className="w-full max-w-md">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Taxable Amount</span>
                  <span className="font-medium">
                    ₹
                    {invoicePricing.taxableAmount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>CGST (9%)</span>
                  <span className="font-medium">
                    ₹
                    {invoicePricing.cgst?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>SGST (9%)</span>
                  <span className="font-medium">
                    ₹
                    {invoicePricing.sgst?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {invoicePricing.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -₹
                      {invoicePricing.discountAmount?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>
                      ₹
                      {invoicePricing.grandTotal?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Amount in Words:{" "}
                  {numberToWords(Math.round(invoicePricing.grandTotal))} Rupees
                  Only
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details & Authorization */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Bank Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium">Bank:</span> UCO Bank
              </div>
              <div>
                <span className="font-medium">Account No:</span> 01230210004975
              </div>
              <div>
                <span className="font-medium">IFSC:</span> UCBA0000123
              </div>
              <div>
                <span className="font-medium">Branch:</span> Srinagar
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-8">
                Authorized Signatory
              </div>
              <div className="border-t-2 border-gray-400 inline-block pt-2">
                <div className="text-sm text-gray-900 font-medium">
                  For {seller.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <span className="font-semibold">Terms & Conditions:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Goods once sold will not be taken back.</li>
              <li>
                1.5% discount, if payment is made within 30 days of the invoice date
              </li>
              <li>Subject to Srinagar jurisdiction only.</li>
              <li>
                This is a computer generated invoice and does not require
                signature.
              </li>
            </ol>
          </div>
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Thank you for your business! For any queries, contact us at
              enquiry@cuttingedge-enterprises.in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert number to words
function numberToWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const scales = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";

  let words = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = convertChunk(chunk);
      words =
        chunkWords +
        (scales[scaleIndex] ? " " + scales[scaleIndex] : "") +
        " " +
        words;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return words.trim();

  function convertChunk(n) {
    let result = "";

    // Handle hundreds
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    // Handle tens and ones
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    // Handle ones (including teens)
    if (n > 0) {
      result += ones[n] + " ";
    }

    return result.trim();
  }
}
