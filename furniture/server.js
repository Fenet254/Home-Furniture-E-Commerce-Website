import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("🛋️ FurniHome API is running...");
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));