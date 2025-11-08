import fs from "fs";
import path from "path";

const cartFilePath = path.join(process.cwd(), "src", "data", "cart.json");

// Initialize cart file if it doesn't exist
if (!fs.existsSync(cartFilePath)) {
  fs.writeFileSync(cartFilePath, JSON.stringify([]));
}

export const getCart = (req, res) => {
  try {
    const cartData = fs.readFileSync(cartFilePath, "utf8");
    const cart = JSON.parse(cartData);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to load cart" });
  }
};

export const addToCart = (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cartData = fs.readFileSync(cartFilePath, "utf8");
    let cart = JSON.parse(cartData);

    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const removeFromCart = (req, res) => {
  try {
    const { id } = req.params;
    const cartData = fs.readFileSync(cartFilePath, "utf8");
    let cart = JSON.parse(cartData);

    cart = cart.filter((item) => item.productId !== parseInt(id));

    fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};
