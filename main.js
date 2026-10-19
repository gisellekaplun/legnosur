/* =========================================
   LEGNOSUR - JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const nav = document.getElementById('nav');
    const announce = document.getElementById('announce');

    // --- Menu mobile ---
    const setMenu = (open) => {
        navToggle.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => {
        setMenu(!navMenu.classList.contains('active'));
    });

    navMenu.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    // --- Desplegable "Productos" (clic + teclado) ---
    const dropItem = document.querySelector('.nav__item--dropdown');
    const dropToggle = document.getElementById('prodToggle');

    const setDrop = (open) => {
        if (!dropItem || !dropToggle) return;
        dropItem.classList.toggle('is-open', open);
        dropToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    if (dropToggle) {
        dropToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setDrop(!dropItem.classList.contains('is-open'));
        });
    }

    // Cerrar al hacer clic afuera
    document.addEventListener('click', (e) => {
        if (dropItem && dropItem.classList.contains('is-open') && !dropItem.contains(e.target)) {
            setDrop(false);
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setDrop(false);
            setMenu(false);
        }
    });

    // --- Ocultar nav/banner al scrollear hacia abajo ---
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const menuOpen = navMenu.classList.contains('active');
        const dropOpen = dropItem && dropItem.classList.contains('is-open');

        if (currentScroll > lastScroll && currentScroll > 120 && !menuOpen && !dropOpen) {
            nav.classList.add('nav--hidden');
            if (announce) announce.classList.add('announce--hidden');
        } else {
            nav.classList.remove('nav--hidden');
            if (announce) announce.classList.remove('announce--hidden');
        }
        lastScroll = currentScroll;
    });

});
