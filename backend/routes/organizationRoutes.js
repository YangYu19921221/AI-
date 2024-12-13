const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { checkRole, checkPermission } = require('../middleware/roleAuth');
const organizationController = require('../controllers/organizationController');

// 组织管理路由
router.post('/', 
  authenticate, 
  checkRole('admin'), 
  organizationController.createOrganization
);

router.get('/', 
  authenticate, 
  checkRole('admin'), 
  organizationController.getAllOrganizations
);

router.get('/:id', 
  authenticate, 
  checkPermission('view_organization'), 
  organizationController.getOrganization
);

router.put('/:id', 
  authenticate, 
  checkPermission('manage_organization'), 
  organizationController.updateOrganization
);

router.delete('/:id', 
  authenticate, 
  checkRole('admin'), 
  organizationController.deleteOrganization
);

// 组织成员管理
router.post('/:id/members', 
  authenticate, 
  checkPermission('manage_members'), 
  organizationController.addMember
);

router.get('/:id/members', 
  authenticate, 
  checkPermission('view_members'), 
  organizationController.getMembers
);

router.delete('/:id/members/:userId', 
  authenticate, 
  checkPermission('manage_members'), 
  organizationController.removeMember
);

// 组织设置管理
router.put('/:id/settings', 
  authenticate, 
  checkPermission('configure_settings'), 
  organizationController.updateSettings
);

router.get('/:id/settings', 
  authenticate, 
  checkPermission('view_settings'), 
  organizationController.getSettings
);

module.exports = router;
