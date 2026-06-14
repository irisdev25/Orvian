document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.task-cards');
    const searchInput = document.getElementById('kanbanSearch');
    const prioritySelect = document.getElementById('kanbanPriority');

    // Función de filtrado
    const filterCards = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const priorityTerm = prioritySelect.value;

        cards.forEach(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            const priority = card.querySelector('.badge-priority').innerText;
            
            const matchesSearch = title.includes(searchTerm);
            const matchesPriority = priorityTerm === '' || priority === priorityTerm;

            if (matchesSearch && matchesPriority) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchInput) searchInput.addEventListener('input', filterCards);
    if (prioritySelect) prioritySelect.addEventListener('change', filterCards);

    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', async () => {
            card.classList.remove('dragging');
            
            // Obtener el nuevo estado y el ID
            const newStatus = card.parentElement.parentElement.dataset.status;
            const taskId = card.dataset.id;
            
            try {
                await fetch(`/tasks/update-status/${taskId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                console.log(`Tarea ${taskId} actualizada a ${newStatus}`);
            } catch (err) {
                console.error('Error al actualizar estado:', err);
            }
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector('.dragging');
            column.appendChild(draggingCard);
        });
    });
});
