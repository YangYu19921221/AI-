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
        console.log('开始获取学生课程列表');
        console.log('用户信息:', req.user?.toJSON());
        
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: '未找到用户信息'
            });
        }

        console.log('学生ID:', studentId);

        // 获取学生已选的课程
        console.log('开始查询课程...');
        console.log('学生ID:', studentId);
        
        // 获取学生的选课记录
        const progresses = await Progress.findAll({
            where: {
                studentId: studentId
            },
            attributes: ['courseId']
        });

        console.log('找到的进度记录:', progresses);
        
        if (progresses.length === 0) {
            return res.json({
                success: true,
                data: {
                    list: []
                },
                message: '还没有选修任何课程'
            });
        }

        const courseIds = progresses.map(p => p.courseId);
        console.log('课程IDs:', courseIds);
        
        const courses = await Course.findAll({
            where: {
                id: {
                    [Op.in]: courseIds
                }
            },
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'username', 'fullName', 'avatar']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log('查询到的课程数量:', courses.length);
        console.log('课程数据:', JSON.stringify(courses, null, 2));
        
        // 获取每个课程的最新进度
        const latestProgresses = await Progress.findAll({
            where: {
                studentId: studentId,
                courseId: {
                    [Op.in]: courseIds
                }
            },
            attributes: ['courseId', 'progress', 'lastAccessedAt']
        });

        console.log('进度数据:', latestProgresses);

        // 创建进度映射
        const progressMap = new Map(
            latestProgresses.map(p => [p.courseId, {
                progress: p.progress,
                lastAccessedAt: p.lastAccessedAt
            }])
        );
        
        // 格式化返回数据
        const formattedCourses = courses.map(course => {
            const courseData = course.toJSON();
            const progress = progressMap.get(courseData.id) || { progress: 0 };
            
            return {
                ...courseData,
                progress: progress.progress || 0,
                lastAccessedAt: progress.lastAccessedAt,
                teacher: courseData.teacher ? {
                    id: courseData.teacher.id,
                    name: courseData.teacher.fullName,
                    avatar: courseData.teacher.avatar
                } : null
            };
        });

        console.log('格式化后的课程数据:', JSON.stringify(formattedCourses, null, 2));

        return res.json({
            success: true,
            data: {
                list: formattedCourses
            }
        });
    } catch (error) {
        console.error('获取学生课程列表失败:', error);
        console.error('错误堆栈:', error.stack);
        res.status(500).json({
            success: false,
            message: '获取学生课程列表失败',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : {}
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
