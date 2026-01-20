import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-indigo-600 text-white px-4 py-2 rounded-md"
      : "text-gray-300 hover:text-white px-4 py-2";

  return (
    <nav className="bg-gray-900 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-6">
          {/* App name → HOME */}
          <NavLink
            to="/"
            className="text-white font-bold text-xl tracking-wide"
          >
            RFP App
          </NavLink>

          {/* Links */}
          <NavLink to="/create-rfp" className={linkClass}>
            Create RFP
          </NavLink>

          <NavLink to="/rfps" className={linkClass}>
            RFP List
          </NavLink>

          <NavLink to="/vendors" className={linkClass}>
            Vendors
          </NavLink>
        </div>

        
      </div>
    </nav>
  );
}
