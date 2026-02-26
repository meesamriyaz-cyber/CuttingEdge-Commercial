import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import RoleGate from "../../components/RoleGate";
import { API_URL } from "../../api/client";
import { ArrowLeft, Printer, Download } from "lucide-react";

export default function QuoteDetails() {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuote() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/govt/quotes/by-enquiry/${enquiryId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Quote not found");

      setQuote(data);
    } catch (err) {
      setError(err.message);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuote();
  }, [enquiryId]);

  async function decide(decision) {
    try {
      const res = await fetch(
        `${API_URL}/govt/quotes/by-enquiry/${enquiryId}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ decision }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      loadQuote();
    } catch (err) {
      alert(err.message);
    }
  }

  async function downloadPDF() {
    try {
      const res = await fetch(`${API_URL}/govt/quotes/${quote._id}/pdf`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to download PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Quote-${quote._id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p>Loading quote…</p>;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!quote) return <p>Quote not available</p>;

  const enquiry = quote.enquiry;
  const product = enquiry?.product;

  // Seller information (company details)
  const seller = {
    name: "Cutting Edge Enterprises",
    address: "Srinagar, Jammu & Kashmir",
    gstin: "01ABCDE1234F1Z5",
  };

  // Buyer information (government client)
  const buyer = {
    name: enquiry?.organizationName || enquiry?.name || "Government Client",
    address: enquiry?.address || "Government Office",
  };

  // Calculate pricing details
  const baseAmount = parseFloat(quote.price) || 0;
  const cgst = baseAmount * 0.09;
  const sgst = baseAmount * 0.09;
  const totalTax = cgst + sgst;
  const grandTotal = baseAmount + totalTax;

  const pricing = {
    baseAmount,
    discountAmount: 0,
    taxableAmount: baseAmount,
    cgst,
    sgst,
    totalTax,
    grandTotal,
  };

  return (
    <RoleGate allow={["PUBLIC"]}>
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
            Print Quote
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Quote Container */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 print:bg-indigo-600 print:from-indigo-600 print:to-indigo-600">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">QUOTATION</h1>
                <p className="text-indigo-100">Official Government Quotation</p>
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

          {/* Quote Details */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              {/* Bill To */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quotation For
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-gray-900 text-lg">
                    {buyer.name}
                  </div>
                  <div className="text-gray-600 mt-1">{buyer.address}</div>
                </div>
              </div>

              {/* Quote Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quote Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quote Number:</span>
                    <span className="font-semibold text-gray-900">
                      {quote._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quote Date:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(quote.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(quote.validityDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      quote.status === "ACCEPTED" ? "text-green-600" :
                      quote.status === "REJECTED" ? "text-red-600" :
                      "text-blue-600"
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product/Service Details */}
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
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">1</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {product?.name || enquiry?.requirements || "Product / Service"}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">
                    {product?.hsn || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {enquiry?.quantity || 1}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {baseAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900 font-medium">
                    {baseAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Requirements/Notes Section */}
          {enquiry?.requirements && (
            <div className="px-8 pb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-3">Requirements / Specifications</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {enquiry.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Remarks Section */}
          {quote.notes && (
            <div className="px-8 pb-8">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h4 className="font-bold text-gray-900 mb-3">Remarks</h4>
                <p className="text-sm text-gray-600">
                  {quote.notes}
                </p>
              </div>
            </div>
          )}

          {/* Totals Section */}
          <div className="px-8 pb-8">
            <div className="flex justify-end">
              <div className="w-full max-w-md">
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Taxable Amount</span>
                    <span className="font-medium">
                      ₹
                      {pricing.taxableAmount?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST (9%)</span>
                    <span className="font-medium">
                      ₹
                      {pricing.cgst?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST (9%)</span>
                    <span className="font-medium">
                      ₹
                      {pricing.sgst?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -₹
                        {pricing.discountAmount?.toLocaleString("en-IN", {
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
                        {pricing.grandTotal?.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Amount in Words:{" "}
                    {numberToWords(Math.round(pricing.grandTotal))} Rupees
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

          {/* Action Buttons for Quote Decision - Hidden when printing */}
          {quote.status === "SENT" && (
            <div className="px-8 pb-8 print:hidden">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-4">Quote Actions</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => decide("ACCEPTED")}
                    className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  >
                    Accept Quote
                  </button>
                  <button
                    onClick={() => decide("REJECTED")}
                    className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Reject Quote
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-2">
              <p>
                <span className="font-semibold">Terms & Conditions:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>This quotation is valid until the expiry date mentioned above.</li>
                <li>
                  Prices are inclusive of all taxes as applicable.
                </li>
                <li>Delivery timeline will be confirmed upon order confirmation.</li>
                <li>Subject to Srinagar jurisdiction only.</li>
                <li>
                  This is a computer generated quotation and does not require
                  signature.
                </li>
              </ol>
            </div>
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Thank you for your interest! For any queries, contact us at
                enquiry@cuttingedge-enterprises.in
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
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
