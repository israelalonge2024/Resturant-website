// Clean, fixed main script: nav toggle, testimonials, enhanced cart with images & qty
document.addEventListener("DOMContentLoaded", () => {
  // NAV TOGGLE
  const navToggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".links");
  if (navToggle && links) {
    navToggle.addEventListener("click", () =>
      links.classList.toggle("show-links")
    );
  }

  // TESTIMONIALS
  const grid = document.querySelector(".testimonials-grid");
  if (grid) {
    const names = ["Aisha", "Michael", "Priya", "Leo", "Maya", "Daniel"];
    const words = [
      "Delicious",
      "Exceptional",
      "Fresh",
      "Tasty",
      "Outstanding",
      "Amazing",
    ];
    const quotes = [
      "Absolutely loved the mains — bold flavors and great portions.",
      "Quick delivery and friendly staff. Highly recommend!",
      "A beautiful dining experience with top-quality ingredients.",
      "Perfect for a quick lunch or a special dinner.",
      "The dessert was heavenly — I savored every bite.",
    ];

    const placeholders = Array.from(grid.querySelectorAll(".testimonial-card"));
    const count = Math.max(3, placeholders.length);
    grid.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const randImg = Math.floor(Math.random() * 70) + 1;
      const name = names[Math.floor(Math.random() * names.length)];
      const word = words[Math.floor(Math.random() * words.length)];
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      const card = document.createElement("div");
      card.className = "testimonial-card";
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", String(100 + i * 100));
      card.innerHTML = `
        <div class="profile"><img src="https://i.pravatar.cc/150?img=${randImg}" alt="${name}"/></div>
        <h3 class="t-name">${name}</h3>
        <p class="t-rating">${word}</p>
        <p class="t-quote">"${quote}"</p>
      `;
      grid.appendChild(card);
    }
    setInterval(() => {
      const first = grid.querySelector(".testimonial-card");
      if (first) grid.appendChild(first);
    }, 6000);
  }

  // CART
  const addButtons = Array.from(document.querySelectorAll(".addToCart"));
  const addedModal = document.getElementById("addedModal");
  const cartModal = document.getElementById("cartModal");
  const cartItemsEl = document.getElementById("cartItems");
  const cartIcon = document.getElementById("cartIcon");
  const mobileCartIcon = document.getElementById("mobileCartIcon");
  const closeCartBtn = document.getElementById("closeCart");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

  const cart = []; // { id?, name, price, img, qty }

  function showAddedToast(text = "Item added to cart!") {
    if (!addedModal) return;
    addedModal.textContent = "\u2713 " + text;
    addedModal.style.display = "block";
    setTimeout(() => (addedModal.style.display = "none"), 1000);
  }

  function calcTotals() {
    const totalMoney = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const totalCount = cart.reduce((s, it) => s + it.qty, 0);
    return { totalMoney, totalCount };
  }

  function updateCartBadge() {
    if (!cartCountEl) return;
    const { totalCount } = calcTotals();
    cartCountEl.textContent = String(totalCount || 0);
    // keep mobile badge synced too (if present)
    const mobileCount = document.getElementById("mobileCartCount");
    if (mobileCount) mobileCount.textContent = totalCount;
  }

  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";
    cart.forEach((it, idx) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      // prefer CSS for styling; add a helper class if needed
      li.classList.add("cart-item-row");

      const img = document.createElement("img");
      img.src = it.img || "";
      img.alt = it.name;
      img.className = "cart-thumb";

      // META container
      const meta = document.createElement("div");
      meta.className = "meta";

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = it.name;

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `$${it.price.toFixed(2)}`;

      const qtyRow = document.createElement("div");
      qtyRow.className = "qty";
      qtyRow.innerHTML = `Qty: `;
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.value = String(it.qty);
      input.className = "qty-input";
      input.addEventListener("change", () => {
        const v = parseInt(input.value, 10) || 1;
        it.qty = v;
        subtotal.textContent = `$${(it.price * it.qty).toFixed(2)}`;
        updateCartBadge();
        if (cartTotalEl)
          cartTotalEl.textContent = `Total: $${calcTotals().totalMoney.toFixed(
            2
          )}`;
      });
      qtyRow.appendChild(input);

      const subtotal = document.createElement("div");
      subtotal.className = "subtotal";
      subtotal.textContent = `$${(it.price * it.qty).toFixed(2)}`;
      subtotal.classList.add("subtotal-strong");

      meta.appendChild(title);
      meta.appendChild(price);
      meta.appendChild(qtyRow);
      meta.appendChild(subtotal);

      // Remove button
      const rm = document.createElement("button");
      rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        cart.splice(idx, 1);
        renderCart();
      });

      // Append structure
      li.appendChild(img);
      li.appendChild(meta);
      li.appendChild(rm);
      cartItemsEl.appendChild(li);
    });

    if (cartTotalEl)
      cartTotalEl.textContent = `Total: $${calcTotals().totalMoney.toFixed(2)}`;
    updateCartBadge();
  }

  function parsePrice(el) {
    if (!el) return 0;
    const txt = el.textContent || el.innerText || "";
    const num = txt.replace(/[^0-9.]/g, "");
    return parseFloat(num) || 0;
  }

  function getProduct(btn) {
    const card = btn.closest(".menu-items, .menu-items-new");
    if (!card) return null;
    const nameEl = card.querySelector(".content h3");
    const priceEl = card.querySelector(".menu-footer p");
    const imgEl = card.querySelector("img");
    return {
      name: nameEl ? nameEl.innerText.trim() : "Item",
      price: parsePrice(priceEl),
      img: imgEl ? imgEl.src : "",
    };
  }

  addButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const info = getProduct(btn);
      // Safety: ensure we don't accidentally change the product card image size
      try {
        const card = btn.closest(".menu-items, .menu-items-new");
        if (card) {
          const originalImg = card.querySelector("img");
          if (originalImg) {
            // remove any inline sizing that might have been set previously
            originalImg.style.width = "";
            originalImg.style.height = "";
            originalImg.removeAttribute("width");
            originalImg.removeAttribute("height");
          }
        }
      } catch (err) {
        // ignore - defensive
      }
      if (!info) return;
      const existing = cart.find((c) => c.name === info.name);
      if (existing) existing.qty += 1;
      else
        cart.push({
          name: info.name,
          price: info.price,
          img: info.img,
          qty: 1,
        });
      showAddedToast(info.name + " added");
      renderCart();
    });
  });

  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      if (!cartModal) return;
      cartModal.style.display =
        cartModal.style.display === "block" ? "none" : "block";
      renderCart();
    });
  }

  // mobile cart icon (inside collapsed nav)
  if (mobileCartIcon) {
    mobileCartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      // ensure nav is collapsed/closed if needed - user may want to close it manually
      cartModal.style.display = "block";
    });
  }
  if (closeCartBtn && cartModal)
    closeCartBtn.addEventListener(
      "click",
      () => (cartModal.style.display = "none")
    );
});

const sliderContainer = document.querySelector(".sliders-div");
const totalImages = document.querySelectorAll(".sliders-div img").length;
let index = 0;

const moveSlider = () => {
  index = (index + 1) % totalImages;
  sliderContainer.style.transform = `translateX(-${index * 100}vw)`;
};
setInterval(moveSlider, 2000);
