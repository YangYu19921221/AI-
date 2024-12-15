const { Course, User, Chapter, Progress, Tag, CourseReview } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;

// 获取课程列表
const getCourses = async (req, res) => {
    try {
        const { search, category, level, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        
        const where = {};
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (category && category !== 'all') {
            where.category = category;
        }
        if (level && level !== 'all') {
            where.level = level;
        }

        const { count, rows } = await Course.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'fullName', 'avatar']
                }
            ],
            limit: parseInt(pageSize),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                list: rows,
                total: count,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(count / pageSize)
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
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId, {
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'fullName', 'avatar']
                },
                {
                    model: Chapter,
                    include: [
                        {
                            model: Progress,
                            where: { userId: req.user?.id },
                            required: false
                        }
                    ]
                }
            ]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: '课程不存在'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('获取课程详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取课程详情失败'
        });
    }
};

// 创建新课程
const createCourse = async (req, res) => {
    try {
        console.log('接收到创建新课程请求:', req.body);
        const { title, description, level, category, cover_image } = req.body;
        
        // 验证用户是否为教师或管理员
        if (!['teacher', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: '只有教师或管理员可以创建课程'
            });
        }

        const course = await Course.create({
            title,
            description,
            level,
            category,
            cover_image,
            teacher_id: req.user.id,
            status: 'draft'
        });

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('创建课程失败:', error);
        res.status(500).json({
            success: false,
            message: '创建课程失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 更新课程信息
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, level, category, cover_image, status } = req.body;

        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: '课程不存在'
            });
        }

        // 验证用户权限
        if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: '没有权限修改此课程'
            });
        }

        await course.update({
            title,
            description,
            level,
            category,
            cover_image,
            status
        });

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('更新课程失败:', error);
        res.status(500).json({
            success: false,
            message: '更新课程失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 删除课程
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: '课程不存在'
            });
        }

        // 验证用户权限
        if (course.teacher_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: '没有权限删除此课程'
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
            message: '删除课程失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 选课
const enrollCourse = async (req, res) => {
    try {
        const { id: course_id } = req.params;
        const student_id = req.user.id;

        // 检查课程是否存在且已发布
        const course = await Course.findOne({
            where: {
                id: course_id,
                status: 'published'
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: '课程不存在或未发布'
            });
        }

        // 检查是否已经选课
        const existingProgress = await Progress.findOne({
            where: {
                course_id,
                userId: student_id
            }
        });

        if (existingProgress) {
            return res.status(400).json({
                success: false,
                message: '已经选修过此课程'
            });
        }

        // 获取课程的所有章节
        const chapters = await Chapter.findAll({
            where: { course_id },
            order: [['order_num', 'ASC']]
        });

        // 为每个章节创建进度记录
        const progressRecords = chapters.map(chapter => ({
            userId: student_id,
            course_id,
            chapter_id: chapter.id,
            status: 'not_started',
            completion_percentage: 0
        }));

        await Progress.bulkCreate(progressRecords);

        res.status(201).json({
            success: true,
            message: '选课成功'
        });
    } catch (error) {
        console.error('选课失败:', error);
        res.status(500).json({
            success: false,
            message: '选课失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 更新学习进度
const updateProgress = async (req, res) => {
    try {
        const { course_id, chapter_id } = req.params;
        const { status, completion_percentage } = req.body;
        const student_id = req.user.id;

        // 检查进度记录是否存在
        const progress = await Progress.findOne({
            where: {
                course_id,
                chapter_id,
                userId: student_id
            }
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: '未找到学习进度记录'
            });
        }

        // 更新进度
        await progress.update({
            status,
            completion_percentage,
            last_study_time: new Date()
        });

        // 计算课程总进度
        const allProgress = await Progress.findAll({
            where: {
                course_id,
                userId: student_id
            }
        });

        const totalProgress = allProgress.reduce((sum, p) => sum + Number(p.completion_percentage), 0) / allProgress.length;

        res.json({
            success: true,
            data: {
                chapter_progress: progress,
                course_progress: Math.round(totalProgress)
            }
        });
    } catch (error) {
        console.error('更新学习进度失败:', error);
        res.status(500).json({
            success: false,
            message: '更新学习进度失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 获取学生的课程列表
const getStudentCourses = async (req, res) => {
    try {
        // 模拟测试数据
        const testCourses = [
            {
                id: 1,
                title: "Python基础编程",
                description: "适合零基础学习的Python入门课程",
                coverImage: "https://via.placeholder.com/300x160?text=Python",
                category: "编程语言",
                level: "初级",
                progress: 75,
                teacher: {
                    id: 1,
                    fullName: "张老师",
                    avatar: "https://via.placeholder.com/50"
                },
                totalChapters: 12,
                completedChapters: 9,
                rating: 4.5,
                studentsCount: 128,
                tags: ["Python", "编程基础", "实战项目"]
            },
            {
                id: 2,
                title: "Web前端开发实战",
                description: "从零开始学习HTML、CSS和JavaScript",
                coverImage: "https://via.placeholder.com/300x160?text=Web",
                category: "前端开发",
                level: "中级",
                progress: 30,
                teacher: {
                    id: 2,
                    fullName: "李老师",
                    avatar: "https://via.placeholder.com/50"
                },
                totalChapters: 15,
                completedChapters: 5,
                rating: 4.8,
                studentsCount: 256,
                tags: ["HTML", "CSS", "JavaScript"]
            },
            {
                id: 3,
                title: "数据结构与算法",
                description: "计算机科学必修课程",
                coverImage: "https://via.placeholder.com/300x160?text=DSA",
                category: "计算机科学",
                level: "高级",
                progress: 0,
                teacher: {
                    id: 3,
                    fullName: "王老师",
                    avatar: "https://via.placeholder.com/50"
                },
                totalChapters: 20,
                completedChapters: 0,
                rating: 4.9,
                studentsCount: 189,
                tags: ["数据结构", "算法", "编程进阶"]
            }
        ];

        // 处理搜索和筛选
        const { search, category, status } = req.query;
        let filteredCourses = [...testCourses];

        if (search) {
            filteredCourses = filteredCourses.filter(course => 
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category && category !== 'all') {
            filteredCourses = filteredCourses.filter(course => 
                course.category === category
            );
        }

        if (status && status !== 'all') {
            filteredCourses = filteredCourses.filter(course => {
                if (status === 'completed') return course.progress === 100;
                if (status === 'in_progress') return course.progress > 0 && course.progress < 100;
                if (status === 'not_started') return course.progress === 0;
                return true;
            });
        }

        res.json({
            success: true,
            data: {
                list: filteredCourses,
                total: filteredCourses.length
            }
        });
    } catch (error) {
        console.error('获取学生课程列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取课程列表失败'
        });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    updateProgress,
    getStudentCourses
};
