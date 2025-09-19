// ---------------- CART FUNCTIONALITY ----------------
let cart = [];
const cartIcon = document.getElementById('cartIcon');
const cartCountElement = document.querySelector('.cart-count');
const cartPage = document.getElementById('cartPage');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentPage = document.getElementById('paymentPage');
const orderSummaryItems = document.getElementById('orderSummaryItems');
const orderTotal = document.getElementById('orderTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const paymentOptions = document.querySelectorAll('.payment-option');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize button states
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        updateButtonState(button);
        
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            
            updateCart();
            showAddedNotification(name);
        });
    });
}

function updateButtonState(button) {
    const id = button.getAttribute('data-id');
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        button.textContent = '✓ Added';
        button.style.backgroundColor = '#2e7d32';
        button.style.cursor = 'default';
        button.disabled = true;
    } else {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '#4caf50';
        button.style.cursor = 'pointer';
        button.disabled = false;
    }
}

// Notification
function showAddedNotification(productName) {
    let notification = document.getElementById('cart-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: #4caf50; color: white;
            padding: 15px 20px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000; opacity: 0; transform: translateX(100px);
            transition: opacity 0.3s, transform 0.3s; max-width: 300px;
        `;
        document.body.appendChild(notification);
    }
    
    notification.innerHTML = `<div style="display:flex;gap:10px;align-items:center;">
        <span style="font-size:1.2em;">✓</span>
        <span>${productName} added to cart!</span>
    </div>`;
    
    notification.classList.remove('show');
    clearTimeout(notification.timeoutId);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    notification.timeoutId = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification && notification.style.opacity === '0') {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Update cart
function updateCart() {
    const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-details">
                    <div class="item-image">🌱</div>
                    <div><h4>${item.name}</h4><p>₹${item.price.toFixed(2)}</p></div>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <span class="remove-item" data-id="${item.id}">Remove</span>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        setupQuantityEventListeners();
    }
    
    const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    const deliveryFee = subtotal > 0 ? 30 : 0;
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartTotal.textContent = `₹${(subtotal + deliveryFee).toFixed(2)}`;
    
    updateAllButtonStates();
}

function setupQuantityEventListeners() {
    document.querySelectorAll('.decrease').forEach(btn =>
        btn.addEventListener('click', e => {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item.quantity > 1) item.quantity--;
            else cart = cart.filter(i => i.id !== id);
            updateCart();
        })
    );
    document.querySelectorAll('.increase').forEach(btn =>
        btn.addEventListener('click', e => {
            const id = e.target.dataset.id;
            cart.find(i => i.id === id).quantity++;
            updateCart();
        })
    );
    document.querySelectorAll('.remove-item').forEach(btn =>
        btn.addEventListener('click', e => {
            const id = e.target.dataset.id;
            cart = cart.filter(i => i.id !== id);
            updateCart();
        })
    );
}

function updateAllButtonStates() {
    document.querySelectorAll('.add-to-cart').forEach(updateButtonState);
}

// Cart navigation
cartIcon.addEventListener('click', () => {
    cartPage.style.display = 'block';
    paymentPage.style.display = 'none';
    setTimeout(() => cartPage.scrollIntoView({ behavior: 'smooth' }), 100);
});

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (!cart.length) return alert('Your cart is empty!');
    
    orderSummaryItems.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'summary-item';
        orderItem.innerHTML = `<span>${item.name} x${item.quantity}</span>
                               <span>₹${(item.price * item.quantity).toFixed(2)}</span>`;
        orderSummaryItems.appendChild(orderItem);
    });
    const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    orderTotal.textContent = `₹${(subtotal + 30).toFixed(2)}`;
    cartPage.style.display = 'none';
    paymentPage.style.display = 'block';
});

// Payment
paymentOptions.forEach(opt =>
    opt.addEventListener('click', () => {
        paymentOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
    })
);

placeOrderBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const method = document.querySelector('.payment-option.selected');
    
    if (!name || !address || !phone) return alert('Fill all details.');
    if (!method) return alert('Select payment method.');
    
    alert(`Order placed!\nPayment: ${method.dataset.method.toUpperCase()}`);
    cart = [];
    updateCart();
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '+91 ';
    paymentOptions.forEach(o => o.classList.remove('selected'));
    paymentPage.style.display = 'none';
});

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor =>
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#contact') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
            const el = document.querySelector(targetId);
            if (el) {
                const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }
        history.pushState(null, null, targetId);
    })
);

// Init
function init() {
    initializeAddToCartButtons();
    updateCart();
    initSlider();
}
init();

// ---------------- SLIDER FUNCTION ----------------
function initSlider() {
    const track = document.querySelector(".slider-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const cards = document.querySelectorAll(".benefit-item");
    const dotsContainer = document.querySelector(".slider-dots");
    if (!track || !cards.length) return;

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 25;
    let maxIndex = cards.length - 1;

    function updateCardWidth() {
        cardWidth = cards[0].offsetWidth + 25;
        const visible = Math.floor(track.parentElement.offsetWidth / cardWidth);
        maxIndex = Math.max(0, cards.length - visible);
    }

    function updateSlider() {
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        document.querySelectorAll(".slider-dot").forEach((dot, i) =>
            dot.classList.toggle("active", i === currentIndex)
        );
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === maxIndex;
    }

    // Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("div");
            dot.className = "slider-dot";
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { currentIndex++; updateSlider(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { currentIndex--; updateSlider(); });

    // Swipe
    let startX = 0;
    track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
    track.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) { currentIndex++; updateSlider(); }
        if (endX - startX > 50) { currentIndex--; updateSlider(); }
    });

    window.addEventListener("resize", () => { updateCardWidth(); updateSlider(); });

    updateCardWidth();
    updateSlider();
}
