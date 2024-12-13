const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');
const tenantController = require('../controllers/tenantController');

// 租户管理路由
router.post('/', 
  authenticate, 
  checkRole('admin'), 
  tenantController.createTenant
);

router.get('/', 
  authenticate, 
  checkRole('admin'), 
  tenantController.getAllTenants
);

router.get('/:id', 
  authenticate, 
  checkRole('admin', 'institution_admin'), 
  tenantController.getTenant
);

router.put('/:id', 
  authenticate, 
  checkRole('admin'), 
  tenantController.updateTenant
);

// 定制化设置
router.put('/:id/customization', 
  authenticate, 
  checkRole('admin', 'institution_admin'), 
  tenantController.updateCustomization
);

// 系统设置
router.put('/:id/settings', 
  authenticate, 
  checkRole('admin', 'institution_admin'), 
  tenantController.updateSettings
);

// 联系人管理
router.put('/:id/contacts', 
  authenticate, 
  checkRole('admin', 'institution_admin'), 
  tenantController.updateContacts
);

module.exports = router;
