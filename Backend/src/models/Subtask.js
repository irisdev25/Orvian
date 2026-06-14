const db = require('../config/db');

class Subtask {
    static async create(data) {
        const { title, task_id } = data;
        const query = 'INSERT INTO subtasks (title, task_id) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(query, [title, task_id]);
        return rows[0];
    }

    static async findByTask(task_id) {
        const query = 'SELECT * FROM subtasks WHERE task_id = $1 ORDER BY created_at ASC';
        const { rows } = await db.query(query, [task_id]);
        return rows;
    }

    static async toggle(id) {
        const query = 'UPDATE subtasks SET completed = NOT completed WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async delete(id) {
        await db.query('DELETE FROM subtasks WHERE id = $1', [id]);
        return true;
    }
}

module.exports = Subtask;
