document.addEventListener("DOMContentLoaded", () => {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.border = "3px solid #8b005d";
        });

        card.addEventListener("mouseleave", () => {
            card.style.border = "none";
        });
    });
});
// Animate statistics numbers
document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
});

function animateNumber(element) {
    const target = parseInt(element.textContent);
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps

    const update = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current) + '+';
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    };

    update();
}
