import React from 'react';
import {
  CloudServerOutlined, SwitcherOutlined, DatabaseOutlined,
  CloudOutlined, LaptopOutlined, MobileOutlined,
  PrinterOutlined
} from '@ant-design/icons';

// 设备图标映射
const getDeviceIcon = (deviceType) => {
  try {
    if (!deviceType) return <CloudServerOutlined style={{ color: '#ffffff' }} />;
    const type = deviceType.toLowerCase();
    
    if (type.includes('server') || type.includes('服务器')) return <CloudServerOutlined style={{ color: '#ffffff' }} />;
    if (type.includes('switch') || type.includes('交换机')) return <SwitcherOutlined style={{ color: '#ffffff' }} />;
    if (type.includes('storage') || type.includes('存储')) return <DatabaseOutlined style={{ color: '#ffffff' }} />;
    if (type.includes('router') || type.includes('路由器')) return <CloudOutlined style={{ color: '#ffffff' }} />;
    if (type.includes('laptop') || type.includes('笔记本')) return <LaptopOutlined style={{ color: '#ffffff' }} />;
    if (type.includes('mobile') || type.includes('手机')) return <MobileOutlined style={{ color: '#ffffff' }} />;
    if (type.includes('printer') || type.includes('打印机')) return <PrinterOutlined style={{ color: '#ffffff' }} />;
    
    return <CloudServerOutlined style={{ color: '#ffffff' }} />;
  } catch (error) {
    console.error('设备图标渲染错误:', error);
    return <CloudServerOutlined style={{ color: '#ffffff' }} />;
  }
};

// 设备状态颜色映射
const getDeviceStatusColor = (status) => {
  const statusColorMap = {
    'normal': '#10b981',
    'running': '#10b981',
    'warning': '#f59e0b',
    'error': '#ef4444',
    'fault': '#ef4444',
    'offline': '#6b7280',
    'maintenance': '#3b82f6',
    undefined: '#3b82f6',
    null: '#3b82f6'
  };
  return statusColorMap[status] || '#3b82f6';
};

// 设备状态主题
const getStatusTheme = (status) => {
  const themeMap = {
    'normal': {
      bgGradient: 'linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)',
      borderColor: '#10b981',
      topBorderColor: '#34d399',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10b981',
      label: '正常'
    },
    'running': {
      bgGradient: 'linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%)',
      borderColor: '#10b981',
      topBorderColor: '#34d399',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10b981',
      label: '运行中'
    },
    'warning': {
      bgGradient: 'linear-gradient(180deg, #d97706 0%, #b45309 50%, #92400e 100%)',
      borderColor: '#f59e0b',
      topBorderColor: '#fbbf24',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      shadowColor: 'rgba(245, 158, 11, 0.3)',
      iconColor: '#f59e0b',
      label: '警告'
    },
    'error': {
      bgGradient: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
      borderColor: '#ef4444',
      topBorderColor: '#f87171',
      glowColor: 'rgba(239, 68, 68, 0.5)',
      shadowColor: 'rgba(239, 68, 68, 0.4)',
      iconColor: '#ef4444',
      label: '故障'
    },
    'fault': {
      bgGradient: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
      borderColor: '#ef4444',
      topBorderColor: '#f87171',
      glowColor: 'rgba(239, 68, 68, 0.5)',
      shadowColor: 'rgba(239, 68, 68, 0.4)',
      iconColor: '#ef4444',
      label: '故障'
    },
    'offline': {
      bgGradient: 'linear-gradient(180deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
      borderColor: '#6b7280',
      topBorderColor: '#9ca3af',
      glowColor: 'rgba(107, 114, 128, 0.2)',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      iconColor: '#9ca3af',
      label: '离线'
    },
    'maintenance': {
      bgGradient: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
      borderColor: '#3b82f6',
      topBorderColor: '#60a5fa',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      shadowColor: 'rgba(59, 130, 246, 0.3)',
      iconColor: '#3b82f6',
      label: '维护中'
    },
    'default': {
      bgGradient: 'linear-gradient(180deg, #3d4451 0%, #2d3139 50%, #252930 100%)',
      borderColor: '#4a5568',
      topBorderColor: '#565c6b',
      glowColor: 'rgba(56, 189, 248, 0.2)',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      iconColor: '#38bdf8',
      label: '未知'
    }
  };
  
  return themeMap[status] || themeMap['default'];
};

// 设备样式计算
const getDeviceStyle = (device, rackHeight) => {
  // 添加参数验证
  if (!device || typeof device.position !== 'number' || typeof device.height !== 'number') {
    return {};
  }
  
  const uHeight = 25; // 调整为更小的U高度以适应屏幕显示，1U=25px
  const deviceHeight = Math.max(1, device.height) * uHeight;
  
  // 设备位置从底部开始计算（U1在底部）
  let position = Math.max(1, device.position);
  let deviceUHeight = Math.max(1, device.height);
  
  // 确保设备不会超出机柜范围
  if (position + deviceUHeight - 1 > rackHeight) {
    // 如果设备会超出机柜，调整位置或高度
    position = Math.max(1, rackHeight - deviceUHeight + 1);
  }
  
  // 计算设备的顶部位置（从机柜顶部算起）
  // 设备占用从 position 到 position + height - 1 的U
  // 机柜顶部是U0，所以设备顶部的topPosition是：
  const deviceBottomU = position; // 设备底部U数
  const deviceTopU = position + deviceUHeight - 1; // 设备顶部U数
  const topPosition = (rackHeight - deviceTopU) * uHeight;
  
  return {
    height: `${deviceHeight}px`, // 确保设备高度精确等于U位高度
    top: `${topPosition}px`, // 确保设备顶部与U位网格线对齐
    // 移除任何可能影响占满U位的样式
    margin: 0,
    padding: 0
  };
};

// 设备组件
const DeviceComponent = ({ device, rackHeight, isHighlighted, onMouseEnter, onMouseLeave }) => {
  try {
    // 处理统一化后的设备数据
    const deviceId = device?.deviceId || device?.id || device?.device_id || device?.device || `device-${Math.random()}`;
    const deviceName = device?.name || device?.deviceName || device?.device_name || device?.title || '未知设备';
    const position = device?.position || 1;
    const height = device?.height || 1;
    
    // 获取状态主题
    const statusTheme = getStatusTheme(device?.status);
    const statusColor = getDeviceStatusColor(device?.status);
    
    return (
      <div 
        key={deviceId} 
        className={`device ${isHighlighted ? 'highlighted' : ''} ${device?.status === 'warning' ? 'status-warning' : ''} ${(device?.status === 'error' || device?.status === 'fault') ? 'status-error' : ''}`}
        style={{
          ...getDeviceStyle(device, rackHeight),
          background: statusTheme.bgGradient,
          border: isHighlighted 
            ? `2px solid ${statusTheme.topBorderColor}` 
            : `1px solid ${statusTheme.borderColor}`,
          borderTop: isHighlighted
            ? `2px solid ${statusTheme.topBorderColor}`
            : `1px solid ${statusTheme.topBorderColor}`
        }}
        onMouseEnter={(e) => {
          const isOneU = (device?.height || 1) === 1;
          const isFaultStatus = device?.status === 'error' || device?.status === 'fault';
          if (isOneU && !isFaultStatus) {
            e.currentTarget.style.height = '33px';
            e.currentTarget.style.zIndex = '150';
          }
          e.currentTarget.style.transform = 'scale(1.008)';
          e.currentTarget.style.boxShadow = `
            0 4px 12px ${statusTheme.shadowColor},
            0 2px 6px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.15)
          `;
          e.currentTarget.style.borderColor = statusTheme.topBorderColor;
          
          if (onMouseEnter) {
            const rect = e.currentTarget.getBoundingClientRect();
            onMouseEnter({ device, position: { x: rect.right + 5, y: rect.top + rect.height / 2 } });
          }
        }}
        onMouseLeave={(e) => {
          const isOneU = (device?.height || 1) === 1;
          const isFaultStatus = device?.status === 'error' || device?.status === 'fault';
          if (isOneU && !isFaultStatus) {
            const originalHeight = (device?.height || 1) * 25;
            e.currentTarget.style.height = `${originalHeight}px`;
            e.currentTarget.style.zIndex = '100';
          }
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = `
            0 1px 2px rgba(0,0,0,0.3),
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `;
          e.currentTarget.style.borderColor = statusTheme.borderColor;
          if (onMouseLeave) {
            onMouseLeave();
          }
        }}
      >
        <div className="device-status-top-bar" style={{
          background: `linear-gradient(90deg, ${statusTheme.topBorderColor} 0%, ${statusTheme.borderColor} 50%, ${statusTheme.topBorderColor} 100%)`
        }} />
        
          {/* 左侧状态指示区域 - 增强版 */}
          <div className="device-status-indicator" style={{
            background: isHighlighted 
              ? `linear-gradient(180deg, ${statusTheme.borderColor}33 0%, ${statusTheme.borderColor}22 100%)`
              : `linear-gradient(180deg, ${statusTheme.borderColor}44 0%, ${statusTheme.borderColor}22 100%)`,
            borderRight: `1px solid ${statusTheme.borderColor}66`
          }}>
            {/* 设备类型标识 */}
            <div className="device-type-badge" style={{
              background: `linear-gradient(180deg, ${statusTheme.borderColor}66 0%, ${statusTheme.borderColor}33 100%)`,
              border: `1px solid ${statusTheme.borderColor}44`
            }}>
              <span className="device-type-text" style={{ color: statusTheme.topBorderColor }}>
                {device.type?.toUpperCase() || 'DEV'}
              </span>
            </div>
            
            {/* LED状态指示灯组 */}
            <div className="device-leds">
              {/* 主状态灯 */}
              <div className="main-status-leds">
                <div className={`led ${device.status === 'warning' ? 'status-warning' : ''} ${device.status === 'error' ? 'status-error' : ''} ${device.status === 'normal' || device.status === 'running' ? 'status-normal' : 'offline'}`} style={{
                  backgroundColor: getDeviceStatusColor(device.status),
                  boxShadow: `0 0 8px ${getDeviceStatusColor(device.status)}`
                }} />
                <div className={`led ${device.status === 'running' ? 'status-running' : 'offline'}`} />
                <div className="led status-running" />
              </div>
              
              {/* 电源指示灯 */}
              <div className="power-led">
                <div className={`power-led-indicator ${device.status !== 'offline' ? 'on' : ''}`} />
                <span className={`power-led-text ${device.status !== 'offline' ? 'on' : ''}`}>
                  PWR
                </span>
              </div>
            </div>
            
            {/* 设备序列号标签 */}
            <div className="device-serial">
              <span className="device-serial-text">
                SN:{device.serial?.slice(-4) || '0000'}
              </span>
            </div>
          </div>
          
          {/* 中间设备信息区域 - 增强版 */}
          <div className="device-info">
            {/* 设备品牌/厂商标识 */}
            <div className="device-brand">
              <div className="device-brand-icon">
                {getDeviceIcon(device.type)}
              </div>
              <span className="device-brand-text">
                {device.brand || 'ENTERPRISE'}
              </span>
            </div>
            
            {/* 设备名称 */}
            <div className="device-name">
              {deviceName}
            </div>
            
            {/* 型号和规格 */}
            <div className="device-model">
              <span className="device-model-text">
                {device.model || device.type?.toUpperCase() || 'STD'}
              </span>
              {device.ip && (
                <span className="device-ip">
                  {device.ip}
                </span>
              )}
            </div>
            
            {/* 散热/通风口装饰 - 根据设备类型显示 */}
            {(device.type === 'server' || device.type === 'storage') && (
              <div className="device-ventilation">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="ventilation-fin" />
                ))}
              </div>
            )}
          </div>
          
          {/* 右侧端口/功能区域 - 增强版 */}
          <div className="device-ports">
            {/* 端口指示灯阵列 */}
            <div className="port-leds">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`port-led ${i < 3 ? 'active' : 'inactive'}`} />
              ))}
            </div>
            
            {/* 管理接口标识 */}
            <div className="management-interface">
              <div className="management-icon" />
              <span className="management-text">
                MGMT
              </span>
            </div>
            
            {/* 设备高度U数标识 */}
            <div className="device-height">
              {device.height}U
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('设备渲染错误:', error, device);
      // 渲染一个简单的错误显示元素
      return (
        <div 
          key={`error-${Math.random()}`} 
          style={{
            position: 'absolute',
            left: '35px',
            right: '35px',
            top: '50%',
            height: '30px',
            transform: 'translateY(-50%)',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            borderRadius: '4px'
          }}
        >
          设备加载错误
        </div>
      );
    }
  };

// 默认导出
export default DeviceComponent;