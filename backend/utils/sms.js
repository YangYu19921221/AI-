// 这里使用模拟的短信发送功能
// 在实际生产环境中，你需要替换为真实的短信服务提供商的 API

const sendSMS = async (phone, code) => {
    // 在开发环境中，直接打印验证码
    if (process.env.NODE_ENV === 'development') {
        console.log(`向手机号 ${phone} 发送验证码: ${code}`);
        return true;
    }

    try {
        // 在这里实现实际的短信发送逻辑
        // 例如使用阿里云、腾讯云等短信服务
        
        // 示例：
        // const result = await smsClient.send({
        //     PhoneNumbers: phone,
        //     SignName: '你的签名',
        //     TemplateCode: '你的模板代码',
        //     TemplateParam: JSON.stringify({ code })
        // });
        
        return true;
    } catch (error) {
        console.error('短信发送失败:', error);
        throw error;
    }
};

module.exports = {
    sendSMS
};
