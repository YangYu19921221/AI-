const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// 公开路由
router.post('/login', authController.login);
router.post('/register', authController.register);

// 验证 token
router.get('/validate', authenticate, (req, res) => {
    res.json({
        success: true,
        data: {
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        }
    });
});

// 需要认证的路由
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
