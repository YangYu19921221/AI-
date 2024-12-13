const aiConfig = {
    apiKey: process.env.ZHIPU_API_KEY || 'fd068fefbf262c1503415e61185463d2.a6Db9hFG2xVPcrXL',
    apiEndpoint: 'https://open.bigmodel.cn/api/paas/v3/model-api',
    model: 'chatglm_turbo',
    temperature: 0.7,
    maxTokens: 2000
};

module.exports = aiConfig;
