document.addEventListener('DOMContentLoaded', () => {
    const notifBell = document.getElementById('notifBell');
    const notifDropdown = document.getElementById('notifDropdown');
    const notifCount = document.getElementById('notifCount');
    const notifList = document.getElementById('notifList');

    // Toggle dropdown
    if (notifBell) {
        notifBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', () => {
            notifDropdown.classList.remove('show');
        });
    }

    // Solicitar permiso para notificaciones de escritorio
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    async function checkAlerts() {
        try {
            const response = await fetch('/api/tasks/alerts');
            const alerts = await response.json();

            if (alerts.length > 0) {
                notifCount.innerText = alerts.length;
                notifCount.style.display = 'flex';
                
                notifList.innerHTML = alerts.map(task => `
                    <div class="notif-item">
                        <p><strong>⚠️ Tarea Próxima:</strong> ${task.title}</p>
                        <small style="color: var(--color-error)">Vence el: ${new Date(task.due_date).toLocaleDateString()}</small>
                    </div>
                `).join('');

                // Notificación de escritorio (Solo para las que no hemos mostrado antes en esta sesión)
                if (Notification.permission === 'granted') {
                    const notifiedTasks = JSON.parse(sessionStorage.getItem('notifiedTasks') || '[]');
                    
                    alerts.forEach(task => {
                        if (!notifiedTasks.includes(task.id)) {
                            new Notification('Orvian: Tarea próxima a vencer', {
                                body: `La tarea "${task.title}" vence pronto. ¡No la olvides!`,
                                icon: '/img/favicon.png'
                            });
                            notifiedTasks.push(task.id);
                        }
                    });
                    
                    sessionStorage.setItem('notifiedTasks', JSON.stringify(notifiedTasks));
                }
            } else {
                notifCount.style.display = 'none';
                notifList.innerHTML = '<p class="text-secondary">No tienes alertas pendientes.</p>';
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    }

    // Comprobar alertas al cargar y cada 5 minutos
    checkAlerts();
    setInterval(checkAlerts, 300000); 
});
