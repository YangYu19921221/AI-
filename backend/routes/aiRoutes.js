const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth'); // 假设你有认证中间件

// 所有AI路由都需要认证
router.use(authMiddleware.authenticate);

// AI聊天
router.post('/chat', aiController.chat);

// 知识点提取
router.post('/extract-key-points', aiController.extractKeyPoints);

// 生成练习题
router.post('/generate-exercises', aiController.generateExercises);

// 生成学习建议
router.post('/learning-advice', aiController.generateLearningAdvice);

module.exports = router;
