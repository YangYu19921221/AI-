const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');

// 公开路由
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);

// 需要认证的路由
router.post('/', authenticate, courseController.createCourse);
router.put('/:id', authenticate, courseController.updateCourse);
router.delete('/:id', authenticate, courseController.deleteCourse);

module.exports = router;
