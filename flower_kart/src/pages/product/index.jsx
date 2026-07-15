import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";
import { SectionIntro } from "../../components/ui/SectionIntro";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
      } catch (error) {
        console.error("🔥 FETCH PRODUCT ERROR 🔥", error);
      }
    };
    fetchproduct();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  let filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "top-rated") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const loading = products.length === 0;

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="surface-card rounded-[36px] p-6 md:p-8">
          <SectionIntro
            eyebrow="Shop all products"
            title={searchTerm ? `Results for "${searchTerm}"` : "Find the right flowers faster"}
            description="Cleaner filters, calmer spacing, and clearer counts make browsing feel much closer to a production storefront."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="surface-card rounded-[28px] p-5 shadow-none">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Categories
                </h2>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                  {filteredProducts.length}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      selectedCategory === cat
                        ? "bg-red-gradient text-white shadow-lg"
                        : "bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {[selectedCategory !== "All" ? selectedCategory : null, searchTerm || null]
                    .filter(Boolean)
                    .map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600"
                      >
                        {chip}
                      </span>
                    ))}
                </div>

                <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-rose-300"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="top-rated">Top Rated</option>
                  </select>
                </label>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  icon="filter_alt_off"
                  title="No matches for this combination"
                  description="Try another category or a broader search term. A stronger empty state keeps the user moving instead of leaving them at a dead end."
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <RecipeReviewCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
