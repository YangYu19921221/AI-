const axios = require('axios');
const aiConfig = require('../config/ai.config');

class AIService {
    constructor() {
        this.apiKey = aiConfig.apiKey;
        this.apiEndpoint = aiConfig.apiEndpoint;
        this.model = aiConfig.model;
    }

    async generateSSEToken() {
        const timestamp = Math.floor(Date.now() / 1000);
        const apiKey = this.apiKey;
        // 实际项目中应该在服务端生成token
        return apiKey;
    }

    async chat(messages, userId) {
        try {
            const token = await this.generateSSEToken();
            
            const response = await axios.post(this.apiEndpoint, {
                model: this.model,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: aiConfig.temperature,
                max_tokens: aiConfig.maxTokens
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('AI Chat Error:', error);
            throw new Error('AI服务暂时不可用，请稍后重试');
        }
    }

    // 添加教育相关的上下文
    addEducationalContext(messages, subject) {
        const systemPrompt = {
            role: 'system',
            content: `你是一位专业的${subject}教师，擅长用通俗易懂的方式解释复杂概念。
                     请注意：
                     1. 回答要循序渐进，由浅入深
                     2. 适当使用类比和实例
                     3. 重要概念要强调
                     4. 如果涉及公式，要解释每个符号的含义
                     5. 鼓励学生思考和提问`
        };

        return [systemPrompt, ...messages];
    }

    // 知识点提取
    async extractKeyPoints(content) {
        const messages = [{
            role: 'system',
            content: '请提取文本中的关键知识点，以结构化的方式呈现。'
        }, {
            role: 'user',
            content
        }];

        return this.chat(messages);
    }

    // 生成练习题
    async generateExercises(topic, difficulty) {
        const messages = [{
            role: 'system',
            content: `请根据主题"${topic}"生成${difficulty}难度的练习题，包含答案和解析。`
        }];

        return this.chat(messages);
    }

    // 学习建议生成
    async generateLearningAdvice(studentData) {
        const messages = [{
            role: 'system',
            content: '基于学生的学习数据，生成个性化的学习建议。'
        }, {
            role: 'user',
            content: JSON.stringify(studentData)
        }];

        return this.chat(messages);
    }
}

module.exports = new AIService();
