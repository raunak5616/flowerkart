import Product from "../mongodb/model/index.js";
console.log("📦 productControllers file LOADED");

export const createProduct = async (req, res) => {
   console.log("🚀 createProduct HIT");

  try {
    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const product = await Product.create({
      ...req.body,
      images
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
  console.error("🔥 CREATE PRODUCT ERROR 🔥");
  console.error(error);

  res.status(500).json({
    message: "Failed to create product",
    error: error.message,
    stack: error.stack,
  });
}

}
