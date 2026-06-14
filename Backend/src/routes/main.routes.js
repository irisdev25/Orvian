const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const TaskController = require('../controllers/task.controller');
const AuthController = require('../controllers/auth.controller');
const CategoryController = require('../controllers/category.controller');
const upload = require('../middlewares/upload.middleware');

// Dashboard & Tasks
router.get('/dashboard', authMiddleware, TaskController.getDashboard);
router.get('/tasks', authMiddleware, TaskController.getTasks);
router.post('/tasks', authMiddleware, TaskController.createTask);
router.post('/tasks/update/:id', authMiddleware, TaskController.updateTask);
router.post('/tasks/update-status/:id', authMiddleware, TaskController.updateStatus);
router.get('/tasks/delete/:id', authMiddleware, TaskController.deleteTask);

// Kanban
router.get('/kanban', authMiddleware, TaskController.getKanban);

// Calendar
router.get('/calendar', authMiddleware, TaskController.getCalendar);

// Categories
router.get('/categories', authMiddleware, CategoryController.getCategories);
router.post('/categories', authMiddleware, CategoryController.createCategory);
router.get('/categories/delete/:id', authMiddleware, CategoryController.deleteCategory);

// Profile
router.get('/profile', authMiddleware, (req, res) => res.render('pages/profile', { title: 'Mi Perfil', page: 'profile', user: req.user }));
router.post('/profile/avatar', authMiddleware, upload.single('avatar'), AuthController.updateAvatar);

module.exports = router;
