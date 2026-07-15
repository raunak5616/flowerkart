import { useCart } from "../../context/card.context/useCartContext";
import { findFavroite } from "../../utils/findFavroite";

export const CartCard = ({ item }) => {
  const { cartDispatch, favourite } = useCart();
  const isFavorite = findFavroite(favourite, item?._id);
  const {
    images: [{ url } = {}] = [],
  } = item || {};

  const countInc = () => {
    cartDispatch({
      type: "INCREMENT_QTY",
      payload: item._id,
    });
  };

  const countDec = () => {
    cartDispatch({
      type: "DECREMENT_QTY",
      payload: item._id,
    });
  };

  const onRemoveClick = () => {
    cartDispatch({
      type: "REMOVE_FROM_CART",
      payload: item._id,
    });
  };

  const onFavoriteClick = () => {
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? item._id : item,
    });
  };

  return (
    <div className="surface-card rounded-[30px] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-rose-50 via-white to-slate-50 p-3 md:w-36">
          <img
            src={url || "/no-image.png"}
            alt={item?.name}
            className="h-28 w-full rounded-[18px] object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                In your cart
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {item?.title || item?.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Freshly fulfilled by a verified FlowerKart partner.
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Line total
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                ₹{(item?.price * item?.qty).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onFavoriteClick}
                className="secondary-button px-4 py-2 text-sm"
              >
                <span className="material-symbols-outlined text-base">favorite</span>
                {isFavorite ? "Wishlisted" : "Move to wishlist"}
              </button>
              <button
                type="button"
                onClick={onRemoveClick}
                className="secondary-button px-4 py-2 text-sm text-rose-600"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Remove
              </button>
            </div>

            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50/80 p-1">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-slate-700 shadow-sm disabled:opacity-40"
                onClick={countDec}
                disabled={item.qty === 1}
              >
                −
              </button>
              <span className="min-w-[52px] text-center text-sm font-semibold text-slate-950">
                {item?.qty}
              </span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-lg font-semibold text-white shadow-sm disabled:opacity-40"
                onClick={countInc}
                disabled={item.qty === 5}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
