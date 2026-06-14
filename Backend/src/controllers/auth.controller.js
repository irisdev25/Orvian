const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.render('pages/register', { error: 'El correo ya esta registrado', layout: false });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name, email, password: hashedPassword });

            res.redirect('/auth/login?registered=true');
        } catch (error) {
            console.error(error);
            res.render('pages/register', { error: 'Error al registrar usuario', layout: false });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.render('pages/login', { error: 'Credenciales invalidas', layout: false });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.render('pages/login', { error: 'Error al iniciar sesion', layout: false });
        }
    }

    static async logout(req, res) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }

    static async updateAvatar(req, res) {
        try {
            if (!req.file) {
                return res.redirect('/profile?error=No+se+selecciono+archivo');
            }

            const avatarName = req.file.filename;
            await User.updateAvatar(req.user.id, avatarName);
            
            res.redirect('/profile');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar avatar');
        }
    }
}

module.exports = AuthController;
