const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');
const studentCourseController = require('../controllers/studentCourseController');

// 所有路由都需要学生身份验证
router.use(authenticate);
router.use(checkRole('student'));

// 课程相关路由
router.get('/courses', studentCourseController.getCourses);
router.get('/courses/:id', studentCourseController.getCourseDetail);
router.post('/progress', studentCourseController.updateProgress);

module.exports = router;
