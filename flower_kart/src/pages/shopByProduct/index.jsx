import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";
import { SectionIntro } from "../../components/ui/SectionIntro";

export const ShopByProduct = () => {
  const { id } = useParams();
  const [productsbyshop, setProductsByShop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductByShop = async () => {
      try {
        const data = await getProductById(id);
        setProductsByShop(data);
      } catch (error) {
        console.error("🔥 FETCH PRODUCTS BY SHOP ERROR 🔥", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductByShop();
  }, [id]);

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionIntro
          eyebrow="Seller assortment"
          title="Everything available from this partner store"
          description="This view now behaves more like a curated store shelf, with breathing room and stronger product discovery."
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : !productsbyshop || productsbyshop.length === 0 ? (
            <EmptyState
              icon="inventory_2"
              title="No products found for this shop"
              description="This seller does not have any active listings available at the moment."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {productsbyshop.map((product) => (
                <RecipeReviewCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
