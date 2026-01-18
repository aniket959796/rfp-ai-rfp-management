export default function VendorList({ vendors }) {
  return (
    <div className="mt-6 bg-white border rounded-xl p-4">
      <h4 className="text-lg font-semibold mb-4">Vendor List</h4>

      {vendors.length === 0 && (
        <p className="text-gray-500">No vendors added</p>
      )}

      <ul className="space-y-3">
        {vendors.map((v) => (
          <li
            key={v._id || v.id}
            className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50"
          >
            <span className="font-medium">{v.name}</span>
            <span className="text-sm text-gray-500">{v.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
