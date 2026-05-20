const products = [
  { id: 1, name: "Wilson Pro Staff RF97", category: "tennis", price: 279.00, image: "http://static.photos/sport/640x360/11", desc: "Legendary feel and precision. Autograph model with refined weight for serious players." },
  { id: 2, name: "Babolat Pure Drive", category: "tennis", price: 239.00, image: "http://static.photos/sport/640x360/12", desc: "Explosive power and unmatched versatility. The benchmark for modern tennis." },
  { id: 3, name: "Head Graphene 360 Radical", category: "tennis", price: 219.00, image: "http://static.photos/sport/640x360/13", desc: "Dynamic control and spin-friendly 16x19 string pattern for aggressive baseliners." },
  { id: 4, name: "Bullpadel Hack Control", category: "padel", price: 289.00, image: "http://static.photos/sport/640x360/21", desc: "Maximum control with a rough surface for devastating spin on every volley." },
  { id: 5, name: "Head Graphene 360+ Alpha", category: "padel", price: 259.00, image: "http://static.photos/sport/640x360/22", desc: "Diamond shape for explosive power. Perfect for advanced offensive players." },
  { id: 6, name: "Wilson Carbon Force Pro", category: "padel", price: 199.00, image: "http://static.photos/sport/640x360/23", desc: "Carbon fiber construction offering an ideal balance of power and comfort." },
  { id: 7, name: "Tecnifibre Carboflex 125", category: "squash", price: 189.00, image: "http://static.photos/sport/640x360/31", desc: "Baseline racket of Mohamed El Shorbagy. Explosive acceleration and precision." },
  { id: 8, name: "Head Graphene Speed 120", category: "squash", price: 169.00, image: "http://static.photos/sport/640x360/32", desc: "Lightweight frame for rapid volleys and exceptional maneuverability at the net." },
  { id: 9, name: "Dunlop Hyperfibre+ Revelation", category: "squash", price: 179.00, image: "http://static.photos/sport/640x360/33", desc: "Enhanced swing weight with superior stability for commanding court presence." }
];

let cart = JSON.parse(localStorage.getItem('racketCart')) || [];

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  grid.innerHTML = filtered.map(p => `
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
      <div class="relative h-64 overflow-hidden bg-gray-100">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-700 shadow-sm border border-gray-100">
          ${p.category}
        </div>
      </div>
      <div class="p-6 flex flex-col flex-1">
        <h3 class="text-xl font-bold text-gray-900 mb-2">${p.name}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">${p.desc}</p>
        <div class="flex items-center justify-between mt-auto">
          <span class="text-2xl font-bold text-emerald-600">${formatPrice(p.price)}</span>
          <button onclick="addToCart(${p.id})" class="bg-gray-900 hover:bg-emerald-600 active:scale-95 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-gray-900/10 hover:shadow-emerald-600/20">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
            Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  lucide.createIcons();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast();
}

function saveCart() {
  localStorage.setItem('racketCart', JSON.stringify(cart));
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('translate-x-80');
  setTimeout(() => toast.classList.add('translate-x-80'), 2200);
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
  
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400 flex flex-col items-center gap-2 h-full justify-center">
        <i data-lucide="shopping-bag" class="w-12 h-12 mb-2 opacity-20"></i>
        <p>Your cart is empty</p>
        <button onclick="closeCart()" class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700">Start Shopping</button>
      </div>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex gap-4 py-4 border-b border-gray-100">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg bg-gray-100">
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-900 truncate">${item.name}</h4>
          <p class="text-sm text-gray-500 capitalize mb-2">${item.category}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-all">-</button>
              <span class="text-sm font-medium w-6 text-center">${item.qty}</span>
              <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-all">+</button>
            </div>
            <span class="font-bold text-emerald-600">${formatPrice(item.price * item.qty)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent = formatPrice(total);
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (cart.length === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
    checkoutBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700', 'shadow-lg');
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
    checkoutBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'shadow-lg');
  }
  
  lucide.createIcons();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  updateCartUI();
}

function openCart() {
  document.getElementById('cart-drawer').classList.remove('translate-x-full');
  const overlay = document.getElementById('cart-overlay');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.remove('opacity-0'));
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer').classList.add('translate-x-full');
  const overlay = document.getElementById('cart-overlay');
  overlay.classList.add('opacity-0');
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
}

function toggleCart() {
  const isOpen = !document.getElementById('cart-drawer').classList.contains('translate-x-full');
  isOpen ? closeCart() : openCart();
}

function openCheckout() {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('checkout-total').textContent = formatPrice(total);
  document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function simulatePayment() {
  const btn = document.getElementById('pay-btn');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Processing...`;
  lucide.createIcons();
  
  setTimeout(() => {
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    closeCart();
    
    // Show success feedback
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i data-lucide="party-popper" class="w-5 h-5 text-emerald-400"></i><span class="font-medium">Order placed successfully!</span>`;
    toast.classList.remove('translate-x-80');
    setTimeout(() => {
      toast.classList.add('translate-x-80');
      setTimeout(() => {
        toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i><span class="font-medium">Added to cart</span>`;
      }, 400);
    }, 3000);
    
    btn.disabled = false;
    btn.innerHTML = originalContent;
    lucide.createIcons();
  }, 1800);
}

function filterProducts(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isTarget = btn.dataset.filter === category;
    if (isTarget) {
      btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      btn.classList.add('bg-gray-900', 'text-white');
    } else {
      btn.classList.remove('bg-gray-900', 'text-white');
      btn.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    }
  });
  renderProducts(category);
}

// Event delegation for filter buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  const filter = btn.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('bg-gray-900', 'text-white');
    b.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
  });
  btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
  btn.classList.add('bg-gray-900', 'text-white');
  renderProducts(filter);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  lucide.createIcons();
});