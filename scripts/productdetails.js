// Image Gallery
let zoomActive = false;

function changeImage(element) {
    const featured = document.getElementById('featured');
    featured.src = element.src;
    
    document.querySelectorAll('.thumbnails img').forEach(img => {
        img.classList.remove('active');
    });
    element.classList.add('active');
}

// Image Zoom
const featuredImage = document.querySelector('.featured-image');
const zoomLens = document.querySelector('.image-zoom-lens');
const featured = document.getElementById('featured');

featuredImage.addEventListener('mouseenter', function() {
    zoomLens.style.display = 'block';
    zoomActive = true;
});

featuredImage.addEventListener('mouseleave', function() {
    zoomLens.style.display = 'none';
    zoomActive = false;
});

featuredImage.addEventListener('mousemove', function(e) {
    if (!zoomActive) return;
    
    const rect = featuredImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    zoomLens.style.left = `${x - zoomLens.offsetWidth/2}px`;
    zoomLens.style.top = `${y - zoomLens.offsetHeight/2}px`;
    
    featured.style.transform = `scale(1.5) translate(${-x/3}px, ${-y/3}px)`;
});

// Quantity Controls
function incrementQuantity() {
    const input = document.getElementById('quantity');
    const max = parseInt(input.getAttribute('max'));
    const currentValue = parseInt(input.value);
    if (currentValue < max) {
        input.value = currentValue + 1;
    }
}

function decrementQuantity() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// Color Selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Size Selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Wishlist Toggle
document.querySelector('.wishlist-btn').addEventListener('click', function() {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
        this.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('Added to Wishlist!');
        
        // Save to wishlist
        const productId = this.dataset.productId;
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    } else {
        this.innerHTML = '<i class="far fa-heart"></i>';
        showToast('Removed from Wishlist');
        
        // Remove from wishlist
        const productId = this.dataset.productId;
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const index = wishlist.indexOf(productId);
        if (index > -1) {
            wishlist.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }
});

// Add to Cart functionality
document.querySelector('.add-to-cart').addEventListener('click', function() {
    const product = {
        id: this.dataset.productId,
        name: document.querySelector('.product-title').textContent,
        price: parseFloat(document.querySelector('.discounted-price').textContent.replace('$', '')),
        color: document.querySelector('.color-btn.active').dataset.color,
        size: document.querySelector('.size-btn.active').textContent,
        quantity: parseInt(document.getElementById('quantity').value),
        image: document.getElementById('featured').src
    };

    // Add to cart storage
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cart.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.size === product.size
    );

    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
    showToast('Added to Cart Successfully!');
    updateCartCount();
});

// Buy Now functionality
document.querySelector('.buy-now').addEventListener('click', function() {
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.click();
    window.location.href = 'checkout.html';
});

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Toast notification function
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if product is in wishlist
    const productId = document.querySelector('.wishlist-btn').dataset.productId;
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(productId)) {
        document.querySelector('.wishlist-btn').classList.add('active');
        document.querySelector('.wishlist-btn').innerHTML = '<i class="fas fa-heart"></i>';
    }

    // Update cart count
    updateCartCount();

    // Load related products
    loadRelatedProducts();
});

// Load related products
function loadRelatedProducts() {
    // Add your related products loading logic here
    const slider = document.querySelector('.products-slider');
    // Example: Fetch related products and append to slider
}