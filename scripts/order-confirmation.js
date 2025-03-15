document.addEventListener('DOMContentLoaded', function() {
    // Get order details from session storage
    const lastOrder = JSON.parse(sessionStorage.getItem('lastOrder')) || {};
    const orderItems = lastOrder.items || [];
    const shippingDetails = JSON.parse(sessionStorage.getItem('shippingDetails')) || {};

    // Set order date
    const orderDate = new Date();
    document.getElementById('orderDate').textContent = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Set estimated delivery date (5 days from order)
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Set shipping address
    document.getElementById('shippingAddress').innerHTML = `
        ${shippingDetails.firstName || ''} ${shippingDetails.lastName || ''}<br>
        ${shippingDetails.address || ''}<br>
        ${shippingDetails.city || ''}, ${shippingDetails.state || ''} ${shippingDetails.zipcode || ''}<br>
        Phone: ${shippingDetails.phone || ''}
    `;

    // Display order items
    const orderItemsContainer = document.getElementById('orderItems');
    if (orderItemsContainer && Array.isArray(orderItems)) {
        orderItemsContainer.innerHTML = orderItems.map(item => `
            <div class="order-item">
                <img src="${item.image || ''}" alt="${item.name || ''}" class="item-image">
                <div class="item-details">
                    <h4>${item.name || ''}</h4>
                    <p>Size: ${item.size || 'N/A'} | Quantity: ${item.quantity || 0}</p>
                    <p class="item-price">$${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }

    // Calculate and display price breakdown
    // const subtotal = orderItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    // const shipping = 5.99;
    // const tax = subtotal * 0.1;
    // const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${(lastOrder.subtotal || 0).toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${(lastOrder.shipping || 5.99).toFixed(2)}`;
    document.getElementById('tax').textContent = `$${(lastOrder.tax || 0).toFixed(2)}`;
    document.getElementById('total').textContent = `$${(lastOrder.total || 0).toFixed(2)}`;
    document.getElementById('orderNumber').textContent = lastOrder.orderNumber || '#FF' + Date.now().toString().slice(-8);
    // Handle invoice download
    // Update the invoice generation section
    document.querySelector('.download-invoice').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const lastOrder = JSON.parse(sessionStorage.getItem('lastOrder')) || 
                         JSON.parse(localStorage.getItem('lastOrder')) || {};
    
        // Add invoice header
        doc.setFontSize(20);
        doc.text('FleekyFinds', 20, 20);
        doc.setFontSize(12);
        doc.text(`Invoice #${lastOrder.orderNumber || 'N/A'}`, 20, 30);
        doc.text(`Date: ${orderDate.toLocaleDateString()}`, 20, 40);
    
        // Add shipping details
        doc.text('Shipping Address:', 20, 60);
        doc.setFontSize(10);
        doc.text(`${shippingDetails.firstName} ${shippingDetails.lastName}`, 20, 70);
        doc.text(shippingDetails.address, 20, 75);
        doc.text(`${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zipcode}`, 20, 80);
    
        // Add items
        let y = 100;
        doc.setFontSize(12);
        doc.text('Order Items:', 20, y);
        y += 10;
    
        orderItems.forEach(item => {
            doc.text(`${item.name} (${item.size}) x${item.quantity}`, 20, y);
            doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, y);
            y += 8;
        });
    
        // Add totals using stored values
        y += 10;
        doc.line(20, y, 190, y);
        y += 10;
        doc.text(`Subtotal: $${lastOrder.subtotal.toFixed(2)}`, 130, y);
        doc.text(`Shipping: $${lastOrder.shipping.toFixed(2)}`, 130, y + 10);
        doc.text(`Tax: $${lastOrder.tax.toFixed(2)}`, 130, y + 20);
        doc.setFontSize(14);
        doc.text(`Total: $${lastOrder.total.toFixed(2)}`, 130, y + 35);
    
        // Save the PDF
        doc.save(`FleekyFinds-Invoice-${lastOrder.orderNumber || Date.now()}.pdf`);
    });
});