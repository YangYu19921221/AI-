const { CourseReview, Course, User } = require('../models');
const { Op } = require('sequelize');

// 创建课程评论
exports.createReview = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { rating, comment } = req.body;
        const student_id = req.user.id;

        // 检查课程是否存在
        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: '课程不存在'
            });
        }

        // 检查是否已经评论过
        const existingReview = await CourseReview.findOne({
            where: {
                course_id,
                student_id
            }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: '您已经评论过这门课程'
            });
        }

        // 创建评论
        const review = await CourseReview.create({
            course_id,
            student_id,
            rating,
            comment,
            status: 'pending'  // 默认需要审核
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('创建评论失败:', error);
        res.status(500).json({
            success: false,
            message: '创建评论失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 获取课程评论列表
exports.getReviews = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { page = 1, page_size = 10, status = 'approved' } = req.query;

        const where = {
            course_id,
            status
        };

        // 管理员和教师可以看到所有状态的评论
        if (['admin', 'teacher'].includes(req.user?.role)) {
            delete where.status;
        }

        const { count, rows: reviews } = await CourseReview.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'name', 'username', 'avatar_url']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(page_size),
            offset: (page - 1) * page_size
        });

        // 计算课程平均评分
        const avgRating = await CourseReview.findOne({
            where: {
                course_id,
                status: 'approved'
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_reviews']
            ],
            raw: true
        });

        res.json({
            success: true,
            data: {
                reviews,
                average_rating: Number(avgRating.average_rating || 0).toFixed(1),
                total_reviews: avgRating.total_reviews,
                pagination: {
                    current: parseInt(page),
                    page_size: parseInt(page_size),
                    total: count
                }
            }
        });
    } catch (error) {
        console.error('获取评论列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取评论列表失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 更新评论状态（管理员功能）
exports.updateReviewStatus = async (req, res) => {
    try {
        const { review_id } = req.params;
        const { status } = req.body;

        const review = await CourseReview.findByPk(review_id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        await review.update({ status });

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('更新评论状态失败:', error);
        res.status(500).json({
            success: false,
            message: '更新评论状态失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 删除评论（学生只能删除自己的，管理员可以删除任何评论）
exports.deleteReview = async (req, res) => {
    try {
        const { review_id } = req.params;
        const user = req.user;

        const review = await CourseReview.findByPk(review_id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        // 检查权限
        if (user.role !== 'admin' && review.student_id !== user.id) {
            return res.status(403).json({
                success: false,
                message: '没有权限删除此评论'
            });
        }

        await review.destroy();

        res.json({
            success: true,
            message: '评论已删除'
        });
    } catch (error) {
        console.error('删除评论失败:', error);
        res.status(500).json({
            success: false,
            message: '删除评论失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};
