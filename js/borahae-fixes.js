(function () {
  "use strict";
 
  /* ─────────────────────────────────────────
   *  CONFIG
   * ───────────────────────────────────────── */
  const FORMSPREE_ID = "mnjyzbpn"; // <-- change this
 
  /* ─────────────────────────────────────────
   *  PRODUCT DATA  (single source of truth)
   *  All pages pull from window.BORAHAE.PRODUCTS
   * ───────────────────────────────────────── */
  const PRODUCTS = [
    // Water Bottles / Mugs  →  tab-2 / category: water-bottles
    { id: 1,  category: "water-bottles", name: "Branded Frosted Mugs",       desc: "Elegant matte finish, customized messages & high quality prints", price: 1500, img: "img/mg2.jpeg" },
    { id: 2,  category: "water-bottles", name: "Stanley Mugs",               desc: "Get your branded/plain Stanley mugs for the vibe",               price: 2800, img: "img/mg30.jpg" },
    { id: 3,  category: "water-bottles", name: "Thermal Flask",              desc: "Keep your drinks hot or cold with our premium Thermal Flasks",   price: 1500, img: "img/mg33.png" },
    { id: 4,  category: "water-bottles", name: "Steel Tumblers",             desc: "Keep your drinks cold with our premium Steel Tumblers",          price: 1800, img: "img/mg32.jpg" },
    { id: 5,  category: "water-bottles", name: "Java Mugs",                  desc: "Up for grabs, get yours today and keep hydrating",               price: 1500, img: "img/mg26s.png" },
    { id: 6,  category: "water-bottles", name: "Frosted Mugs 600ml",         desc: "Classic, Personalized branded/plain mugs 600ml",                 price: 1200, img: "img/m5.jpg" },
    { id: 7,  category: "water-bottles", name: "Peach Thermal Flask 750ml",  desc: "750ml peach branded and unbranded",                              price: 1800, img: "img/m10.jpg" },
    { id: 8,  category: "water-bottles", name: "Glass Mug",                  desc: "Classic, Personalized glass branded mugs",                       price: 1500, img: "img/m3.jpg" },
    { id: 9,  category: "water-bottles", name: "Tumbler Mug",                desc: "Perfect size for that office bag! Get yours today!",             price: 1500, img: "img/m7.jpg" },
    // Notebooks  →  tab-3
    { id: 10, category: "notebooks",     name: "Notebooks & Pens",           desc: "Premium corporate gift sets & promotional items",                price: 2500, img: "img/mg12b.jpeg" },
    // Tote Bags  →  tab-4
    { id: 11, category: "tote-bags",     name: "Branded Tote Bags",          desc: "Everyday carry shopping and lifestyle",                          price: 2000, img: "img/mg17s.jpeg" },
    // Phone Cases  →  tab-5
    { id: 12, category: "phone-cases",   name: "Phone Cases",                desc: "Avoid broken screens, get our phone cases",                     price: 1500, img: "img/mg35s.jpeg" },
  ];
 
  /* ─────────────────────────────────────────
   *  CART STATE
   * ───────────────────────────────────────── */
  let cart = JSON.parse(sessionStorage.getItem("borahae_cart") || "[]");
 
  function saveCart() {
    sessionStorage.setItem("borahae_cart", JSON.stringify(cart));
  }
 
  function getCartCount() {
    return cart.reduce((s, i) => s + i.qty, 0);
  }
 
  function updateCartBadge() {
    document.querySelectorAll(".cart-count-badge").forEach((b) => (b.textContent = getCartCount()));
  }
 
  function addToCart(productId, qty) {
    qty = qty || 1;
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((i) => i.id === productId);
    if (existing) { existing.qty += qty; } else { cart.push({ ...product, qty }); }
    saveCart();
    updateCartBadge();
    showToast(`<strong>${product.name}</strong> added to cart!`, "success");
  }
 
  function changeQty(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== productId);
    saveCart();
    updateCartBadge();
    renderOrderSummary();
  }
 
  function removeFromCart(productId) {
    cart = cart.filter((i) => i.id !== productId);
    saveCart();
    updateCartBadge();
    renderOrderSummary();
  }
 
  /* ─────────────────────────────────────────
   *  TOAST
   * ───────────────────────────────────────── */
  function showToast(html, type) {
    const old = document.getElementById("borahae-toast");
    if (old) old.remove();
    const t = document.createElement("div");
    t.id = "borahae-toast";
    t.innerHTML = `<i class="fa fa-${type === "success" ? "check-circle" : "info-circle"} me-2"></i>${html}`;
    Object.assign(t.style, {
      position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
      background: type === "success" ? "#198754" : "#0d6efd",
      color: "#fff", padding: "12px 20px", borderRadius: "8px",
      boxShadow: "0 4px 16px rgba(0,0,0,.2)", fontSize: "14px",
      opacity: "0", transition: "opacity .3s",
    });
    document.body.appendChild(t);
    setTimeout(() => (t.style.opacity = "1"), 10);
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 400); }, 2800);
  }
 
  /* ─────────────────────────────────────────
   *  HELPERS
   * ───────────────────────────────────────── */
  function categoryLabel(cat) {
    return { "water-bottles": "Water Bottles", notebooks: "Notebooks", "tote-bags": "Tote Bags", "phone-cases": "Phone Cases" }[cat] || cat;
  }
 
  function categoryTabId(cat) {
    return { "water-bottles": "tab-2", notebooks: "tab-3", "tote-bags": "tab-4", "phone-cases": "tab-5" }[cat] || "tab-1";
  }
 
  function productCard(p) {
    return `
      <div class="col-md-6 col-lg-4 col-xl-3" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
        <div class="rounded position-relative fruite-item">
          <div class="fruite-img" style="overflow:hidden;">
            <a href="shop-detail.html?id=${p.id}">
              <img src="${p.img}" class="img-fluid w-100 rounded-top" alt="${p.name}"
                style="height:180px;object-fit:cover;transition:transform .35s;"
                onmouseover="this.style.transform='scale(1.06)'"
                onmouseout="this.style.transform='scale(1)'"
                onerror="this.src='img/mg2.jpeg'">
            </a>
          </div>
          <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top:10px;left:10px;font-size:.78rem;">${categoryLabel(p.category)}</div>
          <div class="p-4 border border-secondary border-top-0 rounded-bottom">
            <a href="shop-detail.html?id=${p.id}" class="text-decoration-none">
              <h5 class="text-dark fw-bold mb-1">${p.name}</h5>
            </a>
            <p class="text-muted small mb-3">${p.desc}</p>
            <div class="d-flex justify-content-between align-items-center flex-lg-wrap gap-2">
              <p class="text-dark fs-5 fw-bold mb-0">Ksh ${p.price.toLocaleString()}</p>
              <button class="btn border border-secondary rounded-pill px-3 text-primary add-to-cart-btn" data-id="${p.id}">
                <i class="fa fa-shopping-bag me-1 text-primary"></i>Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
 
  /* ─────────────────────────────────────────
   *  1. PRODUCT FILTERS (index.html tabs)
   * ───────────────────────────────────────── */
  function initFilters() {
    const tabMap = { "tab-1": "all", "tab-2": "water-bottles", "tab-3": "notebooks", "tab-4": "tote-bags", "tab-5": "phone-cases" };
    Object.entries(tabMap).forEach(([tabId, cat]) => {
      const pane = document.getElementById(tabId);
      if (!pane) return;
      const filtered = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
      pane.innerHTML = `
        <div class="row g-4"><div class="col-lg-12">
          <div class="row g-4" id="${tabId}-grid">
            ${filtered.length ? filtered.map(productCard).join("") : '<p class="text-muted">No products in this category yet.</p>'}
          </div>
        </div></div>`;
    });
  }
 
  /* ─────────────────────────────────────────
   *  2. SEARCH — navbar modal + hero bar
   * ───────────────────────────────────────── */
  function initSearch() {
    // A) Navbar modal
    const modal = document.getElementById("searchModal");
    if (modal) {
      const body = modal.querySelector(".modal-body");
      const resultsDiv = document.createElement("div");
      resultsDiv.id = "search-results";
      resultsDiv.style.cssText = "width:75%;margin:16px auto 0;max-height:55vh;overflow-y:auto;";
      body.appendChild(resultsDiv);
 
      const input   = modal.querySelector("input[type=search]");
      const iconBtn = modal.querySelector(".input-group-text");
 
      function doModalSearch() { runSearch((input.value || "").trim().toLowerCase(), resultsDiv, modal); }
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") doModalSearch(); });
      iconBtn.addEventListener("click", doModalSearch);
      modal.addEventListener("hidden.bs.modal", () => { input.value = ""; resultsDiv.innerHTML = ""; });
    }
 
    // B) Hero / inline search bars with submit buttons
    document.querySelectorAll(".hero-header .position-relative").forEach((wrapper) => {
      const inp = wrapper.querySelector("input");
      const btn = wrapper.querySelector("button[type=submit]");
      if (inp && btn) wireInlineSearch(inp, btn);
    });
  }
 
  function wireInlineSearch(inputEl, btnEl) {
    function go() {
      const q = (inputEl.value || "").trim().toLowerCase();
      if (!q) return;
      const found = PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || categoryLabel(p.category).toLowerCase().includes(q)
      );
      if (!found.length) { showToast(`No products found for "<strong>${q}</strong>"`, "info"); return; }
 
      const shopSection = document.querySelector(".fruite");
      if (shopSection) shopSection.scrollIntoView({ behavior: "smooth", block: "start" });
 
      const allTab = document.querySelector('[href="#tab-1"]');
      if (allTab) allTab.click();
 
      setTimeout(() => {
        const card = document.querySelector(`[data-id="${found[0].id}"]`);
        if (card) {
          card.closest(".fruite-item")?.scrollIntoView({ behavior: "smooth", block: "center" });
          card.closest(".fruite-item")?.classList.add("search-highlight");
          setTimeout(() => card.closest(".fruite-item")?.classList.remove("search-highlight"), 2500);
        }
        if (found.length > 1) showToast(`Found <strong>${found.length} products</strong> matching "${q}"`, "info");
      }, 400);
    }
    btnEl.addEventListener("click", go);
    inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); go(); } });
  }
 
  function runSearch(q, resultsDiv, modal) {
    if (!q) { resultsDiv.innerHTML = ""; return; }
    const found = PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || categoryLabel(p.category).toLowerCase().includes(q)
    );
    if (!found.length) {
      resultsDiv.innerHTML = `<div class="alert alert-warning mt-2"><i class="fas fa-search me-2"></i>No products found for "<strong>${q}</strong>". Try "mugs", "tote", "notebook", "flask".</div>`;
      return;
    }
    resultsDiv.innerHTML = `
      <p class="text-muted mb-2">${found.length} result${found.length > 1 ? "s" : ""} for "<strong>${q}</strong>"</p>
      <div class="list-group">
        ${found.map((p) => `
          <button class="list-group-item list-group-item-action d-flex align-items-center gap-3 search-result-btn"
            data-product-id="${p.id}" data-tab="${categoryTabId(p.category)}">
            <img src="${p.img}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;" onerror="this.src='img/mg2.jpeg'" alt="">
            <div class="text-start flex-grow-1">
              <strong>${p.name}</strong><br>
              <small class="text-muted">${categoryLabel(p.category)} · Ksh ${p.price.toLocaleString()}</small>
            </div>
            <span class="btn btn-sm btn-primary rounded-pill px-3 add-to-cart-btn" data-id="${p.id}">Add</span>
          </button>`).join("")}
      </div>`;
 
    resultsDiv.querySelectorAll(".search-result-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest(".add-to-cart-btn")) return;
        const bsModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
        bsModal.hide();
        const tabLink = document.querySelector(`[href="#${btn.dataset.tab}"]`);
        if (tabLink) tabLink.click();
        setTimeout(() => {
          const card = document.querySelector(`[data-id="${btn.dataset.productId}"]`);
          if (card) {
            card.closest(".fruite-item")?.scrollIntoView({ behavior: "smooth", block: "center" });
            card.closest(".fruite-item")?.classList.add("search-highlight");
            setTimeout(() => card.closest(".fruite-item")?.classList.remove("search-highlight"), 2200);
          }
        }, 350);
      });
    });
  }
 
  /* ─────────────────────────────────────────
   *  3. CART BADGE
   * ───────────────────────────────────────── */
  function initCartBadge() {
    document.querySelectorAll('a[href="cart.html"]').forEach((link) => {
      const badge = link.querySelector(".position-absolute");
      if (badge) badge.classList.add("cart-count-badge");
    });
  }
 
  /* ─────────────────────────────────────────
   *  4. ORDER MODAL
   * ───────────────────────────────────────── */
  function injectOrderModal() {
    if (document.getElementById("orderModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
<div class="modal fade" id="orderModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
    <div class="modal-content rounded-3 border-0 shadow-lg">
      <div class="modal-header bg-primary text-white border-0 px-4 py-3">
        <h5 class="modal-title fw-bold"><i class="fa fa-shopping-bag me-2"></i>Your Cart &amp; Order</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body p-4">
        <div id="order-cart-summary" class="mb-4">
          <h6 class="text-muted text-uppercase fw-semibold mb-3" style="letter-spacing:.07em;">Cart Items</h6>
          <div id="order-items-list"></div>
          <div id="order-empty-msg" class="text-center text-muted py-3 d-none">
            <i class="fa fa-shopping-bag fa-2x mb-2 d-block"></i>Your cart is empty.
          </div>
          <div class="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top" id="order-total-row">
            <span>Total</span>
            <span class="text-primary" id="order-total">Ksh 0</span>
          </div>
        </div>
        <div id="order-success" class="alert alert-success d-none">
          <i class="fas fa-check-circle me-2"></i><strong>Order placed!</strong>
          We'll call you shortly to confirm pickup/delivery and payment. Thank you! 🎉
        </div>
        <div id="order-error" class="alert alert-danger d-none">
          <i class="fas fa-exclamation-circle me-2"></i>Something went wrong. Please WhatsApp us at +254705191550.
        </div>
        <div id="order-form-section">
          <h6 class="text-muted text-uppercase fw-semibold mb-3 mt-2" style="letter-spacing:.07em;">Your Details</h6>
          <div class="row g-3">
            <div class="col-md-6">
              <input type="text"  id="order-name"     class="form-control border py-2" placeholder="Full Name *">
            </div>
            <div class="col-md-6">
              <input type="tel"   id="order-phone"    class="form-control border py-2" placeholder="Phone Number * (e.g. 0712345678)">
            </div>
            <div class="col-12">
              <input type="email" id="order-email"    class="form-control border py-2" placeholder="Email Address (optional)">
            </div>
            <div class="col-12">
              <input type="text"  id="order-location" class="form-control border py-2" placeholder="Town / Delivery Location *">
            </div>
            <div class="col-12">
              <textarea id="order-notes" class="form-control border py-2" rows="2"
                placeholder="Branding details, special instructions, etc. (optional)"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer border-0 px-4 pb-4 pt-0" id="order-footer">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary rounded-pill px-5 fw-semibold" id="place-order-btn">
          <span id="place-order-text">Place Order</span>
          <span id="place-order-spinner" class="d-none">
            <span class="spinner-border spinner-border-sm me-1"></span>Placing…
          </span>
        </button>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(wrap.firstElementChild);
    document.getElementById("place-order-btn").addEventListener("click", placeOrder);
  }
 
  function openOrderModal() {
    if (!cart.length) { showToast("Your cart is empty — add some items first!", "info"); return; }
    ["order-success","order-error"].forEach((id) => document.getElementById(id).classList.add("d-none"));
    document.getElementById("order-form-section").classList.remove("d-none");
    document.getElementById("order-footer").classList.remove("d-none");
    ["order-name","order-phone","order-email","order-location","order-notes"].forEach((id) => { document.getElementById(id).value = ""; });
    renderOrderSummary();
    new bootstrap.Modal(document.getElementById("orderModal")).show();
  }
 
  function renderOrderSummary() {
    const list     = document.getElementById("order-items-list");
    const emptyMsg = document.getElementById("order-empty-msg");
    const totalRow = document.getElementById("order-total-row");
    const footer   = document.getElementById("order-footer");
 
    if (!cart.length) {
      list.innerHTML = "";
      emptyMsg?.classList.remove("d-none");
      totalRow?.classList.add("d-none");
      footer?.classList.add("d-none");
      return;
    }
    emptyMsg?.classList.add("d-none");
    totalRow?.classList.remove("d-none");
    footer?.classList.remove("d-none");
 
    let total = 0;
    list.innerHTML = cart.map((item) => {
      total += item.price * item.qty;
      return `
        <div class="d-flex align-items-center gap-3 py-2 border-bottom cart-row" data-id="${item.id}">
          <img src="${item.img}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;"
            onerror="this.src='img/mg2.jpeg'" alt="">
          <div class="flex-grow-1">
            <div class="fw-semibold" style="font-size:.92rem;">${item.name}</div>
            <div class="text-muted" style="font-size:.82rem;">Ksh ${item.price.toLocaleString()} each</div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-outline-secondary cart-qty-btn px-2 py-0" style="line-height:1.6;" data-id="${item.id}" data-delta="-1">−</button>
            <span class="px-2 fw-bold">${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary cart-qty-btn px-2 py-0" style="line-height:1.6;" data-id="${item.id}" data-delta="1">+</button>
          </div>
          <div class="fw-bold text-dark" style="min-width:80px;text-align:right;">Ksh ${(item.price * item.qty).toLocaleString()}</div>
          <button class="btn btn-sm btn-outline-danger cart-remove-btn rounded-circle px-2 py-0" style="line-height:1.6;" data-id="${item.id}" title="Remove">×</button>
        </div>`;
    }).join("");
 
    document.getElementById("order-total").textContent = `Ksh ${total.toLocaleString()}`;
 
    list.querySelectorAll(".cart-qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
    });
    list.querySelectorAll(".cart-remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
    });
  }
 
  async function placeOrder() {
    const name     = document.getElementById("order-name").value.trim();
    const phone    = document.getElementById("order-phone").value.trim();
    const email    = document.getElementById("order-email").value.trim();
    const location = document.getElementById("order-location").value.trim();
    const notes    = document.getElementById("order-notes").value.trim();
 
    if (!name || !phone || !location) { showToast("Please fill in your name, phone number, and location.", "info"); return; }
    if (!cart.length) { showToast("Your cart is empty!", "info"); return; }
 
    const btn     = document.getElementById("place-order-btn");
    const btnText = document.getElementById("place-order-text");
    const spinner = document.getElementById("place-order-spinner");
    btn.disabled = true; btnText.classList.add("d-none"); spinner.classList.remove("d-none");
 
    const itemsSummary = cart.map((i) => `  • ${i.name} x${i.qty} — Ksh ${(i.price * i.qty).toLocaleString()}`).join("\n");
    const total        = cart.reduce((s, i) => s + i.price * i.qty, 0);
 
    const payload = {
      name:    `[ORDER] ${name}`,
      email:   email || "no-email@borahae.store",
      phone,
      message: `
🛒 NEW ORDER — Borahae Store Website
==========================================
Customer : ${name}
Phone    : ${phone}
Email    : ${email || "—"}
Location : ${location}
 
ITEMS:
${itemsSummary}
 
TOTAL    : Ksh ${total.toLocaleString()}
 
Notes / Branding:
${notes || "None"}
==========================================
Follow up to confirm delivery & payment.
      `.trim(),
    };
 
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        cart = []; saveCart(); updateCartBadge();
        document.getElementById("order-success").classList.remove("d-none");
        document.getElementById("order-form-section").classList.add("d-none");
        document.getElementById("order-footer").classList.add("d-none");
        renderOrderSummary();
      } else { throw new Error(); }
    } catch (_) {
      document.getElementById("order-error").classList.remove("d-none");
    } finally {
      btn.disabled = false; btnText.classList.remove("d-none"); spinner.classList.add("d-none");
    }
  }
 
  /* ─────────────────────────────────────────
   *  5. GLOBAL CLICK DELEGATION
   * ───────────────────────────────────────── */
  function initCartEvents() {
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-to-cart-btn");
      if (addBtn) {
        // shop-detail page handles its own qty — skip if it's the main detail button
        if (addBtn.id === "detailAddToCart") return;
        addToCart(Number(addBtn.dataset.id));
        return;
      }
      const cartLink = e.target.closest('a[href="cart.html"]');
      if (cartLink) { e.preventDefault(); openOrderModal(); return; }
      const checkoutLink = e.target.closest('a[href="chackout.html"]');
      if (checkoutLink) { e.preventDefault(); openOrderModal(); }
    });
  }
 
  /* ─────────────────────────────────────────
   *  CSS
   * ───────────────────────────────────────── */
  function injectStyles() {
    const s = document.createElement("style");
    s.textContent = `
      .search-highlight {
        outline: 3px solid #f4a01c; outline-offset: 4px; border-radius: 8px;
        animation: highlight-pulse 2.4s ease forwards;
      }
      @keyframes highlight-pulse {
        0%,80% { outline-color: #f4a01c; }
        100%    { outline-color: transparent; }
      }
      .cart-count-badge { min-width: 20px; font-size: 12px; }
      #searchModal .list-group-item:hover { background: #f0f4ff; }
      .cart-qty-btn, .cart-remove-btn { font-size: 1rem; font-weight: bold; }
    `;
    document.head.appendChild(s);
  }
 
  /* ─────────────────────────────────────────
   *  BOOT
   * ───────────────────────────────────────── */
  function boot() {
    injectStyles();
    initFilters();        // only affects pages with tab-1…tab-5
    initSearch();
    initCartBadge();
    injectOrderModal();
    initCartEvents();
    updateCartBadge();
 
    // ── Expose global API for shop-detail.html ──
    window.BORAHAE = {
      PRODUCTS,
      addToCartQty: addToCart,   // addToCart(id, qty)
      openOrderModal,
    };
  }
 
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", boot)
    : boot();
 
})();