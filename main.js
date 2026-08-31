/* =========================================
   LEGNOSUR - JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('.nav__link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Navbar Scroll Effect ---
    const nav = document.getElementById('nav');
    const announce = document.getElementById('announce');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const menuOpen = navMenu.classList.contains('active');

        if (currentScroll > lastScroll && currentScroll > 120 && !menuOpen) {
            nav.classList.add('nav--hidden');
            if (announce) announce.classList.add('announce--hidden');
        } else {
            nav.classList.remove('nav--hidden');
            if (announce) announce.classList.remove('announce--hidden');
        }
        lastScroll = currentScroll;
    });

});
