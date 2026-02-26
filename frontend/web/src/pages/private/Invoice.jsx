export default function Invoice({ invoice }) {
  const { seller, buyer, items, pricing } = invoice;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-sm print:p-0">
      <h1 className="text-center text-xl font-bold mb-6">
        TAX INVOICE
      </h1>

      <div className="flex justify-between mb-6">
        <div>
          <strong>{seller.name}</strong>
          <div>{seller.address}</div>
          <div>GSTIN: {seller.gstin}</div>
        </div>

        <div>
          <div>Invoice No: {invoice.invoiceNo}</div>
          <div>Date: {invoice.invoiceDate}</div>
        </div>
      </div>

      <div className="mb-6">
        <strong>Bill To:</strong>
        <div>{buyer.name}</div>
        <div>{buyer.address}</div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Item</th>
            <th className="border p-2">HSN</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.hsn}</td>
              <td className="border p-2 text-right">
                {item.quantity}
              </td>
              <td className="border p-2 text-right">
                ₹{item.unitPrice}
              </td>
              <td className="border p-2 text-right">
                ₹{item.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <table>
          <tbody>
            <tr>
              <td className="pr-6">Base Amount</td>
              <td>₹{pricing.baseAmount}</td>
            </tr>
            <tr>
              <td>CGST (9%)</td>
              <td>₹{pricing.cgst}</td>
            </tr>
            <tr>
              <td>SGST (9%)</td>
              <td>₹{pricing.sgst}</td>
            </tr>
            <tr className="font-semibold">
              <td>Total</td>
              <td>₹{pricing.grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-center mt-8 text-slate-500">
        This is a system generated invoice.
      </p>
    </div>
  );
}
