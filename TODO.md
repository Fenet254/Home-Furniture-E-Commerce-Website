# TODO: Revamp Home Furniture E-Commerce Website

## Project Reorganization

- [ ] Create public/ directory for frontend files
- [ ] Move Frontend/index.html to public/index.html
- [ ] Move furniture/script.js to public/script.js
- [ ] Move furniture/style.css to public/style.css
- [ ] Create src/controllers/cartController.js with content from furniture/cartcontrollers.js
- [ ] Delete Backend/ folder (empty)
- [ ] Delete furniture/ folder after moving files

## Backend Enhancements

- [ ] Ensure src/data/products.json has expanded product data (already created)
- [ ] Ensure src/routes/productRoutes.js is correct (already created)
- [ ] Ensure src/routes/cartRoutes.js is correct (already created)
- [ ] Ensure src/controllers/productController.js is correct (already created)
- [ ] Ensure src/server.js is correct (already created)
- [ ] Update dataPath in productController.js to correct path

## Frontend Revisions

- [ ] Revise public/index.html: add hero section, product details modal, cart modal, checkout modal, improve navigation, add footer
- [ ] Revise public/script.js: integrate with API (/api/products, /api/cart), add full cart management, modals, animations, loading states, error handling
- [ ] Revise public/style.css: add animations (hover, transitions), responsiveness (mobile-first), dark mode toggle, improved colors, gradients, shadows

## New Features

- [ ] Add product details modal with description, reviews, add to cart
- [ ] Add full cart page/modal with quantity update, remove items, total price
- [ ] Add checkout form with user details, payment simulation
- [ ] Add user feedback: tooltips, loading spinners, success messages
- [ ] Add animations: fade-ins, slide-ins, button effects
- [ ] Add responsiveness: media queries for tablets, mobiles

## Testing and Finalization

- [ ] Test server startup and API endpoints
- [ ] Test frontend functionality: load products, filter, search, add to cart, checkout
- [ ] Ensure mobile responsiveness
- [ ] Add more products to products.json if needed
- [ ] Create package.json if missing (with dependencies: express, cors, fs-extra)
- [ ] Update README.md if needed
