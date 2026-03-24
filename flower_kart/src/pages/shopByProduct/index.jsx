import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

export const ShopByProduct = () => {

    const { id } = useParams();   

    const [productsbyshop, setProductsByShop] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProductByShop = async () => {
            try {

                const data = await getProductById(id);
                console.log("🔥 shop By Product ===" , data);  // pass shop id
                setProductsByShop(data);

            } catch (error) {

                console.error("🔥 FETCH PRODUCTS BY SHOP ERROR 🔥", error);

            } finally {

                setLoading(false);

            }
        };

        fetchProductByShop();

    }, [id]);

    if (loading) {
        return <p>Products are loading...</p>;
    }

    return (
        <main className="flex flex-wrap gap-6 justify-center mt-4">
            {productsbyshop.map((product) => (
                <div
                    key={product._id || product.id}
                    className="flex"
                    style={{ width: "345px" }}
                >
                    <RecipeReviewCard product={product} />
                </div>
            ))}
        </main>
    );
};