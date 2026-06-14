document.addEventListener('DOMContentLoaded', () => {
    // Manejo de cambio de estado
    document.querySelectorAll('.task-status-update').forEach(select => {
        select.addEventListener('change', async (e) => {
            const taskId = e.target.dataset.id;
            const newStatus = e.target.value;
            
            try {
                const response = await fetch(`/tasks/update-status/${taskId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                
                if (response.ok) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Modal de Nueva/Editar Tarea
    const modal = document.getElementById('taskModal');
    const btnNew = document.getElementById('btnNewTask');
    const spanClose = document.getElementsByClassName('close')[0];
    const taskForm = document.getElementById('taskForm');
    const modalTitle = document.getElementById('modalTitle');
    const btnSubmit = document.getElementById('btnSubmit');

    // Subtasks elements
    const subtasksSection = document.getElementById('subtasksSection');
    const subtaskList = document.getElementById('subtaskList');
    const btnAddSubtask = document.getElementById('btnAddSubtask');
    const inputNewSubtask = document.getElementById('newSubtaskTitle');

    // Inputs
    const inputTitle = document.getElementById('title');
    const inputDesc = document.getElementById('description');
    const inputPriority = document.getElementById('priority');
    const inputDate = document.getElementById('due_date');
    const inputCategory = document.getElementById('category_id');

    let currentEditingTaskId = null;

    // Abrir para Nueva Tarea
    if (btnNew) {
        btnNew.onclick = () => {
            currentEditingTaskId = null;
            modalTitle.innerText = 'Nueva Tarea';
            btnSubmit.innerText = 'Crear Tarea';
            taskForm.action = '/tasks';
            subtasksSection.style.display = 'none';
            taskForm.reset();
            modal.style.display = 'block';
        };
    }

    // Abrir para Editar Tarea
    document.querySelectorAll('.btn-edit-task').forEach(btn => {
        btn.onclick = async () => {
            currentEditingTaskId = btn.dataset.id;
            modalTitle.innerText = 'Editar Tarea';
            btnSubmit.innerText = 'Guardar Cambios';
            taskForm.action = `/tasks/update/${currentEditingTaskId}`;
            
            // Llenar campos
            inputTitle.value = btn.dataset.title;
            inputDesc.value = btn.dataset.desc === 'null' ? '' : btn.dataset.desc;
            inputPriority.value = btn.dataset.priority;
            inputDate.value = btn.dataset.date;
            inputCategory.value = btn.dataset.cat === 'null' ? '' : btn.dataset.cat;

            // Mostrar y cargar subtareas
            subtasksSection.style.display = 'block';
            loadSubtasks(currentEditingTaskId);

            modal.style.display = 'block';
        };
    });

    async function loadSubtasks(taskId) {
        subtaskList.innerHTML = '<p>Cargando subtareas...</p>';
        try {
            const res = await fetch(`/api/tasks/${taskId}/subtasks`);
            const subtasks = await res.json();
            renderSubtasks(subtasks);
        } catch (error) {
            console.error(error);
        }
    }

    function renderSubtasks(subtasks) {
        if (subtasks.length === 0) {
            subtaskList.innerHTML = '<p class="text-secondary">Sin subtareas.</p>';
            return;
        }
        subtaskList.innerHTML = subtasks.map(st => `
            <div class="subtask-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" ${st.completed ? 'checked' : ''} onchange="toggleSubtask(${st.id})">
                    <span style="${st.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${st.title}</span>
                </div>
                <button type="button" class="btn-icon" onclick="deleteSubtask(${st.id})" style="color: var(--color-error)">×</button>
            </div>
        `).join('');
    }

    if (btnAddSubtask) {
        btnAddSubtask.onclick = async () => {
            const title = inputNewSubtask.value.trim();
            if (!title || !currentEditingTaskId) return;

            try {
                const res = await fetch('/api/subtasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, task_id: currentEditingTaskId })
                });
                if (res.ok) {
                    inputNewSubtask.value = '';
                    loadSubtasks(currentEditingTaskId);
                }
            } catch (error) {
                console.log(error);
            }
        };
    }

    // Funciones globales para subtareas
    window.toggleSubtask = async (id) => {
        await fetch(`/api/subtasks/toggle/${id}`, { method: 'POST' });
        loadSubtasks(currentEditingTaskId);
    };

    window.deleteSubtask = async (id) => {
        if (confirm('¿Eliminar subtarea?')) {
            await fetch(`/api/subtasks/${id}`, { method: 'DELETE' });
            loadSubtasks(currentEditingTaskId);
        }
    };

    // Exportar Tareas a PDF (Estilizado)
    const btnExportTasks = document.getElementById('btnExportTasks');
    
    // Función auxiliar para convertir imagen a Base64 (Evita el aviso de XHR síncrono)
    function getBase64Image(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    if (btnExportTasks) {
        btnExportTasks.onclick = async () => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Cargar logo en Base64
                const logoBase64 = await getBase64Image('/img/favicon.png');
                
                // Dibujar encabezado
                doc.setFillColor(5, 7, 10); // Fondo oscuro premium
                doc.rect(0, 0, 210, 40, 'F');
                
                // Logo (Usando el Base64 ya cargado)
                doc.addImage(logoBase64, 'PNG', 20, 10, 20, 20);
                
                // Título
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(28);
                doc.setTextColor(255, 255, 255);
                doc.text('ORVIAN', 45, 25);
                
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('SUITE DE PRODUCTIVIDAD', 45, 32);

                // Información del reporte
                doc.setTextColor(60, 60, 60);
                doc.setFontSize(14);
                doc.text('REPORTE DE TAREAS PENDIENTES', 20, 55);
                
                doc.setFontSize(10);
                doc.text(`Fecha de emisión: ${new Date().toLocaleString()}`, 20, 62);
                doc.setDrawColor(59, 130, 246);
                doc.line(20, 65, 190, 65); // Línea decorativa azul

                // Datos de la tabla
                const rows = Array.from(document.querySelectorAll('.task-card')).map(card => [
                    card.querySelector('h3').innerText,
                    card.querySelector('p').innerText,
                    card.querySelector('.status-select').value,
                    card.querySelector('.task-meta span') ? card.querySelector('.task-meta span').innerText.trim() : 'Sin fecha'
                ]);

                doc.autoTable({
                    head: [['TÍTULO', 'DESCRIPCIÓN', 'ESTADO', 'VENCIMIENTO']],
                    body: rows,
                    startY: 75,
                    margin: { left: 20, right: 20 },
                    theme: 'striped',
                    headStyles: { 
                        fillColor: [59, 130, 246],
                        textColor: [255, 255, 255],
                        fontSize: 10,
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    styles: { 
                        fontSize: 9,
                        cellPadding: 6,
                        valign: 'middle'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250]
                    }
                });

                // Pie de página
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(`Página ${i} de ${pageCount} | Generado por Orvian Productivity App`, 105, 285, { align: 'center' });
                }

                doc.save('Reporte_Tareas_Orvian.pdf');
            } catch (error) {
                console.error('Error generando PDF:', error);
                alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
            }
        };
    }

    if (spanClose) {
        spanClose.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = 'none';
        };
    }
});
