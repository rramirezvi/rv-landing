// =====================================================
// Ajuste preciso de viewport y navbar
// =====================================================
function setVHVar() {
    // 1% del alto real de la ventana
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function setNavHeightVar() {
    const nav = document.querySelector('.navbar');
    const h = nav ? nav.offsetHeight : 72;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
}

// Suaviza el scroll hacia una sección compensando la navbar
function smoothScrollTo(target, extraOffset) {
    const baseNavH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    // colchón adicional (móvil > desktop) para que el H2 jamás quede tapado
    const cushion = window.matchMedia('(max-width: 576px)').matches ? 32 : 16;
    const extra = (extraOffset || 0) + cushion;
    const y = target.getBoundingClientRect().top + window.scrollY - (baseNavH + extra);
    window.scrollTo({ top: y, behavior: 'smooth' });
}


// Marca activo en navbar según sección visible
// ===== Highlighter por scroll: oculta la línea en header/navbar/top =====
function setupSectionHighlighter() {
    const sections = Array.from(document.querySelectorAll('header[id], section[id]'));
    const links = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
    const linkMap = new Map(links.map(a => [a.getAttribute('href').trim(), a]));

    const clearActive = () => links.forEach(l => l.classList.remove('active'));

    function updateActive() {
        // altura real de navbar y línea de referencia justo debajo
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const probeY = navH + 24;

        // 1) Si estamos arriba del todo → sin línea
        if (window.scrollY < 10) { clearActive(); return; }

        // 2) Buscar sección bajo la línea de referencia
        let current = null;
        for (const sec of sections) {
            const r = sec.getBoundingClientRect();
            if (r.top <= probeY && r.bottom > probeY) { current = sec; break; }
        }

        // 3) Si no hay sección (o es el header) → sin línea
        if (!current || current.id === 'home') { clearActive(); return; }

        // 4) Activar el link correspondiente
        const link = linkMap.get('#' + current.id);
        if (!link) return;
        clearActive();
        link.classList.add('active');
    }

    // Actualiza al cargar, al hacer scroll y al redimensionar
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    window.addEventListener('orientationchange', updateActive);
}


// Cerrar menú colapsable y bloquear scroll del body mientras está abierto
function setupNavbarCollapseBehavior() {
    const navMain = document.getElementById('navMain');
    if (!navMain || !window.bootstrap) return;

    const bsCollapse = new bootstrap.Collapse(navMain, { toggle: false });

    navMain.addEventListener('show.bs.collapse', function () {
        document.body.style.overflow = 'hidden';
    });
    navMain.addEventListener('hidden.bs.collapse', function () {
        document.body.style.overflow = '';
        // Recalcula nav-h por si cambió altura al cerrar
        setNavHeightVar();
    });

    // al hacer click en un link de menú -> cierra si está abierto
    document.querySelectorAll('#navMain .nav-link').forEach(function (a) {
        a.addEventListener('click', function () {
            if (navMain.classList.contains('show')) {
                bsCollapse.hide();
            }
        });
    });
}

// Scroll suave para enlaces de la barra
// Scroll suave para enlaces de la barra (espera a que colapse el menú en móvil)
function setupAnchorLinks() {
    const navMain = document.getElementById('navMain');
    const hasBootstrap = !!window.bootstrap;

    document.querySelectorAll('a.section-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function (ev) {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return;

            ev.preventDefault();

            const doScroll = () => {
                // extra ya se suma dentro de smoothScrollTo; no hace falta pasar más
                smoothScrollTo(target, 0);
            };

            if (navMain && hasBootstrap && navMain.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navMain, { toggle: false });
                const once = () => {
                    navMain.removeEventListener('hidden.bs.collapse', once);
                    setTimeout(() => { setNavHeightVar(); doScroll(); }, 30);
                };
                navMain.addEventListener('hidden.bs.collapse', once);
                bsCollapse.hide();
            } else {
                doScroll();
            }
        });
    });
}

// ===== Quitar estado activo cuando se hace click en el logo =====
function setupLogoClick() {
    const logo = document.querySelector('.navbar-brand');
    if (!logo) return;

    logo.addEventListener('click', function (ev) {
        // elimina la clase active de todos los links
        document.querySelectorAll('.navbar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
    });
}



// =====================================================
// Inicio
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
    // Fija vh y nav-h
    setVHVar();
    setNavHeightVar();

    // Recalcular en resize/orientación/zoom UI
    window.addEventListener('resize', () => { setVHVar(); setNavHeightVar(); });
    window.addEventListener('orientationchange', () => { setVHVar(); setNavHeightVar(); });

    // Carrusel Bootstrap con opciones
    const el = document.getElementById('techCarousel');
    if (el && window.bootstrap) {
        new bootstrap.Carousel(el, {
            interval: 4500,
            ride: 'carousel',
            pause: 'hover',
            touch: true,
            wrap: true
        });
    }

    // Comportamiento navbar en móvil
    setupNavbarCollapseBehavior();

    // Scroll a secciones con offset
    setupAnchorLinks();

    // Activo dinámico según scroll
    setupSectionHighlighter();
    // Click en logo quita activo
    setupLogoClick();
    // >>> Activa dinamismo del Stack
    setupStackHover();
    // >>> Muestra/oculta botón "volver arriba"
    setupBackTop();

    // Año en footer
    const y = document.getElementById('year');
    if (y) { y.textContent = new Date().getFullYear(); }

    // Corrige posición si entras con #hash
    handleHashOnLoad();
});


// Si la página carga con #hash, corrige la posición con offset de navbar
function handleHashOnLoad() {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    setTimeout(() => { smoothScrollTo(target, 0); }, 80);
}

// Dinamismo del Stack: hover + tilt 3D
function setupStackHover() {
    // Selecciona las “tarjetas” del grid del stack y les agrega clase/efectos
    const tiles = document.querySelectorAll('#stack .row .col');
    if (!tiles.length) return;

    tiles.forEach(col => {
        col.classList.add('stack-anim');

        // Tilt solo en dispositivos con mouse
        const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!canTilt) return;

        const maxTilt = 8; // grados máximos
        const damp = 0.9;

        function onMove(e) {
            const rect = col.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const x = (e.clientX - cx) / (rect.width / 2);   // -1 .. 1
            const y = (e.clientY - cy) / (rect.height / 2);  // -1 .. 1
            const rx = (+y * maxTilt);
            const ry = (-x * maxTilt);
            col.style.transform =
                `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0) scale(${1 + Math.min(Math.hypot(x, y) * 0.03, 0.05)})`;
        }

        function onLeave() {
            col.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
        }

        col.addEventListener('mousemove', onMove, { passive: true });
        col.addEventListener('mouseleave', onLeave);
    });
}
// Mostrar/ocultar botón "volver arriba"
function setupBackTop() {
    const btn = document.getElementById('btnBackTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
