const { Course, User, Chapter, Progress, Tag, CourseReview } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;

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

// 获取课程列表
exports.getCourses = async (req, res) => {
    try {
        console.log('接收到获取课程列表请求:', req.query);
        const { 
            page = 1, 
            page_size = 12, 
            search, 
            category,
            level,
            tag_ids,
            price_min,
            price_max,
            sort_by = 'created_at',
            sort_order = 'DESC',
            teacher_id
        } = req.query;
        
        const offset = (page - 1) * page_size;
        
        // 构建查询条件
        const where = {};
        const include = [
            {
                model: User,
                as: 'teacher',
                attributes: ['id', 'fullName', 'username', 'email']
            },
            {
                model: Tag,
                as: 'tags',
                through: { attributes: [] },
                attributes: ['id', 'name', 'category']
            }
        ];
        
        // 搜索条件
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // 基本筛选
        if (category) {
            where.category = category;
        }
        if (level) {
            where.level = level;
        }
        if (teacher_id) {
            where.teacher_id = teacher_id;
        }

        // 价格范围筛选
        if (price_min !== undefined || price_max !== undefined) {
            where.price = {};
            if (price_min !== undefined) {
                where.price[Op.gte] = price_min;
            }
            if (price_max !== undefined) {
                where.price[Op.lte] = price_max;
            }
        }

        // 标签筛选
        if (tag_ids) {
            const tagIdsArray = tag_ids.split(',').map(Number);
            include[1].where = {
                id: {
                    [Op.in]: tagIdsArray
                }
            };
        }

        // 排序
        const order = [];
        switch (sort_by) {
            case 'price':
                order.push(['price', sort_order]);
                break;
            case 'rating':
                // 添加子查询来计算平均评分
                include.push({
                    model: CourseReview,
                    as: 'reviews',
                    attributes: [],
                    where: { status: 'approved' },
                    required: false
                });
                order.push([sequelize.fn('AVG', sequelize.col('reviews.rating')), sort_order]);
                break;
            default:
                order.push(['created_at', sort_order]);
        }

        // 查询课程总数
        const total = await Course.count({ 
            where,
            include: tag_ids ? [include[1]] : [] 
        });

        // 查询分页数据
        const courses = await Course.findAll({
            where,
            include,
            order,
            limit: parseInt(page_size),
            offset: parseInt(offset),
            distinct: true,
            group: tag_ids ? ['Course.id', 'teacher.id', 'tags.id'] : ['Course.id', 'teacher.id']
        });

        // 获取每个课程的评分统计
        const coursesWithStats = await Promise.all(courses.map(async (course) => {
            const stats = await CourseReview.findOne({
                where: { 
                    courseId: course.id,
                    status: 'approved'
                },
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total_reviews']
                ],
                raw: true
            });

            const courseJson = course.toJSON();
            return {
                ...courseJson,
                teacher: courseJson.teacher ? {
                    ...courseJson.teacher,
                    name: courseJson.teacher.fullName
                } : null,
                average_rating: Number(stats?.average_rating || 0).toFixed(1),
                total_reviews: stats?.total_reviews || 0
            };
        }));

        res.json({
            success: true,
            data: {
                list: coursesWithStats,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(page_size),
                    total
                }
            }
        });
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
        const { id } = req.params;
        const course = await Course.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'fullName', 'username', 'email']
                },
                {
                    model: Chapter,
                    attributes: ['id', 'title', 'content', 'order'],
                    include: [
                        {
                            model: Progress,
                            required: false,
                            where: req.user ? { user_id: req.user.id } : {},
                            attributes: ['status', 'score']
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
            message: '获取课程详情失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

// 创建新课程
exports.createCourse = async (req, res) => {
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
exports.updateCourse = async (req, res) => {
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
exports.deleteCourse = async (req, res) => {
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
exports.enrollCourse = async (req, res) => {
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
                student_id
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
            student_id,
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
exports.updateProgress = async (req, res) => {
    try {
        const { course_id, chapter_id } = req.params;
        const { status, completion_percentage } = req.body;
        const student_id = req.user.id;

        // 检查进度记录是否存在
        const progress = await Progress.findOne({
            where: {
                course_id,
                chapter_id,
                student_id
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
                student_id
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
