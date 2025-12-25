import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, DatePicker, Select, Input, message, Popconfirm, Typography, Drawer, Descriptions, Timeline } from 'antd';
import { ReloadOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { operationLogAPI } from '../api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OperationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({});
  const [actions, setActions] = useState([]);
  const [modules, setModules] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchOptions();
  }, [pagination.current, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      };
      const response = await operationLogAPI.list(params);
      if (response.success) {
        setLogs(response.data.logs);
        setPagination(prev => ({ ...prev, total: response.data.total }));
      }
    } catch (error) {
      message.error('获取操作日志失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [actionsRes, modulesRes] = await Promise.all([
        operationLogAPI.getActions(),
        operationLogAPI.getModules()
      ]);
      if (actionsRes.success) setActions(actionsRes.data);
      if (modulesRes.success) setModules(modulesRes.data);
    } catch (error) {
      console.error('获取选项失败:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setFilters(prev => ({
        ...prev,
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString()
      }));
    } else {
      setFilters(prev => ({ ...prev, startDate: undefined, endDate: undefined }));
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleClear = async () => {
    try {
      const response = await operationLogAPI.clear({ days: 30 });
      if (response.success) {
        message.success('已清理30天前的日志');
        fetchLogs();
      }
    } catch (error) {
      message.error('清理失败');
    }
  };

  const showDetail = (log) => {
    setSelectedLog(log);
    setDetailVisible(true);
  };

  const getActionColor = (action) => {
    if (action.includes('删除')) return 'red';
    if (action.includes('创建')) return 'green';
    if (action.includes('修改')) return 'blue';
    if (action.includes('登录')) return 'purple';
    return 'default';
  };

  const getModuleColor = (module) => {
    const colors = {
      user: 'blue',
      role: 'green',
      device: 'orange',
      consumable: 'purple',
      system: 'cyan'
    };
    return colors[module] || 'default';
  };

  const columns = [
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 180,
      sorter: (a, b) => new Date(b.operateTime) - new Date(a.operateTime),
      render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作人',
      key: 'operator',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.realName || record.username}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>@{record.username}</div>
        </div>
      )
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action) => (
        <Tag color={getActionColor(action)}>{action || '-'}</Tag>
      )
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (module) => (
        <Tag color={getModuleColor(module)}>
          {module === 'user' ? '用户' : 
           module === 'role' ? '角色' : 
           module === 'device' ? '设备' : 
           module === 'consumable' ? '耗材' : 
           module === 'system' ? '系统' : module}
        </Tag>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '目标',
      key: 'target',
      width: 120,
      render: (_, record) => record.targetName || record.targetId || '-'
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (ip) => ip || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => showDetail(record)}
        />
      )
    }
  ];

  const pageHeaderStyle = {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0
  };

  return (
    <div>
      <div style={pageHeaderStyle}>
        <h1 style={titleStyle}>操作日志</h1>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchLogs}>刷新</Button>
          <Popconfirm title="确定清理30天前的日志？" onConfirm={handleClear}>
            <Button danger>清理旧日志</Button>
          </Popconfirm>
        </Space>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <Space wrap>
          <Input.Search
            placeholder="搜索操作人"
            style={{ width: 150 }}
            onSearch={(value) => handleFilterChange('username', value)}
            allowClear
          />
          <Select
            placeholder="操作类型"
            allowClear
            style={{ width: 140 }}
            onChange={(value) => handleFilterChange('action', value)}
            options={actions}
            fieldNames={{ label: 'label', value: 'value' }}
          />
          <Select
            placeholder="模块"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange('module', value)}
            options={modules}
            fieldNames={{ label: 'label', value: 'value' }}
          />
          <RangePicker onChange={handleDateChange} showTime />
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={(newPagination) => {
            setPagination(prev => ({ ...prev, ...newPagination }));
          }}
        />
      </Card>

      <Drawer
        title="日志详情"
        placement="right"
        width={500}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {selectedLog && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="操作时间">
              {selectedLog.operateTime ? dayjs(selectedLog.operateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="操作人">
              {selectedLog.realName || selectedLog.username} (@{selectedLog.username})
            </Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={getActionColor(selectedLog.action)}>{selectedLog.action}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">
              <Tag color={getModuleColor(selectedLog.module)}>{selectedLog.module}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="描述">{selectedLog.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="目标对象">
              {selectedLog.targetName || selectedLog.targetId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">{selectedLog.ip || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedLog.status === 'success' ? 'green' : 'red'}>
                {selectedLog.status === 'success' ? '成功' : '失败'}
              </Tag>
            </Descriptions.Item>
            {selectedLog.errorMessage && (
              <Descriptions.Item label="错误信息">
                <span style={{ color: 'red' }}>{selectedLog.errorMessage}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
        {(selectedLog?.oldValue || selectedLog?.newValue) && (
          <div style={{ marginTop: '24px' }}>
            <Title level={5}>变更内容</Title>
            <Descriptions column={1} bordered size="small">
              {selectedLog.oldValue && (
                <Descriptions.Item label="旧值">
                  <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(JSON.parse(selectedLog.oldValue), null, 2)}
                  </pre>
                </Descriptions.Item>
              )}
              {selectedLog.newValue && (
                <Descriptions.Item label="新值">
                  <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(JSON.parse(selectedLog.newValue), null, 2)}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OperationLogs;
