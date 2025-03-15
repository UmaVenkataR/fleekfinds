document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".hero-section");

    sections.forEach(section => {
        section.addEventListener("mouseenter", () => {
            section.style.boxShadow = "0px 15px 30px rgba(0, 0, 0, 0.3)";
        });

        section.addEventListener("mouseleave", () => {
            section.style.boxShadow = "none";
        });
    });

    const partnerCards = document.querySelectorAll('.partner-card');
    
    const pageMap = {
        'menswear': 'menwear.html',
        'womenswear': 'womenswear.html',
        'women-accessories': 'women-accessories.html',
        'men-accessories': 'men-accessories.html',
        'home-lifestyle': 'home-lifestyle.html'
    };
    
    partnerCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.id;
            const page = pageMap[category];
            if (page) {
                window.location.href = page;
            } else {
                console.error(`No page mapped for category: ${category}`);
            }
        });
    });
// Handle shop now button clicks
document.getElementById('elevate-shopping').addEventListener('click', function() {
    window.location.href = 'productdetails.html';
});

// Handle all other shop now buttons in the page
document.querySelectorAll('.shop-btn').forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'productdetails.html';
    });
});
});
