const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate } = require('../middleware/auth');

// 学生端路由
router.get('/student/assignments', authenticate, assignmentController.getStudentAssignments);
router.get('/student/assignments/:id', authenticate, assignmentController.getAssignmentDetail);
router.post('/student/assignments/:id/submit', authenticate, assignmentController.submitAssignment);
router.post('/student/assignments/:id/draft', authenticate, assignmentController.saveDraft);

module.exports = router;
