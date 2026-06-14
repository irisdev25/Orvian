const db = require('../config/db');

class Task {
    static async create(data) {
        const { title, description, status, priority, due_date, user_id, category_id } = data;
        const query = `
            INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const { rows } = await db.query(query, [title, description, status, priority, due_date, user_id, category_id]);
        return rows[0];
    }

    static async findAllByUser(user_id, filters = {}) {
        let query = `
            SELECT t.*, c.name as category_name, c.color as category_color,
            (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id) as subtask_total,
            (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND completed = true) as subtask_completed
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = $1`;
        
        const params = [user_id];

        if (filters.status) {
            params.push(filters.status);
            query += ` AND t.status = $${params.length}`;
        }
        if (filters.search) {
            params.push(`%${filters.search}%`);
            query += ` AND t.title ILIKE $${params.length}`;
        }

        query += ' ORDER BY t.created_at DESC';
        const { rows } = await db.query(query, params);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT t.*, c.name as category_name, c.color as category_color,
            (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id) as subtask_total,
            (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND completed = true) as subtask_completed
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.id = $1`;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const fields = [];
        const params = [];
        let i = 1;

        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${i}`);
            params.push(value);
            i++;
        }

        params.push(id);
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
        const { rows } = await db.query(query, params);

        // Si la tarea se marcó como completada, sumamos puntos al usuario
        if (data.status === 'Completada') {
            await db.query('UPDATE users SET points = points + 50 WHERE id = $1', [rows[0].user_id]);
        }

        return rows[0];
    }

    static async delete(id) {
        await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        return true;
    }

    static async getStats(user_id) {
        const query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Completada' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status IN ('Pendiente', 'En progreso') OR status IS NULL THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN due_date < CURRENT_DATE AND (status IS NULL OR status != 'Completada') THEN 1 ELSE 0 END) as overdue
            FROM tasks
            WHERE user_id = $1
        `;
        const { rows } = await db.query(query, [user_id]);
        const stats = rows[0];
        return {
            total: parseInt(stats.total) || 0,
            completed: parseInt(stats.completed) || 0,
            pending: parseInt(stats.pending) || 0,
            overdue: parseInt(stats.overdue) || 0
        };
    }
}

module.exports = Task;
