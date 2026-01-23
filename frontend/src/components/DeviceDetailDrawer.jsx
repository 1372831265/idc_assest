import React, { useState, useCallback, useMemo } from 'react';
import { Drawer, Tabs, Tag, Space, Typography, Empty, Card, Tooltip } from 'antd';
import { ApiOutlined, CloudServerOutlined, EnvironmentOutlined } from '@ant-design/icons';
import NetworkCardPanel from './NetworkCardPanel';

const { Text, Title } = Typography;

const designTokens = {
  colors: {
    primary: '#667eea',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  },
  spacing: {
    sm: 8,
    md: 16
  }
};

function DeviceDetailDrawer({ device, visible, onClose, cables, onRefreshCables }) {
  const [activeTab, setActiveTab] = useState('ports');

  const deviceCables = useMemo(() => {
    if (!device || !cables) return [];
    return cables.filter(c =>
      c.sourceDeviceId === device.deviceId || c.targetDeviceId === device.deviceId
    );
  }, [device, cables]);

  const getStatusTag = useCallback((status) => {
    const config = {
      running: { color: 'success', text: '运行中' },
      normal: { color: 'success', text: '正常' },
      warning: { color: 'warning', text: '警告' },
      error: { color: 'error', text: '故障' },
      fault: { color: 'error', text: '故障' },
      offline: { color: 'default', text: '离线' },
      maintenance: { color: 'processing', text: '维护中' }
    };
    const { color, text } = config[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  }, []);

  const getDeviceTypeName = useCallback((type) => {
    const typeMap = {
      server: '服务器',
      switch: '交换机',
      router: '路由器',
      storage: '存储设备',
      firewall: '防火墙',
      ups: 'UPS',
      pdu: 'PDU'
    };
    return typeMap[type?.toLowerCase()] || type || '未知设备';
  }, []);

  const tabItems = [
    {
      key: 'ports',
      label: (
        <span>
          <ApiOutlined />
          端口与网卡
        </span>
      ),
      children: (
        <NetworkCardPanel
          deviceId={device?.deviceId}
          deviceName={device?.name}
          onRefresh={onRefreshCables}
        />
      )
    },
    {
      key: 'cables',
      label: (
        <span>
          <EnvironmentOutlined />
          接线 ({deviceCables.length})
        </span>
      ),
      children: (
        <div className="cable-panel">
          {deviceCables.length === 0 ? (
            <Empty description="该设备暂无接线" />
          ) : (
            <Space direction="vertical" size={designTokens.spacing.md} style={{ width: '100%' }}>
              {deviceCables.map(cable => (
                <Card
                  key={cable.cableId}
                  size="small"
                  style={{ borderRadius: '8px' }}
                >
                  <div style={{ marginBottom: designTokens.spacing.sm }}>
                    <Space direction="vertical" size={4}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>源设备：</Text>
                        <div style={{ fontWeight: 500 }}>
                          {cable.sourceDevice?.name || '-'}
                          <Tag color="blue" style={{ marginLeft: '8px' }}>{cable.sourcePort}</Tag>
                        </div>
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>目标设备：</Text>
                        <div style={{ fontWeight: 500 }}>
                          {cable.targetDevice?.name || '-'}
                          <Tag color="green" style={{ marginLeft: '8px' }}>{cable.targetPort}</Tag>
                        </div>
                      </div>
                    </Space>
                  </div>

                  <Space wrap>
                    <Tag color={cable.status === 'normal' ? 'success' : cable.status === 'fault' ? 'error' : 'default'}>
                      {cable.status === 'normal' ? '正常' : cable.status === 'fault' ? '故障' : '未连接'}
                    </Tag>
                    <Tag color="purple">
                      {cable.cableType === 'ethernet' ? '网线' : cable.cableType === 'fiber' ? '光纤' : '铜缆'}
                    </Tag>
                    {cable.cableLength && (
                      <Tag color="orange">
                        {cable.cableLength}m
                      </Tag>
                    )}
                  </Space>

                  {cable.description && (
                    <div style={{ marginTop: designTokens.spacing.sm, fontSize: '12px', color: '#666' }}>
                      {cable.description}
                    </div>
                  )}
                </Card>
              ))}
            </Space>
          )}
        </div>
      )
    }
  ];

  if (!device) return null;

  return (
    <Drawer
      title={
        <Space>
          <CloudServerOutlined style={{ color: designTokens.colors.primary }} />
          <span>设备详情 - {device.name}</span>
        </Space>
      }
      placement="right"
      width={520}
      open={visible}
      onClose={onClose}
      styles={{ body: { padding: '16px 20px', overflow: 'auto' } }}
    >
      <div className="device-info-section" style={{ marginBottom: '20px' }}>
        <Title level={5} style={{ margin: '0 0 12px 0', color: '#1e293b' }}>基本信息</Title>
        <div className="info-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '10px'
        }}>
          <div className="info-item">
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>设备ID</Text>
            <Text strong style={{ fontSize: '14px' }}>{device.deviceId}</Text>
          </div>
          <div className="info-item">
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>设备类型</Text>
            <Text strong style={{ fontSize: '14px' }}>{getDeviceTypeName(device.type)}</Text>
          </div>
          <div className="info-item">
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>设备状态</Text>
            {getStatusTag(device.status)}
          </div>
          <div className="info-item">
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>位置</Text>
            <Text strong style={{ fontSize: '14px' }}>
              U{device.position} {device.height && `(${device.height}U)`}
            </Text>
          </div>
          {device.ipAddress && (
            <div className="info-item">
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>IP地址</Text>
              <Text strong style={{ fontSize: '14px' }}>{device.ipAddress}</Text>
            </div>
          )}
          {device.brand && (
            <div className="info-item">
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>品牌</Text>
              <Text strong style={{ fontSize: '14px' }}>{device.brand}</Text>
            </div>
          )}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Drawer>
  );
}

export default React.memo(DeviceDetailDrawer);
