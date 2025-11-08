let products = [];
let cart = [];

// Load products from JSON file
async function loadProducts() {
  try {
    const response = await fetch('../src/data/products.json');
    products = await response.json();
    displayProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

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
      <img src="${prod.img}" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/300x220?text=No+Image'" />
      <div class="product-info">
        <h3>${prod.name}</h3>
        <p class="price">$${prod.price}</p>
        <p class="description">${prod.description}</p>
      </div>
      <button class="add-cart-btn" onclick="addToCart(${prod.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = totalItems;
}

function showNotification(message) {
  // Simple notification - you can enhance this
  alert(message);
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
      <img src="${prod.img}" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/300x220?text=No+Image'" />
      <div class="product-info">
        <h3>${prod.name}</h3>
        <p class="price">$${prod.price}</p>
        <p class="description">${prod.description}</p>
      </div>
      <button class="add-cart-btn" onclick="addToCart(${prod.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Cart Modal Functions
function openCart() {
  const modal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price} x ${item.quantity}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItems.appendChild(itemDiv);
    });
  }

  modal.style.display = "block";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  openCart(); // Refresh the cart modal
}

// Event listeners
document.getElementById("cartButton").addEventListener("click", openCart);

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById("cartModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Load products on page load
loadProducts();
