











<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FurniHome - Modern Furniture Store</title>
  <link rel="stylesheet" href="../furniture/style.css" />
</head>


<body>
  <header class="header">
    <div class="logo">🛋️ <span>FurniHome</span></div>



    <nav class="nav">
      <button class="nav-btn active" onclick="showAllProducts(this)">All</button>
      <button class="nav-btn" onclick="showCategory('kitchen', this)">Kitchen</button>
      <button class="nav-btn" onclick="showCategory('living', this)">Living</button>
      <button class="nav-btn" onclick="showCategory('bedroom', this)">Bedroom</button>
      <button class="nav-btn" onclick="showCategory('bathroom', this)">Bathroom</button>
    </nav>

    <div class="cart">
      <button id="cartButton" class="cart-btn">
        🛒
        <span id="cartCount" class="cart-count">0</span>
      </button>
    </div>
  </header>

  <main class="main-content">
    <aside class="sidebar">
      <h3>Filters</h3>

      <div class="filter-section">
        <h4>Price Range</h4>
        <div class="price-range">
          <input type="range" id="minPrice" min="0" max="1000" value="0" step="10">
          <input type="range" id="maxPrice" min="0" max="1000" value="1000" step="10">
          <div class="price-display">
            <span id="minPriceDisplay">$0</span> - <span id="maxPriceDisplay">$1000</span>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h4>Color</h4>
        <div class="color-filters">
          <label><input type="checkbox" value="White"> White</label>
          <label><input type="checkbox" value="Black"> Black</label>
          <label><input type="checkbox" value="Brown"> Brown</label>
          <label><input type="checkbox" value="Gray"> Gray</label>
          <label><input type="checkbox" value="Silver"> Silver</label>
          <label><input type="checkbox" value="Oak"> Oak</label>
          <label><input type="checkbox" value="Teak"> Teak</label>
          <label><input type="checkbox" value="Walnut"> Walnut</label>
          <label><input type="checkbox" value="Blue"> Blue</label>
        </div>
      </div>

      <div class="filter-section">
        <h4>Material</h4>
        <div class="material-filters">
          <label><input type="checkbox" value="Wood"> Wood</label>
          <label><input type="checkbox" value="Fabric"> Fabric</label>
          <label><input type="checkbox" value="Metal"> Metal</label>
          <label><input type="checkbox" value="Glass"> Glass</label>
          <label><input type="checkbox" value="Leather"> Leather</label>
          <label><input type="checkbox" value="Mesh"> Mesh</label>
          <label><input type="checkbox" value="Marble"> Marble</label>
          <label><input type="checkbox" value="Upholstered"> Upholstered</label>
        </div>
      </div>

      <button id="applyFilters" class="apply-filters-btn">Apply Filters</button>
      <button id="clearFilters" class="clear-filters-btn">Clear All</button>
    </aside>

    <section class="products-section">
      <div class="products-header">
        <h2 id="resultsCount">All Products (20)</h2>
        <div class="sort-options">
          <select id="sortSelect">
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div id="product-grid" class="grid-container"></div>
    </section>
  </main>

  <!-- Cart Modal -->
  <div id="cartModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeCart()">&times;</span>
      <h2>Your Cart</h2>
      <div id="cart-items"></div>
    </div>
  </div>

  <footer class="footer">
    <input id="searchInput" type="search" placeholder="Search products..." />
    <button onclick="handleSearch()">Search</button>
  </footer>

  <script src="../furniture/script.js"></script>
</body>
</html>