import { useEffect, useState } from "react";
import api from "../api";
import VendorForm from "../components/VendorForm";
import VendorList from "../components/VendorList";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6">Vendors</h2>

      <VendorForm onVendorAdded={fetchVendors} />

      <div className="mt-6">
        <VendorList vendors={vendors} />
      </div>
    </div>
  );
}
