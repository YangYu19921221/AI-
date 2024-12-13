const roles = {
  // 系统管理员权限
  admin: ['*'],  // 管理员拥有所有权限
  
  // 机构角色权限
  institution_admin: [
    'manage_organization',
    'manage_teachers',
    'manage_students',
    'manage_courses',
    'view_analytics',
    'manage_assignments',
    'configure_settings',
    'manage_departments',
    'manage_classes'
  ],
  
  institution_teacher: [
    'create_courses',
    'edit_courses',
    'create_assignments',
    'grade_assignments',
    'view_student_progress',
    'provide_feedback',
    'manage_class',
    'create_exams',
    'grade_exams'
  ],
  
  institution_student: [
    'view_courses',
    'submit_assignments',
    'view_grades',
    'participate_discussions',
    'access_resources',
    'take_exams',
    'view_certificates'
  ],

  // 个人用户权限
  individual_teacher: [
    'create_courses',
    'manage_students',
    'create_content',
    'provide_feedback',
    'set_course_price',
    'view_earnings'
  ],
  
  individual_student: [
    'enroll_courses',
    'access_content',
    'submit_work',
    'view_progress',
    'book_sessions',
    'rate_courses'
  ]
};

// 权限检查中间件
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    // 检查用户是否有权限
    if (allowedRoles.includes(userRole) || userRole === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: '您没有权限执行此操作'
      });
    }
  };
};

// 检查特定权限的中间件
const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    // 管理员拥有所有权限
    if (userRole === 'admin') {
      return next();
    }

    // 检查角色是否有特定权限
    const rolePermissions = roles[userRole] || [];
    if (rolePermissions.includes(permission) || rolePermissions.includes('*')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: '您没有权限执行此操作'
      });
    }
  };
};

// 检查组织权限的中间件
const checkOrganizationAccess = (req, res, next) => {
  const userOrganization = req.user.organization;
  const targetOrganization = req.params.organizationId || req.body.organizationId;

  if (!targetOrganization || userOrganization.toString() === targetOrganization.toString()) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: '您没有权限访问其他组织的数据'
    });
  }
};

module.exports = {
  roles,
  checkRole,
  checkPermission,
  checkOrganizationAccess
};
