import fs from "fs-extra";
const dataPath = "./data/products.json";

export const getProducts = async (req, res) => {
  const { category, search } = req.query;
  let products = await fs.readJSON(dataPath);

  if (category && category !== "all") {
    products = products.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q));
  }

  res.json(products);
};

export const addProduct = async (req, res) => {
  const newProduct = req.body;
  const products = await fs.readJSON(dataPath);

  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);

  await fs.writeJSON(dataPath, products, { spaces: 2 });
  res.status(201).json(newProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  let products = await fs.readJSON(dataPath);
  products = products.filter(p => p.id !== Number(id));
  await fs.writeJSON(dataPath, products, { spaces: 2 });
  res.json({ message: "Product deleted" });
};