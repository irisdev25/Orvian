const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS con rutas al Frontend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Frontend/views'));
app.use(expressLayouts);
// CSP Middleware para permitir recursos externos
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; " +
        "img-src 'self' data: https://res.cloudinary.com; " +
        "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;"
    );
    next();
});

app.set('layout', 'layouts/main');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const mainRoutes = require('./src/routes/main.routes');
const apiRoutes = require('./src/routes/api.routes'); // Asegurarnos de importar la API

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/', mainRoutes);

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Condicional para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Orvian running at http://localhost:${PORT}`);
    });
}

// Exportar para Vercel
module.exports = app;
