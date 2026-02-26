import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminQuote,
  updateQuoteStatus
} from "../../../api/adminQuotes";
import { Skeleton } from "../../../components/Skeleton";


export default function AdminQuoteDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("");
  const [adminRemark, setAdminRemark] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
  try {
    setLoading(true);
    const data = await fetchAdminQuote(id);
    setQuote(data);
  } catch (err) {
    console.error(err);
    navigate(-1);
  } finally {
    setLoading(false);
  }
}

  async function handleUpdate() {
    //await updateQuoteStatus(id, status, adminRemark);
    load();
  }

  useEffect(() => {
  if (!id) return; // 🛑 STOP if id not ready
  load();
}, [id]);

 if (loading) {
  return (
    <div className="space-y-4 max-w-3xl">AC
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
  if (!quote) return <p>Quote not found</p>;

  return (
    <div className="space-y-4 max-w-3xl">

      <button
        onClick={() => navigate(-1)}
        className="text-sm border px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold">
        Quote #{quote.quoteNumber || quote._id.slice(-6)}
      </h2>
          <h2 className="text-lg font-semibold flex items-center gap-3">
      Quote #{quote._id.slice(-6).toUpperCase()}

      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
        bg-green-100 text-green-700 border border-green-300">
        ✔ Email sent
      </span>
    </h2>
      <div className="grid md:grid-cols-2 gap-4">

        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-medium mb-2">Organization</h3>
          <p className="text-sm">{quote.enquiry?.user?.organizationName}</p>
          <p className="text-sm">{quote.enquiry?.user?.officialEmail}</p>
        </div>

       <div className="border rounded-md p-3 bg-white">
  <h3 className="font-medium mb-2">Quote Summary</h3>

  <div className="text-sm space-y-1">
    <div>Amount: <b>₹ {quote.price}</b></div>
    <div>
      Valid till:{" "}
      {new Date(quote.validityDate).toLocaleDateString()}
    </div>
    <div>Status: <b>{quote.status}</b></div>
  </div>

  {quote.notes && (
    <div className="mt-3 text-sm">
      <div className="font-medium">Notes</div>
      <p className="whitespace-pre-line">{quote.notes}</p>
    </div>
  )}

  <a
    href={`/api/quotes/${quote._id}/pdf`}
    target="_blank"
    className="inline-block mt-3 px-3 py-2 border rounded text-sm"
  >
    Download Quote PDF
  </a>
</div>


      </div>

      <div className="border rounded-md p-3 bg-white">
        <h3 className="font-medium mb-2">Quote Details</h3>

        <p className="text-sm whitespace-pre-line">
          {quote.notes || quote.description || "—"}
        </p>

      </div>

    </div>
  );
}
