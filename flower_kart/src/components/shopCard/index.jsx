import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
const ShopCard = ({ shop,onClick }) => {
  const url = shop?.images?.url; 

  return (
    <Card
      onClick={() => onClick(shop._id)}
      sx={{
        width: 345,
        height: 380,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <CardMedia
        component="img"
        image={url || "/no-image.png"}
        alt={shop?.shop || "shop image"}
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
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
          className="text-gray-700"
        >
          {shop?.shop}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            p: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {shop?.name}
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
        {/* Add buttons here later */}
      </CardActions>
    </Card>
  );
};

export default ShopCard;