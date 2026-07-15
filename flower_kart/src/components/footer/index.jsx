import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 border-t border-rose-100 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.6fr_0.6fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
              FlowerKart
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Commerce for thoughtful floral gifting.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              A more polished storefront should feel trustworthy in the quiet moments too, so the footer now leans on clarity, utility, and brand calm instead of decorative overload.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate("/products")} className="secondary-button px-4 py-2 text-sm">
                Shop now
              </button>
              <button type="button" onClick={() => navigate("/support")} className="secondary-button px-4 py-2 text-sm">
                Get support
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Shop</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                ["Products", "/products"],
                ["Partner stores", "/shop"],
                ["Wishlist", "/favorite"],
                ["My profile", "/profile"],
              ].map(([label, href]) => (
                <button key={label} type="button" onClick={() => navigate(href)} className="block transition hover:text-rose-600">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Help</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {["Support", "Orders", "Delivery", "Returns"].map((label) => (
                <button key={label} type="button" onClick={() => navigate(label === "Support" ? "/support" : "/profile")} className="block transition hover:text-rose-600">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Stay in bloom</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              New launches, gifting edits, and seasonal bundles delivered without overwhelming the page.
            </p>
            <div className="mt-5 flex rounded-full border border-slate-200 bg-slate-50/70 p-1">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              />
              <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FlowerKart. Designed for a calmer, higher-converting commerce experience.</p>
          <p>Fresh delivery • Trusted sellers • Profile-led order tracking</p>
        </div>
      </div>
    </footer>
  );
}
