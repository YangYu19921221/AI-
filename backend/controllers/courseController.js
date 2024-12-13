const { Course, Lesson, User, Enrollment } = require('../models');
const { Op } = require('sequelize');

// 创建新课程
exports.createCourse = async (req, res) => {
    try {
        const { title, description, level, category, coverImage } = req.body;
        const teacherId = req.user.id;

        const course = await Course.create({
            title,
            description,
            level,
            category,
            coverImage,
            teacherId
        });

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('创建课程失败:', error);
        res.status(500).json({
            success: false,
            error: '创建课程失败'
        });
    }
};

// 获取课程列表
exports.getCourses = async (req, res) => {
    try {
        const { page = 1, pageSize = 12, search, category, level } = req.query;
        const offset = (page - 1) * pageSize;
        
        // 构建查询条件
        const where = {};
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        if (category) {
            where.category = category;
        }
        if (level) {
            where.level = level;
        }

        // 查询课程总数
        const total = await Course.count({ where });

        // 查询分页数据
        const courses = await Course.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'username', 'avatar']
                }
            ],
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                list: courses,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total
                }
            }
        });
    } catch (error) {
        console.error('获取课程列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取课程列表失败'
        });
    }
};

// 获取课程详情
exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'username', 'avatar']
                },
                {
                    model: Lesson,
                    attributes: ['id', 'title', 'order', 'duration']
                }
            ]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: '课程不存在'
            });
        }

        // 如果是已登录用户，获取选课信息
        let enrollment = null;
        if (req.user) {
            enrollment = await Enrollment.findOne({
                where: {
                    courseId: id,
                    studentId: req.user.id
                }
            });
        }

        res.json({
            success: true,
            data: {
                ...course.toJSON(),
                enrolled: !!enrollment,
                progress: enrollment ? enrollment.progress : 0
            }
        });
    } catch (error) {
        console.error('获取课程详情失败:', error);
        res.status(500).json({
            success: false,
            error: '获取课程详情失败'
        });
    }
};

// 更新课程信息
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, level, category, coverImage } = req.body;
        const teacherId = req.user.id;

        const course = await Course.findOne({
            where: { id, teacherId }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: '课程不存在或无权限修改'
            });
        }

        await course.update({
            title,
            description,
            level,
            category,
            coverImage
        });

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('更新课程失败:', error);
        res.status(500).json({
            success: false,
            error: '更新课程失败'
        });
    }
};

// 删除课程
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;

        const course = await Course.findOne({
            where: { id, teacherId }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: '课程不存在或无权限删除'
            });
        }

        await course.destroy();

        res.json({
            success: true,
            message: '课程已删除'
        });
    } catch (error) {
        console.error('删除课程失败:', error);
        res.status(500).json({
            success: false,
            error: '删除课程失败'
        });
    }
};

// 选课
exports.enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // 检查课程是否存在
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: '课程不存在'
            });
        }

        // 检查是否已经选课
        const existingEnrollment = await Enrollment.findOne({
            where: {
                courseId,
                studentId
            }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                error: '已经选修此课程'
            });
        }

        // 创建选课记录
        const enrollment = await Enrollment.create({
            courseId,
            studentId
        });

        res.status(201).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        console.error('选课失败:', error);
        res.status(500).json({
            success: false,
            error: '选课失败'
        });
    }
};

// 更新学习进度
exports.updateProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { lessonId, completed } = req.body;
        const studentId = req.user.id;

        const enrollment = await Enrollment.findOne({
            where: {
                courseId,
                studentId
            }
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: '未选修此课程'
            });
        }

        // 更新完成的课时
        let completedLessons = enrollment.completedLessons || [];
        if (completed && !completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
        } else if (!completed) {
            completedLessons = completedLessons.filter(id => id !== lessonId);
        }

        // 计算总进度
        const totalLessons = await Lesson.count({ where: { courseId } });
        const progress = Math.round((completedLessons.length / totalLessons) * 100);

        await enrollment.update({
            completedLessons,
            progress,
            lastAccessedAt: new Date()
        });

        res.json({
            success: true,
            data: {
                progress,
                completedLessons
            }
        });
    } catch (error) {
        console.error('更新进度失败:', error);
        res.status(500).json({
            success: false,
            error: '更新进度失败'
        });
    }
};
