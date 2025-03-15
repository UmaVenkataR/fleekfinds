document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelector('.testimonials');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function updateSlider() {
        const cardWidth = document.querySelector('.testimonial-card').offsetWidth + 32; // width + margin
        testimonials.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = document.querySelectorAll('.testimonial-card').length - 1;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
        const maxIndex = document.querySelectorAll('.testimonial-card').length - 1;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }, 5000);
});