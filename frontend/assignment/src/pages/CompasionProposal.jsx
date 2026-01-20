import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ComparisonProposal() {
  const { rfpId } = useParams();

  const [proposals, setProposals] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const proposalRes = await api.get(`/proposals/${rfpId}`);
        setProposals(proposalRes.data);

        const recRes = await api.get(
          `/proposals/recommendation/${rfpId}`
        );
        setRecommendation(recRes.data.recommendation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [rfpId]);

  if (loading) return <p>Loading comparison...</p>;

  if (proposals.length === 0) {
    return <p>No proposals found for this RFP.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Proposal Comparison
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Delivery (Days)</th>
              <th className="border p-2">Warranty</th>
              <th className="border p-2">Payment Terms</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">
                  {p.vendorId?.name}
                </td>
                <td className="border p-2">
                  {p.structuredData?.totalPrice ?? "—"}
                </td>
                <td className="border p-2">
                  {p.structuredData?.deliveryDays ?? "—"}
                </td>
                <td className="border p-2">
                  {p.structuredData?.warranty ?? "—"}
                </td>
                <td className="border p-2">
                  {p.structuredData?.paymentTerms ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI RECOMMENDATION */}
      {recommendation && (
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-2">
            🤖 AI Recommendation
          </h3>

          <p className="text-sm">
            <strong>Best Vendor:</strong>{" "}
            {recommendation.bestVendor}
          </p>

          <p className="text-sm mt-2 text-gray-700">
            <strong>Reason:</strong>{" "}
            {recommendation.reason}
          </p>
        </div>
      )}
    </div>
  );
}
