const db = require('../config/db');

class Category {
    static async create(data) {
        const { name, color, user_id } = data;
        const query = 'INSERT INTO categories (name, color, user_id) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await db.query(query, [name, color, user_id]);
        return rows[0];
    }

    static async findAllByUser(user_id) {
        const query = 'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC';
        const { rows } = await db.query(query, [user_id]);
        return rows;
    }

    static async update(id, data) {
        const { name, color } = data;
        const query = 'UPDATE categories SET name = $1, color = $2 WHERE id = $3 RETURNING *';
        const { rows } = await db.query(query, [name, color, id]);
        return rows[0];
    }

    static async delete(id) {
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        return true;
    }
}

module.exports = Category;
