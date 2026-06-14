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
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Frontend/public')));

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
