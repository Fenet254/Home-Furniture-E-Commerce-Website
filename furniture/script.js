// Category switching functionality
function showCategory(category) {
  // Hide all product sections
  const sections = document.querySelectorAll(".product-section");
  sections.forEach((section) => {
    section.classList.add("hidden");
    section.style.opacity = "0";
  });

  // Show selected category with fade-in effect
  const targetSection = document.getElementById(category + "-products");
  if (targetSection) {
    targetSection.classList.remove("hidden");
    setTimeout(() => {
      targetSection.style.opacity = "1";
    }, 50);
  }

  // Update title with animation
  const titles = {
    kitchen: "Kitchen Furniture",
    living: "Living Room Furniture",
    bedroom: "Bedroom Furniture",
    bathroom: "Bathroom Furniture",
  };

  const titleElement = document.getElementById("categoryTitle");
  titleElement.style.opacity = "0.5";
  setTimeout(() => {
    titleElement.textContent = titles[category] || "Featured Products";
    titleElement.style.opacity = "1";
  }, 150);
}

// Show all products functionality
function showAllProducts() {
  // Hide all category sections
  const sections = document.querySelectorAll(".product-section");
  sections.forEach((section) => {
    section.classList.add("hidden");
    section.style.opacity = "0";
  });

  // Show featured products with fade-in effect
  const featuredSection = document.getElementById("featured-products");
  featuredSection.classList.remove("hidden");
  setTimeout(() => {
    featuredSection.style.opacity = "1";
  }, 50);

  // Update title
  const titleElement = document.getElementById("categoryTitle");
  titleElement.style.opacity = "0.5";
  setTimeout(() => {
    titleElement.textContent = "Featured Products";
    titleElement.style.opacity = "1";
  }, 150);
}

// Shopping cart functionality
let cartCount = 3; // Initial cart count

// Add to cart functionality with enhanced feedback
document.addEventListener("click", function (e) {
  if (e.target.textContent === "Add to Cart") {
    // Button animation and feedback
    e.target.textContent = "Added!";
    e.target.classList.remove("bg-blue-600", "hover:bg-blue-700");
    e.target.classList.add("bg-green-600", "cart-added");

    // Update cart count
    cartCount++;
    updateCartDisplay();

    // Add pulse animation to cart icon
    const cartIcon = document.querySelector(".relative button");
    cartIcon.classList.add("cart-added");

    // Reset button after 2 seconds
    setTimeout(() => {
      e.target.textContent = "Add to Cart";
      e.target.classList.remove("bg-green-600", "cart-added");
      e.target.classList.add("bg-blue-600", "hover:bg-blue-700");
      cartIcon.classList.remove("cart-added");
    }, 2000);

    // Show success notification
    showNotification("Item added to cart!");
  }
});

// Update cart display
function updateCartDisplay() {
  const cartBadge = document.querySelector(".absolute.bg-red-500");
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.classList.add("cart-added");
    setTimeout(() => {
      cartBadge.classList.remove("cart-added");
    }, 300);
  }
}

// Notification system
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300";
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Slide in
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  // Slide out and remove
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Image loading error handling
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img[onerror]");
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.style.display = "none";
      const fallback = this.nextElementSibling;
      if (fallback && fallback.classList.contains("hidden")) {
        fallback.classList.remove("hidden");
      }
    });
  });
});

// Smooth scrolling for navigation
document.addEventListener("click", function (e) {
  if (e.target.tagName === "A" && e.target.getAttribute("href") === "#") {
    e.preventDefault();
  }
});

// Mobile menu functionality (if needed)
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("hidden");
  }
}

// Search functionality placeholder
function handleSearch() {
  const searchInput = document.querySelector('input[type="search"]');
  if (searchInput) {
    const query = searchInput.value.toLowerCase();
    // Implement search logic here
    console.log("Searching for:", query);
  }
}

// Keyboard navigation support
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.classList.contains("category-card")) {
    e.target.click();
  }
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Set initial opacity for smooth transitions
  const sections = document.querySelectorAll(".product-section");
  sections.forEach((section) => {
    section.style.transition = "opacity 0.3s ease-in-out";
    if (!section.classList.contains("hidden")) {
      section.style.opacity = "1";
    }
  });

  // Initialize title transition
  const titleElement = document.getElementById("categoryTitle");
  if (titleElement) {
    titleElement.style.transition = "opacity 0.3s ease-in-out";
  }

  console.log("FurniHome website loaded successfully!");
});
