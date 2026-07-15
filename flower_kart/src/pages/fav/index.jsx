import { Link } from "react-router-dom";
import RecipeReviewCard from "../../components/productCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionIntro } from "../../components/ui/SectionIntro";
import { useCart } from "../../context/card.context/useCartContext";

const Fav = () => {
  const { favourite } = useCart();

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionIntro
          eyebrow="Wishlist"
          title="Saved for later, without losing momentum"
          description="Your wishlist should feel like a thoughtful holding space, not just a recycled product grid."
        />

        <div className="mt-8">
          {favourite.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {favourite.map((item) => (
                <RecipeReviewCard key={item._id || item.id} product={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="favorite"
              title="No saved favorites yet"
              description="Browse the catalog and save a few options to compare later. A stronger empty state keeps wishlisting useful instead of feeling abandoned."
              action={
                <Link to="/products" className="cta-button px-6 py-3 text-sm">
                  Discover products
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Fav;
