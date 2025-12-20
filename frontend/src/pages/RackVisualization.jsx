import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Space, message, Tooltip } from 'antd';
import { 
  ReloadOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  RotateRightOutlined,
  CloudServerOutlined,
  SwitcherOutlined,
  DatabaseOutlined,
  CloudOutlined,
  LaptopOutlined,
  MobileOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }
`;
document.head.appendChild(style);

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('机柜可视化组件错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: '20px'
        }}>
          <h2 style={{ color: '#f44336' }}>可视化组件出错了</h2>
          <p style={{ color: '#666', margin: '10px 0' }}>
            错误信息: {this.state.error?.toString()}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function RackVisualization() {
  const [racks, setRacks] = useState([]);
  const [selectedRack, setSelectedRack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState(null);
  const [hoveredDevice, setHoveredDevice] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // 获取所有机柜
  const fetchRacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/racks');
      
      // 验证数据结构并过滤有效机柜
      const validRacks = response.data.filter(rack => 
        rack && 
        typeof rack === 'object' && 
        rack.rackId && 
        typeof rack.height === 'number'
      );
      
      setRacks(validRacks);
      if (validRacks.length > 0) {
        setSelectedRack(validRacks[0]);
        fetchDevices(validRacks[0].rackId);
      } else {
        setSelectedRack(null);
        setDevices([]);
        message.warning('未找到有效的机柜数据');
      }
    } catch (error) {
      message.error('获取机柜列表失败');
      console.error('获取机柜列表失败:', error);
      setError(error);
      setRacks([]);
      setSelectedRack(null);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // 获取机柜内的设备
  const fetchDevices = async (rackId) => {
    try {
      setLoadingDevices(true);
      console.log(`=== 开始获取机柜 ${rackId} 的设备数据 ===`);
      console.log('API URL:', `/api/devices?rackId=${rackId}`);
      
      const response = await axios.get(`/api/devices?rackId=${rackId}`);
      
      console.log('=== API响应完整信息 ===');
      console.log('HTTP状态码:', response.status);
      console.log('响应头:', response.headers);
      console.log('响应数据类型:', typeof response.data);
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
      
      // 处理不同的响应格式
      let devicesData;
      if (Array.isArray(response.data)) {
        devicesData = response.data;
        console.log('响应是数组格式');
      } else if (response.data && Array.isArray(response.data.data)) {
        devicesData = response.data.data;
        console.log('响应是对象格式，数组在data字段中');
      } else if (response.data && Array.isArray(response.data.devices)) {
        devicesData = response.data.devices;
        console.log('响应是对象格式，数组在devices字段中');
      } else {
        devicesData = [];
        console.log('响应不是预期格式，设置为空数组');
      }
      
      console.log('=== 处理后的设备数据 ===');
      console.log('设备数组长度:', devicesData.length);
      console.log('设备数据:', devicesData);
      
      // 如果没有数据，显示警告
      if (devicesData.length === 0) {
        console.warn('=== 没有找到设备数据 ===');
        console.warn('可能的原因:');
        console.warn('1. 数据库中该机柜确实没有设备');
        console.warn('2. API路由配置错误');
        console.warn('3. 数据库查询条件问题');
        message.warning(`机柜 ${rackId} 暂无设备数据`);
        setDevices([]);
        return;
      }
      
      // 显示原始数据结构以供调试
      console.log('=== 数据结构分析 ===');
      if (devicesData.length > 0) {
        const firstDevice = devicesData[0];
        console.log('第一个设备完整数据:', JSON.stringify(firstDevice, null, 2));
        console.log('第一个设备的字段:', Object.keys(firstDevice));
        console.log('第一个设备的字段类型:');
        Object.keys(firstDevice).forEach(key => {
          console.log(`  ${key}: ${typeof firstDevice[key]} = ${JSON.stringify(firstDevice[key])}`);
        });
      }
      
      // 过滤有效的设备数据 - 放宽验证条件
      const validDevices = devicesData.filter(device => {
        if (!device) {
          console.log('跳过空设备');
          return false;
        }
        
        console.log('设备数据:', device);
        
        // 只要求有任意ID字段或标识符
        const hasId = device.deviceId || device.id || device.device_id || device.device;
        if (!hasId) {
          console.log('跳过缺少ID的设备:', device);
          return false;
        }
        
        // 放宽名称验证
        const hasName = device.name || device.deviceName || device.device_name || device.title;
        if (!hasName) {
          console.log('跳过缺少名称的设备:', device);
          return false;
        }
        
        // 检查位置和高度，允许字符串类型并转换
        let position = device.position || device.u_position || device.uPos || device.u;
        let height = device.height || device.u_height || device.uHeight || device.size || 1;
        
        // 如果是字符串，尝试转换为数字
        if (typeof position === 'string') {
          position = parseInt(position, 10);
        }
        if (typeof height === 'string') {
          height = parseInt(height, 10);
        }
        
        if (typeof position !== 'number' || isNaN(position) || position <= 0) {
          console.log('跳过位置无效的设备:', device);
          return false;
        }
        
        if (typeof height !== 'number' || isNaN(height) || height <= 0) {
          console.log('跳过高度无效的设备:', device);
          return false;
        }
        
        // 统一化数据格式
        device.position = position;
        device.height = height;
        device.name = hasName;
        device.deviceId = hasId;
        
        console.log('有效的设备:', device);
        return true;
      });
      
      console.log('最终有效设备列表:', validDevices);
      setDevices(validDevices);
      
      if (validDevices.length === 0) {
        console.warn('未找到有效设备数据');
        message.warning('该机柜内暂无设备数据');
      }
    } catch (error) {
      message.error('获取设备列表失败');
      console.error('获取设备列表失败:', error);
      setDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchRacks();
  }, []);

  // 根据设备类型获取图标
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

  // 根据设备类型获取背景色
  const getDeviceColor = (deviceType) => {
    if (!deviceType) return '#1890ff';
    const type = deviceType.toLowerCase();
    
    if (type.includes('server') || type.includes('服务器')) return '#1890ff'; // 蓝色
    if (type.includes('switch') || type.includes('交换机')) return '#52c41a'; // 绿色
    if (type.includes('storage') || type.includes('存储')) return '#faad14'; // 黄色
    if (type.includes('router') || type.includes('路由器')) return '#f5222d'; // 红色
    if (type.includes('laptop') || type.includes('笔记本')) return '#722ed1'; // 紫色
    if (type.includes('mobile') || type.includes('手机')) return '#eb2f96'; // 粉色
    if (type.includes('printer') || type.includes('打印机')) return '#13c2c2'; // 青色
    
    return '#1890ff'; // 默认蓝色
  };

  const getDeviceStyle = (device, rackHeight) => {
    // 添加参数验证
    if (!device || typeof device.position !== 'number' || typeof device.height !== 'number') {
      return {};
    }
    
    const uHeight = 18; // 每个U的高度（像素）
    const deviceHeight = Math.max(1, device.height) * uHeight;
    
    // 设备位置从底部开始计算（U1在底部）
    const position = Math.max(1, Math.min(device.position, rackHeight));
    const deviceUHeight = Math.max(1, device.height);
    
    // 计算设备的顶部位置（从机柜顶部算起）
    // 设备占用从 position 到 position + height - 1 的U
    // 机柜顶部是U0，所以设备顶部的topPosition是：
    const deviceBottomU = position; // 设备底部U数
    const deviceTopU = position + deviceUHeight - 1; // 设备顶部U数
    const topPosition = (rackHeight - deviceTopU - 1) * uHeight;
    
    return {
      height: `${deviceHeight}px`, // 确保设备高度精确等于U位高度
      top: `${topPosition}px`, // 确保设备顶部与U位网格线对齐
      // 移除任何可能影响占满U位的样式
      margin: 0,
      padding: 0
    };
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    } catch (error) {
      return '无效日期';
    }
  };

  // 获取设备类型中文名称
  const getDeviceTypeName = (type) => {
    const typeMap = {
      'server': '服务器',
      'switch': '交换机',
      'router': '路由器',
      'storage': '存储设备',
      'ups': 'UPS',
      'firewall': '防火墙',
      'other': '其他设备'
    };
    return typeMap[type?.toLowerCase()] || '未知设备';
  };

  // 生成U数标记（每个U都有标记）
  const generateUMarks = (height) => {
    const marks = [];
    const uHeight = 18;
    
    for (let i = 1; i <= height; i++) {
      marks.push(
        <div 
          key={i} 
          className="u-mark"
          style={{
            top: `${(height - i) * uHeight + 1}px`,
            height: '1px',
            backgroundColor: i % 5 === 0 ? '#1890ff' : '#999',
            width: '100%',
            position: 'absolute',
            borderTop: i % 5 === 0 ? '2px solid #1890ff' : '1px solid #999'
          }}
        >
          <span style={{
            position: 'absolute',
            left: '-40px',
            top: '-12px',
            fontSize: '12px',
            color: i % 5 === 0 ? '#1890ff' : '#ccc',
            fontWeight: i % 5 === 0 ? 'bold' : 'normal',
            textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
          }}>
            {i}
          </span>
        </div>
      );
    }
    
    return marks;
  };

  // 生成左侧U数标记（从实际范围开始显示）
  const generateLeftUMarks = (height) => {
    const marks = [];
    const uHeight = 18;
    
    // 从实际U位范围开始（通常是4-42U或类似范围）
    const startU = Math.max(1, height - 40); // 假设机柜有40U左右，从较高位置开始显示
    
    for (let i = 1; i <= height; i++) {
      const actualU = startU + i - 1;
      if (actualU <= 42) { // 只显示到42U
        marks.push(
          <div key={`left-${i}`}>
            {/* U位网格背景 */}
            <div 
              style={{
                position: 'absolute',
                top: `${(height - i) * uHeight}px`,
                left: '0',
                width: '25px',
                height: `${uHeight}px`,
                backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                borderRight: '1px solid #555'
              }}
            />
            {/* U位序号 */}
            <div 
              style={{
                position: 'absolute',
                top: `${(height - i) * uHeight + 1}px`,
                left: '0',
                width: '25px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i % 5 === 0 ? '#00ff88' : '#ccc',
                fontSize: '10px',
                fontWeight: i % 5 === 0 ? 'bold' : 'normal',
                textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
                zIndex: 2
              }}
            >
              {actualU}
            </div>
          </div>
        );
      }
    }
    
    return marks;
  };

  // 生成右侧U数标记（从实际范围开始显示）
  const generateRightUMarks = (height) => {
    const marks = [];
    const uHeight = 18;
    
    // 从实际U位范围开始（通常是4-42U或类似范围）
    const startU = Math.max(1, height - 40); // 假设机柜有40U左右，从较高位置开始显示
    
    for (let i = 1; i <= height; i++) {
      const actualU = startU + i - 1;
      if (actualU <= 42) { // 只显示到42U
        marks.push(
          <div key={`right-${i}`}>
            {/* U位网格背景 */}
            <div 
              style={{
                position: 'absolute',
                top: `${(height - i) * uHeight}px`,
                right: '0',
                width: '25px',
                height: `${uHeight}px`,
                backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                borderLeft: '1px solid #555'
              }}
            />
            {/* U位序号 */}
            <div 
              style={{
                position: 'absolute',
                top: `${(height - i) * uHeight + 1}px`,
                right: '0',
                width: '25px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i % 5 === 0 ? '#00ff88' : '#ccc',
                fontSize: '10px',
                fontWeight: i % 5 === 0 ? 'bold' : 'normal',
                textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
                zIndex: 2
              }}
            >
              {actualU}
            </div>
          </div>
        );
      }
    }
    
    return marks;
  };

  // 选择机柜
  const handleRackChange = (rackId) => {
    const rack = racks.find(r => r.rackId === rackId);
    if (rack) {
      setSelectedRack(rack);
      fetchDevices(rackId);
    }
  };

  // 重新加载数据
  const handleReload = () => {
    setLoading(true);
    fetchRacks().then(() => {
      message.success('数据已刷新');
    });
  };

  // 重置视角
  const handleResetView = () => {
    setZoom(1);
    setRotation(0);
  };

  // 放大
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2.5));
  };

  // 缩小
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  // 无需额外的初始化，CSS 3D变换直接在JSX中实现

  return (
    <div>
      <Card 
        title="机柜可视化"
        extra={
          <Space>
            <Select
              placeholder="选择机柜"
              style={{ width: 200 }}
              value={selectedRack?.rackId}
              onChange={handleRackChange}
              loading={loading}
              disabled={loading}
            >
              {racks.map(rack => (
                <Option key={rack?.rackId || `rack-${Math.random()}`} value={rack?.rackId}>
                  {rack?.Room?.name || '未知机房'} - {rack?.name || '未知机柜'} ({rack?.rackId || '无ID'}) - {rack?.height || 0}U
                </Option>
              ))}
            </Select>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReload}
              loading={loading}
              disabled={loading}
            >
              刷新
            </Button>
          </Space>
        }  
      >
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ZoomInOutlined />} onClick={handleZoomIn}>放大</Button>
          <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut}>缩小</Button>
          <Button icon={<RotateRightOutlined />} onClick={handleResetView}>重置视角</Button>
        </Space>
        
        <ErrorBoundary>
                  {loading ? (
                    <div style={{ 
                      width: '100%', 
                      height: '600px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#f5f5f5',
                      fontSize: '16px',
                      color: '#666'
                    }}>
                      加载机柜数据中...
                    </div>
                  ) : selectedRack ? (
                    <div style={{ 
                      width: '100%', 
                      height: '600px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      perspective: '1000px',
                      overflow: 'auto',
                      backgroundColor: '#f5f5f5',
                      position: 'relative' // 为设备详情面板定位
                    }}>
              {loadingDevices && (
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000
                }}>
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    加载设备数据中...
                  </div>
                </div>
              )}
              <div 
                style={{
                  transform: `scale(${zoom}) rotateY(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 机柜主体 */}
                <div style={{
                  position: 'relative',
                  width: '200px',
                  height: `${selectedRack.height * 18}px`,
                  background: 'linear-gradient(145deg, #5d6d7e, #7f8c8d)',
                  border: '2px solid #4a5c6a',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transformStyle: 'preserve-3d',
                  overflow: 'hidden'
                }}>
                  {/* 前面板 */}
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: '3px',
                    right: '3px',
                    bottom: '3px',
                    background: 'linear-gradient(145deg, #2c3e50, #34495e)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    padding: '3px',
                    transform: 'translateZ(15px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'visible'
                  }}>
                    {/* 左侧U数标记 */}
                    <div style={{
                      position: 'absolute',
                      left: '-25px',
                      top: '0',
                      width: '25px',
                      height: '100%',
                      zIndex: 10
                    }}>
                      {generateLeftUMarks(selectedRack.height)}
                    </div>
                    
                    {/* 右侧U数标记 */}
                    <div style={{
                      position: 'absolute',
                      right: '-25px',
                      top: '0',
                      width: '25px',
                      height: '100%',
                      zIndex: 10
                    }}>
                      {generateRightUMarks(selectedRack.height)}
                    </div>
                    
                    {/* 原有的U数标记（内部） */}
                    {generateUMarks(selectedRack.height)}
                    
                    {/* 设备 */}
                    {/* 调试信息 */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      color: '#1890ff',
                      fontSize: '12px',
                      background: 'rgba(0,0,0,0.5)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      zIndex: 1000
                    }}>
                      设备数量: {devices.length}
                    </div>
                    
                    {devices.length > 0 ? devices.map(device => {
                      try {
                        // 处理统一化后的设备数据
                        const deviceId = device?.deviceId || device?.id || device?.device_id || device?.device || `device-${Math.random()}`;
                        const deviceName = device?.name || device?.deviceName || device?.device_name || device?.title || '未知设备';
                        const position = device?.position || 1;
                        const height = device?.height || 1;
                        
                        return (
                          <div 
                            key={deviceId} 
                            className="device"
                            style={{
                              ...getDeviceStyle(device, selectedRack.height),
                              position: 'absolute',
                              left: '0px', // 移除左边界
                              right: '0px', // 移除右边界
                              borderRadius: '4px',
                              display: 'flex',
                              cursor: 'pointer',
                              transform: 'translateZ(20px)',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                              backgroundColor: getDeviceColor(device.type),
                              opacity: 0.95,
                              border: '1px solid rgba(255,255,255,0.2)',
                              overflow: 'hidden', // 确保内容不溢出
                              margin: 0,
                              padding: 0,
                              zIndex: 100, // 确保设备在前景
                              pointerEvents: 'auto' // 确保可以接收鼠标事件
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateZ(25px) scale(1.01)';
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                              
                              // 清除之前的定时器
                              if (hoverTimeout) {
                                clearTimeout(hoverTimeout);
                                setHoverTimeout(null);
                              }
                              
                              // 延迟显示设备信息，避免快速移动时的闪烁
                              const timeout = setTimeout(() => {
                                // 使用设备ID确保状态设置正确
                                setHoveredDevice({
                                  ...device,
                                  _key: device.deviceId || device.id || device.device_id || device.device
                                });
                              }, 100);
                              
                              setHoverTimeout(timeout);
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateZ(20px) scale(1)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                              
                              // 清除之前的定时器
                              if (hoverTimeout) {
                                clearTimeout(hoverTimeout);
                                setHoverTimeout(null);
                              }
                              
                              // 延迟隐藏设备信息，给用户一些缓冲时间
                              const timeout = setTimeout(() => {
                                setHoveredDevice(null);
                              }, 200); // 增加延迟时间到200ms
                              
                              setHoverTimeout(timeout);
                            }}
                          >
                              {/* 左侧指示灯区域 */}
                              <div style={{
                                width: '15px', // 减小指示灯区域宽度
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: '4px 0 0 4px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '2px 1px',
                                gap: '1px',
                                flexShrink: 0
                              }}>
                                {/* 状态指示灯 */}
                                <div style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#00ff88',
                                  boxShadow: '0 0 3px #00ff88'
                                }} />
                                <div style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ffa500',
                                  boxShadow: '0 0 3px #ffa500'
                                }} />
                                <div style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ff4444',
                                  boxShadow: '0 0 3px #ff4444'
                                }} />
                              </div>
                              
                              {/* 中间模块/接口槽位区域 */}
                              <div style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderLeft: '1px solid rgba(255,255,255,0.2)',
                                borderRight: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center', // 居中显示
                                alignItems: 'center', // 水平居中
                                padding: '4px',
                                margin: '0 2px'
                              }}>
                                {/* 模拟接口槽位 */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(8px, 1fr))',
                                  gap: '1px',
                                  marginBottom: '3px',
                                  width: '100%',
                                  justifyItems: 'center'
                                }}>
                                  {Array.from({length: Math.min(6, Math.max(3, Math.floor(height * 1.5)))}, (_, i) => (
                                    <div key={i} style={{
                                      height: '6px',
                                      backgroundColor: 'rgba(255,255,255,0.2)',
                                      borderRadius: '1px',
                                      minWidth: '8px'
                                    }} />
                                  ))}
                                </div>
                                
                                {/* 设备图标和名称 - 居中显示 */}
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column', // 改为垂直布局
                                  alignItems: 'center',
                                  gap: '2px',
                                  color: '#ffffff',
                                  fontSize: '9px',
                                  fontWeight: 'bold',
                                  textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
                                  textAlign: 'center' // 文字居中
                                }}>
                                  <span style={{ fontSize: '12px', color: '#ffffff', textShadow: '1px 1px 1px rgba(0,0,0,0.8)', marginBottom: '2px' }}>
                                    {getDeviceIcon(device.type)}
                                  </span>
                                  <span style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%',
                                    lineHeight: '1.2'
                                  }}>
                                    {deviceName}
                                  </span>
                                </div>
                              </div>
                              
                              {/* 右侧U高度标签 */}
                              <div style={{
                                width: '25px', // 减小标签宽度
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                borderRadius: '0 4px 4px 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '9px', // 减小字体
                                fontWeight: 'bold',
                                textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                                letterSpacing: '0.5px', // 减小字符间距
                                flexShrink: 0
                              }}>
                                {height}U
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
                    }) : (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#999',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}>
                        暂无设备数据
                      </div>
                    )}
                  </div>
                  
                  {/* 侧面 */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '100%',
                    width: '20px',
                    height: '100%',
                    backgroundColor: '#555',
                    transformOrigin: 'left center',
                    transform: 'rotateY(90deg)',
                    borderTopRightRadius: '4px',
                    borderBottomRightRadius: '4px'
                  }} />
                  
                  {/* 机柜顶部 */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '0',
                    width: '100%',
                    height: '20px',
                    backgroundColor: '#666',
                    transformOrigin: 'bottom center',
                    transform: 'rotateX(90deg)',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px'
                  }} />
                  
                  {/* 机柜名称 */}
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {selectedRack.name} ({selectedRack.rackId})
                  </div>
                </div>
                
                {/* 设备详情面板 */}
                {hoveredDevice && (
                  <div 
                    style={{
                      position: 'fixed', // 使用 fixed 定位确保相对于视口
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '320px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      padding: '20px',
                      border: '1px solid #e8e8e8',
                      zIndex: 10000, // 提高 z-index 确保在最上层
                      animation: 'slideIn 0.3s ease-out',
                      pointerEvents: 'auto' // 确保面板可以接收鼠标事件
                    }}
                    key={`panel-${hoveredDevice._key || hoveredDevice.deviceId || hoveredDevice.id || 'unknown'}`}
                    onMouseEnter={(e) => {
                      // 鼠标进入面板时，清除隐藏定时器
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                      e.stopPropagation(); // 防止事件冒泡
                    }}
                    onMouseLeave={(e) => {
                      // 鼠标离开面板时，延迟隐藏
                      const timeout = setTimeout(() => {
                        setHoveredDevice(null);
                      }, 300); // 增加延迟时间
                      setHoverTimeout(timeout);
                      e.stopPropagation(); // 防止事件冒泡
                    }}
                    onMouseMove={(e) => {
                      // 鼠标在面板内移动时，保持面板打开
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                      e.stopPropagation();
                    }}
                  >

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '16px',
                      borderBottom: '1px solid #f0f0f0',
                      paddingBottom: '12px'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        marginRight: '12px',
                        color: getDeviceColor(hoveredDevice.type)
                      }}>
                        {getDeviceIcon(hoveredDevice.type)}
                      </div>
                      <div>
                        <h3 style={{
                          margin: 0,
                          color: '#333',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>
                          {hoveredDevice.name || hoveredDevice.deviceName || hoveredDevice.device_name || '未知设备'}
                        </h3>
                        <p style={{
                          margin: '4px 0 0 0',
                          color: '#666',
                          fontSize: '12px'
                        }}>
                          {getDeviceTypeName(hoveredDevice.type)}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>设备类型:</span>
                        <span style={{ color: '#666' }}>{getDeviceTypeName(hoveredDevice.type)}</span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>U位位置:</span>
                        <span style={{ color: '#666' }}>
                          U{hoveredDevice.position} - U{hoveredDevice.position + (hoveredDevice.height || 1) - 1}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>设备高度:</span>
                        <span style={{ color: '#666' }}>{hoveredDevice.height || 1}U</span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>运行状态:</span>
                        <span style={{ 
                          color: hoveredDevice.status === 'running' ? '#52c41a' : '#ff4d4f',
                          fontWeight: 'bold'
                        }}>
                          {hoveredDevice.status === 'running' ? '运行中' : '已停止'}
                        </span>
                      </div>
                      
                      {hoveredDevice.serialNumber && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>序列号:</span>
                          <span style={{ color: '#666', fontFamily: 'monospace' }}>
                            {hoveredDevice.serialNumber}
                          </span>
                        </div>
                      )}
                      
                      {hoveredDevice.installDate && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>安装日期:</span>
                          <span style={{ color: '#666' }}>
                            {formatDate(hoveredDevice.installDate)}
                          </span>
                        </div>
                      )}
                      
                      {hoveredDevice.model && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>设备型号:</span>
                          <span style={{ color: '#666' }}>
                            {hoveredDevice.model}
                          </span>
                        </div>
                      )}
                      
                      {hoveredDevice.ipAddress && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>IP地址:</span>
                          <span style={{ color: '#666', fontFamily: 'monospace' }}>
                            {hoveredDevice.ipAddress}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 关闭按钮 */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      fontSize: '12px',
                      color: '#999'
                    }}
                    onClick={() => setHoveredDevice(null)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e6f7ff';
                      e.currentTarget.style.color = '#1890ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                      e.currentTarget.style.color = '#999';
                    }}
                    >
                      ×
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ 
              width: '100%', 
              height: '600px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              fontSize: '16px',
              color: '#666'
            }}>
              请选择机柜
            </div>
          )}
        </ErrorBoundary>
      </Card>
    </div>
  );
}

export default RackVisualization;