const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

// 学生路由 - 需要学生权限
router.get('/student/courses', 
    authenticate, 
    authorize(['student']), 
    courseController.getStudentCourses
);

// 其他学生路由
router.post('/student/courses/:id/enroll', 
    authenticate, 
    authorize(['student']), 
    courseController.enrollCourse
);

router.put('/student/courses/:course_id/chapters/:chapter_id/progress',
    authenticate,
    authorize(['student']),
    courseController.updateProgress
);

// 公开路由 - 不需要认证
router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);

module.exports = router;
