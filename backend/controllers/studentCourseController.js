const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Progress = require('../models/Progress');
const { Op } = require('sequelize');

exports.getCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;
        const where = {
            status: 'published'
        };

        if (category) {
            where.category = category;
        }
        if (level) {
            where.level = level;
        }
        if (search) {
            where.title = {
                [Op.like]: `%${search}%`
            };
        }

        const courses = await Course.findAll({
            where,
            include: [{
                model: Chapter,
                attributes: ['id']
            }],
            order: [['createdAt', 'DESC']]
        });

        // 获取每个课程的学习进度
        const coursesWithProgress = await Promise.all(
            courses.map(async (course) => {
                const progress = await Progress.findOne({
                    where: {
                        courseId: course.id,
                        userId: req.user.id
                    }
                });

                return {
                    ...course.toJSON(),
                    progress: progress ? progress.progress : 0,
                    lastStudyTime: progress ? progress.lastStudyTime : null,
                    chaptersCount: course.Chapters.length
                };
            })
        );

        res.json(coursesWithProgress);
    } catch (error) {
        console.error('Error in getCourses:', error);
        res.status(500).json({ message: '获取课程列表失败' });
    }
};

exports.getCourseDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({
            where: { 
                id,
                status: 'published'
            },
            include: [{
                model: Chapter,
                order: [['order', 'ASC']]
            }]
        });

        if (!course) {
            return res.status(404).json({ message: '课程不存在' });
        }

        // 获取学习进度
        const progress = await Progress.findOne({
            where: {
                courseId: id,
                userId: req.user.id
            }
        });

        const courseData = {
            ...course.toJSON(),
            progress: progress ? progress.progress : 0,
            currentChapter: progress ? progress.chapterId : null,
            lastStudyTime: progress ? progress.lastStudyTime : null
        };

        res.json(courseData);
    } catch (error) {
        console.error('Error in getCourseDetail:', error);
        res.status(500).json({ message: '获取课程详情失败' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { courseId, chapterId, progress, currentTime } = req.body;
        const userId = req.user.id;

        let progressRecord = await Progress.findOne({
            where: {
                userId,
                courseId,
                chapterId
            }
        });

        if (progressRecord) {
            await progressRecord.update({
                progress,
                currentTime,
                lastStudyTime: new Date()
            });
        } else {
            progressRecord = await Progress.create({
                userId,
                courseId,
                chapterId,
                progress,
                currentTime,
                lastStudyTime: new Date()
            });
        }

        // 更新课程总进度
        const chapters = await Chapter.findAll({
            where: { courseId }
        });
        
        const allProgress = await Progress.findAll({
            where: {
                userId,
                courseId
            }
        });

        const totalProgress = Math.floor(
            (allProgress.reduce((sum, p) => sum + p.progress, 0) / (chapters.length * 100)) * 100
        );

        await Progress.update(
            { progress: totalProgress },
            {
                where: {
                    userId,
                    courseId,
                    chapterId: null
                }
            }
        );

        res.json({ message: '进度更新成功', progress: totalProgress });
    } catch (error) {
        console.error('Error in updateProgress:', error);
        res.status(500).json({ message: '更新进度失败' });
    }
};
