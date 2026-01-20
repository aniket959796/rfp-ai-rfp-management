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
        {rfps.map((rfp) => {
          const d = rfp.structuredData || {};

          return (
            <div key={rfp._id} className="border rounded-lg p-4 space-y-3">
              {/* Original user input */}
              <p className="font-medium text-gray-800">
                {rfp.description}
              </p>

              <p className="text-sm text-gray-500">
                Created: {new Date(rfp.createdAt).toLocaleString()}
              </p>

              {/* Structured details */}
              <div className="bg-gray-50 border rounded-lg p-4 text-sm space-y-2">
                <p>
                  <strong>Title:</strong>{" "}
                  {d.title || "—"}
                </p>

                {/* Items */}
                {d.items?.length > 0 && (
                  <div>
                    <strong>Items Required:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {d.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity} {item.name}
                          {item.specs && (
                            <span className="text-gray-600">
                              {" "}(
                              {typeof item.specs === "string"
                                ? item.specs
                                : Object.entries(item.specs)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(", ")
                              }
                              )
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p>
                  <strong>Budget:</strong>{" "}
                  {d.budget ? `$${d.budget}` : "—"}
                </p>

                <p>
                  <strong>Delivery:</strong>{" "}
                  {d.deliveryDays
                    ? `${d.deliveryDays} days`
                    : "—"}
                </p>

                <p>
                  <strong>Warranty:</strong>{" "}
                  {d.warranty || "—"}
                </p>

                <p>
                  <strong>Payment Terms:</strong>{" "}
                  {d.paymentTerms || "—"}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() =>
                  navigate(`/rfps/${rfp._id}/compare`)
                }
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Compare Vendor Proposals
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
