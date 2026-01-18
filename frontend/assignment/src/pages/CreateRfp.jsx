import { useEffect, useState } from "react";
import api from "../api";

export default function CreateRfp() {
  const [input, setInput] = useState("");
  const [rfpId, setRfpId] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/vendors").then((res) => setVendors(res.data));
  }, []);

  const handleCreateRfp = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const res = await api.post("/rfps", { description: input });
    setRfpId(res.data._id);
    setLoading(false);
  };

  const toggleVendor = (id) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const sendRfp = async () => {
    if (!rfpId || selectedVendors.length === 0) return;

    setSending(true);
    await api.post("/send-rfp", {
      rfpId,
      vendorIds: selectedVendors,
    });
    setSending(false);
    alert("RFP sent to selected vendors");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-2">Create RFP</h2>
      <p className="text-gray-500 mb-4">
        Describe your procurement requirements and send the RFP to selected vendors.
      </p>

      {/* RFP Input */}
      {!rfpId && (
        <>
          <textarea
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe procurement needs..."
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleCreateRfp}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create RFP"}
          </button>
        </>
      )}

      {/* Vendor Selection */}
      {rfpId && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Select Vendors</h3>

          <div className="space-y-2 mb-4">
            {vendors.map((v) => (
              <label
                key={v._id}
                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(v._id)}
                  onChange={() => toggleVendor(v._id)}
                />
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-sm text-gray-500">{v.email}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={sendRfp}
            disabled={sending}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send RFP"}
          </button>
        </div>
      )}
    </div>
  );
}
