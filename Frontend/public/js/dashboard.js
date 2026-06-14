document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando dashboard.js...');
    const statsDataElement = document.getElementById('statsData');
    
    if (!statsDataElement) {
        console.warn('No se encontró el elemento statsData');
        return;
    }

    let stats;
    try {
        stats = JSON.parse(statsDataElement.dataset.stats);
        console.log('Datos recibidos para gráficos:', stats);
    } catch (e) {
        console.error('Error parseando stats:', e);
        return;
    }

    const statusCounts = stats.statusCounts || {};
    const priorityCounts = stats.priorityCounts || {};

    // Gráfico de Estado
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        new Chart(statusCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Pendiente', 'En progreso', 'Completada', 'Cancelada'],
                datasets: [{
                    data: [
                        parseInt(statusCounts['Pendiente'] || 0),
                        parseInt(statusCounts['En progreso'] || 0),
                        parseInt(statusCounts['Completada'] || 0),
                        parseInt(statusCounts['Cancelada'] || 0)
                    ],
                    backgroundColor: ['#64748b', '#f59e0b', '#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { 
                    legend: { display: true, position: 'bottom', labels: { color: '#94A3B8' } } 
                }
            }
        });
    }

    // Gráfico de Prioridad
    const priorityCtx = document.getElementById('priorityChart');
    if (priorityCtx) {
        new Chart(priorityCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Baja', 'Media', 'Alta', 'Urgente'],
                datasets: [{
                    label: 'Tareas',
                    data: [
                        parseInt(priorityCounts['Baja'] || 0),
                        parseInt(priorityCounts['Media'] || 0),
                        parseInt(priorityCounts['Alta'] || 0),
                        parseInt(priorityCounts['Urgente'] || 0)
                    ],
                    backgroundColor: '#3b82f6',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94A3B8', stepSize: 1 } },
                    x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
});
