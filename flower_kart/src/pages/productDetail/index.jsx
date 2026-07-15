import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import { useCart } from "../../context/card.context/useCartContext";
import { findCart } from "../../utils/findCartitem";
import { findFavroite } from "../../utils/findFavroite";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";
import { SectionIntro } from "../../components/ui/SectionIntro";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, favourite, cartDispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isInCart = findCart(cart, id);
  const isFavorite = findFavroite(favourite, id);
  const heroImage = product?.images?.[0]?.url || "/no-image.png";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getProducts();
        const currentProduct = allProducts.find((item) => item._id === id);
        setProduct(currentProduct || null);

        if (currentProduct) {
          const recommendations = allProducts
            .filter(
              (item) =>
                item._id !== currentProduct._id &&
                (item.category === currentProduct.category || item.shopId === currentProduct.shopId)
            )
            .slice(0, 4);
          setRelatedProducts(recommendations);
        }
      } catch (error) {
        console.error("Failed to load product detail", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  const handleCartClick = () => {
    cartDispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product._id : product,
    });
  };

  const handleFavoriteClick = () => {
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? product._id : product,
    });
  };

  if (loading) {
    return (
      <div className="bg-shell px-4 py-10 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-card min-h-[560px] animate-pulse rounded-[36px] bg-white" />
          <div className="space-y-6">
            <div className="surface-card h-24 animate-pulse rounded-[32px] bg-white" />
            <div className="surface-card h-80 animate-pulse rounded-[32px] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-shell px-4 py-16 md:px-6">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            icon="search_off"
            title="We couldn't find that product"
            description="The listing may have been removed or the link is no longer valid. Browse the catalog to continue shopping."
            action={
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="cta-button px-6 py-3 text-sm"
              >
                Back to products
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="secondary-button mb-6 px-4 py-2 text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Continue browsing
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card overflow-hidden rounded-[36px] p-5">
            <div className="rounded-[30px] bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 shadow-sm">
                  {product.category}
                </span>
                <span className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600">
                  Same-day delivery eligible
                </span>
              </div>
              <img
                src={heroImage}
                alt={product.name}
                className="mx-auto h-[420px] w-full max-w-xl object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-[36px] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">
                Signature floral pick
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Starting from
                  </p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                    ₹{product.price?.toLocaleString()}
                  </p>
                </div>
                {product.discount > 0 ? (
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Save {product.discount}%
                  </span>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Rating
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {product.rating > 0 ? product.rating.toFixed(1) : "New"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Reviews
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {product.numReviews || 0}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Stock
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {product.stock}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[36px] p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                  <span className="material-symbols-outlined rounded-full bg-white p-2 text-rose-500 shadow-sm">
                    local_shipping
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Fast doorstep delivery</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Fresh inventory is dispatched with priority routing for better bloom quality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                  <span className="material-symbols-outlined rounded-full bg-white p-2 text-rose-500 shadow-sm">
                    verified
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Trusted seller fulfillment</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Each order is fulfilled by a verified FlowerKart partner shop.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCartClick}
                  className="cta-button flex-1 px-6 py-4 text-sm"
                >
                  <span className="material-symbols-outlined text-base">
                    {isInCart ? "shopping_bag" : "add_shopping_cart"}
                  </span>
                  {isInCart ? "Remove from cart" : "Add to cart"}
                </button>
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className="secondary-button flex-1 px-6 py-4 text-sm"
                >
                  <span className="material-symbols-outlined text-base">
                    {isFavorite ? "favorite" : "favorite"}
                  </span>
                  {isFavorite ? "Saved to wishlist" : "Save for later"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <SectionIntro
            eyebrow="You may also like"
            title="Recommended alongside this bouquet"
            description="A few nearby matches based on category and seller so the browsing journey stays warm and relevant."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.length > 0
              ? relatedProducts.map((item) => <RecipeReviewCard key={item._id} product={item} />)
              : Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
