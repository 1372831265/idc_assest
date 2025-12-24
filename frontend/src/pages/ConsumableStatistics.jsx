import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Space, Select, Progress, message } from 'antd';
import { InboxOutlined, ExportOutlined, WarningOutlined, DollarOutlined, ShoppingCartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function ConsumableStatistics() {
  const [summary, setSummary] = useState({ total: 0, lowStock: 0, totalValue: 0, byCategory: [] });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [stats, setStats] = useState({ inCount: 0, outCount: 0, inQuantity: 0, outQuantity: 0, recentRecords: [] });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/api/consumables/statistics/summary');
      setSummary(response.data);
    } catch (error) {
      message.error('获取统计信息失败');
    }
  };

  const fetchLowStock = async () => {
    try {
      const response = await axios.get('/api/consumables/low-stock');
      setLowStockItems(response.data);
    } catch (error) {
      message.error('获取低库存信息失败');
    }
  };

  const fetchInOutStats = async () => {
    try {
      const params = {};
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }
      const response = await axios.get('/api/consumable-records/statistics', { params });
      setStats(response.data);
    } catch (error) {
      message.error('获取出入库统计失败');
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchLowStock();
    fetchInOutStats();
  }, []);

  useEffect(() => {
    fetchInOutStats();
  }, [dateRange]);

  const lowStockColumns = [
    {
      title: '耗材名称',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      render: (value) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{value}</span>
      )
    },
    {
      title: '最小库存',
      dataIndex: 'minStock',
      key: 'minStock',
      width: 100
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80
    },
    {
      title: '库存充足率',
      key: 'rate',
      width: 150,
      render: (_, record) => {
        const rate = Math.min(100, Math.round((record.currentStock / record.maxStock) * 100));
        const status = rate < 30 ? 'exception' : rate < 60 ? 'active' : 'success';
        return <Progress percent={rate} size="small" status={status} />;
      }
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
      render: (value) => value || '-'
    }
  ];

  const recentColumns = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '耗材名称',
      dataIndex: ['Consumable', 'name'],
      key: 'consumableName',
      width: 150
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'in' ? 'green' : 'red'}>
          {type === 'in' ? '入库' : '出库'}
        </Tag>
      )
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value, record) => (
        <span style={{ color: record.type === 'in' ? '#52c41a' : '#ff4d4f' }}>
          {record.type === 'in' ? '+' : '-'}{value}
        </span>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
      render: (value) => value || '-'
    }
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="耗材种类总数"
              value={summary.total}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="低库存预警"
              value={summary.lowStock}
              prefix={<WarningOutlined style={{ color: summary.lowStock > 0 ? '#ff4d4f' : '#52c41a' }} />}
              valueStyle={{ color: summary.lowStock > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存总价值"
              value={parseFloat(summary.totalValue || 0)}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="净入库量"
              value={stats.inQuantity - stats.outQuantity}
              prefix={<InboxOutlined style={{ color: stats.inQuantity - stats.outQuantity >= 0 ? '#52c41a' : '#ff4d4f' }} />}
              valueStyle={{ color: stats.inQuantity - stats.outQuantity >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="入库出库统计" extra={
            <RangePicker value={dateRange} onChange={setDateRange} />
          }>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                  <Statistic
                    title="入库次数"
                    value={stats.inCount}
                    prefix={<InboxOutlined style={{ color: '#52c41a' }} />}
                  />
                  <div style={{ marginTop: 8, color: '#52c41a', fontSize: 20, fontWeight: 'bold' }}>
                    +{stats.inQuantity}
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#fff1f0', borderColor: '#ffa39e' }}>
                  <Statistic
                    title="出库次数"
                    value={stats.outCount}
                    prefix={<ExportOutlined style={{ color: '#ff4d4f' }} />}
                  />
                  <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 20, fontWeight: 'bold' }}>
                    -{stats.outQuantity}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分类统计">
            <Space wrap>
              {summary.byCategory?.map(item => (
                <Card size="small" key={item.category} style={{ width: 140 }}>
                  <Statistic
                    title={item.category}
                    value={item.count}
                    valueStyle={{ fontSize: 24 }}
                  />
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title={<span><ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />低库存预警</span>}
            extra={<Tag color="red">{lowStockItems.length}项</Tag>}
          >
            <Table
              columns={lowStockColumns}
              dataSource={lowStockItems}
              rowKey="consumableId"
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近出入库记录">
            <Table
              columns={recentColumns}
              dataSource={stats.recentRecords}
              rowKey="recordId"
              pagination={false}
              size="small"
              scroll={{ x: 900 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ConsumableStatistics;
