document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('categoryModal');
    const btn = document.getElementById('btnNewCategory');
    const span = document.getElementsByClassName('close')[0];

    if (btn && modal) {
        btn.onclick = () => modal.style.display = 'block';
        span.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = 'none';
        };
    }
});
