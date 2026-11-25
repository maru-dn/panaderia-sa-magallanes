const PRODUCTS = [
  { name: 'Ensaymada', price: 8, sizes: [{ label: 'Small', price: 8 }, { label: 'Big', price: 21 }], img: 'images/Ensaymada.png', desc: 'A soft and fluffy Filipino brioche-style bread generously brushed with butter and topped with a delightful combination of grated cheese and sugar. Its rich, buttery flavor and sweet-savory finish make it a beloved bakery classic.', fav: true, },
  { name: 'Kababayan', price: 7, img: 'images/Kababayan.png', desc: 'A charming, flower-shaped Filipino bread with a golden-brown exterior and a tender, moist crumb. Lightly sweet and pleasantly buttery, it offers a comforting homemade taste in every bite.', fav: true },
  { name: 'Spanish Bread', price: 8, img: 'images/Spanish-Bread.png', desc: 'A soft, golden bread roll filled with a sweet buttery mixture and coated with fine breadcrumbs. Its delicate crust, fluffy interior, and rich filling create a satisfying blend of sweetness and buttery goodness.', fav: false },
  { name: 'Cheese Bread', price: 8, img: 'images/Cheese-Bread.png', desc: 'A tender and fluffy bread with a delicious cheesy flavor throughout. Baked to a lovely golden finish, it combines the comforting softness of freshly baked bread with the creamy, savory taste of cheese.', fav: false },
  { name: 'Chocolate Donut', price: 15, img: 'images/Chocolate-Donut.png', desc: 'A soft, pillowy donut covered in a smooth chocolate coating. With its light texture and rich chocolate flavor, this sweet treat is perfect for satisfying chocolate cravings any time of the day.', fav: true },
  { name: 'Crinkles', price: 10, img: 'images/Crinkles.png', desc: 'Delicious chocolate cookies with a signature cracked surface dusted in powdered sugar. Slightly crisp on the outside and soft and fudgy inside, they deliver a rich chocolate taste with every bite.', fav: false },
  { name: 'Hopiang Baboy', price: 8, img: 'images/Hopia-Baboy.png', desc: 'A traditional Filipino pastry featuring a golden, flaky crust and a sweet-savory filling made with mung bean paste and aromatic ingredients. Its delicate layers and distinctive flavor make it a timeless merienda favorite.', fav: false },
  { name: 'Pan De Regla', price: 8, img: 'images/Pan-De-Regla.png', desc: 'A soft and fluffy Filipino bread filled with a vibrant red sweet filling. Its tender texture and pleasantly sugary center make it a nostalgic bakery treat enjoyed by generations.', fav: false },
  { name: 'Donut', price: 10, img: 'images/Plain Donut.png', desc: 'A classic, freshly baked-style donut with a light and fluffy texture. Finished with a sweet coating, it offers a simple yet delightful taste that pairs perfectly with coffee, milk, or your favorite drink.', fav: false },
  { name: 'Ube Cheese Bread', price: 10, img: 'images/Purple.png', desc: 'A soft, purple-hued bread infused with the distinctively sweet and earthy flavor of ube. Paired with a creamy, savory cheese filling, it brings together two beloved Filipino flavors in one delightful treat.', fav: false },
  { name: 'Putok', price: 13, img: 'images/Putok.png', desc: 'A traditional Filipino bread known for its rounded shape and beautifully cracked top. Slightly firm on the outside with a dense yet tender interior, it has a mild sweetness and a satisfying, rustic character.', fav: false },
  { name: 'Ube Hopia', price: 8, img: 'images/Ube-Hopia.png', desc: 'A delicious Filipino pastry with delicate, flaky layers surrounding a sweet ube filling. Its rich purple yam flavor and tender pastry shell create a delightful balance of texture and sweetness.', fav: true },
  { name: 'Star Bread', price: 10, img: 'images/Big-Muffin.png', desc: 'A beautifully shaped bread with a soft, golden exterior and a tender, fluffy center. Its distinctive star-like appearance and sweet, comforting flavor make it a delightful addition to any bakery selection.', fav: false },
];

const SITE = {
  address: 'Magallanes Street, Intramuros, Manila',
  addressLink: 'https://share.google/JCDHqgZGI7kptXc43',
  hours: '5AM - 6 PM<br>Mon-Sat',
  instagram: 'https://www.instagram.com/masabakerymanila/',
  facebook: 'https://www.facebook.com/profile.php?id=61588925942914',
  phone: 'tel:+639673807772',
  email: 'mailto:hello@example.com',
};

const peso = (n) => '₱' + Number(n).toFixed(2).replace(/\.00$/, '');
const $ = (selector) => document.querySelector(selector);
const CART_KEY = 'panaderia-cart';

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  checkoutMessageText = '';
  checkoutPreview = false;
  renderCart();
}

function getCartProductName(item) {
  return item.productName || PRODUCTS.find((product) =>
    item.name === product.name || item.name.startsWith(`${product.name} (`)
  )?.name;
}

function addToCart(product, size = null, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity <= 0) return false;
  const cart = readCart();
  const itemName = size ? `${product.name} (${size.label})` : product.name;
  const existing = cart.find((item) => item.name === itemName);

  if (existing) existing.qty += quantity;
  else cart.push({ name: itemName, productName: product.name, price: size ? size.price : product.price, img: product.img, qty: quantity });

  saveCart(cart);
  return true;
}

function renderCart() {
  const panel = $('#cart-panel');
  const count = $('#cart-count');
  if (!panel || !count) return;

  const cart = readCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  count.textContent = totalItems;
  count.hidden = totalItems === 0;
  panel.innerHTML = `
    <div class="cart-heading"><h3>Your Cart</h3><button class="cart-close" type="button" aria-label="Close cart">×</button></div>
    ${cart.length ? `<div class="cart-items">${cart.map((item, index) => `
      <div class="cart-item">
        <label class="cart-select"><input type="checkbox" data-cart-select="${index}" ${item.selected !== false ? 'checked' : ''}> Checkout</label>
        <img src="${item.img}" alt="">
        <div class="cart-item-info"><b>${item.name}</b><span>${peso(item.price)} each</span>
          <div class="cart-quantity">
            <button type="button" data-cart-action="decrease" data-cart-index="${index}">−</button>
            <span>${item.qty}</span>
            <button type="button" data-cart-action="increase" data-cart-index="${index}">+</button>
            <button class="cart-remove" type="button" data-cart-action="remove" data-cart-index="${index}">Remove</button>
          </div>
        </div>
      </div>`).join('')}</div>
      <div class="cart-total">Total: ${peso(cart.filter((item) => !checkoutPreview || item.selected !== false).reduce((sum, item) => sum + item.price * item.qty, 0))}</div>
      ${checkoutPreview ? `
        <button class="cart-remove-all" type="button" data-cart-action="back-to-cart">Back to cart</button>` : `
        <button class="cart-remove-all" type="button" data-cart-action="remove-all">Remove all</button>
        <button class="btn cart-checkout" type="button" data-cart-action="checkout">Checkout</button>`}` : ''}
    ${checkoutMessageText ? `
      <div class="checkout-message-box">
        <label>Order message — copy and send it to our official business page:</label>
        <label for="pickup-date">Pick-up date</label><input id="pickup-date" type="date" value="${pickupDate}">
        <pre class="checkout-message">${checkoutMessageText}</pre>
        <textarea id="checkout-message-source" class="checkout-message-source" aria-hidden="true" tabindex="-1">${checkoutMessageText}</textarea>
        ${checkoutPreview ? '<p class="checkout-reminder">Review your order above. Clicking Confirm will copy this message and open our Facebook page.</p><button class="btn cart-checkout" type="button" data-cart-action="confirm-checkout">Confirm and continue</button>' : ''}
      </div>` : (cart.length ? '' : '<p class="cart-empty">Your cart is empty.</p>')}`;
  panel.querySelector('.cart-close').onclick = () => panel.classList.remove('open');
}

function openCart() {
  $('#cart-panel')?.classList.toggle('open');
  renderCart();
}

let toastTimer;
let checkoutMessageText = '';
let checkoutPreview = false;
let pickupDate = '';

function showToast(message) {
  const toast = $('#cart-toast');
  if (!toast) return;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.remove('show', 'pop');
  void toast.offsetWidth;
  toast.classList.add('show', 'pop');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show', 'pop'), 2500);
}

function createCheckoutMessage(cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = cart.map((item) => `- ${item.name} x${item.qty} (${peso(item.price * item.qty)})`).join('\n');
  return `Hello! I would like to place an order:\n\n${items}\n\nTotal: ${peso(total)}\n\nPick-up date: ${pickupDate || 'To be confirmed'}\n\nPlease let me know the availability. Thank you!`;
}

async function checkoutAndRedirectToFacebook(cart) {
  checkoutMessageText = createCheckoutMessage(cart);
  try {
    await navigator.clipboard.writeText(checkoutMessageText);
  } catch (error) {

  }

  showToast('Order copied. Paste it in our Facebook message.');
  window.location.assign(SITE.facebook);
}

const page = location.pathname.split('/').pop() || 'index.html';

const links = [
  ['index.html', 'Home'],
  ['menu.html', 'Menu'],
  ['about.html', 'About Us'],
];

$('#site-header').innerHTML = `
  <header class="container nav">
    <a href="index.html">
      <img class="logo" src="images/logo.png" alt="Panaderia Sa Intramuros">
    </a>
    <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false">
      <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path class="menu-line line-top" d="M4 6h16"></path><path class="menu-line line-middle" d="M4 12h16"></path><path class="menu-line line-bottom" d="M4 18h16"></path></svg>
    </button>
    <nav id="site-nav" aria-label="Main navigation">
      ${links.map(([href, text]) =>
        `<a href="${href}" class="${page === href ? 'active' : ''}"${page === href ? ' aria-current="page"' : ''}>${text}</a>`
      ).join('')}
    </nav>
    <button class="cart-button" id="cart-button" type="button" aria-label="Open shopping cart" title="Shopping cart">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H7M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
      <span id="cart-count" class="cart-count" hidden>0</span>
    </button>
  </header>`;

$('#site-header').insertAdjacentHTML('beforeend', '<div class="cart-panel" id="cart-panel" aria-label="Shopping cart"></div>');
$('#cart-button').onclick = openCart;
const menuToggle = $('#menu-toggle');
const siteNav = $('#site-nav');
menuToggle.onclick = () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
};
siteNav.querySelectorAll('a').forEach((link) => {
  link.onclick = () => {
    siteNav.classList.remove('open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
});
renderCart();
document.body.insertAdjacentHTML('beforeend', `
  <div id="cart-toast" class="cart-toast" role="status" aria-live="polite">
    <span class="toast-check" aria-hidden="true">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m7 12 3.2 3.2L17 8.8"></path></svg>
    </span>
    <span class="toast-text"></span>
  </div>`);

$('#cart-panel').addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const action = button.dataset.cartAction;

  if (action === 'checkout') {
    const cart = readCart().filter((item) => item.selected !== false);
    if (!cart.length) { showToast('Select at least one item to check out.'); return; }
    pickupDate = '';
    checkoutMessageText = createCheckoutMessage(cart);
    checkoutPreview = true;
    renderCart();
    return;
  }

  if (action === 'confirm-checkout') {
    const cart = readCart().filter((item) => item.selected !== false);
    if (!cart.length) return;
    checkoutAndRedirectToFacebook(cart);
    return;
  }

  if (action === 'back-to-cart') {
    checkoutPreview = false;
    checkoutMessageText = '';
    renderCart();
    return;
  }

  if (action === 'remove-all') {
    saveCart([]);
    showToast('Cart cleared.');
    return;
  }

  const index = Number(button.dataset.cartIndex);
  const cart = readCart();
  const item = cart[index];
  if (!item) return;

  if (action === 'increase') {
    item.qty += 1;
  }
  if (action === 'decrease') item.qty -= 1;
  if (action === 'remove' || item.qty <= 0) cart.splice(index, 1);
  saveCart(cart);
});

$('#cart-panel').addEventListener('change', (event) => {
  if (event.target.matches('[data-cart-select]')) {
    const cart = readCart();
    const item = cart[Number(event.target.dataset.cartSelect)];
    if (item) item.selected = event.target.checked;
    saveCart(cart);
    return;
  }
  if (event.target.id === 'pickup-date') {
    pickupDate = event.target.value;
    checkoutMessageText = createCheckoutMessage(readCart().filter((item) => item.selected !== false));
    renderCart();
  }
});

$('#site-footer').innerHTML = `
  <footer class="site-footer">
    <div class="container footer-grid">

      <div class="footer-brand">
        <a href="index.html" class="footer-logo">
          <img src="images/logo.png" alt="Panaderia Sa Intramuros">
        </a>
        <p>Baked fresh in the heart of Intramuros</p>
      </div>

      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
          ${links.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join('')}
        </ul>
      </div>

      <div class="footer-col">
        <h4>Location</h4>
        <p>📍 ${SITE.address}</p>
        <p class="hours"><b>Operating Hours</b><br>${SITE.hours}</p>
      </div>

      <div class="footer-col">
        <h4>Socials</h4>
        <div class="icons">
          <a href="${SITE.instagram}" title="Instagram">◎</a>
          <a href="${SITE.facebook}" title="Facebook">f</a>
          <a href="${SITE.phone}" title="Call">✆</a>
          <a href="${SITE.email}" title="Email">✉</a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      © ${new Date().getFullYear()} Panadería Sa Magallanes. All rights reserved.
    </div>
  </footer>`;

const footerAddress = document.querySelector('.footer-col p');
if (footerAddress) {
  footerAddress.innerHTML = `<a href="${SITE.addressLink}" target="_blank" rel="noopener noreferrer">${SITE.address}</a>`;
}

document.querySelector('.icons a[title="Email"]')?.remove();

const instagramLink = document.querySelector('.icons a[title="Instagram"]');
if (instagramLink) {
  instagramLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg>';
}

const budgeterLink = document.querySelector('a[href="menu.html#budgeter"]');
if (budgeterLink) {
  budgeterLink.innerHTML = '<svg class="budgeter-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2"></rect><rect x="8" y="5.5" width="8" height="3"></rect><path d="M8 12h2m2 0h2m2 0h0M8 16h2m2 0h2m2 0h0M8 19h2m2 0h2m2 0h0"></path></svg> TRY BUDGETER';
}


function card(p) {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="img"><img src="${p.img}" alt="${p.name}"></div>
    <h4>${p.name}</h4>
    <div class="row">
      <span class="price${p.sizes ? ' pending' : ''}">${p.sizes ? 'Select a size' : peso(p.price)}</span>
      
    </div>
    ${p.sizes ? `<div class="sizes">${p.sizes.map((z, i) => `<button class="size" data-i="${i}">${z.label}</button>`).join('')}</div>` : ''}
    <div class="product-cart-row">
      <label class="product-quantity">Qty
        <input class="quantity-input" type="number" min="0" value="1" ${p.sizes ? 'disabled' : ''}>
      </label>
      <button class="btn cart-add" type="button" ${p.sizes ? 'disabled' : ''}>Add to cart</button>
    </div>
    <p class="desc product-description" style="display:block">${p.desc}</p>`;


  el.querySelector('.quantity-input').addEventListener('blur', (event) => { if (event.target.value === '0') event.target.value = ''; });
  let selectedSize = null;

  el.querySelector('.cart-add').onclick = () => {
    if (p.sizes && !selectedSize) {
      showToast('Choose a size first.');
      return;
    }
    const quantityInput = el.querySelector('.quantity-input');
    const quantity = Number.parseInt(quantityInput.value, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) { quantityInput.value = ''; showToast('Product not added because the quantity is zero.'); return; }
    quantityInput.value = quantity;
    addToCart(p, selectedSize, quantity);
    showToast('Added to cart.');
  };

  el.querySelectorAll('.size').forEach((btn) => {
    btn.onclick = () => {
      el.querySelectorAll('.size').forEach((b) => b.classList.toggle('on', b === btn));
      const price = el.querySelector('.price');
      price.classList.remove('pending');
      price.textContent = peso(p.sizes[btn.dataset.i].price);
      selectedSize = p.sizes[btn.dataset.i];
      el.classList.toggle('size-big', selectedSize.label.toLowerCase() === 'big');
      el.classList.toggle('size-small', selectedSize.label.toLowerCase() === 'small');
      el.querySelector('.cart-add').disabled = false;
      el.querySelector('.quantity-input').disabled = false;
    };
  });

  return el;
}

if ($('#menu-grid')) {
  PRODUCTS.forEach((p) => $('#menu-grid').append(card(p)));
}

if ($('#team-grid')) {
  TEAM.forEach((m) => {
    const d = document.createElement('article');
    d.className = 'card';
    d.innerHTML = `
      <div class="img"><img src="${m.img}" alt="${m.name}"></div>
      <h4>${m.name}</h4>
      <p class="desc" style="display:block">${m.role}</p>`;
    $('#team-grid').append(d);
  });
}

const track = $('#featured-track');

if (track) {
  const items = PRODUCTS.slice(0, 8).map((p) => {
    const a = document.createElement('a');
    a.className = 'feat';
    a.href = 'menu.html';
    a.draggable = false;
    a.innerHTML = `<img src="${p.img}" alt="${p.name}" draggable="false"><span>${p.name}</span>`;
    track.append(a);
    return a;
  });

  const n = items.length;
  const AUTOPLAY_MS = 3000;                 
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let dragDx = 0, dragging = false, moved = false, startX = 0, dragStartCurrent = 0, timer;

  const isMobile = () => window.innerWidth < 760;
  const gap = () => track.clientWidth / (isMobile() ? 2.2 : 4.2);   
  const range = () => (isMobile() ? 1 : 2);                         
  const wrap = (i) => ((i % n) + n) % n;

  function render() {
    const sp = gap();
    const jumped = [];
    const big = isMobile() ? 1.35 : 1.55;                    
    const small = isMobile() ? 0.75 : 0.8; 

    items.forEach((el, i) => {
      let off = wrap(i - current);
      if (off > n / 2) off -= n;
      const hidden = Math.abs(off) > range();

      
      if (el._off !== undefined && Math.abs(off - el._off) > range() + 1) {
        el.style.transition = 'none';
        jumped.push(el);
      }
      el._off = off;

                   
      const push = Math.sign(off) * sp * 0.2;                

      el.style.width = sp * 0.9 + 'px';
      el.style.transform = `translateX(calc(-50% + ${off * sp + push + dragDx}px))`;
      el.querySelector('img').style.transform = `scale(${off === 0 ? big : small})`;
      el.style.opacity = hidden ? 0 : off === 0 ? 1 : 0.6;
      el.style.zIndex = 10 - Math.abs(off);
      el.style.pointerEvents = hidden ? 'none' : 'auto';
      el.classList.toggle('center', off === 0);
    });

    const boxH = items[0].offsetHeight;
    const trackH = isMobile() ? 440 : 520;
    track.style.height = trackH + 'px';
    items.forEach((el) => (el.style.top = (trackH - boxH) / 2 + 'px'));

    if (jumped.length) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        jumped.forEach((el) => (el.style.transition = ''));
      }));
    }
  }

  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (!reduced) timer = setInterval(() => { current = wrap(current + 1); render(); }, AUTOPLAY_MS);
  };

  track.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    dragStartCurrent = current;
    stop();
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dragDx = e.clientX - startX;
    if (Math.abs(dragDx) > 5) {
      moved = true;
      track.classList.add('dragging');
    }
    const steps = Math.floor(Math.abs(dragDx) / gap() + 0.2) * Math.sign(-dragDx);
    current = wrap(dragStartCurrent + steps);
    dragDx += steps * gap();
    render();
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');

    let steps = -Math.round(dragDx / gap());
    if (steps === 0 && Math.abs(dragDx) > 40) steps = dragDx < 0 ? 1 : -1;

    dragDx = 0;
    current = wrap(current + steps);
    render();
    start();
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  track.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      moved = false;
    }
  }, true);

  window.addEventListener('resize', render);
  render();
  start();

}

const OPTIONS = PRODUCTS.flatMap((p) =>
  p.sizes ? p.sizes.map((z) => ({ ...p, name: `${p.name} (${z.label})`, price: z.price })) : [p]
);

const VALUE_RANGE = 0.20;

function plan(budget, mode) {
  const cart = new Map();
  let left = budget;

  const items = OPTIONS.filter((p) => p.price > 0 && p.price <= budget);
  const sorted = [...items].sort((a, b) => a.price - b.price);

  const add = (p) => {
    cart.set(p, (cart.get(p) || 0) + 1);
    left -= p.price;
  };

  if (sorted.length) {
    if (mode === 'value') {
      const cheapestPrice = sorted[0].price;
      const goodValueItems = sorted.filter((p) =>
        p.price <= cheapestPrice * (1 + VALUE_RANGE)
      );

      let added;
      do {
        added = false;
        for (const p of goodValueItems) {
          if (p.price <= left) {
            add(p);
            added = true;
          }
        }
      } while (added);

      let remainderItem;
      while ((remainderItem = sorted.find((p) => p.price <= left))) {
        add(remainderItem);
      }

    } else if (mode === 'variety') {
      let added;
      do {
        added = false;
        for (const p of sorted) {
          if (p.price <= left) {
            add(p);
            added = true;
          }
        }
      } while (added);

    } else if (mode === 'favorites') {
      
      const favs = sorted.filter((p) => p.fav);
      const pool = favs.length ? favs : sorted;
      let added = true;
      while (added) {
        added = false;
        for (const p of pool) {
          if (p.price <= left) {
            add(p);
            added = true;
          }
        }
      }

    } else {
      
      let affordable;
      while ((affordable = sorted.filter((p) => p.price <= left)).length) {
        add(affordable[Math.floor(Math.random() * affordable.length)]);
      }
    }
  }

  return { cart, total: budget - left, left };
}

function getBudgetCartDetails(option) {
  const product = PRODUCTS.find((item) =>
    option.name === item.name || option.name.startsWith(`${item.name} (`)
  );
  const size = product?.sizes?.find((item) => option.name === `${product.name} (${item.label})`) || null;
  return { product, size };
}


const mount = $('#budgeter-mount');

if (mount) {
  const modes = [
    ['value', '★', 'Most Value'],
    ['variety', '▦', 'More Variety'],
    ['favorites', '♥', 'All-Time Favorites'],
    ['surprise', '✦', 'Surprise Me'],
  ];
  let mode = 'value';
  let recommendations = [];

  mount.innerHTML = `
    <div class="widget">
      <div class="w-left">
        <label class="amount">
          <b>₱</b>
          <input id="amt" type="number" min="1" inputmode="numeric" placeholder="Enter Amount...">
        </label>
        <div class="modes">
          ${modes.map(([key, icon, label]) =>
            `<button class="mode ${key === mode ? 'on' : ''}" data-m="${key}"><i>${icon}</i>${label}</button>`
          ).join('')}
        </div>
        <div class="budget-actions">
          <button class="btn" id="go" type="button">Lets Go</button>
          <button class="btn" id="budget-add" type="button" disabled>Add to cart</button>
        </div>
      </div>
      <div class="w-right">
        <h3 id="res-title">For 0 Php, you can get:</h3>
        <div class="res">
          <div class="res-items" id="res-items">
            <p class="hint">Enter an amount and press “Lets Go”.</p>
          </div>
          <div class="total" id="total">Total: ₱0</div>
        </div>
      </div>
    </div>`;

  function run() {
    const budget = parseFloat($('#amt').value);

    if (!(budget > 0)) {
      recommendations = [];
      $('#budget-add').disabled = true;
      $('#res-items').innerHTML = '<p class="hint">Please enter a valid amount.</p>';
      return;
    }

    const { cart, total, left } = plan(budget, mode);
    recommendations = [...cart];
    $('#budget-add').disabled = !cart.size;

    $('#res-title').textContent = `For ${budget} Php, you can get:`;

    $('#res-items').innerHTML = cart.size
      ? [...cart].map(([p, qty]) => `
          <div class="mini">
            <label class="budget-pick"><input type="checkbox" data-budget-pick="${p.name}" checked> Add</label>
            <img src="${p.img}" alt="">
            <span>${p.name}</span>
            <small>${p.price} Php × ${qty} <b>${peso(p.price * qty)}</b></small>
          </div>`).join('')
      : '<p class="hint">Not enough for any item yet.</p>';

    $('#total').textContent =
      `Total: ${peso(total)}` + (left > 0 ? `  ·  Change: ${peso(left)}` : '');
  }

  mount.querySelectorAll('.mode').forEach((btn) => {
    btn.onclick = () => {
      mode = btn.dataset.m;
      mount.querySelectorAll('.mode').forEach((b) => b.classList.toggle('on', b === btn));
      if ($('#amt').value) run();
    };
  });

  $('#go').onclick = run;

  $('#budget-add').onclick = () => {
    const selected = new Set([...mount.querySelectorAll('[data-budget-pick]:checked')].map((input) => input.dataset.budgetPick));
    const items = recommendations.filter(([option]) => selected.has(option.name)).map(([option, quantity]) => ({
      ...getBudgetCartDetails(option),
      quantity,
    }));
    if (items.some(({ product }) => !product)) {
      showToast('Some recommended items could not be added.');
      return;
    }
    if (!items.length) { showToast('Select at least one recommended item.'); return; }

    items.forEach(({ product, size, quantity }) => addToCart(product, size, quantity));
    showToast('Recommended item added to cart.');
  };

  $('#amt').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') run();
  });
}
