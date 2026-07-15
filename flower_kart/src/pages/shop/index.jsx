import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getShop } from "../../apiCalls/shopApi";
import ShopCard from "../../components/shopCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionIntro } from "../../components/ui/SectionIntro";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";

const Shop = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await getShop();
        setShop(response);
      } catch (error) {
        console.error("🔥 FETCH SHOP ERROR 🔥", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  if (loading) {
    return (
      <div className="bg-shell px-4 py-10 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionIntro
          eyebrow="Partner stores"
          title="Browse FlowerKart's verified seller network"
          description="Shops deserve a discovery page that feels deliberate too, not just another card dump."
        />

        <div className="mt-8">
          {!shop || shop.length === 0 ? (
            <EmptyState
              icon="storefront"
              title="No shops available right now"
              description="New partner stores will appear here as the marketplace grows."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {shop.map((shops) => (
                <ShopCard key={shops._id} shop={shops} onClick={(id) => navigate(`/shop/${id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
