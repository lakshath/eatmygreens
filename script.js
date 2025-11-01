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

// Initialize button states
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        updateButtonState(button);
        
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
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

cartIcon.addEventListener('click', () => {
    cartPage.style.display = 'block';
    paymentPage.style.display = 'none';
    setTimeout(() => cartPage.scrollIntoView({ behavior: 'smooth' }), 100);
});

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

// ---------------- SMOOTH SCROLLING (FIXED - NO DUPLICATES) ----------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal # links
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            
            if (href === '#contact') {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offset = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }
            
            // Update URL without page reload
            history.pushState(null, null, href);
        }
        // For links like /blog/, ../page, etc - let them work normally
    });
});

// ---------------- ORDER NOW BUTTON ----------------
document.addEventListener("DOMContentLoaded", () => {
    const orderBtn = document.getElementById("orderNowBtn");
    const productsSection = document.getElementById("products");

    if (orderBtn && productsSection) {
        orderBtn.addEventListener("click", () => {
            productsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
});

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

// ---------------- MICROGREENS SECTION REVEAL ----------------
document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#microgreens-info");
    const cards = document.querySelectorAll("#microgreens-info .card");
    
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === section) {
                        entry.target.classList.add("section-visible");
                    }
                    
                    if (entry.target.classList.contains("card")) {
                        setTimeout(() => {
                            entry.target.style.opacity = "1";
                            entry.target.style.transform = "translateY(0)";
                            entry.target.classList.add("card-visible");
                        }, 100);
                    }
                }
            });
        },
        { 
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    if (section) observer.observe(section);
    cards.forEach(card => observer.observe(card));

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-8px) scale(1.02)";
        });
        
        card.addEventListener("mouseleave", () => {
            if (card.classList.contains("card-visible")) {
                card.style.transform = "translateY(0) scale(1)";
            }
        });
    });
});

// ---------------- FAQ ACCORDION ----------------
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.closest('.faq-item');
        faqItem.classList.toggle('active');
    });
});

// ---------------- PERFORMANCE OPTIMIZATIONS ----------------
function optimizeDOMOperations() {
    const reads = [];
    const elementsToMeasure = document.querySelectorAll('.product-card, .benefit-item, .card');
    
    elementsToMeasure.forEach(el => {
        reads.push({
            element: el,
            width: el.offsetWidth,
            height: el.offsetHeight
        });
    });
    
    requestAnimationFrame(() => {
        reads.forEach(({element, width}) => {
            if (width < 300) {
                element.classList.add('compact');
            }
        });
    });
}

function createScrollManager() {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function update() {
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = scrollY;
        
        requestAnimationFrame(() => {
            const header = document.querySelector('header');
            if (header && scrollY > 100 && direction === 'down') {
                header.style.transform = 'translateY(-100%)';
            } else if (header) {
                header.style.transform = 'translateY(0)';
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    });
}

function createResizeManager() {
    let resizeTimeout;
    
    function handleResize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--vh', `${windowHeight * 0.01}px`);
                
                if (windowWidth < 768) {
                    document.body.classList.add('mobile');
                } else {
                    document.body.classList.remove('mobile');
                }
            });
        }, 150);
    }
    
    window.addEventListener('resize', handleResize);
}

// ---------------- INITIALIZE ALL ----------------
function init() {
    initializeAddToCartButtons();
    updateCart();
    initSlider();
    optimizeDOMOperations();
    createScrollManager();
    createResizeManager();
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}