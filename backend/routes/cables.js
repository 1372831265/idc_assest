const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Cable = require('../models/Cable');
const Device = require('../models/Device');

router.get('/', async (req, res) => {
  try {
    const { sourceDeviceId, targetDeviceId, status, cableType, page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    
    if (sourceDeviceId) {
      where.sourceDeviceId = sourceDeviceId;
    }
    
    if (targetDeviceId) {
      where.targetDeviceId = targetDeviceId;
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (cableType && cableType !== 'all') {
      where.cableType = cableType;
    }
    
    const { count, rows } = await Cable.findAndCountAll({
      where,
      include: [
        {
          model: Device,
          as: 'sourceDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        },
        {
          model: Device,
          as: 'targetDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        }
      ],
      offset,
      limit: parseInt(pageSize),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      total: count,
      cables: rows,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('获取接线列表失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const cables = await Cable.findAll({
      where: {
        [Op.or]: [
          { sourceDeviceId: deviceId },
          { targetDeviceId: deviceId }
        ]
      },
      include: [
        {
          model: Device,
          as: 'sourceDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        },
        {
          model: Device,
          as: 'targetDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        }
      ]
    });
    
    res.json(cables);
  } catch (error) {
    console.error('获取设备接线失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { cableId, sourceDeviceId, sourcePort, targetDeviceId, targetPort, cableType, cableLength, status, description } = req.body;
    
    if (!sourceDeviceId || !sourcePort || !targetDeviceId || !targetPort) {
      return res.status(400).json({ error: '缺少必填字段' });
    }
    
    if (sourceDeviceId === targetDeviceId) {
      return res.status(400).json({ error: '源设备和目标设备不能相同' });
    }
    
    const existingCable = await Cable.findOne({
      where: {
        [Op.or]: [
          { sourceDeviceId, sourcePort },
          { targetDeviceId, targetPort }
        ]
      }
    });
    
    if (existingCable) {
      return res.status(400).json({ error: '端口已被占用' });
    }
    
    const autoCableId = cableId || `CABLE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    const cable = await Cable.create({
      cableId: autoCableId,
      sourceDeviceId,
      sourcePort,
      targetDeviceId,
      targetPort,
      cableType: cableType || 'ethernet',
      cableLength,
      status: status || 'normal',
      description
    });
    
    const createdCable = await Cable.findByPk(cable.cableId, {
      include: [
        {
          model: Device,
          as: 'sourceDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        },
        {
          model: Device,
          as: 'targetDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        }
      ]
    });
    
    res.status(201).json(createdCable);
  } catch (error) {
    console.error('创建接线失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { cables } = req.body;
    
    if (!cables || !Array.isArray(cables) || cables.length === 0) {
      return res.status(400).json({ error: '请提供有效的接线数据' });
    }
    
    const results = {
      total: cables.length,
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (let i = 0; i < cables.length; i++) {
      const cableData = cables[i];
      
      try {
        if (!cableData.cableId || !cableData.sourceDeviceId || !cableData.sourcePort || 
            !cableData.targetDeviceId || !cableData.targetPort) {
          throw new Error('缺少必填字段');
        }
        
        if (cableData.sourceDeviceId === cableData.targetDeviceId) {
          throw new Error('源设备和目标设备不能相同');
        }
        
        const existingCable = await Cable.findOne({
          where: {
            [Op.or]: [
              { sourceDeviceId: cableData.sourceDeviceId, sourcePort: cableData.sourcePort },
              { targetDeviceId: cableData.targetDeviceId, targetPort: cableData.targetPort }
            ]
          }
        });
        
        if (existingCable) {
          throw new Error('端口已被占用');
        }
        
        await Cable.create({
          cableId: cableData.cableId,
          sourceDeviceId: cableData.sourceDeviceId,
          sourcePort: cableData.sourcePort,
          targetDeviceId: cableData.targetDeviceId,
          targetPort: cableData.targetPort,
          cableType: cableData.cableType || 'ethernet',
          cableLength: cableData.cableLength,
          status: cableData.status || 'normal',
          description: cableData.description
        });
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i + 1,
          cableId: cableData.cableId,
          error: error.message
        });
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('批量创建接线失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cableId', async (req, res) => {
  try {
    const [updated] = await Cable.update(req.body, {
      where: { cableId: req.params.cableId }
    });
    
    if (updated) {
      const cable = await Cable.findByPk(req.params.cableId, {
        include: [
          {
            model: Device,
            as: 'sourceDevice',
            attributes: ['deviceId', 'name', 'type', 'rackId']
          },
          {
            model: Device,
            as: 'targetDevice',
            attributes: ['deviceId', 'name', 'type', 'rackId']
          }
        ]
      });
      res.json(cable);
    } else {
      res.status(404).json({ error: '接线不存在' });
    }
  } catch (error) {
    console.error('更新接线失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cableId', async (req, res) => {
  try {
    const deleted = await Cable.destroy({
      where: { cableId: req.params.cableId }
    });
    
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: '接线不存在' });
    }
  } catch (error) {
    console.error('删除接线失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/batch', async (req, res) => {
  try {
    const { cableIds } = req.body;
    
    if (!cableIds || !Array.isArray(cableIds) || cableIds.length === 0) {
      return res.status(400).json({ error: '请提供有效的接线ID列表' });
    }
    
    const deletedCount = await Cable.destroy({
      where: { cableId: { [Op.in]: cableIds } }
    });
    
    res.json({
      message: `批量删除成功，已删除 ${deletedCount} 条接线`,
      deletedCount
    });
  } catch (error) {
    console.error('批量删除接线失败:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cableId', async (req, res) => {
  try {
    const cable = await Cable.findByPk(req.params.cableId, {
      include: [
        {
          model: Device,
          as: 'sourceDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        },
        {
          model: Device,
          as: 'targetDevice',
          attributes: ['deviceId', 'name', 'type', 'rackId']
        }
      ]
    });
    
    if (!cable) {
      return res.status(404).json({ error: '接线不存在' });
    }
    
    res.json(cable);
  } catch (error) {
    console.error('获取接线详情失败:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
