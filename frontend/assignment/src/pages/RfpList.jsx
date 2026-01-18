import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RfpList() {
  const [rfps, setRfps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/rfps").then((res) => {
      setRfps(res.data);
    });
  }, []);

  if (rfps.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">No RFPs created yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Latest RFPs
      </h2>

      <div className="space-y-6">
        {rfps.map((rfp) => (
          <div key={rfp._id} className="border rounded-lg p-4">
            <p className="font-medium">
              {rfp.description}
            </p>

            <p className="text-sm text-gray-500 mb-3">
              Created: {new Date(rfp.createdAt).toLocaleString()}
            </p>

            {/* Structured summary */}
            <div className="bg-gray-50 border rounded-lg p-3 text-sm space-y-1">
              <p>
                <strong>Title:</strong>{" "}
                {rfp.structuredData?.title || "—"}
              </p>
              <p>
                <strong>Budget:</strong>{" "}
                {rfp.structuredData?.budget || "—"}
              </p>
              <p>
                <strong>Delivery:</strong>{" "}
                {rfp.structuredData?.deliveryDays || "—"} days
              </p>
            </div>

            {/* Compare button */}
            <button
              onClick={() =>
                navigate(`/rfps/${rfp._id}/compare`)
              }
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Compare Vendor Proposals
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
