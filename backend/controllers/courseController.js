const { Course, Lesson, User, Enrollment } = require('../models');
const { Op } = require('sequelize');

// 创建测试数据
const createTestData = async () => {
    try {
        const coursesCount = await Course.count();
        if (coursesCount === 0) {
            const testCourses = [
                {
                    title: 'JavaScript基础教程',
                    description: '从零开始学习JavaScript编程语言',
                    level: 'beginner',
                    category: 'programming',
                    coverImage: 'https://via.placeholder.com/300x160?text=JavaScript',
                    teacherId: 1
                },
                {
                    title: 'React入门到精通',
                    description: '学习React框架开发现代Web应用',
                    level: 'intermediate',
                    category: 'programming',
                    coverImage: 'https://via.placeholder.com/300x160?text=React',
                    teacherId: 1
                },
                {
                    title: '高等数学基础',
                    description: '大学数学基础课程',
                    level: 'beginner',
                    category: 'math',
                    coverImage: 'https://via.placeholder.com/300x160?text=数学',
                    teacherId: 1
                },
                {
                    title: '物理学导论',
                    description: '基础物理学知识介绍',
                    level: 'beginner',
                    category: 'physics',
                    coverImage: 'https://via.placeholder.com/300x160?text=物理',
                    teacherId: 1
                }
            ];

            await Course.bulkCreate(testCourses);
            console.log('测试数据创建成功');
        }
    } catch (error) {
        console.error('创建测试数据失败:', error);
    }
};

// 初始化测试数据
createTestData();

// 创建新课程
exports.createCourse = async (req, res) => {
    try {
        console.log('接收到创建新课程请求:', req.body);
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

        console.log('创建课程成功:', course);

        const response = {
            success: true,
            data: course
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.status(201).json(response);
    } catch (error) {
        console.error('创建课程失败:', error);
        res.status(500).json({
            success: false,
            error: '创建课程失败',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// 获取课程列表
exports.getCourses = async (req, res) => {
    try {
        console.log('接收到获取课程列表请求:', req.query);
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

        console.log('查询条件:', where);

        // 查询课程总数
        const total = await Course.count({ where });
        console.log('课程总数:', total);

        // 查询分页数据
        const courses = await Course.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'name', 'username', 'email']
                }
            ],
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        console.log('查询到的课程数量:', courses.length);

        const response = {
            success: true,
            data: {
                list: courses,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total
                }
            }
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('获取课程列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取课程列表失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 获取课程详情
exports.getCourseById = async (req, res) => {
    try {
        console.log('接收到获取课程详情请求:', req.params);
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

        console.log('查询到的课程详情:', course);

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

        const response = {
            success: true,
            data: {
                ...course.toJSON(),
                enrolled: !!enrollment,
                progress: enrollment ? enrollment.progress : 0
            }
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('获取课程详情失败:', error);
        res.status(500).json({
            success: false,
            error: '获取课程详情失败',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// 更新课程信息
exports.updateCourse = async (req, res) => {
    try {
        console.log('接收到更新课程信息请求:', req.body);
        const { id } = req.params;
        const { title, description, level, category, coverImage } = req.body;
        const teacherId = req.user.id;

        const course = await Course.findOne({
            where: { id, teacherId }
        });

        console.log('查询到的课程信息:', course);

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

        console.log('更新课程信息成功:', course);

        const response = {
            success: true,
            data: course
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('更新课程失败:', error);
        res.status(500).json({
            success: false,
            error: '更新课程失败',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// 删除课程
exports.deleteCourse = async (req, res) => {
    try {
        console.log('接收到删除课程请求:', req.params);
        const { id } = req.params;
        const teacherId = req.user.id;

        const course = await Course.findOne({
            where: { id, teacherId }
        });

        console.log('查询到的课程信息:', course);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: '课程不存在或无权限删除'
            });
        }

        await course.destroy();

        console.log('删除课程成功');

        const response = {
            success: true,
            message: '课程已删除'
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('删除课程失败:', error);
        res.status(500).json({
            success: false,
            error: '删除课程失败',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// 选课
exports.enrollCourse = async (req, res) => {
    try {
        console.log('接收到选课请求:', req.params);
        const { courseId } = req.params;
        const studentId = req.user.id;

        // 检查课程是否存在
        const course = await Course.findByPk(courseId);
        console.log('查询到的课程信息:', course);

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

        console.log('检查选课信息:', existingEnrollment);

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

        console.log('创建选课记录成功:', enrollment);

        const response = {
            success: true,
            data: enrollment
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.status(201).json(response);
    } catch (error) {
        console.error('选课失败:', error);
        res.status(500).json({
            success: false,
            error: '选课失败',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// 更新学习进度
exports.updateProgress = async (req, res) => {
    try {
        console.log('接收到更新学习进度请求:', req.body);
        const { courseId } = req.params;
        const { lessonId, completed } = req.body;
        const studentId = req.user.id;

        const enrollment = await Enrollment.findOne({
            where: {
                courseId,
                studentId
            }
        });

        console.log('查询到的选课信息:', enrollment);

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

        console.log('更新学习进度成功:', enrollment);

        const response = {
            success: true,
            data: {
                progress,
                completedLessons
            }
        };

        console.log('返回数据:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('更新进度失败:', error);
        res.status(500).json({
            success: false,
            error: '更新进度失败',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
