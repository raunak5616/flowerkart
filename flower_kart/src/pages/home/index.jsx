import { Profiler, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";
import { SectionIntro } from "../../components/ui/SectionIntro";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchStart = performance.now();

      try {
        const response = await getProducts();
        setProducts(response);
        console.log("[PERF] Home fetchProducts completed:", {
          productCount: response.length,
          fetchMs: (performance.now() - fetchStart).toFixed(2),
        });
      } catch (err) {
        console.error("🔥 FETCH PRODUCTS ERROR 🔥", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryHighlights = [...new Set(products.map((product) => product.category))]
    .filter(Boolean)
    .slice(0, 4);
  const featuredProducts = products.slice(0, 4);
  const latestProducts = products.slice(4, 12);

  const handleRenderProfile = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    console.log("[PERF] Home render:", {
      id,
      phase,
      actualDuration: actualDuration.toFixed(2),
      baseDuration: baseDuration.toFixed(2),
      startTime: startTime.toFixed(2),
      commitTime: commitTime.toFixed(2),
      productCount: products.length,
    });
  };

  return (
    <Profiler id="HomeProductsGrid" onRender={handleRenderProfile}>
      <div className="bg-shell pb-20">
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 md:px-6 md:pt-12">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card relative overflow-hidden rounded-[40px] bg-premium-gradient px-7 py-8 text-white md:px-10 md:py-12">
              <div className="relative z-10 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-rose-100/85">
                  FlowerKart signature delivery
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                  Fresh flowers, gifting picks, and doorstep joy in one seamless flow.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-rose-50/85 md:text-base">
                  Curated local sellers, warmer presentation, and faster browsing so every purchase feels premium before it even arrives.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/products" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-600 shadow-lg transition hover:bg-rose-50">
                    Shop the collection
                  </Link>
                  <Link to="/shop" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                    Explore partner stores
                  </Link>
                </div>
              </div>
              <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 right-12 h-72 w-72 rounded-full bg-rose-200/20 blur-3xl" />
            </div>

            <div className="grid gap-6">
              <div className="surface-card rounded-[34px] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Why shoppers stay
                </p>
                <div className="mt-5 grid gap-4">
                  {[
                    { icon: "local_shipping", title: "Fast dispatch", text: "Same-day support for local delivery-ready sellers." },
                    { icon: "verified", title: "Trusted inventory", text: "Verified shops and fresh stock visibility built into the journey." },
                    { icon: "redeem", title: "Gifting made easy", text: "Designed for bouquet gifting, planned surprises, and repeat orders." },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                      <span className="material-symbols-outlined rounded-full bg-white p-2 text-rose-500 shadow-sm">
                        {item.icon}
                      </span>
                      <div>
                        <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card rounded-[34px] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Browse by mood
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {categoryHighlights.map((category) => (
                    <Link
                      key={category}
                      to={`/products?search=${encodeURIComponent(category)}`}
                      className="secondary-button px-4 py-2 text-sm"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <SectionIntro
            eyebrow="Featured selection"
            title="Top picks for thoughtful gifting"
            description="A tighter first row with more breathing room so shoppers can focus on a few strong choices instead of being dropped into an endless wall of cards."
            action={
              <Link to="/products" className="secondary-button px-5 py-3 text-sm">
                View full catalog
              </Link>
            }
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : featuredProducts.map((product) => <RecipeReviewCard key={product._id || product.id} product={product} />)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="surface-card rounded-[36px] px-6 py-8 md:px-8">
            <SectionIntro
              eyebrow="Fresh arrivals"
              title="More reasons to keep scrolling"
              description="Recent additions stay in a calmer grid with cleaner whitespace, making the catalog feel curated rather than crowded."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                : latestProducts.map((product) => <RecipeReviewCard key={product._id || product.id} product={product} />)}
            </div>
          </div>
        </section>
      </div>
    </Profiler>
  );
};

export default Home;
