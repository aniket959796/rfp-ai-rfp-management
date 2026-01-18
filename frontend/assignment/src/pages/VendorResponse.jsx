import { useEffect, useState } from "react";
import api from "../api";

export default function VendorResponse() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [rfpId, setRfpId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/rfps").then((res) => setRfps(res.data));
    api.get("/vendors").then((res) => setVendors(res.data));
  }, []);

  const submitResponse = async () => {
    if (!rfpId || !vendorId || !replyText) return;

    setLoading(true);
    await api.post("/proposals", {
      rfpId,
      vendorId,
      replyText,
    });
    setLoading(false);
    alert("Vendor response submitted & parsed by AI");
    setReplyText("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Vendor Response</h2>

      <select
        className="w-full border rounded-lg p-2 mb-3"
        onChange={(e) => setRfpId(e.target.value)}
      >
        <option value="">Select RFP</option>
        {rfps.map((r) => (
          <option key={r._id} value={r._id}>
            {r._id}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded-lg p-2 mb-3"
        onChange={(e) => setVendorId(e.target.value)}
      >
        <option value="">Select Vendor</option>
        {vendors.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ))}
      </select>

      <textarea
        rows={5}
        placeholder="Paste vendor email response here..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <button
        onClick={submitResponse}
        disabled={loading}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Response"}
      </button>
    </div>
  );
}
