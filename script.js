const prices = {Small:700, Medium:1000, Large:1500};
const cart = [];
let selectedFlavour = "";
const $ = (id) => document.getElementById(id);
const money = (n) => "Rs. " + n.toLocaleString("en-PK");

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}
function openSizeModal(flavour) {
  selectedFlavour = flavour;
  $("modalFlavour").textContent = flavour;
  $("sizeModal").classList.add("open");
  $("sizeModal").setAttribute("aria-hidden", "false");
}
function closeSizeModal() {
  $("sizeModal").classList.remove("open");
  $("sizeModal").setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => openSizeModal(button.dataset.flavour));
});
document.querySelectorAll(".size-choice").forEach(button => {
  button.addEventListener("click", () => {
    const size = button.dataset.size;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.flavour === selectedFlavour && item.size === size);
    if (existing) existing.qty += 1;
    else cart.push({flavour:selectedFlavour, size, price, qty:1});
    closeSizeModal();
    renderCart();
    toast(`${selectedFlavour} (${size}) added to your cart!`);
  });
});
$("closeSizeModal").addEventListener("click", closeSizeModal);
$("sizeModal").addEventListener("click", e => { if (e.target === $("sizeModal")) closeSizeModal(); });

function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  const total = cart.reduce((sum,item) => sum + item.price * item.qty, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  if (!cart.length) {
    $("cartItems").innerHTML = '<p class="empty-cart">Your cart is looking hungry. Add a pizza! 🍕</p>';
    return;
  }
  $("cartItems").innerHTML = cart.map((item,index) => `
    <div class="cart-row">
      <div><b>${item.flavour}</b><small>${item.size} · ${money(item.price)} each</small>
        <div class="qty-controls">
          <button data-action="minus" data-index="${index}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-action="plus" data-index="${index}" aria-label="Increase quantity">+</button>
          <button class="remove-item" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </div><strong>${money(item.price * item.qty)}</strong>
    </div>`).join("");
}
$("cartItems").addEventListener("click", e => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;
  const index = Number(button.dataset.index), action = button.dataset.action;
  if (action === "plus") cart[index].qty++;
  if (action === "minus") cart[index].qty--;
  if (action === "remove" || cart[index]?.qty <= 0) cart.splice(index,1);
  renderCart();
});
function openCart() {
  $("cartDrawer").classList.add("open");
  $("cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart() {
  $("cartDrawer").classList.remove("open");
  $("cartDrawer").setAttribute("aria-hidden","true");
}
$("cartButton").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("checkoutButton").addEventListener("click", () => {
  if (!cart.length) { toast("Add a pizza before continuing!"); return; }
  const lines = cart.map(item => `${item.qty} x ${item.flavour} (${item.size}) — ${money(item.price * item.qty)}`);
  const total = cart.reduce((sum,item) => sum + item.price * item.qty,0);
  alert("Your demo order:\\n\\n" + lines.join("\\n") + "\\n\\nTotal: " + money(total) + "\\n\\nThis is a demo website. Add your shop's WhatsApp number to accept real orders.");
});
$("menuToggle").addEventListener("click", () => {
  const isOpen = $("nav").classList.toggle("open");
  $("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  $("nav").classList.remove("open");
  $("menuToggle").setAttribute("aria-expanded","false");
}));
$("year").textContent = new Date().getFullYear();
renderCart();
