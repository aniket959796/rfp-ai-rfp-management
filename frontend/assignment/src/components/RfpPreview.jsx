export default function RfpPreview({ rfp }) {
  return (
    <div className="mt-4 bg-gray-50 border rounded-xl p-4">
      <h3 className="text-md font-semibold mb-2">Structured RFP</h3>

      <pre className="text-sm bg-white border rounded-lg p-3 overflow-x-auto">
        {JSON.stringify(rfp.structuredData, null, 2)}
      </pre>
    </div>
  );
}
