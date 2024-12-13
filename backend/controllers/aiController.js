const aiService = require('../services/ai.service');

class AIController {
    // 处理聊天请求
    async chat(req, res) {
        try {
            const { messages, subject } = req.body;
            const userId = req.user.id; // 假设使用了认证中间件

            // 添加教育相关上下文
            const contextualMessages = aiService.addEducationalContext(messages, subject);
            
            // 获取AI回复
            const response = await aiService.chat(contextualMessages, userId);
            
            res.json(response);
        } catch (error) {
            console.error('Chat Error:', error);
            res.status(500).json({ 
                error: error.message || '服务器错误' 
            });
        }
    }

    // 提取知识点
    async extractKeyPoints(req, res) {
        try {
            const { content } = req.body;
            const response = await aiService.extractKeyPoints(content);
            res.json(response);
        } catch (error) {
            console.error('Extract Key Points Error:', error);
            res.status(500).json({ 
                error: error.message || '服务器错误' 
            });
        }
    }

    // 生成练习题
    async generateExercises(req, res) {
        try {
            const { topic, difficulty } = req.body;
            const response = await aiService.generateExercises(topic, difficulty);
            res.json(response);
        } catch (error) {
            console.error('Generate Exercises Error:', error);
            res.status(500).json({ 
                error: error.message || '服务器错误' 
            });
        }
    }

    // 生成学习建议
    async generateLearningAdvice(req, res) {
        try {
            const { studentData } = req.body;
            const response = await aiService.generateLearningAdvice(studentData);
            res.json(response);
        } catch (error) {
            console.error('Generate Learning Advice Error:', error);
            res.status(500).json({ 
                error: error.message || '服务器错误' 
            });
        }
    }
}

module.exports = new AIController();
