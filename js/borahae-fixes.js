(function () {
  "use strict";
 
  /* ─────────────────────────────────────────────
   *  CONFIG — edit these values
   * ───────────────────────────────────────────── */
  const FORMSPREE_ID = "https://formspree.io/f/xeewongo"; // <-- from formspree.io
 
  /* ─────────────────────────────────────────────
   *  PRODUCT DATA
   *  Each product has: category, name, desc, price, img
   *  Categories match the tab filter pills exactly.
   * ───────────────────────────────────────────── */
  const PRODUCTS = [
    // ── Water Bottles / Mugs (tab-2)
    { id: 1,  category: "water-bottles", name: "Branded Frosted Mugs",      desc: "Elegant matte finish, customized messages & high quality prints", price: 1500, img: "img/mg2.jpeg" },
    { id: 2,  category: "water-bottles", name: "Stanley Mugs",              desc: "Get your branded/plain Stanley mugs for the vibe",               price: 2800, img: "img/mg30.jpg" },
    { id: 3,  category: "water-bottles", name: "Thermal Flask",             desc: "Keep your drinks hot or cold with our premium Thermal Flasks",   price: 1500, img: "img/mg33.png" },
    { id: 4,  category: "water-bottles", name: "Steel Tumblers",            desc: "Keep your drinks cold with our premium Steel Tumblers",          price: 1800, img: "img/mg32.jpg" },
    { id: 5,  category: "water-bottles", name: "Java Mugs",                 desc: "Up for grabs, get yours today and keep hydrating",               price: 1500, img: "img/mg26s.png" },
    { id: 6,  category: "water-bottles", name: "Frosted Mugs 600ml",        desc: "Classic, Personalized branded/plain mugs 600ml",                 price: 1200, img: "img/m5.jpg" },
    { id: 7,  category: "water-bottles", name: "Peach Thermal Flask 750ml", desc: "750ml peach branded and unbranded",                              price: 1800, img: "img/m10.jpg" },
    { id: 8,  category: "water-bottles", name: "Glass Mug",                 desc: "Classic, Personalized glass branded mugs",                       price: 1500, img: "img/m3.jpg" },
    { id: 9,  category: "water-bottles", name: "Tumbler Mug",               desc: "Perfect size for that office bag! Get yours today!",             price: 1500, img: "img/m7.jpg" },
    // ── Notebooks (tab-3)
    { id: 10, category: "notebooks",     name: "Notebooks & Pens",          desc: "Premium corporate gift sets & promotional items",                price: 2500, img: "img/mg12b.jpeg" },
    // ── Tote Bags (tab-4)
    { id: 11, category: "tote-bags",     name: "Branded Tote Bags",         desc: "Everyday carry shopping and lifestyle",                          price: 2000, img: "img/mg17s.jpeg" },
    // ── Phone Cases (tab-5)
    { id: 12, category: "phone-cases",   name: "Phone Cases",               desc: "Avoid broken screens, get our phone cases",                     price: 1500, img: "img/mg35s.jpeg" },
  ];
 
  /* ─────────────────────────────────────────────
   *  CART STATE  (persisted in sessionStorage)
   * ───────────────────────────────────────────── */
  let cart = JSON.parse(sessionStorage.getItem("borahae_cart") || "[]");
 
  function saveCart() {
    sessionStorage.setItem("borahae_cart", JSON.stringify(cart));
  }
 
  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }
 
  function updateCartBadge() {
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach((b) => (b.textContent = getCartCount()));
  }
 
  function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((i) => i.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartBadge();
    showAddedToast(product.name);
  }
 
  function showAddedToast(name) {
    const existing = document.getElementById("borahae-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "borahae-toast";
    toast.innerHTML = `<i class="fa fa-check-circle me-2"></i><strong>${name}</strong> added to cart!`;
    Object.assign(toast.style, {
      position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
      background: "#198754", color: "#fff", padding: "12px 20px",
      borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      fontFamily: "inherit", fontSize: "14px", opacity: "0",
      transition: "opacity .3s ease",
    });
    document.body.appendChild(toast);
    setTimeout(() => (toast.style.opacity = "1"), 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }
 
  /* ─────────────────────────────────────────────
   *  RENDER PRODUCTS into a grid container
   * ───────────────────────────────────────────── */
  function productCard(p) {
    return `
      <div class="col-md-6 col-lg-4 col-xl-3" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
        <div class="rounded position-relative fruite-item">
          <div class="fruite-img">
            <img src="${p.img}" class="img-fluid w-100 rounded-top" alt="${p.name}" onerror="this.src='img/mg2.jpeg'">
          </div>
          <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top:10px;left:10px;">${categoryLabel(p.category)}</div>
          <div class="p-4 border border-secondary border-top-0 rounded-bottom">
            <h4>${p.name}</h4>
            <p>${p.desc}</p>
            <div class="d-flex justify-content-between flex-lg-wrap">
              <p class="text-dark fs-5 fw-bold mb-0">Ksh ${p.price.toLocaleString()}</p>
              <button class="btn border border-secondary rounded-pill px-3 text-primary add-to-cart-btn" data-id="${p.id}">
                <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
 
  function categoryLabel(cat) {
    const labels = { "water-bottles": "Water Bottles", notebooks: "Notebooks", "tote-bags": "Tote Bags", "phone-cases": "Phone Cases" };
    return labels[cat] || cat;
  }
 
  /* ─────────────────────────────────────────────
   *  1. FIX PRODUCT FILTERS ("Pick your Poison")
   *  Replaces the static tab content with dynamic
   *  filtered grids driven by PRODUCTS array above.
   * ───────────────────────────────────────────── */
  function initFilters() {
    const tabMap = {
      "tab-1": "all",
      "tab-2": "water-bottles",
      "tab-3": "notebooks",
      "tab-4": "tote-bags",
      "tab-5": "phone-cases",
    };
 
    Object.entries(tabMap).forEach(([tabId, cat]) => {
      const pane = document.getElementById(tabId);
      if (!pane) return;
 
      const filtered = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
 
      pane.innerHTML = `
        <div class="row g-4">
          <div class="col-lg-12">
            <div class="row g-4" id="${tabId}-grid">
              ${filtered.length ? filtered.map(productCard).join("") : '<p class="text-muted">No products found.</p>'}
            </div>
          </div>
        </div>`;
    });
  }
 
  /* ─────────────────────────────────────────────
   *  2. FIX SEARCH
   *  Searches product names and shows results in
   *  the search modal. Clicking a result scrolls
   *  to the product in "All Products" tab.
   * ───────────────────────────────────────────── */
  function initSearch() {
    const modal = document.getElementById("searchModal");
    if (!modal) return;
 
    // Inject results area below the input
    const body = modal.querySelector(".modal-body");
    const resultsDiv = document.createElement("div");
    resultsDiv.id = "search-results";
    resultsDiv.style.cssText = "width:75%;margin:16px auto 0;max-height:60vh;overflow-y:auto;";
    body.appendChild(resultsDiv);
 
    const input = modal.querySelector("input[type=search]");
    const searchBtn = modal.querySelector(".input-group-text");
 
    function doSearch() {
      const q = (input.value || "").trim().toLowerCase();
      if (!q) { resultsDiv.innerHTML = ""; return; }
 
      const found = PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || categoryLabel(p.category).toLowerCase().includes(q)
      );
 
      if (!found.length) {
        resultsDiv.innerHTML = `<div class="alert alert-warning mt-2"><i class="fas fa-search me-2"></i>No products found for "<strong>${q}</strong>". Try "mugs", "tote", "notebook" etc.</div>`;
        return;
      }
 
      resultsDiv.innerHTML = `
        <p class="text-muted mb-2">${found.length} result${found.length > 1 ? "s" : ""} for "<strong>${q}</strong>"</p>
        <div class="list-group">
          ${found.map((p) => `
            <button class="list-group-item list-group-item-action d-flex align-items-center gap-3 search-result-btn" data-product-id="${p.id}" data-tab="${categoryTabId(p.category)}">
              <img src="${p.img}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;" onerror="this.src='img/mg2.jpeg'" alt="">
              <div class="text-start">
                <strong>${p.name}</strong><br>
                <small class="text-muted">${categoryLabel(p.category)} · Ksh ${p.price.toLocaleString()}</small>
              </div>
            </button>`).join("")}
        </div>`;
 
      // Click result → close modal, switch to correct tab, scroll to product
      resultsDiv.querySelectorAll(".search-result-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tabId = btn.dataset.tab;
          const productId = btn.dataset.productId;
 
          // Close modal
          const bsModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
          bsModal.hide();
 
          // Switch to tab
          const tabLink = document.querySelector(`[href="#${tabId}"]`);
          if (tabLink) tabLink.click();
 
          // Scroll after short delay for tab to render
          setTimeout(() => {
            const card = document.querySelector(`[data-id="${productId}"]`);
            if (card) {
              card.closest(".fruite-item")?.scrollIntoView({ behavior: "smooth", block: "center" });
              card.closest(".fruite-item")?.classList.add("search-highlight");
              setTimeout(() => card.closest(".fruite-item")?.classList.remove("search-highlight"), 2000);
            }
          }, 350);
        });
      });
    }
 
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });
    searchBtn.addEventListener("click", doSearch);
    // Clear results when modal closes
    modal.addEventListener("hidden.bs.modal", () => { input.value = ""; resultsDiv.innerHTML = ""; });
  }
 
  function categoryTabId(cat) {
    const map = { "water-bottles": "tab-2", notebooks: "tab-3", "tote-bags": "tab-4", "phone-cases": "tab-5" };
    return map[cat] || "tab-1";
  }
 
  /* ─────────────────────────────────────────────
   *  3. CART BADGE on navbar
   *  Patches the existing cart anchor to show
   *  a live count badge.
   * ───────────────────────────────────────────── */
  function initCartBadge() {
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach((link) => {
      const existing = link.querySelector(".position-absolute");
      if (existing) {
        existing.classList.add("cart-count-badge");
        existing.textContent = getCartCount();
      }
    });
  }
 
  /* ─────────────────────────────────────────────
   *  ORDER MODAL — shown from cart.html or
   *  any "Checkout" button. We inject it globally
   *  so it's available on index.html too via the
   *  cart icon area.
   * ───────────────────────────────────────────── */
  function injectOrderModal() {
    if (document.getElementById("orderModal")) return;
 
    const modal = document.createElement("div");
    modal.innerHTML = `
<!-- Order Modal -->
<div class="modal fade" id="orderModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content rounded-3 border-0 shadow-lg">
      <div class="modal-header bg-primary text-white rounded-top-3 border-0 px-4 py-3">
        <h5 class="modal-title fw-bold"><i class="fa fa-shopping-bag me-2"></i>Complete Your Order</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body p-4">
 
        <!-- Cart Summary -->
        <div id="order-cart-summary" class="mb-4">
          <h6 class="text-muted text-uppercase fw-semibold mb-3" style="letter-spacing:.08em;">Your Items</h6>
          <div id="order-items-list"></div>
          <div class="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
            <span>Total</span>
            <span class="text-primary" id="order-total">Ksh 0</span>
          </div>
        </div>
 
        <!-- Success / Error banners -->
        <div id="order-success" class="alert alert-success d-none">
          <i class="fas fa-check-circle me-2"></i><strong>Order placed!</strong>
          We'll call you shortly to confirm pickup/delivery and payment details. Thank you! 🎉
        </div>
        <div id="order-error" class="alert alert-danger d-none">
          <i class="fas fa-exclamation-circle me-2"></i>Something went wrong. Please WhatsApp us directly at +254705191550.
        </div>
 
        <!-- Customer details form -->
        <div id="order-form-section">
          <h6 class="text-muted text-uppercase fw-semibold mb-3" style="letter-spacing:.08em;">Your Details</h6>
          <div class="row g-3">
            <div class="col-md-6">
              <input type="text" id="order-name" class="form-control border py-2" placeholder="Full Name *" required>
            </div>
            <div class="col-md-6">
              <input type="tel" id="order-phone" class="form-control border py-2" placeholder="Phone Number * (e.g. 0712345678)" required>
            </div>
            <div class="col-12">
              <input type="email" id="order-email" class="form-control border py-2" placeholder="Email Address (optional)">
            </div>
            <div class="col-12">
              <input type="text" id="order-location" class="form-control border py-2" placeholder="Town / Delivery Location *" required>
            </div>
            <div class="col-12">
              <textarea id="order-notes" class="form-control border py-2" rows="2" placeholder="Any special instructions, branding details, etc. (optional)"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer border-0 px-4 pb-4 pt-0" id="order-footer">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary rounded-pill px-5 fw-semibold" id="place-order-btn">
          <span id="place-order-text">Place Order</span>
          <span id="place-order-spinner" class="d-none">
            <span class="spinner-border spinner-border-sm me-1"></span>Placing...
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
<!-- /Order Modal -->`;
    document.body.appendChild(modal.firstElementChild);
 
    document.getElementById("place-order-btn").addEventListener("click", placeOrder);
  }
 
  function openOrderModal() {
    if (!cart.length) {
      alert("Your cart is empty! Add some items first.");
      return;
    }
    renderOrderSummary();
    // Reset state
    document.getElementById("order-success").classList.add("d-none");
    document.getElementById("order-error").classList.add("d-none");
    document.getElementById("order-form-section").classList.remove("d-none");
    document.getElementById("order-footer").classList.remove("d-none");
    document.getElementById("order-name").value = "";
    document.getElementById("order-phone").value = "";
    document.getElementById("order-email").value = "";
    document.getElementById("order-location").value = "";
    document.getElementById("order-notes").value = "";
 
    new bootstrap.Modal(document.getElementById("orderModal")).show();
  }
 
  function renderOrderSummary() {
    const list = document.getElementById("order-items-list");
    let total = 0;
    list.innerHTML = cart.map((item) => {
      total += item.price * item.qty;
      return `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <img src="${item.img}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.src='img/mg2.jpeg'" alt="">
            <span>${item.name} <span class="text-muted">×${item.qty}</span></span>
          </div>
          <span class="fw-semibold">Ksh ${(item.price * item.qty).toLocaleString()}</span>
        </div>`;
    }).join("");
    document.getElementById("order-total").textContent = `Ksh ${total.toLocaleString()}`;
  }
 
  async function placeOrder() {
    const name     = document.getElementById("order-name").value.trim();
    const phone    = document.getElementById("order-phone").value.trim();
    const email    = document.getElementById("order-email").value.trim();
    const location = document.getElementById("order-location").value.trim();
    const notes    = document.getElementById("order-notes").value.trim();
 
    if (!name || !phone || !location) {
      alert("Please fill in your name, phone number, and location.");
      return;
    }
 
    const btn     = document.getElementById("place-order-btn");
    const btnText = document.getElementById("place-order-text");
    const spinner = document.getElementById("place-order-spinner");
    btn.disabled = true;
    btnText.classList.add("d-none");
    spinner.classList.remove("d-none");
 
    // Build order summary text for email
    const itemsSummary = cart.map((i) => `  • ${i.name} x${i.qty} — Ksh ${(i.price * i.qty).toLocaleString()}`).join("\n");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
 
    const emailBody = {
      name:    `[ORDER] ${name}`,
      email:   email || "No email provided",
      phone:   phone,
      message: `
🛒 NEW ORDER from Borahae Store Website
==========================================
Customer: ${name}
Phone:    ${phone}
Email:    ${email || "—"}
Location: ${location}
 
ITEMS ORDERED:
${itemsSummary}
 
TOTAL: Ksh ${total.toLocaleString()}
 
Notes / Branding instructions:
${notes || "None"}
==========================================
Please follow up with the customer to confirm delivery and payment.
      `.trim(),
    };
 
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(emailBody),
      });
 
      if (res.ok) {
        // Clear cart
        cart = [];
        saveCart();
        updateCartBadge();
 
        // Show success, hide form
        document.getElementById("order-success").classList.remove("d-none");
        document.getElementById("order-form-section").classList.add("d-none");
        document.getElementById("order-footer").classList.add("d-none");
      } else {
        throw new Error("bad response");
      }
    } catch (_) {
      document.getElementById("order-error").classList.remove("d-none");
    } finally {
      btn.disabled = false;
      btnText.classList.remove("d-none");
      spinner.classList.add("d-none");
    }
  }
 
  /* ─────────────────────────────────────────────
   *  DELEGATE click events for dynamically
   *  rendered Add-to-Cart buttons
   * ───────────────────────────────────────────── */
  function initCartEvents() {
    document.addEventListener("click", (e) => {
      // Add to cart buttons
      const btn = e.target.closest(".add-to-cart-btn");
      if (btn) {
        addToCart(Number(btn.dataset.id));
        return;
      }
      // Cart icon in navbar → open order modal
      const cartLink = e.target.closest('a[href="cart.html"]');
      if (cartLink) {
        e.preventDefault();
        openOrderModal();
        return;
      }
      // Any explicit "Checkout" or "Place Order" link
      const checkoutLink = e.target.closest('a[href="chackout.html"]');
      if (checkoutLink) {
        e.preventDefault();
        openOrderModal();
      }
    });
  }
 
  /* ─────────────────────────────────────────────
   *  INJECT highlight CSS
   * ───────────────────────────────────────────── */
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .search-highlight {
        outline: 3px solid #f4a01c;
        outline-offset: 4px;
        border-radius: 8px;
        transition: outline .3s;
      }
      .cart-count-badge { min-width: 20px; font-size: 12px; }
      #searchModal .list-group-item:hover { background: #f8f9fa; }
    `;
    document.head.appendChild(style);
  }
 
  /* ─────────────────────────────────────────────
   *  BOOT — run after DOM is ready
   * ───────────────────────────────────────────── */
  function boot() {
    injectStyles();
    initFilters();
    initSearch();
    initCartBadge();
    injectOrderModal();
    initCartEvents();
    updateCartBadge();
  }
 
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();