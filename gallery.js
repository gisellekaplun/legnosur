/* =========================================
   LEGNOSUR - Galerías de producto
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('[data-galeria]').forEach(galeria => {
        const slides = Array.from(galeria.querySelectorAll('.galeria__slide'));
        const thumbs = Array.from(galeria.querySelectorAll('.galeria__thumb'));
        const prev = galeria.querySelector('.galeria__nav--prev');
        const next = galeria.querySelector('.galeria__nav--next');

        if (slides.length < 2) return;

        let actual = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));

        const mostrar = (indice) => {
            actual = (indice + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === actual));
            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle('is-active', i === actual);
                thumb.setAttribute('aria-pressed', i === actual ? 'true' : 'false');
            });
        };

        if (prev) prev.addEventListener('click', () => mostrar(actual - 1));
        if (next) next.addEventListener('click', () => mostrar(actual + 1));
        thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => mostrar(i)));

        galeria.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                mostrar(actual - 1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                mostrar(actual + 1);
            }
        });
    });
});
