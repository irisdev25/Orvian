const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const TaskController = require('../controllers/task.controller');

// API/Alerts
router.get('/tasks/alerts', authMiddleware, TaskController.getAlerts);

// Subtasks API
router.get('/tasks/:taskId/subtasks', authMiddleware, TaskController.getSubtasks);
router.post('/subtasks', authMiddleware, TaskController.createSubtask);
router.post('/subtasks/toggle/:id', authMiddleware, TaskController.toggleSubtask);
router.delete('/subtasks/:id', authMiddleware, TaskController.deleteSubtask);

module.exports = router;
