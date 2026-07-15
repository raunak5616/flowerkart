import { Profiler, useEffect, useState } from "react";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

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
  }, []); // ✅ runs once on mount

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

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
      <main className="flex flex-wrap gap-6 justify-center mt-4">
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="flex"
            style={{ width: "345px" }}
          >
            <RecipeReviewCard product={product} />
          </div>
        ))}
      </main>
    </Profiler>
  );
};

export default Home;
