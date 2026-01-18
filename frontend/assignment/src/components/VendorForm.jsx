import { useState } from "react";
import api from "../api";

export default function VendorForm({ onVendorAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!name || !email) return;

    await api.post("/vendors", { name, email });

    setName("");
    setEmail("");
    onVendorAdded();
  };

  return (
    <div className="bg-gray-50 border rounded-xl p-4">
      <h4 className="text-lg font-semibold mb-4">Add Vendor</h4>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
      >
        Add Vendor
      </button>
    </div>
  );
}
