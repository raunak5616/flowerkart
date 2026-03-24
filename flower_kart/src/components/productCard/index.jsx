import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { useCart } from "../../context/card.context/useCartContext";
import { findFavroite } from "../../utils/findFavroite";
import { findCart } from "../../utils/findCartitem";


export default function RecipeReviewCard({ product }) {
  const { cartDispatch, cart, favourite } = useCart();
  const isFavorite = findFavroite(favourite, product?._id);
  const isInCart = findCart(cart, product?._id);
  const {
    images: [{ url } = {}] = [],
  } = product || {};
  const onFavoriteClick = () => {
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? product._id : product,
    })
  };
  const onCartClick = () => {
    cartDispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product._id : product,
    })
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 345,
        minHeight: 450,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        margin: "auto", // center if smaller than container
      }}
    >
      <CardMedia
        component="img"
        image={url || "/no-image.png"}
        alt={product?.name || "product image"}
        sx={{
          height: 200,
          objectFit: "contain",
          bgcolor: "white",
          p: 1,
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          component="div"
          fontWeight="bold"
          sx={{
            p: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            height: "3.6em", // fixed height for 2 lines
          }}
          className="text-gray-700"
        >
          {product?.description}
        </Typography>

        <Typography variant="body2" sx={{ p: 1, fontSize: "16px" }}>
          Price: ₹{product?.price?.toFixed(0)}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          mt: "auto",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          color="error"
          onClick={() => onFavoriteClick(product)}
        >
          <span className="material-symbols-outlined">
            favorite
          </span>
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => onCartClick(product)}
        >
          <span className="material-symbols-outlined">
            shopping_cart
          </span>
        </Button>
      </CardActions>
    </Card>
  );
}
