// Admin panel — login removed (access control recommended via Netlify Identity)
document.addEventListener("DOMContentLoaded", () => {
  const adminPanel = document.getElementById("adminPanel");

  function showPanel() {
    if (adminPanel) adminPanel.style.display = "block";
    loadProducts();
    loadOrders();
  }

  // Auto-show admin panel (login handled separately/server-side in production)
  showPanel();

  // Product actions
  const productForm = document.getElementById("productForm");
  const productList = document.getElementById("productList");

  async function loadProducts() {
    const res = await fetch("/.netlify/functions/getProducts");
    const products = await res.json();
    productList.innerHTML = "";
    products.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.name}</strong> - $${p.price.toFixed(
        2
      )} <button data-id="${
        p.id
      }" class="edit">Edit</button> <button data-id="${
        p.id
      }" class="del">Delete</button>`;
      productList.appendChild(li);
    });
  }

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(productForm);
    // call addProduct function with admin token header
    const res = await fetch("/.netlify/functions/addProduct", {
      method: "POST",
      headers: { "x-admin-token": "secret-token" },
      body: fd,
    });
    const json = await res.json();
    alert("added");
    loadProducts();
  });

  productList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("del")) {
      const id = e.target.getAttribute("data-id");
      await fetch("/.netlify/functions/deleteProduct", {
        method: "POST",
        headers: {
          "x-admin-token": "secret-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      loadProducts();
    }
  });

  async function loadOrders() {
    const res = await fetch("/.netlify/functions/getOrders");
    const orders = await res.json();
    const ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";
    orders.forEach((o) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>Order ${o.id}</strong> - ${o.timestamp} - ${o.customer.name} - ${o.total}`;
      ordersList.appendChild(li);
    });
  }
});
