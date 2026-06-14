document.addEventListener('DOMContentLoaded', () => {
    console.log('Orvian cargado correctamente');
    
    // Gestión del Tema (Claro/Oscuro)
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const themeText = themeToggle ? themeToggle.querySelector('span') : null;

    // Sincronizar UI (el tema ya se aplica en el head)
    updateThemeUI(html.classList.contains('light-mode'));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = html.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeUI(isLight);
        });
    }

    function updateThemeUI(isLight) {
        if (!themeIcon || !themeText) return;
        if (isLight) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeText.innerText = 'Modo Claro';
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.innerText = 'Modo Oscuro';
        }
    }

    // Animaciones suaves para las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });

    // Gestión del Sidebar en Mobile
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileToggle && sidebar && sidebarOverlay) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
        
        // Cerrar al hacer clic en un link (opcional pero recomendado en SPAs)
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        });
    }
});
