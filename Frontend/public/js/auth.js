document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.querySelector('form');
    if (!authForm) return;

    authForm.addEventListener('submit', (e) => {
        const password = document.getElementById('password');
        const email = document.getElementById('email');

        if (password && password.value.length < 6) {
            e.preventDefault();
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (email && !email.value.includes('@')) {
            e.preventDefault();
            alert('Por favor, introduce un correo electrónico válido');
            return;
        }
    });

    console.log('Módulo de autenticación cargado');
});
