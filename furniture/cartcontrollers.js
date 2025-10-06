let cart = [];

export const getCart = (req, res) => res.json(cart);

export const addToCart = (req, res) => {
  const { product } = req.body;
  const existing = cart.find(p => p.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  res.json(cart);
};

export const removeFromCart = (req, res) => {
  const { id } = req.params;
  cart = cart.filter(p => p.id !== Number(id));
  res.json(cart);
};