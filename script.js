// Cart functionality
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
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            showAddedNotification(name);
        });
    });
}

// Update button state based on cart
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

// Show added notification
function showAddedNotification(productName) {
    // Create or update notification
    let notification = document.getElementById('cart-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
    }
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2em;">✓</span>
            <span>${productName} added to cart!</span>
        </div>
    `;
    
    // Remove any existing classes and timeouts
    notification.classList.remove('show');
    clearTimeout(notification.timeoutId);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Hide after 3 seconds
    notification.timeoutId = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        
        // Completely remove after animation completes
        setTimeout(() => {
            if (notification && notification.style.opacity === '0') {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart items
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
                    <div>
                        <h4>${item.name}</h4>
                        <p>₹${item.price.toFixed(2)}</p>
                    </div>
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
        
        // Add event listeners to quantity buttons
        setupQuantityEventListeners();
    }
    
    // Update cart totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 30 : 0;
    const total = subtotal + deliveryFee;
    
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartTotal.textContent = `₹${total.toFixed(2)}`;
    
    // Update all add to cart buttons
    updateAllButtonStates();
}

// Setup quantity event listeners
function setupQuantityEventListeners() {
    // Decrease buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
            
            updateCart();
        });
    });
    
    // Increase buttons
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            updateCart();
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            updateCart();
        });
    });
}

// Update all add to cart buttons
function updateAllButtonStates() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        updateButtonState(button);
    });
}

// Cart icon click
cartIcon.addEventListener('click', () => {
    cartPage.style.display = 'block';
    paymentPage.style.display = 'none';
    setTimeout(() => {
        cartPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
});

// Checkout button click
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some microgreens first!');
        return;
    }
    
    // Update order summary
    orderSummaryItems.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'summary-item';
        orderItem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummaryItems.appendChild(orderItem);
    });
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 30;
    const total = subtotal + deliveryFee;
    
    orderTotal.textContent = `₹${total.toFixed(2)}`;
    
    // Show payment page
    cartPage.style.display = 'none';
    paymentPage.style.display = 'block';
});

// Payment option selection
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Place order button
placeOrderBtn.addEventListener('click', (e) => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const selectedPayment = document.querySelector('.payment-option.selected');
    
    if (!name || !address || !phone) {
        alert('Please fill in all delivery information.');
        return;
    }
    
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return;
    }
    
    const paymentMethod = selectedPayment.getAttribute('data-method');
    alert(`Order placed successfully!\n\nPayment Method: ${paymentMethod.toUpperCase()}\n\nThank you for your order, ${name}! Your microgreens will be delivered soon.`);
    
    // Reset cart
    cart = [];
    updateCart();
    
    // Reset form
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '+91 ';
    paymentOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Go back to products
    paymentPage.style.display = 'none';
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#contact') {
            // Scroll to footer for contact link
            const footer = document.querySelector('footer');
            if (footer) {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
        } else {
            // Normal section scrolling for other links
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Update URL hash
        history.pushState(null, null, targetId);
    });
});

// Initialize everything
function init() {
    initializeAddToCartButtons();
    updateCart();
    initSlider(); // Initialize the slider
}

// Start the application
init();

// Form validation with specific input restrictions
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');

// Add +91 prefix to phone input and make it non-removable
if (phoneInput) {
    phoneInput.value = '+91 ';
    let phonePrefixLength = 4; // Length of "+91 "

    // Prevent deletion of +91 prefix
    phoneInput.addEventListener('keydown', function(e) {
        const cursorPosition = e.target.selectionStart;
        
        // Prevent backspace and delete within the prefix area
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= phonePrefixLength) {
            e.preventDefault();
        }
        
        // Prevent cutting within prefix area
        if (e.key === 'x' && e.ctrlKey && cursorPosition <= phonePrefixLength) {
            e.preventDefault();
        }
    });

    // Allow only numbers after +91 prefix
    phoneInput.addEventListener('input', function(e) {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        
        // Ensure prefix is always present
        if (!value.startsWith('+91 ')) {
            e.target.value = '+91 ' + value.replace(/[^0-9]/g, '');
            return;
        }
        
        // Get the part after prefix
        const numbersPart = value.substring(phonePrefixLength);
        
        // Allow only numbers after prefix
        const cleanedNumbers = numbersPart.replace(/[^0-9]/g, '');
        
        // Update value keeping the prefix
        e.target.value = '+91 ' + cleanedNumbers;
        
        // Maintain cursor position
        const newCursorPosition = cursorPosition - (numbersPart.length - cleanedNumbers.length);
        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        
        validateInput(phoneInput);
    });
}

// Allow only letters and spaces in name field
if (nameInput) {
    nameInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        validateInput(nameInput);
    });
}

// Basic address validation (just required field check)
if (addressInput) {
    addressInput.addEventListener('input', function() {
        validateInput(addressInput);
    });
}

// Enhanced validation functions
function validateInput(input) {
    if (!input) return false;
    
    const value = input.value.trim();
    
    if (!value) {
        showError(input, 'This field is required');
        return false;
    }
    
    if (input.id === 'name') {
        if (value.length < 2) {
            showError(input, 'Name must be at least 2 characters');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(input, 'Name can only contain letters and spaces');
            return false;
        }
    }
    
    if (input.id === 'phone') {
        // Check only the numbers part (after +91 )
        const numbersOnly = value.substring(4).replace(/\D/g, '');
        if (numbersOnly.length !== 10) {
            showError(input, 'Phone number must be 10 digits after +91');
            return false;
        }
    }
    
    if (input.id === 'address') {
        if (value.length < 10) {
            showError(input, 'Please enter a complete address');
            return false;
        }
    }
    
    showSuccess(input);
    return true;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidation(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error', 'success');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Add CSS for validation styles
const style = document.createElement('style');
style.textContent = `
    .form-group.error input {
        border-color: #f44336 !important;
        background: rgba(244, 67, 54, 0.05) !important;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }
    
    .form-group.success input {
        border-color: #4caf50 !important;
        background: rgba(76, 175, 80, 0.05) !important;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
    }
    
    .error-message {
        color: #f44336;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        display: block;
        font-weight: 500;
    }
    
    /* Style for phone input with prefix */
    #phone {
        padding-left: 3.5rem !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 1rem center;
        background-size: 20px;
    }
    
    .phone-prefix {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        font-weight: 500;
        pointer-events: none;
    }
    
    /* Slider styles */
    .benefits-slider {
        position: relative;
        overflow: hidden;
        padding: 20px 0;
    }
    
    .slider-container {
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
    }
    
    .slider-container::-webkit-scrollbar {
        display: none;
    }
    
    .slider-track {
        display: flex;
        gap: 25px;
        transition: transform 0.3s ease;
    }
    
    .benefit-item {
        flex: 0 0 300px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .benefit-image {
        height: 200px;
        overflow: hidden;
    }
    
    .benefit-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .benefit-item:hover .benefit-image img {
        transform: scale(1.05);
    }
    
    .benefit-content {
        padding: 20px;
    }
    
    .benefit-content h3 {
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: #2e7d32;
    }
    
    .benefit-list {
        list-style: none;
    }
    
    .benefit-list li {
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .benefit-list li:last-child {
        border-bottom: none;
    }
    
    .slider-nav {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    
    .nav-btn {
        background: #2e7d32;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
    }
    
    .nav-btn:hover {
        background: #1b5e20;
    }
    
    .slider-dots {
        display: flex;
        gap: 10px;
    }
    
    .slider-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ccc;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .slider-dot.active {
        background: #2e7d32;
    }
`;
document.head.appendChild(style);

// Add phone prefix visual
if (phoneInput) {
    const phoneFormGroup = phoneInput.parentElement;
    if (!phoneFormGroup.querySelector('.phone-prefix')) {
        const prefixSpan = document.createElement('span');
        prefixSpan.className = 'phone-prefix';
        prefixSpan.textContent = '+91';
        phoneFormGroup.appendChild(prefixSpan);
    }
}

// Enhanced cancel functionality without page reload
if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
        // Create a custom confirmation modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px;">
                <h3 style="color: #2e7d32; margin-bottom: 1rem;">Cancel Order?</h3>
                <p style="color: #666; margin-bottom: 2rem;">Are you sure you want to cancel your order? Your cart will be cleared.</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="confirmCancel" style="background: #f44336; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer;">Yes, Cancel</button>
                    <button id="keepOrder" style="background: #4caf50; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer;">Keep Order</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle button clicks
        document.getElementById('confirmCancel').addEventListener('click', function() {
            // Reset everything
            cart = [];
            updateCart();
            document.getElementById('name').value = '';
            document.getElementById('address').value = '';
            document.getElementById('phone').value = '+91 ';
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Hide payment page
            paymentPage.style.display = 'none';
            
            // Remove modal
            document.body.removeChild(modal);
            
            // Show success message
            alert('Order cancelled successfully.');
        });
        
        document.getElementById('keepOrder').addEventListener('click', function() {
            // Just remove the modal
            document.body.removeChild(modal);
        });
    });
}

// Enhanced Order Now button with animation
document.addEventListener('DOMContentLoaded', function() {
    const orderNowButton = document.querySelector('.cta-button');
    
    if (orderNowButton) {
        orderNowButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            const productsSection = document.getElementById('products');
            
            if (productsSection) {
                const headerOffset = 80;
                const elementPosition = productsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Optional: Pulse animation on products section when reached
                setTimeout(() => {
                    productsSection.style.boxShadow = '0 0 0 4px rgba(76, 175, 80, 0.3)';
                    setTimeout(() => {
                        productsSection.style.boxShadow = 'none';
                    }, 1000);
                }, 800);
            }
        });
    }
});

// Initialize the slider functionality
function initSlider() {
    const track = document.querySelector(".slider-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const cards = document.querySelectorAll(".benefit-item");
    const dotsContainer = document.querySelector(".slider-dots");

    if (!track || !cards.length) {
        console.error("Slider elements not found!");
        return;
    }

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 25; // card + gap

    // Create dots for slider navigation
    if (dotsContainer) {
        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement("div");
            dot.className = "slider-dot";
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("data-index", i);
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCardWidth() {
        cardWidth = cards[0].offsetWidth + 25;
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update active dot
        document.querySelectorAll(".slider-dot").forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    // --- Button navigation ---
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    // --- Swipe support ---
    let startX = 0;
    let isDown = false;

    track.addEventListener("mousedown", e => {
        isDown = true;
        startX = e.pageX;
    });

    track.addEventListener("mouseup", () => isDown = false);
    track.addEventListener("mouseleave", () => isDown = false);

    track.addEventListener("mousemove", e => {
        if (!isDown) return;
        let moveX = e.pageX - startX;
        if (moveX < -50 && currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
            isDown = false;
        } else if (moveX > 50 && currentIndex > 0) {
            currentIndex--;
            updateSlider();
            isDown = false;
        }
    });

    // Touch devices
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50 && currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        } else if (endX - startX > 50 && currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Update cardWidth on resize
    window.addEventListener("resize", () => {
        updateCardWidth();
        updateSlider();
    });

    // Recalculate once images load
    window.addEventListener("load", () => {
        updateCardWidth();
        updateSlider();
    });
}












// Initialize the slider functionality
function initSlider() {
    const track = document.querySelector(".slider-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const cards = document.querySelectorAll(".benefit-item");
    const dotsContainer = document.querySelector(".slider-dots");
    const container = document.querySelector(".slider-container");

    if (!track || !cards.length || !container) {
        console.error("Slider elements not found!");
        return;
    }

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 25; // card + gap
    
    // Calculate how many cards are visible at once
    function calculateMaxIndex() {
        const containerWidth = container.offsetWidth;
        const cardsPerView = Math.floor(containerWidth / cardWidth);
        return Math.max(0, cards.length - cardsPerView);
    }
    
    let maxIndex = calculateMaxIndex();

    // Create dots for slider navigation
    if (dotsContainer) {
        dotsContainer.innerHTML = ''; // Clear existing dots
        const dotsCount = Math.min(cards.length, maxIndex + 1);
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement("div");
            dot.className = "slider-dot";
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("data-index", i);
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCardWidth() {
        cardWidth = cards[0].offsetWidth + 25;
        maxIndex = calculateMaxIndex();
    }

    function updateSlider() {
        // Prevent overscrolling
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update active dot
        document.querySelectorAll(".slider-dot").forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Update button states
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= maxIndex;
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        }
    }

    // --- Button navigation ---
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    // Update on resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCardWidth();
            updateSlider();
        }, 250); // Debounce resize events
    });

    // Initial setup
    updateCardWidth();
    updateSlider();
    
    // Hide navigation if all cards fit in view
    if (maxIndex <= 0) {
        const sliderNav = document.querySelector('.slider-nav');
        if (sliderNav) {
            sliderNav.style.display = 'none';
        }
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initSlider);












// Initialize the slider functionality
function initSlider() {
    const track = document.querySelector(".slider-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const cards = document.querySelectorAll(".benefit-item");
    const dotsContainer = document.querySelector(".slider-dots");

    if (!track || !cards.length) {
        console.error("Slider elements not found!");
        return;
    }

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 25; // card + gap
    let maxIndex = cards.length - 1;

    // Create dots for slider navigation
    if (dotsContainer) {
        dotsContainer.innerHTML = ''; // Clear existing dots
        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement("div");
            dot.className = "slider-dot";
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("data-index", i);
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCardWidth() {
        cardWidth = cards[0].offsetWidth + 25;
        // Recalculate maxIndex based on container width
        const containerWidth = track.parentElement.offsetWidth;
        const visibleCards = Math.floor(containerWidth / cardWidth);
        maxIndex = Math.max(0, cards.length - visibleCards);
    }

    function updateSlider() {
        // Prevent overscrolling
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update active dot
        document.querySelectorAll(".slider-dot").forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Update button states
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex === maxIndex;
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
        }
    }

    // --- Button navigation ---
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    // --- Swipe support ---
    let startX = 0;
    let isDown = false;

    track.addEventListener("mousedown", e => {
        isDown = true;
        startX = e.pageX;
        track.style.cursor = 'grabbing';
    });

    track.addEventListener("mouseup", () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener("mouseleave", () => {
        isDown = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener("mousemove", e => {
        if (!isDown) return;
        let moveX = e.pageX - startX;
        if (moveX < -50 && currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
            isDown = false;
        } else if (moveX > 50 && currentIndex > 0) {
            currentIndex--;
            updateSlider();
            isDown = false;
        }
    });

    // Touch devices
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50 && currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        } else if (endX - startX > 50 && currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Update on resize
    window.addEventListener("resize", () => {
        updateCardWidth();
        updateSlider();
    });

    // Initial setup
    updateCardWidth();
    updateSlider();
    
    // Make slider track focusable for keyboard navigation
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
}

// Add CSS for the slider
const sliderStyle = document.createElement('style');
sliderStyle.textContent = `
    .benefits-slider {
        position: relative;
        overflow: hidden;
        padding: 20px 0;
    }
    
    .slider-container {
        overflow: hidden;
    }
    
    .slider-track {
        display: flex;
        gap: 25px;
        transition: transform 0.3s ease;
        cursor: grab;
    }
    
    .slider-track:active {
        cursor: grabbing;
    }
    
    .benefit-item {
        flex: 0 0 300px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .benefit-image {
        height: 200px;
        overflow: hidden;
    }
    
    .benefit-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .benefit-item:hover .benefit-image img {
        transform: scale(1.05);
    }
    
    .benefit-content {
        padding: 20px;
    }
    
    .benefit-content h3 {
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: #2e7d32;
    }
    
    .benefit-list {
        list-style: none;
    }
    
    .benefit-list li {
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .benefit-list li:last-child {
        border-bottom: none;
    }
    
    .slider-nav {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    
    .nav-btn {
        background: #2e7d32;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    
    .nav-btn:hover:not(:disabled) {
        background: #1b5e20;
    }
    
    .nav-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
    
    .slider-dots {
        display: flex;
        gap: 10px;
    }
    
    .slider-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ccc;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .slider-dot.active {
        background: #2e7d32;
    }
    
    @media (max-width: 768px) {
        .benefit-item {
            flex: 0 0 280px;
        }
    }
`;
document.head.appendChild(sliderStyle);

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initSlider);







// Remove duplicate rupee symbols
document.addEventListener('DOMContentLoaded', function() {
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(element => {
        element.textContent = element.textContent.replace('₹₹', '₹');
    });
});







// WhatsApp order functionality - FIXED
document.addEventListener("DOMContentLoaded", function() {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    
    placeOrderBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        // DEBUG: Check if form values exist
        console.log("Name value:", document.getElementById("name").value);
        console.log("Address value:", document.getElementById("address").value);
        console.log("Phone value:", document.getElementById("phone").value);
        
        // Get form values directly
        const name = document.getElementById("name").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;
        
        // Get payment method
        const selectedPayment = document.querySelector(".payment-option.selected");
        const paymentMethod = selectedPayment ? selectedPayment.getAttribute("data-method") : "Not Selected";
        
        // Get order items
        const orderItems = [];
        document.querySelectorAll("#orderSummaryItems .summary-item").forEach(item => {
            orderItems.push(item.textContent.trim());
        });
        
        // Get total
        const total = document.getElementById("orderTotal").textContent;
        
        // Build WhatsApp message
        const message = 
            `📦 *New Order Received!*\n\n` +
            `👤 Name: ${name}\n` +
            `📍 Address: ${address}\n` +
            `📞 Phone: ${phone}\n` +
            `💳 Payment: ${paymentMethod}\n\n` +
            `🛒 *Order Items:*\n${orderItems.join('\n')}\n\n` +
            `💰 Total: ${total}`;
        
        console.log("Final message:", message);
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/917483069438?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    });
});