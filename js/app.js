document.getElementById('year').textContent = new Date().getFullYear();

function sendForm(e) {
    e.preventDefault();
    alert('¡Gracias! Me pondré en contacto contigo.');
    return false;
}

// Carousel autoplay + pause on hover
document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('techCarousel');
    if (el && window.bootstrap) {
        new bootstrap.Carousel(el, { interval: 4500, ride: 'carousel', pause: 'hover', touch: true, wrap: true });
    }
    // Ajustar offset dinámicamente
    function setNavHeightVar() {
        var nav = document.querySelector('.navbar');
        if (!nav) return;
        var h = nav.offsetHeight || 96;
        document.documentElement.style.setProperty('--nav-h', h + 'px');
    }
    setNavHeightVar();
    window.addEventListener('resize', setNavHeightVar);
});
