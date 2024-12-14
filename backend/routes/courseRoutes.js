const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

// 公开路由 - 不需要认证
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);

// 学生路由 - 需要学生权限
router.post('/:id/enroll', 
    authenticate, 
    authorize(['student']), 
    courseController.enrollCourse
);

router.put('/:course_id/chapters/:chapter_id/progress',
    authenticate,
    authorize(['student']),
    courseController.updateProgress
);

// 教师路由 - 需要教师或管理员权限
router.post('/',
    authenticate,
    authorize(['teacher', 'admin']),
    courseController.createCourse
);

router.put('/:id',
    authenticate,
    authorize(['teacher', 'admin']),
    courseController.updateCourse
);

router.delete('/:id',
    authenticate,
    authorize(['teacher', 'admin']),
    courseController.deleteCourse
);

module.exports = router;
