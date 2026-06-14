const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }

        const points = user.points || 0;
        user.level = Math.floor(points / 500) + 1;
        user.levelProgress = (points % 500) / 5; // Porcentaje (0-100) para barra de progreso

        req.user = user;
        res.locals.user = user; // For EJS
        next();
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
};

module.exports = authMiddleware;
