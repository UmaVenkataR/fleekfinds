// Handle form submission
document.getElementById('shipping-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if a saved address is selected
    const selectedSavedAddress = document.querySelector('input[name="saved-address"]:checked');
    let shippingDetails;

    if (selectedSavedAddress) {
        // Get saved address details
        const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
        const selectedIndex = parseInt(selectedSavedAddress.id.split('-')[1]);
        shippingDetails = savedAddresses[selectedIndex];
    } else {
        // Collect form data
        shippingDetails = {
            firstName: document.getElementById('firstname').value,
            lastName: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipcode: document.getElementById('zipcode').value,
            saveAddress: document.getElementById('save-address').checked
        };

        // Validate form fields if no saved address is selected
        if (!validateFormFields(shippingDetails)) {
            return;
        }

        // Save address if checkbox is checked
        if (shippingDetails.saveAddress) {
            const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
            savedAddresses.push(shippingDetails);
            localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
        }
    }

    // Save shipping details to sessionStorage
    sessionStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));

    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index <= 1) {
            step.classList.add('completed');
        } else if (index === 2) {
            step.classList.add('active');
        }
    });

    // Redirect to payment page
    window.location.href = 'payment.html';
});

document.querySelector('.add-address-btn').addEventListener('click', function() {
    // Clear all form fields
    document.getElementById('firstname').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('zipcode').value = '';
    document.getElementById('save-address').checked = false;
    
    // Remove any existing 'active' class from saved addresses
    document.querySelectorAll('[name="saved-address"]').forEach(radio => {
        radio.checked = false;
    });
});
// Handle coupon application
document.getElementById('apply-coupon').addEventListener('click', function() {
    const couponCode = document.getElementById('coupon-code').value.toUpperCase();
    const validCoupons = {
        'WELCOME10': 10,
        'SAVE20': 20
    };

    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        sessionStorage.setItem('appliedCoupon', JSON.stringify({
            code: couponCode,
            discount: discount
        }));
        updatePriceBreakdown();
        alert(`Coupon applied! ${discount}% discount added to your order.`);
    } else {
        alert('Invalid coupon code.');
    }
});

// Copy coupon code
document.querySelector('.copy-coupon').addEventListener('click', function() {
    const couponCode = this.parentElement.querySelector('.coupon-code').textContent;
    navigator.clipboard.writeText(couponCode);
    this.textContent = 'Copied!';
    setTimeout(() => this.textContent = 'Copy', 2000);
});

// Handle shipping method change
document.getElementById('shipping-method').addEventListener('change', function() {
    updatePriceBreakdown();
});

// Update price breakdown
function updatePriceBreakdown() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = parseFloat(document.getElementById('shipping-method').value);
    const appliedCoupon = JSON.parse(sessionStorage.getItem('appliedCoupon'));
    
    let discount = 0;
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
        // Update the discount display with the coupon code
        document.querySelector('.discount').textContent = `-$${discount.toFixed(2)} (${appliedCoupon.code})`;
    } else {
        document.querySelector('.discount').textContent = `-$${discount.toFixed(2)}`;
    }

    const tax = (subtotal - discount) * 0.1; // 10% tax
    const total = subtotal + shippingCost - discount + tax;

    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
}
// Back to cart button
document.querySelector('.back-to-cart').addEventListener('click', function() {
    window.location.href = 'cart.html';
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateOrderSummary();
    loadSavedAddresses();
    updatePriceBreakdown();
});

// Load saved addresses
function loadSavedAddresses() {
    const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
    const addressCards = document.querySelector('.address-cards');
    
    addressCards.innerHTML = savedAddresses.map((address, index) => `
        <div class="address-card">
            <input type="radio" name="saved-address" id="address-${index}">
            <label for="address-${index}">
                <strong>${address.firstName} ${address.lastName}</strong><br>
                ${address.address}<br>
                ${address.city}, ${address.state} ${address.zipcode}<br>
                ${address.phone}
            </label>
        </div>
    `).join('');
}

function validateFormFields(details) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipcode'];
    let isValid = true;

    requiredFields.forEach(field => {
        if (!details[field]) {
            isValid = false;
            document.getElementById(field.toLowerCase()).classList.add('error');
        } else {
            document.getElementById(field.toLowerCase()).classList.remove('error');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
    }

    return isValid;
}

// // Add event listener for saved address selection
// document.addEventListener('click', function(e) {
//     if (e.target.name === 'saved-address') {
//         // Clear form validation errors when selecting saved address
//         const formInputs = document.querySelectorAll('#shipping-form input[type="text"], #shipping-form input[type="email"], #shipping-form input[type="tel"]');
//         formInputs.forEach(input => input.classList.remove('error'));
//     }
// });

document.addEventListener('click', function(e) {
    if (e.target.name === 'saved-address') {
        const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
        const selectedIndex = parseInt(e.target.id.split('-')[1]);
        const selectedAddress = savedAddresses[selectedIndex];

        // Auto-fill form fields with selected address
        document.getElementById('firstname').value = selectedAddress.firstName;
        document.getElementById('lastname').value = selectedAddress.lastName;
        document.getElementById('email').value = selectedAddress.email;
        document.getElementById('phone').value = selectedAddress.phone;
        document.getElementById('address').value = selectedAddress.address;
        document.getElementById('city').value = selectedAddress.city;
        document.getElementById('state').value = selectedAddress.state;
        document.getElementById('zipcode').value = selectedAddress.zipcode;

        // Clear validation errors
        const formInputs = document.querySelectorAll('#shipping-form input[type="text"], #shipping-form input[type="email"], #shipping-form input[type="tel"]');
        formInputs.forEach(input => input.classList.remove('error'));
    }
});

function updateOrderSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.querySelector('.cart-items');
    
    if (cartItems.length === 0) {
        window.location.href = 'products.html';
        return;
    }

    cartContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-size">Size: ${item.size || 'N/A'}</p>
                <p class="item-color">Color: ${item.color || 'N/A'}</p>
                <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    // Add event listeners for quantity buttons and remove buttons
    attachCartEventListeners();
}

// Attach event listeners for cart interactions
function attachCartEventListeners() {
    // Quantity button listeners
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const change = this.classList.contains('plus') ? 1 : -1;
            updateQuantity(index, change);
        });
    });

    // Remove item listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeItem(index);
        });
    });
}

// Update quantity with validation
function updateQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems[index];
    
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
        item.quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateOrderSummary();
        updatePriceBreakdown();
    }
}

// Remove item with confirmation
function removeItem(index) {
    if (confirm('Are you sure you want to remove this item?')) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        if (cartItems.length === 0) {
            window.location.href = 'cart.html';
        } else {
            updateOrderSummary();
            updatePriceBreakdown();
        }
    }
}

// Update price breakdown with all components
function updatePriceBreakdown() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = parseFloat(document.getElementById('shipping-method').value) || 0;
    const appliedCoupon = JSON.parse(sessionStorage.getItem('appliedCoupon'));
    
    let discount = 0;
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
        document.querySelector('.discount').textContent = `-$${discount.toFixed(2)} (${appliedCoupon.code})`;
    } else {
        document.querySelector('.discount').textContent = `-$${discount.toFixed(2)}`;
    }

    const tax = (subtotal - discount) * 0.1; // 10% tax
    const total = subtotal + shippingCost - discount + tax;

    // Update all price elements
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;

    // Store total for payment page
    sessionStorage.setItem('orderTotal', total.toFixed(2));
}