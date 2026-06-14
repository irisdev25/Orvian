const Task = require('../models/Task');
const Category = require('../models/Category');
const Subtask = require('../models/Subtask');

class TaskController {
    static async getDashboard(req, res) {
        try {
            const stats = await Task.getStats(req.user.id);
            const tasks = await Task.findAllByUser(req.user.id);
            const chartData = {
                status: {
                    pending: tasks.filter(t => t.status === 'Pendiente').length,
                    progress: tasks.filter(t => t.status === 'En progreso').length,
                    completed: tasks.filter(t => t.status === 'Completada').length,
                    cancelled: tasks.filter(t => t.status === 'Cancelada').length
                },
                priority: {
                    low: tasks.filter(t => t.priority === 'Baja').length,
                    medium: tasks.filter(t => t.priority === 'Media').length,
                    high: tasks.filter(t => t.priority === 'Alta').length,
                    urgent: tasks.filter(t => t.priority === 'Urgente').length
                }
            };
            res.render('pages/index', { title: 'Dashboard', page: 'dashboard', stats, chartData });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar dashboard');
        }
    }

    static async getTasks(req, res) {
        try {
            const { status, search } = req.query;
            const tasks = await Task.findAllByUser(req.user.id, { status, search });
            const categories = await Category.findAllByUser(req.user.id);
            res.render('pages/tasks', { title: 'Mis Tareas', page: 'tasks', tasks, categories, filters: { status, search } });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar tareas: ' + error.message);
        }
    }

    static async createTask(req, res) {
        try {
            const { title, description, priority, due_date, category_id } = req.body;
            await Task.create({
                title, description, priority, due_date: due_date || null,
                user_id: req.user.id, category_id: category_id || null
            });
            res.redirect('/tasks');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear tarea');
        }
    }

    static async updateTask(req, res) {
        try {
            const { id } = req.params;
            await Task.update(id, req.body);
            res.redirect('/tasks');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar tarea');
        }
    }

    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await Task.update(id, { status });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar status' });
        }
    }

    static async deleteTask(req, res) {
        try {
            await Task.delete(req.params.id);
            res.redirect('/tasks');
        } catch (error) {
            res.status(500).send('Error al eliminar');
        }
    }

    static async getCalendar(req, res) {
        try {
            const tasks = await Task.findAllByUser(req.user.id);
            const tasksWithDate = tasks.filter(t => t.due_date);
            res.render('pages/calendar', { title: 'Calendario', page: 'calendar', tasks: tasksWithDate });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar calendario');
        }
    }

    static async getAlerts(req, res) {
        try {
            const tasks = await Task.findAllByUser(req.user.id);
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);

            const alerts = tasks.filter(t => {
                if (!t.due_date || t.status === 'Completada') return false;
                const dueDate = new Date(t.due_date);
                return dueDate <= tomorrow;
            });
            res.json(alerts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener alertas' });
        }
    }

    // Subtasks
    static async getSubtasks(req, res) {
        try {
            const subtasks = await Subtask.findByTask(req.params.taskId);
            res.json(subtasks);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener subtareas' });
        }
    }

    static async createSubtask(req, res) {
        try {
            const { title, task_id } = req.body;
            const subtask = await Subtask.create({ title, task_id });
            res.json(subtask);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear subtarea' });
        }
    }

    static async toggleSubtask(req, res) {
        try {
            const subtask = await Subtask.toggle(req.params.id);
            res.json(subtask);
        } catch (error) {
            res.status(500).json({ error: 'Error al cambiar estado' });
        }
    }

    static async deleteSubtask(req, res) {
        try {
            await Subtask.delete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar' });
        }
    }

    static async getKanban(req, res) {
        try {
            const tasks = await Task.findAllByUser(req.user.id);
            res.render('pages/kanban', { title: 'Tablero Kanban', page: 'kanban', tasks });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar Kanban');
        }
    }
}

module.exports = TaskController;
