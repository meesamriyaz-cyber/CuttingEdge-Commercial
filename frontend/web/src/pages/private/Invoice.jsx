export default function Invoice({ invoice }) {
  const { seller, buyer, items, pricing } = invoice;

  return (
    <div className="mx-auto max-w-4xl bg-white p-4 text-sm sm:p-8 print:p-0">
      <h1 className="mb-6 text-center text-xl font-bold">TAX INVOICE</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          <strong>{seller.name}</strong>
          <div>{seller.address}</div>
          <div>GSTIN: {seller.gstin}</div>
        </div>

        <div className="min-w-0">
          <div>Invoice No: {invoice.invoiceNo}</div>
          <div>Date: {invoice.invoiceDate}</div>
        </div>
      </div>

      <div className="mb-6">
        <strong>Bill To:</strong>
        <div>{buyer.name}</div>
        <div>{buyer.address}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse border">
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
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.hsn}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">₹{item.unitPrice}</td>
                <td className="border p-2 text-right">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-start sm:justify-end">
        <table className="w-full max-w-sm sm:w-auto">
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

      <p className="mt-8 text-center text-xs text-slate-500">
        This is a system generated invoice.
      </p>
    </div>
  );
}
