const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationCode = sequelize.define('VerificationCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
            is: /^1[3-9]\d{9}$/
        }
    },
    code: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('register', 'reset'),
        allowNull: false,
        defaultValue: 'register'
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    indexes: [
        {
            fields: ['phone', 'type']
        },
        {
            fields: ['expiresAt']
        }
    ],
    hooks: {
        beforeCreate: (code) => {
            // 设置验证码15分钟后过期
            code.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        }
    }
});

// 静态方法：生成6位随机验证码
VerificationCode.generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// 静态方法：检查验证码是否有效
VerificationCode.isValid = async function(phone, code, type) {
    const verificationCode = await this.findOne({
        where: {
            phone,
            code,
            type,
            used: false,
            expiresAt: {
                [sequelize.Op.gt]: new Date()
            }
        }
    });
    return !!verificationCode;
};

module.exports = VerificationCode;
