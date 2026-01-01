document.addEventListener('DOMContentLoaded', () => {

    // Animações de Fade-in ao rolar a página
    const sections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null, // usa o viewport como área de observação
        rootMargin: '0px',
        threshold: 0.1 // aciona quando 10% do elemento está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: para de observar o elemento uma vez que ele já foi animado
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Adiciona sombra no cabeçalho ao rolar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

});
