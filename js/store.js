window.HEARTHFOLD_PRODUCTS = [
  { id: "mill", name: "Four-piece mill", price: 24, img: "images/demo-grinder.png", landed: "8–11" },
  { id: "tray", name: "Lid tray", price: 28, img: "images/demo-tray.png", landed: "9–13" },
  { id: "pouch", name: "Odor pouch", price: 18, img: "images/demo-bag.png", landed: "5–8" },
  { id: "papers", name: "Hemp papers", price: 4.5, img: "images/demo-papers.png", landed: "1–2" },
  { id: "cones", name: "Pre-roll cones 32-pack", price: 12, img: "images/demo-cones.png", landed: "3–5" },
  { id: "jar", name: "Jar + clean kit", price: 22, img: "images/demo-jar.png", landed: "7–10" },
  { id: "kit", name: "Starter kit (tray + papers + cones)", price: 39, img: "images/demo-tray.png", landed: "13–20" },
  { id: "pouch-s", name: "Odor pouch — small", price: 14, img: "images/demo-bag.png", landed: "4–6" },
  { id: "pouch-l", name: "Odor pouch — large", price: 28, img: "images/demo-bag.png", landed: "8–11" },
  { id: "turkey", name: "Oven / turkey bags 10-pack", price: 14, img: "images/demo-bag.png", landed: "3–6" },
  { id: "mylar", name: "Mylar zipper bags 50-pack (assorted kitchen sizes)", price: 16, img: "images/demo-bag.png", landed: "4–7" },
  { id: "carbon", name: "Carbon odor refills 4-pack", price: 12, img: "images/demo-bag.png", landed: "2–4" },
  { id: "pack", name: "Odor backpack", price: 59, img: "images/demo-bag.png", landed: "18–26" }
];

(function () {
  const KEY = "hearthfold-cart";
  const AGE = "hearthfold-21";

  function cart() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); renderCart(); }
  function add(id) {
    const items = cart();
    const found = items.find((row) => row.id === id);
    if (found) found.qty += 1;
    else items.push({ id: id, qty: 1 });
    save(items);
    openCart();
  }
  function setQty(id, qty) {
    let items = cart();
    if (qty <= 0) items = items.filter((row) => row.id !== id);
    else items.forEach((row) => { if (row.id === id) row.qty = qty; });
    save(items);
  }
  function product(id) {
    return window.HEARTHFOLD_PRODUCTS.find((p) => p.id === id);
  }
  function total() {
    return cart().reduce((sum, row) => {
      const p = product(row.id);
      return sum + (p ? p.price * row.qty : 0);
    }, 0);
  }
  function money(n) {
    return "$" + n.toFixed(2);
  }
  function openCart() {
    const el = document.getElementById("cart-drawer");
    if (el) el.hidden = false;
  }
  function closeCart() {
    const el = document.getElementById("cart-drawer");
    if (el) el.hidden = true;
  }
  function renderCart() {
    const count = cart().reduce((n, row) => n + row.qty, 0);
    const btn = document.getElementById("cart-count");
    if (btn) btn.textContent = String(count);
    const list = document.getElementById("cart-lines");
    const tot = document.getElementById("cart-total");
    if (!list) return;
    if (!cart().length) {
      list.innerHTML = "<p>Bag is empty.</p>";
    } else {
      list.innerHTML = cart().map((row) => {
        const p = product(row.id);
        if (!p) return "";
        return "<div class='line'><div><strong>" + p.name + "</strong><p>" + money(p.price) + " · qty " + row.qty + "</p></div><button type='button' class='no' data-remove='" + row.id + "'>Remove</button></div>";
      }).join("");
    }
    if (tot) tot.textContent = money(total());
    list.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.onclick = function () { setQty(btn.getAttribute("data-remove"), 0); };
    });
  }

  window.hearthfoldAdd = add;
  window.hearthfoldCart = { renderCart: renderCart, openCart: openCart, closeCart: closeCart, total: total, items: cart, product: product, money: money };

  document.addEventListener("click", function (e) {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) add(addBtn.getAttribute("data-add"));
    if (e.target.id === "open-cart" || e.target.closest("#open-cart")) openCart();
    if (e.target.id === "close-cart") closeCart();
    if (e.target.id === "cart-drawer" && e.target.classList.contains("drawer-wrap")) closeCart();
  });

  const gate = document.getElementById("gate");
  if (gate && localStorage.getItem(AGE) === "yes") gate.hidden = true;
  const yes = document.getElementById("btn-yes");
  const no = document.getElementById("btn-no");
  if (yes) yes.onclick = function () { localStorage.setItem(AGE, "yes"); gate.hidden = true; };
  if (no) no.onclick = function () {
    localStorage.removeItem(AGE);
    document.querySelector(".wrap").innerHTML = "<p class='banner'>This catalog is 21+ only.</p>";
    if (gate) gate.hidden = true;
  };

  renderCart();
})();
