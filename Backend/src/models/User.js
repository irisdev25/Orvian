const db = require('../config/db');

class User {
    static async create(data) {
        const { name, email, password } = data;
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await db.query(query, [name, email, password]);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    }

    static async updateAvatar(id, avatarName) {
        return await db.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarName, id]);
    }

    static async update(id, data) {
        const { name, email, avatar } = data;
        const query = 'UPDATE users SET name = $1, email = $2, avatar = COALESCE($3, avatar) WHERE id = $4 RETURNING *';
        const { rows } = await db.query(query, [name, email, avatar, id]);
        return rows[0];
    }

    static async updatePassword(id, hashedPassword) {
        const query = 'UPDATE users SET password = $1 WHERE id = $2';
        await db.query(query, [hashedPassword, id]);
        return true;
    }
}

module.exports = User;
