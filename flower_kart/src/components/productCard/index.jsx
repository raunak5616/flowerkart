import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/card.context/useCartContext";
import { findFavroite } from "../../utils/findFavroite";
import { findCart } from "../../utils/findCartitem";

export default function RecipeReviewCard({ product }) {
  const navigate = useNavigate();
  const { cartDispatch, cart, favourite } = useCart();
  const isFavorite = findFavroite(favourite, product?._id);
  const isInCart = findCart(cart, product?._id);
  const {
    images: [{ url } = {}] = [],
  } = product || {};

  const onFavoriteClick = (event) => {
    event.stopPropagation();
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? product._id : product,
    });
  };

  const onCartClick = (event) => {
    event.stopPropagation();
    cartDispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product._id : product,
    });
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/products/${product?._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/products/${product?._id}`);
        }
      }}
      className="group relative mx-auto flex h-full w-full max-w-[340px] cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(244,63,94,0.14)]"
    >
      <button
        type="button"
        onClick={onFavoriteClick}
        className={`absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
          isFavorite
            ? "bg-red-500 text-white shadow-lg shadow-red-200"
            : "bg-white/80 text-gray-400 shadow-sm backdrop-blur-sm hover:scale-110 hover:text-red-500"
        }`}
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
      >
        <span className="material-symbols-outlined text-lg">favorite</span>
      </button>

      <div className="pointer-events-none relative mb-6 h-56 w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-rose-50 via-white to-slate-50 transition-colors group-hover:bg-red-50/30">
        <img
          src={url || "/no-image.png"}
          alt={product?.name}
          className="h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
          {product?.stock > 0 ? "In stock" : "Sold out"}
        </div>
        {product?.price < 500 ? (
          <div className="absolute bottom-4 left-4 rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
            Best Value
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none flex flex-1 flex-col px-2">
        <div className="mb-2">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
            Premium Bloom
          </p>
          <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 transition-colors group-hover:text-red-600">
            {product?.name}
          </h3>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {product?.description ||
            "Experience the fresh fragrance and vibrant colors of our handpicked floral selection."}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-orange-400">star</span>
              <span className="text-[10px] font-black text-gray-900">
                {product?.rating > 0 ? product.rating.toFixed(1) : "New"}
              </span>
              {product?.numReviews > 0 ? (
                <span className="text-[9px] font-bold text-gray-400">({product.numReviews})</span>
              ) : null}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-none text-slate-400">
              Price
            </p>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              ₹{product?.price?.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={onCartClick}
            className={`pointer-events-auto z-30 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
              isInCart
                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                : "bg-gray-900 text-white shadow-lg hover:scale-110 hover:bg-red-500"
            }`}
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
          >
            <span className="material-symbols-outlined">
              {isInCart ? "shopping_bag" : "add_shopping_cart"}
            </span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-10 -right-10 z-10 h-32 w-32 rounded-full bg-red-100 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
    </article>
  );
}
