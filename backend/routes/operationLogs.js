const express = require('express');
const OperationLog = require('../models/OperationLog');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const ACTION_TYPES = {
  USER_CREATE: '创建用户',
  USER_UPDATE: '修改用户',
  USER_DELETE: '删除用户',
  USER_LOGIN: '用户登录',
  USER_LOGOUT: '用户登出',
  ROLE_CREATE: '创建角色',
  ROLE_UPDATE: '修改角色',
  ROLE_DELETE: '删除角色',
  ROLE_ASSIGN: '分配角色',
  DEVICE_CREATE: '创建设备',
  DEVICE_UPDATE: '修改设备',
  DEVICE_DELETE: '删除设备',
  CONSUMABLE_IN: '耗材入库',
  CONSUMABLE_OUT: '耗材出库',
  CONSUMABLE_RECORD: '耗材记录',
  SYSTEM_CONFIG: '系统配置'
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, pageSize = 20, userId, action, module, startDate, endDate } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);
    const where = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (module) where.module = module;
    if (startDate || endDate) {
      where.operateTime = {};
      if (startDate) where.operateTime[Op.gte] = new Date(startDate);
      if (endDate) where.operateTime[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await OperationLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['operateTime', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        logs: rows.map(l => ({
          id: l.id,
          userId: l.userId,
          username: l.username,
          realName: l.realName,
          action: l.action,
          module: l.module,
          description: l.description,
          targetId: l.targetId,
          targetName: l.targetName,
          oldValue: l.oldValue,
          newValue: l.newValue,
          ip: l.ip,
          status: l.status,
          errorMessage: l.errorMessage,
          operateTime: l.operateTime
        }))
      }
    });
  } catch (error) {
    console.error('获取操作日志错误:', error);
    res.status(500).json({
      success: false,
      message: '获取操作日志失败'
    });
  }
});

router.get('/actions', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: Object.entries(ACTION_TYPES).map(([key, value]) => ({
      key,
      value,
      label: value
    }))
  });
});

router.get('/modules', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: [
      { key: 'user', value: 'user', label: '用户管理' },
      { key: 'role', value: 'role', label: '角色管理' },
      { key: 'device', value: 'device', label: '设备管理' },
      { key: 'consumable', value: 'consumable', label: '耗材管理' },
      { key: 'system', value: 'system', label: '系统设置' }
    ]
  });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await OperationLog.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除操作日志错误:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { days } = req.body;
    const where = {};
    
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      where.operateTime = { [Op.lt]: cutoffDate };
    }
    
    await OperationLog.destroy({ where });
    res.json({ success: true, message: '清理成功' });
  } catch (error) {
    console.error('清理操作日志错误:', error);
    res.status(500).json({ success: false, message: '清理失败' });
  }
});

const logOperation = async (req, action, module, description, targetId, targetName, oldValue, newValue, status = 'success', errorMessage = null) => {
  try {
    await OperationLog.create({
      userId: req.user?.userId,
      username: req.user?.username,
      realName: req.userModel?.realName,
      action,
      module,
      description,
      targetId,
      targetName,
      oldValue: oldValue ? JSON.stringify(oldValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
      ip: req.ip,
      status,
      errorMessage
    });
  } catch (error) {
    console.error('记录操作日志错误:', error);
  }
};

module.exports = router;
module.exports.ACTION_TYPES = ACTION_TYPES;
module.exports.logOperation = logOperation;

const { Op } = require('sequelize');
