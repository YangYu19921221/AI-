const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticate, authorize } = require('../middleware/auth');

// 获取标签列表（公开）
router.get('/', tagController.getTags);

// 创建标签（管理员）
router.post('/',
    authenticate,
    authorize(['admin']),
    tagController.createTag
);

// 为课程添加标签（教师和管理员）
router.post('/courses/:course_id/tags',
    authenticate,
    authorize(['teacher', 'admin']),
    tagController.addTagsToCourse
);

// 从课程移除标签（教师和管理员）
router.delete('/courses/:course_id/tags',
    authenticate,
    authorize(['teacher', 'admin']),
    tagController.removeTagsFromCourse
);

module.exports = router;
