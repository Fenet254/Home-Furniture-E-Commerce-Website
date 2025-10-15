const products = [
  { name: "Modern Sofa", category: "living", img: "https://images.unsplash.com/photo-1616627452984-3f4f3d0b9e94", price: "$499" },
  { name: "Wooden Table", category: "kitchen", img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461", price: "$199" },
  { name: "Bed Frame", category: "bedroom", img: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa", price: "$899" },
  { name: "Bathroom Mirror", category: "bathroom", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", price: "$120" },
  { name: "Dining Chair", category: "kitchen", img: "https://images.unsplash.com/photo-1616627988854-2c8f7d3e9b7d", price: "$89" },
];

let cartCount = 0;

function displayProducts(filter = "all") {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const filtered = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  filtered.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" onerror="this.src='fallback.jpg'" />
      <div class="product-info">
        <h3>${prod.name}</h3>
        <p>${prod.price}</p>
      </div>
      <button class="add-cart-btn" onclick="addToCart()">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function addToCart() {
  cartCount++;
  document.getElementById("cartCount").textContent = cartCount;
}

function showAllProducts(btn) {
  activateNav(btn);
  displayProducts("all");
}

function showCategory(cat, btn) {
  activateNav(btn);
  displayProducts(cat);
}

function activateNav(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  filtered.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" />
      <div class="product-info">
        <h3>${prod.name}</h3>
        <p>${prod.price}</p>
      </div>
      <button class="add-cart-btn" onclick="addToCart()">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

displayProducts();