const express = require('express');
const LoginHistory = require('../models/LoginHistory');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, pageSize = 10, userId, loginType, startDate, endDate } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);
    const where = {};

    if (userId) where.userId = userId;
    if (loginType) where.loginType = loginType;
    if (startDate || endDate) {
      where.loginTime = {};
      if (startDate) where.loginTime[Op.gte] = new Date(startDate);
      if (endDate) where.loginTime[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await LoginHistory.findAndCountAll({
      where,
      limit,
      offset,
      order: [['loginTime', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        histories: rows.map(h => ({
          id: h.id,
          userId: h.userId,
          username: h.username,
          realName: h.realName,
          loginTime: h.loginTime,
          loginIp: h.loginIp,
          userAgent: h.userAgent,
          loginType: h.loginType,
          failReason: h.failReason
        }))
      }
    });
  } catch (error) {
    console.error('获取登录历史错误:', error);
    res.status(500).json({
      success: false,
      message: '获取登录历史失败'
    });
  }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const { count, rows } = await LoginHistory.findAndCountAll({
      where: { userId: req.params.userId },
      limit,
      offset,
      order: [['loginTime', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        histories: rows
      }
    });
  } catch (error) {
    console.error('获取用户登录历史错误:', error);
    res.status(500).json({
      success: false,
      message: '获取登录历史失败'
    });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await LoginHistory.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除登录历史错误:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { days } = req.body;
    const where = { loginType: 'success' };
    
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      where.loginTime = { [Op.lt]: cutoffDate };
    }
    
    await LoginHistory.destroy({ where });
    res.json({ success: true, message: '清理成功' });
  } catch (error) {
    console.error('清理登录历史错误:', error);
    res.status(500).json({ success: false, message: '清理失败' });
  }
});

const { Op } = require('sequelize');

module.exports = router;
