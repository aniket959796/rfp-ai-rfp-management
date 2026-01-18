import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateRfp from "./pages/CreateRfp";
import Vendors from "./pages/Vendors";
import VendorResponse from "./pages/VendorResponse";
import RfpList from "./pages/RfpList";
import CompareProposals from "./pages/CompasionProposal";
import Home from "./pages/Home";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/create-rfp" element={<CreateRfp />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendor-response" element={<VendorResponse />} />
          <Route path="/rfps" element={<RfpList/>}/>
          <Route
  path="/rfps/:rfpId/compare"
  element={<CompareProposals />}
/>
        </Routes>
      </main>
    </div>
  );
}
