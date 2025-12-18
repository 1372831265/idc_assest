const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Device = require('../models/Device');
const Rack = require('../models/Rack');

// 获取所有设备（支持搜索和筛选）
router.get('/', async (req, res) => {
  try {
    const { keyword, status, type, page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    
    // 构建查询条件
    const where = {};
    
    // 关键词搜索（所有文本字段）
    if (keyword) {
      where[Op.or] = [
        { deviceId: { [Op.like]: `%${keyword}%` } },
        { name: { [Op.like]: `%${keyword}%` } },
        { type: { [Op.like]: `%${keyword}%` } },
        { model: { [Op.like]: `%${keyword}%` } },
        { serialNumber: { [Op.like]: `%${keyword}%` } },
        { position: { [Op.like]: `%${keyword}%` } },
        { ipAddress: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    // 状态筛选
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // 分类筛选
    if (type && type !== 'all') {
      where.type = type;
    }
    
    // 执行查询
    const { count, rows } = await Device.findAndCountAll({
      where,
      include: [
        { model: Rack }
      ],
      offset,
      limit: parseInt(pageSize)
    });
    
    res.json({
      total: count,
      devices: rows,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个设备
router.get('/:deviceId', async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.deviceId, {
      include: [
        { model: Rack }
      ]
    });
    if (!device) {
      return res.status(404).json({ error: '设备不存在' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建设备
router.post('/', async (req, res) => {
  try {
    const device = await Device.create(req.body);
    
    // 更新机柜当前功率
    const rack = await Rack.findByPk(req.body.rackId);
    if (rack) {
      await rack.update({
        currentPower: rack.currentPower + req.body.powerConsumption
      });
    }
    
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 更新设备
router.put('/:deviceId', async (req, res) => {
  try {
    // 获取旧设备信息以更新功率
    const oldDevice = await Device.findByPk(req.params.deviceId);
    if (!oldDevice) {
      return res.status(404).json({ error: '设备不存在' });
    }
    
    const [updated] = await Device.update(req.body, {
      where: { deviceId: req.params.deviceId }
    });
    
    if (updated) {
      // 更新机柜当前功率
      const rack = await Rack.findByPk(oldDevice.rackId);
      if (rack) {
        const powerDiff = req.body.powerConsumption - oldDevice.powerConsumption;
        await rack.update({
          currentPower: rack.currentPower + powerDiff
        });
      }
      
      const updatedDevice = await Device.findByPk(req.params.deviceId, {
        include: [
          { model: Rack }
        ]
      });
      res.json(updatedDevice);
    } else {
      res.status(404).json({ error: '设备不存在' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 删除设备
router.delete('/:deviceId', async (req, res) => {
  try {
    // 获取设备信息以更新功率
    const device = await Device.findByPk(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ error: '设备不存在' });
    }
    
    const deleted = await Device.destroy({
      where: { deviceId: req.params.deviceId }
    });
    
    if (deleted) {
      // 更新机柜当前功率
      const rack = await Rack.findByPk(device.rackId);
      if (rack) {
        await rack.update({
          currentPower: Math.max(0, rack.currentPower - device.powerConsumption)
        });
      }
      
      res.status(204).json();
    } else {
      res.status(404).json({ error: '设备不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;