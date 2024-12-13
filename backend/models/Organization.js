const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['institution', 'individual'],
    required: true
  },
  institutionType: {
    type: String,
    enum: ['school', 'enterprise'],
    required: function() { return this.type === 'institution'; }
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  config: {
    features: [{
      type: String,
      enum: [
        'courses',         // 课程管理
        'assignments',     // 作业管理
        'ai_tutoring',     // AI辅导
        'live_qa',         // 在线答疑
        'analytics',       // 数据分析
        'exam_system',     // 考试系统
        'certification'    // 认证系统
      ]
    }],
    customization: {
      theme: {
        primaryColor: String,
        logo: String
      },
      modules: {
        type: Map,
        of: Boolean
      }
    }
  },
  usage: {
    totalStorage: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    },
    totalCourses: {
      type: Number,
      default: 0
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'professional', 'enterprise'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active'
    }
  },
  structure: {
    departments: [{
      name: String,
      code: String,
      parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      }
    }],
    classes: [{
      name: String,
      code: String,
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      }
    }]
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

organizationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

organizationSchema.pre(/^find/, function(next) {
  if (!this._conditions.tenant && this.options.bypassTenantFilter !== true) {
    throw new Error('Tenant ID is required for this operation');
  }
  next();
});

module.exports = mongoose.model('Organization', organizationSchema);
