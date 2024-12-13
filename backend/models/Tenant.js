const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  customization: {
    logo: String,
    primaryColor: String,
    companyInfo: {
      address: String,
      website: String,
      description: String
    }
  },
  settings: {
    allowedIPs: [String],
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    passwordPolicy: {
      minLength: {
        type: Number,
        default: 8
      },
      requireNumbers: {
        type: Boolean,
        default: true
      },
      requireSpecialChars: {
        type: Boolean,
        default: true
      }
    },
    sessionTimeout: {
      type: Number,
      default: 3600  // 默认1小时
    }
  },
  contacts: [{
    name: String,
    role: String,
    email: String,
    phone: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
tenantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Tenant', tenantSchema);
