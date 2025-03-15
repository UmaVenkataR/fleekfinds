// Handle card number formatting
document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value;
    
    // Update card preview
    document.querySelector('.card-number').textContent = value || '•••• •••• •••• ••••';
});

// Handle expiry date formatting
document.getElementById('expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0,2) + '/' + value.slice(2);
    }
    e.target.value = value;
    
    // Update card preview
    document.querySelector('.card-expiry').textContent = value || 'MM/YY';
});

// Handle card holder name
document.getElementById('card-holder').addEventListener('input', function(e) {
    document.querySelector('.card-holder').textContent = e.target.value.toUpperCase() || 'CARD HOLDER';
});

// Handle payment method selection
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Show/hide card form based on selection
        const cardForm = document.querySelector('.card-form');
        if (this.querySelector('#card').checked) {
            cardForm.classList.add('active-form');
        } else {
            cardForm.classList.remove('active-form');
        }
    });
});

// Handle payment form submission
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate payment processing
    const payBtn = document.querySelector('.pay-btn');
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';
    
    setTimeout(() => {
        alert('Payment successful! Thank you for your purchase.');
        // Clear cart and redirect to order confirmation
        localStorage.removeItem('cartItems');
        window.location.href = 'order-confirmation.html';
    }, 2000);
});

// Initialize order summary
function initializePaymentPage() {
    const shippingDetails = JSON.parse(sessionStorage.getItem('shippingDetails')) || {};
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    let subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    document.querySelector('.pay-btn').textContent = `Pay $${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        setupPaymentMethods();
        setupCardPreview();
        loadOrderSummary();
        initializePaymentPage();
    } catch (error) {
        console.error('Error initializing payment page:', error);
    }
});

// Load order summary from session storage
function loadOrderSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const summaryItems = document.querySelector('.summary-items');
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    // Store current order totals
    sessionStorage.setItem('orderSummary', JSON.stringify({
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
    }));

    // Display cart items in summary
    if (summaryItems) {
        summaryItems.innerHTML = cartItems.map(item => `
            <div class="summary-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-details">Size: ${item.size} | Qty: ${item.quantity}</span>
                </div>
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        // Update summary totals
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        // Update pay button amount
        const payBtn = document.querySelector('.pay-btn');
        if (payBtn) {
            payBtn.innerHTML = `<i class="fas fa-lock"></i> Pay $${total.toFixed(2)}`;
        }
    }
}

// Setup card preview and live updates
function setupCardPreview() {
    const cardNumber = document.getElementById('card-number');
    const cardHolder = document.getElementById('card-holder');
    const expiry = document.getElementById('expiry');

    // Format card number
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
        document.getElementById('preview-number').textContent = formattedValue || '•••• •••• •••• ••••';
    });

    // Update card holder name
    cardHolder.addEventListener('input', function(e) {
        document.getElementById('preview-name').textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });

    // Format expiry date
    expiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
        document.getElementById('preview-expiry').textContent = value || 'MM/YY';
    });
}

// Handle payment method switching
// Handle payment method switching
function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentForms = document.querySelectorAll('.payment-form');

    if (!paymentOptions.length || !paymentForms.length) {
        console.warn('Payment options or forms not found');
        return;
    }

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            try {
                // Update radio button state
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                }

                // Update active states for options
                paymentOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                // Show/hide payment forms
                const formId = radio ? radio.id + '-form' : null;
                paymentForms.forEach(form => {
                    if (form.id === formId) {
                        form.style.display = 'block';
                        form.classList.add('active-form');
                    } else {
                        form.style.display = 'none';
                        form.classList.remove('active-form');
                    }
                });

                // Special handling for card form
                const cardForm = document.getElementById('card-form');
                if (cardForm) {
                    if (radio && radio.id === 'card') {
                        cardForm.classList.add('active-form');
                    } else {
                        cardForm.classList.remove('active-form');
                    }
                }
            } catch (error) {
                console.error('Error in payment method setup:', error);
            }
        });
    });

    // Set default payment method
    const defaultPayment = paymentOptions[0];
    if (defaultPayment) {
        defaultPayment.click();
    }
}

// Add this CSS to ensure proper form display

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const payBtn = this.querySelector('.pay-btn');
    const originalText = payBtn.innerHTML;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        // Clear cart and order data
        localStorage.removeItem('cartItems');
        sessionStorage.removeItem('orderTotal');
        sessionStorage.removeItem('appliedCoupon');

        // Show success message and redirect
        showSuccessMessage();
    }, 2000);
});

// Success message and redirect
// Update the payment success handler to store order details
function showSuccessMessage() {
    // Store last order details before clearing cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const orderTotal = sessionStorage.getItem('orderTotal');
    
    // Store order details for confirmation page
    sessionStorage.setItem('lastOrder', JSON.stringify({
        items: cartItems,
        total: orderTotal,
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toISOString(),
        subtotal: calculateSubtotal(cartItems),
        shipping: 5.99,
        tax: calculateTax(cartItems)
    }));

    // Show success modal and redirect
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>
            <p>Order confirmation has been sent to your email.</p>
            <button onclick="window.location.href='order-confirmation.html'">View Order</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 2000);
}
// Update the payment success handler
// Update the payment success handler
function showSuccessMessage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const orderSummary = JSON.parse(sessionStorage.getItem('orderSummary')) || {};

    const orderDetails = {
        items: cartItems,
        orderNumber: 'FF' + Date.now().toString().slice(-8),
        orderDate: new Date().toISOString(),
        subtotal: orderSummary.subtotal || 0,
        shipping: orderSummary.shipping || 5.99,
        tax: orderSummary.tax || 0,
        total: orderSummary.total || 0
    };

    // Save complete order details
    sessionStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

    // Show success modal
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>
            <button onclick="window.location.href='order-confirmation.html'">View Order</button>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 2000);
}
// Helper functions for calculations
function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTax(items) {
    return calculateSubtotal(items) * 0.1; // 10% tax
}

function generateOrderNumber() {
    return 'FF' + Date.now().toString().slice(-8);
}

// Initialize tooltips
document.querySelectorAll('[title]').forEach(element => {
    element.addEventListener('mouseover', function(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('title');
        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';

        this.addEventListener('mouseleave', () => tooltip.remove());
    });
});