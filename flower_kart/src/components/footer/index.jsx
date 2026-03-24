import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-emerald-700 text-white mt-8">

      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-6">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-semibold mb-2">DesiCart</h2>
          <p className="text-xs text-emerald-100">
            Fresh groceries delivered quickly.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-xs text-emerald-100">
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/shop")}>Shop</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/cart")}>Cart</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/support")}>Support</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Follow</h3>
          <div className="flex gap-3 text-sm text-emerald-100">
            <span className="hover:text-white cursor-pointer">🌐</span>
            <span className="hover:text-white cursor-pointer">📘</span>
            <span className="hover:text-white cursor-pointer">📸</span>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-emerald-600 text-center py-3 text-xs text-emerald-100">
        © {new Date().getFullYear()} DesiCart —
        <span className="font-semibold text-white">
          {" "}Raunak Kumar
        </span>
      </div>

    </footer>
  );
}
