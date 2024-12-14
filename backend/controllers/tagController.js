const { Tag, Course, CourseTag } = require('../models');
const { Op } = require('sequelize');

// 获取所有标签
exports.getTags = async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        
        if (category) {
            where.category = category;
        }

        const tags = await Tag.findAll({
            where,
            order: [['category', 'ASC'], ['name', 'ASC']]
        });

        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('获取标签列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取标签列表失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 创建标签
exports.createTag = async (req, res) => {
    try {
        const { name, category, description } = req.body;

        const tag = await Tag.create({
            name,
            category,
            description
        });

        res.status(201).json({
            success: true,
            data: tag
        });
    } catch (error) {
        console.error('创建标签失败:', error);
        res.status(500).json({
            success: false,
            message: '创建标签失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 为课程添加标签
exports.addTagsToCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { tag_ids } = req.body;

        // 检查标签是否存在
        const tags = await Tag.findAll({
            where: {
                id: {
                    [Op.in]: tag_ids
                }
            }
        });

        if (tags.length !== tag_ids.length) {
            return res.status(400).json({
                success: false,
                message: '部分标签不存在'
            });
        }

        // 添加标签关联
        const courseTags = tag_ids.map(tag_id => ({
            course_id,
            tag_id
        }));

        await CourseTag.bulkCreate(courseTags, {
            ignoreDuplicates: true
        });

        // 获取更新后的课程标签
        const updatedTags = await Tag.findAll({
            include: [{
                model: Course,
                as: 'courses',
                where: { id: course_id },
                through: { attributes: [] }
            }]
        });

        res.json({
            success: true,
            data: updatedTags
        });
    } catch (error) {
        console.error('添加课程标签失败:', error);
        res.status(500).json({
            success: false,
            message: '添加课程标签失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 从课程移除标签
exports.removeTagsFromCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { tag_ids } = req.body;

        await CourseTag.destroy({
            where: {
                course_id,
                tag_id: {
                    [Op.in]: tag_ids
                }
            }
        });

        res.json({
            success: true,
            message: '标签已移除'
        });
    } catch (error) {
        console.error('移除课程标签失败:', error);
        res.status(500).json({
            success: false,
            message: '移除课程标签失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};
