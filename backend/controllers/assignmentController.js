const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const { Op } = require('sequelize');

// 获取学生的作业列表
exports.getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignments = await Assignment.findAll({
      where: {
        status: 'published',
        deadline: {
          [Op.gt]: new Date() // 未过期的作业
        }
      },
      include: [{
        model: Submission,
        where: { studentId },
        required: false
      }],
      order: [['deadline', 'ASC']]
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: '获取作业列表失败', error: error.message });
  }
};

// 获取作业详情
exports.getAssignmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const assignment = await Assignment.findOne({
      where: { id },
      include: [{
        model: Submission,
        where: { studentId },
        required: false
      }]
    });

    if (!assignment) {
      return res.status(404).json({ message: '作业不存在' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: '获取作业详情失败', error: error.message });
  }
};

// 提交作业
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const { content, attachments } = req.body;

    // 检查作业是否存在且未过期
    const assignment = await Assignment.findOne({
      where: {
        id,
        status: 'published',
        deadline: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: '作业不存在或已过期' });
    }

    // 创建或更新提交记录
    const [submission, created] = await Submission.findOrCreate({
      where: { assignmentId: id, studentId },
      defaults: {
        content,
        attachments,
        status: 'submitted',
        submittedAt: new Date()
      }
    });

    if (!created) {
      await submission.update({
        content,
        attachments,
        status: 'submitted',
        submittedAt: new Date()
      });
    }

    res.json({ message: '作业提交成功', submission });
  } catch (error) {
    res.status(500).json({ message: '提交作业失败', error: error.message });
  }
};

// 保存作业草稿
exports.saveDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const { content, attachments } = req.body;

    const [submission, created] = await Submission.findOrCreate({
      where: { assignmentId: id, studentId },
      defaults: {
        content,
        attachments,
        status: 'draft'
      }
    });

    if (!created) {
      await submission.update({
        content,
        attachments,
        status: 'draft'
      });
    }

    res.json({ message: '草稿保存成功', submission });
  } catch (error) {
    res.status(500).json({ message: '保存草稿失败', error: error.message });
  }
};
