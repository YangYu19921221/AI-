const express = require('express');
const router = express.Router();
const courseReviewController = require('../controllers/courseReviewController');
const { authenticate, authorize } = require('../middleware/auth');

// 获取课程评论列表（公开）
router.get('/courses/:course_id/reviews', courseReviewController.getReviews);

// 创建课程评论（需要学生权限）
router.post('/courses/:course_id/reviews',
    authenticate,
    authorize(['student']),
    courseReviewController.createReview
);

// 删除评论（学生只能删除自己的，管理员可以删除任何评论）
router.delete('/reviews/:review_id',
    authenticate,
    authorize(['student', 'admin']),
    courseReviewController.deleteReview
);

// 更新评论状态（仅管理员）
router.put('/reviews/:review_id/status',
    authenticate,
    authorize(['admin']),
    courseReviewController.updateReviewStatus
);

module.exports = router;
