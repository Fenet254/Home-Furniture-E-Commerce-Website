let products = [];
let cart = [];
let currentFilters = {
  category: "all",
  minPrice: 0,
  maxPrice: 1000,
  colors: [],
  materials: []
};

// Load products from JSON file
async function loadProducts() {
  try {
    const response = await fetch('../src/data/products.json');
    products = await response.json();
    displayProducts();
    updateResultsCount();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function displayProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  let filtered = products;

  // Apply category filter
  if (currentFilters.category !== "all") {
    filtered = filtered.filter(p => p.category === currentFilters.category);
  }

  // Apply price filter
  filtered = filtered.filter(p => p.price >= currentFilters.minPrice && p.price <= currentFilters.maxPrice);

  // Apply color filter
  if (currentFilters.colors.length > 0) {
    filtered = filtered.filter(p => currentFilters.colors.includes(p.color));
  }

  // Apply material filter
  if (currentFilters.materials.length > 0) {
    filtered = filtered.filter(p => currentFilters.materials.includes(p.material));
  }

  // Apply sorting
  const sortValue = document.getElementById("sortSelect").value;
  if (sortValue === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  filtered.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/300x220?text=No+Image'" />
      <div class="product-info">
        <h3>${prod.name}</h3>
        <p class="price">$${prod.price}</p>
        <p class="description">${prod.description}</p>
        <div class="product-details">
          <small>Color: ${prod.color} | Material: ${prod.material}</small>
        </div>
      </div>
      <button class="add-cart-btn" onclick="addToCart(${prod.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });

  updateResultsCount(filtered.length);
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
  currentFilters.category = "all";
  displayProducts();
}

function showCategory(cat, btn) {
  activateNav(btn);
  currentFilters.category = cat;
  displayProducts();
}

function activateNav(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function updateResultsCount(count) {
  const totalProducts = products.length;
  const resultsText = count === totalProducts ? `All Products (${count})` : `Filtered Results (${count} of ${totalProducts})`;
  document.getElementById("resultsCount").textContent = resultsText;
}

// Filter Functions
function applyFilters() {
  // Get price range
  const minPrice = parseInt(document.getElementById("minPrice").value);
  const maxPrice = parseInt(document.getElementById("maxPrice").value);
  currentFilters.minPrice = minPrice;
  currentFilters.maxPrice = maxPrice;

  // Update price display
  document.getElementById("minPriceDisplay").textContent = `$${minPrice}`;
  document.getElementById("maxPriceDisplay").textContent = `$${maxPrice}`;

  // Get selected colors
  const colorCheckboxes = document.querySelectorAll('.color-filters input[type="checkbox"]:checked');
  currentFilters.colors = Array.from(colorCheckboxes).map(cb => cb.value);

  // Get selected materials
  const materialCheckboxes = document.querySelectorAll('.material-filters input[type="checkbox"]:checked');
  currentFilters.materials = Array.from(materialCheckboxes).map(cb => cb.value);

  displayProducts();
}

function clearFilters() {
  // Reset price range
  document.getElementById("minPrice").value = 0;
  document.getElementById("maxPrice").value = 1000;
  document.getElementById("minPriceDisplay").textContent = "$0";
  document.getElementById("maxPriceDisplay").textContent = "$1000";

  // Uncheck all checkboxes
  document.querySelectorAll('.color-filters input[type="checkbox"], .material-filters input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });

  // Reset filters
  currentFilters = {
    category: currentFilters.category, // Keep category filter
    minPrice: 0,
    maxPrice: 1000,
    colors: [],
    materials: []
  };

  displayProducts();
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
  // Price range sliders
  document.getElementById("minPrice").addEventListener("input", function() {
    document.getElementById("minPriceDisplay").textContent = `$${this.value}`;
  });

  document.getElementById("maxPrice").addEventListener("input", function() {
    document.getElementById("maxPriceDisplay").textContent = `$${this.value}`;
  });

  // Filter buttons
  document.getElementById("applyFilters").addEventListener("click", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", clearFilters);

  // Sort select
  document.getElementById("sortSelect").addEventListener("change", displayProducts);
});

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
