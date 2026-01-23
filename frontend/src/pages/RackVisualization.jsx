import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, Select, Button, Space, message, Tooltip, Modal, Form, Switch, Checkbox, Input, Badge, Typography, Row, Col, Empty, Spin } from 'antd';
import {
  ReloadOutlined, ZoomInOutlined, ZoomOutOutlined,
  RotateRightOutlined, CloudServerOutlined, SwitcherOutlined,
  DatabaseOutlined, CloudOutlined, LaptopOutlined,
  MobileOutlined, PrinterOutlined, SettingOutlined,
  SearchOutlined, ClearOutlined, EnvironmentOutlined,
  FilterOutlined, AppstoreOutlined, UnorderedListOutlined,
  FullscreenOutlined, CompressOutlined, EyeOutlined, ApiOutlined
} from '@ant-design/icons';
import axios from 'axios';
import DeviceComponent from '../components/DeviceComponent';
import DeviceDetailDrawer from '../components/DeviceDetailDrawer';
import './RackVisualization.css';

const { Option } = Select;
const { Text, Title } = Typography;

// 设计令牌定义
const designTokens = {
  colors: {
    primary: {
      main: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      light: '#8b9ff0',
      dark: '#4f5db8'
    },
    success: {
      main: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      light: '#34d399',
      dark: '#047857'
    },
    warning: {
      main: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      light: '#fbbf24',
      dark: '#b45309'
    },
    error: {
      main: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      light: '#f87171',
      dark: '#b91c1c'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      inverse: '#ffffff'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      dark: '#1e293b'
    },
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8'
    },
    device: {
      server: '#3b82f6',
      switch: '#22c55e',
      router: '#f59e0b',
      storage: '#8b5cf6',
      other: '#64748b'
    },
    status: {
      normal: '#10b981',
      running: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      fault: '#ef4444',
      offline: '#6b7280',
      maintenance: '#3b82f6'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    small: 6,
    medium: 10,
    large: 16,
    xl: 24
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
  }
};

// 移除内联样式函数，使用CSS类

// 卡片样式定义
const cardStyle = {
  borderRadius: designTokens.borderRadius.large,
  border: 'none',
  boxShadow: designTokens.shadows.medium,
  background: '#fff',
  overflow: 'hidden'
};

// 按钮样式定义
const primaryButtonStyle = {
  height: '42px',
  borderRadius: '10px',
  background: designTokens.colors.primary.gradient,
  border: 'none',
  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.35)',
  fontWeight: '500'
};

const secondaryButtonStyle = {
  height: '40px',
  borderRadius: designTokens.borderRadius.medium,
  border: `1px solid ${designTokens.colors.border.light}`,
  background: designTokens.colors.background.primary,
  transition: `all ${designTokens.transitions.fast}`
};

// 工具函数提取到组件外部，避免每次渲染重复创建
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

const getDeviceColor = (deviceType) => {
  if (!deviceType) return '#1890ff';
  const type = deviceType.toLowerCase();
  
  if (type.includes('server') || type.includes('服务器')) return '#1890ff';
  if (type.includes('switch') || type.includes('交换机')) return '#52c41a';
  if (type.includes('storage') || type.includes('存储')) return '#faad14';
  if (type.includes('router') || type.includes('路由器')) return '#f5222d';
  if (type.includes('laptop') || type.includes('笔记本')) return '#722ed1';
  if (type.includes('mobile') || type.includes('手机')) return '#eb2f96';
  if (type.includes('printer') || type.includes('打印机')) return '#13c2c2';
  
  return '#1890ff';
};

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

const getDeviceTypeTheme = (type) => {
  const themeMap = {
    'server': {
      borderColor: '#38bdf8',
      accentColor: '#0ea5e9',
      glowColor: 'rgba(56, 189, 248, 0.3)',
      iconColor: '#38bdf8',
      label: '服务器'
    },
    'switch': {
      borderColor: '#22c55e',
      accentColor: '#16a34a',
      glowColor: 'rgba(34, 197, 94, 0.3)',
      iconColor: '#22c55e',
      label: '交换机'
    },
    'router': {
      borderColor: '#f59e0b',
      accentColor: '#d97706',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      iconColor: '#f59e0b',
      label: '路由器'
    },
    'storage': {
      borderColor: '#8b5cf6',
      accentColor: '#7c3aed',
      glowColor: 'rgba(139, 92, 246, 0.3)',
      iconColor: '#8b5cf6',
      label: '存储'
    },
    'firewall': {
      borderColor: '#ef4444',
      accentColor: '#dc2626',
      glowColor: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#ef4444',
      label: '防火墙'
    },
    'ups': {
      borderColor: '#14b8a6',
      accentColor: '#0d9488',
      glowColor: 'rgba(20, 184, 166, 0.3)',
      iconColor: '#14b8a6',
      label: 'UPS'
    },
    'pdus': {
      borderColor: '#64748b',
      accentColor: '#475569',
      glowColor: 'rgba(100, 116, 139, 0.3)',
      iconColor: '#64748b',
      label: 'PDU'
    },
    'other': {
      borderColor: '#94a3b8',
      accentColor: '#64748b',
      glowColor: 'rgba(148, 163, 184, 0.3)',
      iconColor: '#94a3b8',
      label: '其他设备'
    }
  };
  
  const normalizedType = type?.toLowerCase();
  
  if (normalizedType?.includes('server') || normalizedType?.includes('服务器')) return themeMap.server;
  if (normalizedType?.includes('switch') || normalizedType?.includes('交换机')) return themeMap.switch;
  if (normalizedType?.includes('router') || normalizedType?.includes('路由器')) return themeMap.router;
  if (normalizedType?.includes('storage') || normalizedType?.includes('存储')) return themeMap.storage;
  if (normalizedType?.includes('firewall') || normalizedType?.includes('防火墙')) return themeMap.firewall;
  if (normalizedType?.includes('ups') || normalizedType?.includes('不间断电源')) return themeMap.ups;
  if (normalizedType?.includes('pdu') || normalizedType?.includes('电源分配')) return themeMap.pdus;
  
  return themeMap.other;
};

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
        <div className="error-boundary">
          <h2 className="error-boundary-title">可视化组件出错了</h2>
          <p className="error-boundary-message">
            错误信息: {this.state.error?.toString()}
          </p>
          <button
            className="error-boundary-reload-button"
            onClick={() => window.location.reload()}
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
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [zoom, setZoom] = useState(1.7);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState(null);
  const [deviceTooltip, setDeviceTooltip] = useState(null); // 设备详情tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // tooltip位置
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundType, setBackgroundType] = useState('gradient'); // gradient or image
  const [backgroundSize, setBackgroundSize] = useState('contain'); // cover, contain, auto
  const [uploading, setUploading] = useState(false); // 上传状态
  const [showTooltipConfig, setShowTooltipConfig] = useState(false); // 显示tooltip配置面板
  const [tooltipDeviceFields, setTooltipDeviceFields] = useState([]); // 设备字段配置
  const [loadingTooltipFields, setLoadingTooltipFields] = useState(false); // 加载字段配置状态
  const [savingTooltipConfig, setSavingTooltipConfig] = useState(false); // 保存配置状态
  const [deviceCache, setDeviceCache] = useState({}); // 设备数据缓存，键为rackId，值为设备数据

  // 接线管理相关状态
  const [cables, setCables] = useState([]); // 接线列表
  const [showCables, setShowCables] = useState(true); // 是否显示接线

  // 设备详情抽屉状态
  const [selectedDevice, setSelectedDevice] = useState(null); // 当前选中设备
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false); // 详情抽屉显示状态

  // 设备搜索功能
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词
  const [searchResults, setSearchResults] = useState([]); // 搜索结果
  const [highlightedDevice, setHighlightedDevice] = useState(null); // 高亮的设备
  const [searchMatchCount, setSearchMatchCount] = useState(0); // 匹配数量
  const [searching, setSearching] = useState(false); // 搜索中状态

  // 设备详情tooltip字段配置
  const [tooltipFields, setTooltipFields] = useState({});

  // 默认设备字段配置
  const defaultTooltipFields = useMemo(() => ({
    name: { label: '设备名称', enabled: true, field: 'name', fieldType: 'string' },
    deviceId: { label: '设备ID', enabled: true, field: 'deviceId', fieldType: 'string' },
    type: { label: '设备类型', enabled: true, field: 'type', fieldType: 'string' },
    brand: { label: '品牌', enabled: true, field: 'brand', fieldType: 'string' },
    model: { label: '型号', enabled: true, field: 'model', fieldType: 'string' },
    status: { label: '状态', enabled: true, field: 'status', fieldType: 'string' },
    position: { label: '位置', enabled: true, field: 'position', fieldType: 'number' },
    height: { label: '高度', enabled: true, field: 'height', fieldType: 'number' },
    ipAddress: { label: 'IP地址', enabled: true, field: 'ipAddress', fieldType: 'string' },
    power: { label: '功率', enabled: true, field: 'power', fieldType: 'number' }
  }), []);

  // 移除初始化样式的useEffect，因为样式已移至CSS文件

  // 获取设备字段配置 - 使用 useCallback 避免重复创建
  const fetchTooltipDeviceFields = useCallback(async () => {
    try {
      setLoadingTooltipFields(true);
      console.log('开始获取设备字段配置...');
      const response = await axios.get('/api/deviceFields');
      console.log('API响应:', response.data);
      const fieldsData = response.data;
      
      if (Array.isArray(fieldsData) && fieldsData.length > 0) {
        console.log('使用API返回的字段配置');
        const sortedFields = fieldsData.sort((a, b) => a.order - b.order);
        setTooltipDeviceFields(sortedFields);

        // 根据字段配置初始化tooltipFields
        const initialFields = {};
        sortedFields.forEach(field => {
          console.log('字段:', field.fieldName, field.displayName, field.visible);
          initialFields[field.fieldName] = {
            label: field.displayName,
            enabled: field.visible,
            field: field.fieldName,
            fieldType: field.fieldType
          };
        });
        setTooltipFields(initialFields);
      } else {
        console.log('使用默认字段配置');
        // 使用默认字段配置
        setTooltipFields(defaultTooltipFields);
      }
    } catch (error) {
      console.error('获取设备字段配置失败，使用默认配置:', error);
      // 使用默认字段配置
      setTooltipFields(defaultTooltipFields);
    } finally {
      setLoadingTooltipFields(false);
    }
  }, [defaultTooltipFields]);

  // 初始化获取保存的字段配置
  useEffect(() => {
    fetchTooltipDeviceFields();
  }, [fetchTooltipDeviceFields]);

  // 保存tooltip字段配置
  const saveTooltipConfig = useCallback(async () => {
    try {
      setSavingTooltipConfig(true);
      
      const fieldConfigs = Object.entries(tooltipFields).map(([key, field]) => ({
        fieldName: field.field,
        visible: field.enabled,
        displayName: field.label,
        fieldType: field.fieldType
      }));
      
      await axios.post('/api/deviceFields/config', fieldConfigs);
      message.success('字段配置已保存');
      setShowTooltipConfig(false);
      
      // 重新获取配置以确保数据一致
      await fetchTooltipDeviceFields();
    } catch (error) {
      console.error('保存字段配置失败:', error);
      message.error('保存字段配置失败');
    } finally {
      setSavingTooltipConfig(false);
    }
  }, [tooltipFields, fetchTooltipDeviceFields]);

  // 获取机柜内的设备 - 使用 useCallback 避免重复创建
  const fetchDevices = useCallback(async (rackId) => {
    // 先检查缓存中是否已有数据
    if (deviceCache[rackId]) {
      console.log(`=== 从缓存获取机柜 ${rackId} 的设备数据 ===`);
      setDevices(deviceCache[rackId]);
      setLoadingDevices(false);
      return;
    }
    
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

      // 展开customFields中的字段到设备对象的直接属性
      const processedDevices = devicesData.map(device => {
        const deviceWithFields = { ...device };
        
        if (device.customFields && typeof device.customFields === 'object') {
          Object.entries(device.customFields).forEach(([fieldName, value]) => {
            deviceWithFields[fieldName] = value;
          });
        }
        
        return deviceWithFields;
      });
      
      console.log('展开customFields后的设备数据:', processedDevices);
      
      // 如果没有数据，显示警告
      if (processedDevices.length === 0) {
        console.warn('=== 没有找到设备数据 ===');
        console.warn('可能的原因:');
        console.warn('1. 数据库中该机柜确实没有设备');
        console.warn('2. API路由配置错误');
        console.warn('3. 数据库查询条件问题');
        message.warning(`机柜 ${rackId} 暂无设备数据`);
        setDevices([]);
        // 将空数据也存入缓存，避免重复请求
        setDeviceCache(prev => ({ ...prev, [rackId]: [] }));
        return;
      }
      
      // 显示原始数据结构以供调试
      console.log('=== 数据结构分析 ===');
      if (processedDevices.length > 0) {
        const firstDevice = processedDevices[0];
        console.log('第一个设备完整数据:', JSON.stringify(firstDevice, null, 2));
        console.log('第一个设备的字段:', Object.keys(firstDevice));
        console.log('第一个设备的字段类型:');
        Object.keys(firstDevice).forEach(key => {
          console.log(`  ${key}: ${typeof firstDevice[key]} = ${JSON.stringify(firstDevice[key])}`);
        });
      }
      
      // 过滤有效的设备数据 - 放宽验证条件
      const validDevices = processedDevices.filter(device => {
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
      
      // 将处理后的数据存入缓存
      setDeviceCache(prev => ({ ...prev, [rackId]: validDevices }));
      
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
  }, [deviceCache]);

  // 搜索设备 - 全局搜索，支持跨机柜
  const handleSearch = useCallback(async (keyword) => {
    setSearchKeyword(keyword);
    
    if (!keyword || !keyword.trim()) {
      setSearchResults([]);
      setHighlightedDevice(null);
      setSearchMatchCount(0);
      return;
    }
    
    const searchLower = keyword.toLowerCase().trim();
    setSearching(true);
    
    try {
      // 调用全局搜索API，搜索所有机柜的设备
      const response = await axios.get('/api/devices', {
        params: { keyword: searchLower, pageSize: 100 }
      });
      
      const devicesData = response.data.devices || [];
      
      // 构建搜索结果，包含机柜信息
      const results = devicesData.map(device => ({
        deviceId: device.deviceId || device.id,
        name: device.name,
        type: device.type,
        rackId: device.rackId,
        rackName: device.Rack?.name || '未知机柜',
        roomName: device.Rack?.Room?.name || '未知机房',
        position: device.position
      }));
      
      setSearchResults(results);
      setSearchMatchCount(results.length);
      
      // 如果有搜索结果，自动定位到第一个设备所在的机柜
      if (results.length > 0) {
        const firstResult = results[0];
        setHighlightedDevice(firstResult.deviceId);
        
        // 如果设备不在当前机柜，自动切换机柜
        if (selectedRack && firstResult.rackId !== selectedRack.rackId) {
          const targetRack = racks.find(r => r.rackId === firstResult.rackId);
          if (targetRack) {
            // 找到设备所在的机房
            if (targetRack?.Room) {
              const roomKey = targetRack.Room.roomId || targetRack.Room.id || targetRack.Room.name;
              if (roomKey !== selectedRoom) {
                setSelectedRoom(roomKey);
              }
            }
            
            // 切换到设备所在的机柜
            setSelectedRack(targetRack);
            // 不再直接调用fetchDevices，由useEffect处理
            message.info(`已跳转到机柜: ${firstResult.rackName}`);
          }
        } else {
          message.info(`已定位到设备: ${firstResult.name}`);
        }
      } else {
        setHighlightedDevice(null);
        message.warning('未找到匹配的设备');
      }
    } catch (error) {
      console.error('全局搜索失败:', error);
      message.error('搜索失败，请重试');
      setSearchResults([]);
      setSearchMatchCount(0);
    } finally {
      setSearching(false);
    }
  }, [selectedRack, selectedRoom, racks, fetchDevices]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchKeyword('');
    setSearchResults([]);
    setHighlightedDevice(null);
    setSearchMatchCount(0);
  }, []);

  // 跳转到指定设备
  const jumpToDevice = useCallback((deviceId) => {
    setHighlightedDevice(deviceId);
    message.info(`已定位到设备: ${deviceId}`);
  }, []);

  // 获取所有机柜 - 使用 useCallback 避免重复创建
  const fetchRacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 为机柜可视化页面传递较大的pageSize以获取所有机柜
      const response = await axios.get('/api/racks', { params: { pageSize: 1000 } });
      
      // 验证数据结构并过滤有效机柜
      // 机柜API返回的是包含total和racks数组的对象
      const racksArray = response.data.racks || [];
      const validRacks = racksArray.filter(rack => 
        rack && 
        typeof rack === 'object' && 
        rack.rackId && 
        typeof rack.height === 'number'
      );
      
      setRacks(validRacks);
      if (validRacks.length > 0) {
        // 自动选择第一个机柜
        const firstRack = validRacks[0];
        setSelectedRack(firstRack);
        
        // 设置对应的机房
        if (firstRack?.Room) {
          const roomKey = firstRack.Room.roomId || firstRack.Room.id || firstRack.Room.name;
          setSelectedRoom(roomKey);
        }
        
        // 不再直接调用fetchDevices，由useEffect处理
      } else {
        setSelectedRack(null);
        setSelectedRoom(null);
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
  }, []);

  useEffect(() => {
    fetchRacks();
  }, [fetchRacks]);

  // 使用useMemo缓存处理后的设备数据，只有当rackId变化时才重新处理
  const processedDevices = useMemo(() => {
    if (!devices || !devices.length) {
      return [];
    }
    
    // 处理设备数据，添加必要的计算属性
    return devices.map(device => {
      // 计算设备在机柜中的位置（用于可视化）
      const calculatedPosition = {
        top: device.position,
        height: device.height
      };
      
      return {
        ...device,
        calculatedPosition
      };
    });
  }, [devices]);

  // 当selectedRack变化时，获取对应机柜的设备数据
  useEffect(() => {
    if (selectedRack?.rackId) {
      fetchDevices(selectedRack.rackId);
      fetchCablesForRack(selectedRack.rackId);
    } else {
      setDevices([]);
      setCables([]);
    }
  }, [selectedRack, fetchDevices]);

  // 获取机柜的接线数据
  const fetchCablesForRack = useCallback(async (rackId) => {
    try {
      const response = await axios.get('/api/cables');
      const rackCables = (response.data.cables || []).filter(cable => 
        cable.sourceDevice?.rackId === rackId || cable.targetDevice?.rackId === rackId
      );
      setCables(rackCables);
    } catch (error) {
      console.error('获取接线数据失败:', error);
    }
  }, []);

  // 打开字段配置模态框时获取数据
  const handleOpenTooltipConfig = () => {
    if (Object.keys(tooltipFields).length === 0) {
      fetchTooltipDeviceFields();
    }
    setShowTooltipConfig(true);
  };

  // 生成模拟监控数据
  const generateMonitoringData = (device) => {
    const baseTemp = device.type?.includes('服务器') ? 65 : 
                    device.type?.includes('存储') ? 55 : 
                    device.type?.includes('网络') ? 45 : 40;
    
    const baseVoltage = 220;
    const baseUptime = 24 * 365; // 假设运行了1年
    
    return {
      temperature: (baseTemp + Math.random() * 20 - 10).toFixed(1), // 温度
      voltage: (baseVoltage + Math.random() * 10 - 5).toFixed(1),   // 电压
      uptime: Math.floor(baseUptime + Math.random() * 24 * 30),     // 运行时长（小时）
      power: (50 + Math.random() * 200).toFixed(1),                 // 功耗
      load: Math.floor(Math.random() * 80 + 10)                     // 负载百分比
    };
  };

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
    const uHeight = 25; // 调整为更小的U高度以适应屏幕显示
    
    for (let i = 1; i <= height; i++) {
      marks.push(
        <div 
          key={i} 
          className={`u-mark-line ${i % 5 === 0 ? 'five' : ''}`}
          style={{
            top: `${(height - i) * uHeight}px`
          }}
        >
          <span className={`u-mark-text ${i % 5 === 0 ? 'five' : ''}`}>
            {i}
          </span>
        </div>
      );
    }
    
    return marks;
  };

  // 生成左侧U数标记（从U1开始显示）
  const generateLeftUMarks = (height) => {
    const marks = [];
    const uHeight = 25;
    
    for (let u = 1; u <= height; u++) {
      // 调整U位标记定位，确保U1在机柜底部，U42在顶部
      const topPosition = (height - u) * uHeight;
      
      marks.push(
        <div 
          key={`left-${u}`} 
          className="u-mark"
          style={{
            top: `${topPosition}px`,
            height: `${uHeight}px`
          }}
        >
          {u}
        </div>
      );
    }
    
    return (
      <div className="u-marks-container left">
        {marks}
      </div>
    );
  };

  // 生成右侧U数标记（从U1开始显示）
  const generateRightUMarks = (height) => {
    const marks = [];
    const uHeight = 25;
    
    for (let u = 1; u <= height; u++) {
      // 调整U位标记定位，确保U1在机柜底部，U42在顶部
      const topPosition = (height - u) * uHeight;
      
      marks.push(
        <div 
          key={`right-${u}`} 
          className="u-mark"
          style={{
            top: `${topPosition}px`,
            height: `${uHeight}px`
          }}
        >
          {u}
        </div>
      );
    }
    
    return (
      <div className="u-marks-container right">
        {marks}
      </div>
    );
  };

  // 获取机房列表
  const getRooms = () => {
    const roomMap = new Map();
    racks.forEach(rack => {
      if (rack?.Room) {
        const roomKey = rack.Room.roomId || rack.Room.id || rack.Room.name;
        if (!roomMap.has(roomKey)) {
          roomMap.set(roomKey, {
            ...rack.Room,
            key: roomKey
          });
        }
      }
    });
    return Array.from(roomMap.values());
  };

  // 获取指定机房下的机柜
  const getRacksByRoom = (roomId) => {
    return racks.filter(rack => {
      const rackRoomId = rack?.Room?.roomId || rack?.Room?.id;
      return rackRoomId === roomId;
    });
  };

  // 选择机房
  const handleRoomChange = (roomId) => {
    console.log('选择机房:', roomId);
    setSelectedRoom(roomId);
    
    // 重置机柜选择
    setSelectedRack(null);
    setDevices([]);
    
    // 如果选择了机房，获取该机房下的机柜
    if (roomId) {
      const roomRacks = getRacksByRoom(roomId);
      if (roomRacks.length > 0) {
        // 自动选择第一个机柜
        const firstRack = roomRacks[0];
        setSelectedRack(firstRack);
        fetchDevices(firstRack.rackId);
      }
    }
  };

  // 选择机柜
  const handleRackChange = (rackId) => {
    const rack = racks.find(r => r.rackId === rackId);
    if (rack) {
      setSelectedRack(rack);
      // 不再直接调用fetchDevices，由useEffect处理
    }
  };

  // 重新加载数据
  const handleReload = () => {
    setLoading(true);
    fetchRacks().then(() => {
      message.success('数据已刷新');
    });
  };
  
  // 保存背景设置到服务器
  const saveBackgroundSettings = async (type, image, size) => {
    try {
      await axios.post('/api/background/settings', {
        type,
        image,
        size
      });
    } catch (error) {
      console.error('保存背景设置失败:', error);
    }
  };
  
  // 从服务器加载背景设置
  const loadBackgroundSettings = async () => {
    try {
      const response = await axios.get('/api/background/settings');
      if (response.data) {
        setBackgroundType(response.data.type || 'gradient');
        setBackgroundImage(response.data.image || null);
        setBackgroundSize(response.data.size || 'contain');
      }
    } catch (error) {
      console.error('加载背景设置失败:', error);
    }
  };

  // 重置视角
  const handleResetView = () => {
    setZoom(1);
    setRotation(0);
  };

  // 放大
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.3, 3.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.3, 0.7));
  };

  // 无需额外的初始化，CSS 3D变换直接在JSX中实现

  return (
    <div className="page-container">
      <div className="header">
        <div className="header-content">
          <div>
            <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 700 }}>
              <CloudServerOutlined style={{ marginRight: designTokens.spacing.sm, fontSize: '28px' }} />
              机柜可视化
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: designTokens.spacing.xs, display: 'block', fontSize: '14px' }}>
              实时监控机房机柜设备分布与状态
            </Text>
          </div>
          <Row gutter={[designTokens.spacing.md, designTokens.spacing.md]} style={{ textAlign: 'center' }}>
            <Col>
              <div className="stat-card">
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'block' }}>机柜总数</Text>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{racks.length}</div>
              </div>
            </Col>
            <Col>
              <div className="stat-card">
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'block' }}>设备总数</Text>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                  {racks.reduce((sum, rack) => sum + (rack.deviceCount || 0), 0)}
                </div>
              </div>
            </Col>
            <Col>
              <div className="stat-card">
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'block' }}>在线设备</Text>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                  {devices.filter(d => d.status === 'running' || d.status === 'normal').length}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Card className="filter-card" styles={{ body: { padding: '16px 24px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Input
            placeholder="搜索设备名称、ID、IP..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
            style={{ width: 240, height: '40px', borderRadius: '10px' }}
            allowClear
            prefix={<SearchOutlined />}
            suffix={
              searchMatchCount > 0 ? (
                <Badge count={searchMatchCount} size="small" style={{ backgroundColor: '#10b981' }} />
              ) : null
            }
          />
          {searchKeyword && (
            <Button
              className="secondary-button"
              icon={<ClearOutlined />}
              onClick={clearSearch}
              title="清除搜索"
            />
          )}
          <Select
            placeholder="选择机房"
            style={{ width: 180, height: '40px', borderRadius: '10px' }}
            value={selectedRoom}
            onChange={handleRoomChange}
            loading={loading}
            disabled={loading}
            allowClear
          >
            {getRooms().map(room => (
              <Option key={room.key} value={room.key}>
                {room.name || '未知机房'} ({room.roomId || room.id || '无ID'})
              </Option>
            ))}
          </Select>
          <Select
            placeholder="选择机柜"
            style={{ width: 200, height: '40px', borderRadius: '10px' }}
            value={selectedRack?.rackId}
            onChange={handleRackChange}
            loading={loading || loadingDevices}
            disabled={!selectedRoom || loading}
            allowClear
          >
            {selectedRoom && getRacksByRoom(selectedRoom).map(rack => (
              <Option key={rack?.rackId || `rack-${Math.random()}`} value={rack?.rackId}>
                {rack?.name || '未知机柜'} ({rack?.rackId || '无ID'}) - {rack?.height || 0}U
              </Option>
            ))}
          </Select>
          <Button
            className="secondary-button"
            icon={<ReloadOutlined />}
            onClick={handleReload}
            loading={loading}
            disabled={loading}
          >
            刷新
          </Button>
          <Button
            className={showTooltipConfig ? 'primary-button' : 'secondary-button'}
            icon={<SettingOutlined />}
            onClick={handleOpenTooltipConfig}
            type={showTooltipConfig ? 'primary' : 'default'}
          >
            字段配置
          </Button>
          <Button
            className={showCables ? 'primary-button' : 'secondary-button'}
            icon={<ApiOutlined />}
            onClick={() => setShowCables(!showCables)}
            type={showCables ? 'primary' : 'default'}
          >
            {showCables ? '隐藏接线' : '显示接线'}
          </Button>
        </div>
      </Card>

      {searchKeyword && (
        <Card className="search-result-card" styles={{ body: { padding: '16px 24px' } }}>
          <div className="search-result-content">
            <SearchOutlined style={{
              fontSize: 20,
              color: '#fff'
            }} />
            <Text strong style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
              {searchResults.length > 0
                ? `找到 ${searchResults.length} 个设备`
                : searching ? '搜索中...' : '未找到匹配的设备'}
            </Text>
            {searching && (
              <Badge status="processing" text="正在搜索所有机柜..." style={{ color: '#fff' }} />
            )}
            {searchResults.length > 0 && (
              <Space wrap size={designTokens.spacing.sm}>
                {searchResults.slice(0, 5).map(result => {
                  const isCurrentRack = selectedRack && result.rackId === selectedRack.rackId;
                  return (
                    <Button
                      key={result.deviceId}
                      size="small"
                      type={highlightedDevice === result.deviceId ? 'primary' : 'default'}
                      icon={<EnvironmentOutlined />}
                      onClick={() => {
                        if (selectedRack && result.rackId !== selectedRack.rackId) {
                          const targetRack = racks.find(r => r.rackId === result.rackId);
                          if (targetRack) {
                            if (targetRack?.Room) {
                              const roomKey = targetRack.Room.roomId || targetRack.Room.id || targetRack.Room.name;
                              if (roomKey !== selectedRoom) {
                                setSelectedRoom(roomKey);
                              }
                            }
                            setSelectedRack(targetRack);
                            // 不再直接调用fetchDevices，由useEffect处理
                            message.info(`已跳转到机柜: ${result.rackName}`);
                          }
                        }
                        setHighlightedDevice(result.deviceId);
                      }}
                      style={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        background: highlightedDevice === result.deviceId ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        height: '32px',
                        borderRadius: designTokens.borderRadius.small
                      }}
                    >
                      <Tooltip title={`机柜: ${result.rackName}${result.roomName ? ` | 机房: ${result.roomName}` : ''} | U${result.position || '?'}`}>
                        <span>
                          {result.name}
                          <Text type="secondary" style={{ fontSize: 10, marginLeft: 4 }}>
                            U{result.position || '?'}
                          </Text>
                          {!isCurrentRack && (
                            <EnvironmentOutlined style={{ marginLeft: 4, color: '#fbbf24' }} />
                          )}
                        </span>
                      </Tooltip>
                    </Button>
                  );
                })}
                {searchResults.length > 5 && (
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>+ 还有 {searchResults.length - 5} 个</Text>
                )}
              </Space>
            )}
          </div>
        </Card>
      )}
      
      <Card style={cardStyle} styles={{ body: { padding: `${designTokens.spacing.md}px ${designTokens.spacing.lg}px` } }}>
        <div style={{ marginBottom: designTokens.spacing.md }}>
          <Space wrap size={designTokens.spacing.sm}>
            <Button style={secondaryButtonStyle} icon={<ZoomInOutlined />} onClick={handleZoomIn}>放大</Button>
            <Button style={secondaryButtonStyle} icon={<ZoomOutOutlined />} onClick={handleZoomOut}>缩小</Button>
            <Button style={secondaryButtonStyle} icon={<RotateRightOutlined />} onClick={handleResetView}>重置视角</Button>
            <Select
              placeholder="选择背景类型"
              style={{ width: 150, height: '40px', borderRadius: designTokens.borderRadius.medium }}
              value={backgroundType}
              onChange={async (type) => {
                setBackgroundType(type);
                await saveBackgroundSettings(type, backgroundImage, backgroundSize);
              }}
            >
              <Option value="gradient">渐变背景</Option>
              <Option value="image">自定义图片</Option>
            </Select>
            {backgroundType === 'image' && (
              <Space size={designTokens.spacing.sm}>
                <input
                  type="text"
                  placeholder="输入图片URL"
                  style={{
                    width: 200,
                    padding: `8px ${designTokens.spacing.md}px`,
                    borderRadius: designTokens.borderRadius.medium,
                    border: `1px solid ${designTokens.colors.border.light}`,
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                  onChange={async (e) => {
                    const image = e.target.value;
                    setBackgroundImage(image);
                    await saveBackgroundSettings(backgroundType, image, backgroundSize);
                  }}
                  value={backgroundImage || ''}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        setUploading(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('type', 'background');

                        const response = await axios.post('/api/background/upload', formData, {
                          headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                        });

                        if (response.data && response.data.path) {
                          setBackgroundImage(response.data.path);
                          message.success('背景图片上传成功');
                          await saveBackgroundSettings('image', response.data.path, backgroundSize);
                        } else {
                          message.error('上传失败：服务器返回格式不正确');
                        }
                      } catch (error) {
                        console.error('上传失败:', error);
                        message.error('背景图片上传失败，请重试');
                      } finally {
                        setUploading(false);
                      }
                    }
                  }}
                  style={{ display: 'none' }}
                  id="backgroundFileInput"
                />
                <Button style={secondaryButtonStyle} onClick={() => document.getElementById('backgroundFileInput').click()} loading={uploading}>上传图片</Button>
                <Select
                  placeholder="图片大小"
                  style={{ width: 100, height: '40px', borderRadius: designTokens.borderRadius.medium }}
                  value={backgroundSize}
                  onChange={async (size) => {
                    setBackgroundSize(size);
                    await saveBackgroundSettings(backgroundType, backgroundImage, size);
                  }}
                >
                  <Option value="contain">自适应</Option>
                  <Option value="cover">覆盖</Option>
                  <Option value="auto">原始大小</Option>
                </Select>
                {backgroundImage && (
                  <Button style={secondaryButtonStyle} onClick={() => {
                    setBackgroundImage(null);
                    setBackgroundType('gradient');
                  }}>清除</Button>
                )}
              </Space>
            )}
          </Space>
        </div>
        
        <ErrorBoundary>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" tip="加载机柜数据中..." />
            </div>
          ) : selectedRack ? (
            <div 
              className={`rack-visualization-container ${backgroundType === 'image' ? 'image-background' : ''}`}
              style={{ 
                background: backgroundType === 'image' && backgroundImage 
                  ? `url(${backgroundImage})`
                  : 'linear-gradient(180deg, #f8fffe 0%, #f0fdf4 50%, #e6fffa 100%)',
                backgroundSize: backgroundType === 'image' ? backgroundSize : 'auto'
              }}>
              {loadingDevices && (
                <div className="device-loading-container">
                  <Spin size="default" tip="加载设备数据中..." />
                </div>
              )}
              <div 
                className="rack-container"
                style={{ transform: `scale(${zoom})` }}
              >
                {/* 机柜主体 */}
                <div className="rack" style={{ height: `${selectedRack.height * 25}px` }}>
                  {/* 扫描线效果 */}
                  <div className="scan-effect" style={{ top: '0' }} />
                  
                  {/* 玻璃光泽效果 */}
                  <div className="rack-glass-effect" />
                  {/* 左侧U数标记 - 贴紧机架边缘 */}
                  <div className="u-marks-container left">
                    {generateLeftUMarks(selectedRack.height)}
                  </div>
                  
                  {/* 右侧U数标记 - 贴紧机架边缘 */}
                  <div className="u-marks-container right">
                    {generateRightUMarks(selectedRack.height)}
                  </div>
                  
                  {/* 左侧U型安装导轨 */}
                  <div className="rack-rail left">
                    {/* 导轨安装孔 - 左侧 */}
                    {Array.from({ length: selectedRack.height }).map((_, index) => {
                      // 计算安装孔的top位置，确保与U位标记对齐
                      // U1在底部，所以index对应的top位置是：(selectedRack.height - 1 - index) * 25 + 2
                      const topPosition = (selectedRack.height - 1 - index) * 25 + 2;
                      return (
                        <div
                          key={`left-rail-${index}`}
                          className="rail-hole left"
                          style={{ top: `${topPosition}px` }}
                        >
                          <div className="rail-hole-inner left" />
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* 右侧U型安装导轨 */}
                  <div className="rack-rail right">
                    {/* 导轨安装孔 - 右侧 */}
                    {Array.from({ length: selectedRack.height }).map((_, index) => {
                      // 计算安装孔的top位置，确保与U位标记对齐
                      // U1在底部，所以index对应的top位置是：(selectedRack.height - 1 - index) * 25 + 2
                      const topPosition = (selectedRack.height - 1 - index) * 25 + 2;
                      return (
                        <div
                          key={`right-rail-${index}`}
                          className="rail-hole right"
                          style={{ top: `${topPosition}px` }}
                        >
                          <div className="rail-hole-inner right" />
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* 前面板 */}
                  <div className="rack-front-panel">
                    {/* 细微网格纹理 */}
                    <div className="front-panel-grid" />
                    
                    {/* U位网格线 */}
                    <div className="u-grid-lines">
                      {Array.from({ length: Math.max(0, selectedRack.height - 1) }).map((_, index) => (
                        <div
                          key={`grid-line-${index}`}
                          className="u-grid-line"
                          style={{ top: `${(index + 1) * 25 - 1}px` }}
                        />
                      ))}
                    </div>
                    
                    {/* 移除了内侧U数标记，因为外侧已有U数显示 */}
                    
                    {/* 设备 */}
                    {/* 移除了设备数量显示，现在在机柜标题旁边 */}
                    
                    {devices.length > 0 ? devices.map(device => {
                      try {
                        // 处理统一化后的设备数据
                        const deviceId = device?.deviceId || device?.id || device?.device_id || device?.device || `device-${Math.random()}`;
                        const deviceName = device?.name || device?.deviceName || device?.device_name || device?.title || '未知设备';
                        const position = device?.position || 1;
                        const height = device?.height || 1;
                        
                        // 检查是否是高亮的设备
                        const isHighlighted = highlightedDevice === deviceId;
                        
                        // 获取状态主题
                        const statusTheme = getStatusTheme(device?.status);
                        const statusColor = getDeviceStatusColor(device?.status);
                        
                        return (
                          <div 
                            key={deviceId} 
                            className={`device ${isHighlighted ? 'highlighted' : ''} ${device?.status === 'warning' ? 'status-warning' : ''} ${(device?.status === 'error' || device?.status === 'fault') ? 'status-error' : ''}`}
                            style={{
                              ...getDeviceStyle(device, selectedRack.height),
                              background: statusTheme.bgGradient,
                              border: isHighlighted 
                                ? `2px solid ${statusTheme.topBorderColor}` 
                                : `1px solid ${statusTheme.borderColor}`,
                              borderTop: isHighlighted
                                ? `2px solid ${statusTheme.topBorderColor}`
                                : `1px solid ${statusTheme.topBorderColor}`
                              }}
                              onClick={(e) => {
                                setSelectedDevice(device);
                                setDetailDrawerVisible(true);
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
                              
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltipPosition({ x: rect.right + 5, y: rect.top + rect.height / 2 });
                              setDeviceTooltip({ device: device });
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
                              setDeviceTooltip(null);
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
                            className="device-error"
                          >
                            设备加载错误
                          </div>
                        );
                      }
                    }) : (
                      <div className="no-data-container">
                        暂无设备数据
                      </div>
                    )}
                  </div>
                  
                  {/* 侧面 */}
                  <div className="rack-side" />
                  
                  {/* 机柜顶部 */}
                  <div className="rack-top" />
                  
                  {/* 接线连线层 */}
                  {showCables && cables.length > 0 && (
                    <svg 
                      className="cable-connections"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 50
                      }}
                    >
                      {cables.map((cable, index) => {
                        const sourceDevice = devices.find(d => d.deviceId === cable.sourceDeviceId);
                        const targetDevice = devices.find(d => d.deviceId === cable.targetDeviceId);
                        
                        if (!sourceDevice || !targetDevice) return null;
                        
                        const sourceStyle = getDeviceStyle(sourceDevice, selectedRack.height);
                        const targetStyle = getDeviceStyle(targetDevice, selectedRack.height);
                        
                        const sourceTop = parseInt(sourceStyle.top);
                        const sourceHeight = parseInt(sourceStyle.height);
                        const targetTop = parseInt(targetStyle.top);
                        const targetHeight = parseInt(targetStyle.height);
                        
                        const sourceX = 50;
                        const sourceY = sourceTop + sourceHeight / 2;
                        const targetX = 50;
                        const targetY = targetTop + targetHeight / 2;
                        
                        const cableColor = cable.status === 'normal' ? '#10b981' : 
                                        cable.status === 'fault' ? '#ef4444' : '#6b7280';
                        const cableDash = cable.cableType === 'fiber' ? '5,5' : 'none';
                        
                        return (
                          <g key={cable.cableId}>
                            <path
                              d={`M ${sourceX} ${sourceY} Q ${sourceX + 30} ${(sourceY + targetY) / 2} ${targetX} ${targetY}`}
                              stroke={cableColor}
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray={cableDash}
                              opacity="0.7"
                            />
                            <circle
                              cx={sourceX}
                              cy={sourceY}
                              r="4"
                              fill={cableColor}
                            />
                            <circle
                              cx={targetX}
                              cy={targetY}
                              r="4"
                              fill={cableColor}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  )}
                  
                  {/* 机柜名称和设备数量 */}
                  <div className="rack-header">
                    {/* 机柜标题 */}
                    <div className="rack-title">
                      {selectedRack.name} ({selectedRack.rackId})
                    </div>
                    
                    {/* 设备数量badge */}
                    <div className="device-count-badge">
                      <span style={{ color: '#38bdf8', fontWeight: '600' }}>{devices.length}</span>
                      <span style={{ color: '#94a3b8' }}> 设备</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="select-rack-prompt">
              请选择机柜
            </div>
          )}
        </ErrorBoundary>
        
        {/* 设备详情字段配置模态框 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm }}>
              <SettingOutlined style={{ color: designTokens.colors.primary.main }} />
              <span style={{ fontWeight: 600 }}>设备详情字段配置</span>
            </div>
          }
          open={showTooltipConfig}
          onCancel={() => setShowTooltipConfig(false)}
          footer={null}
          width={520}
          styles={{ body: { padding: designTokens.spacing.lg } }}
        >
          {loadingTooltipFields ? (
            <div style={{ padding: designTokens.spacing.xl, textAlign: 'center', color: designTokens.colors.text.tertiary }}>
              <Spin size="large" />
              <div style={{ marginTop: designTokens.spacing.md }}>加载字段配置中...</div>
            </div>
          ) : Object.keys(tooltipFields).length === 0 ? (
            <div style={{ padding: designTokens.spacing.xl, textAlign: 'center', color: designTokens.colors.text.tertiary }}>
              <Empty description="暂无字段配置" />
              <Text style={{ color: designTokens.colors.text.tertiary, display: 'block', marginTop: designTokens.spacing.sm }}>
                请先在设备字段管理中添加字段
              </Text>
            </div>
          ) : (
            <div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                <div style={{ color: designTokens.colors.text.secondary, fontSize: '13px', marginBottom: designTokens.spacing.md }}>
                  选择要在设备详情中显示的字段： ({Object.keys(tooltipFields).length} 个字段)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: designTokens.spacing.sm }}>
                  {Object.entries(tooltipFields).map(([key, field]) => (
                    <div
                      key={key}
                      style={{
                        padding: `${designTokens.spacing.sm}px ${designTokens.spacing.md}px`,
                        borderRadius: designTokens.borderRadius.medium,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: designTokens.spacing.sm,
                        background: field.enabled ? `${designTokens.colors.primary.main}10` : 'transparent',
                        border: field.enabled ? `1px solid ${designTokens.colors.primary.main}30` : `1px solid ${designTokens.colors.border.light}`,
                        transition: `all ${designTokens.transitions.fast}`
                      }}
                      onClick={() => {
                        setTooltipFields(prev => ({
                          ...prev,
                          [key]: { ...prev[key], enabled: !prev[key].enabled }
                        }));
                      }}
                    >
                      <Checkbox checked={field.enabled} />
                      <Text style={{ color: field.enabled ? designTokens.colors.text.primary : designTokens.colors.text.tertiary }}>
                        {field.label}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: designTokens.spacing.lg, textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={() => {
                      const allEnabled = Object.values(tooltipFields).every(f => f.enabled);
                      setTooltipFields(prev => {
                        const newFields = { ...prev };
                        Object.keys(newFields).forEach(key => {
                          newFields[key] = { ...newFields[key], enabled: !allEnabled };
                        });
                        return newFields;
                      });
                    }}
                    style={{ borderRadius: designTokens.borderRadius.medium }}
                  >
                    {Object.values(tooltipFields).every(f => f.enabled) ? '取消全选' : '全选'}
                  </Button>
                  <Button
                    onClick={() => setShowTooltipConfig(false)}
                    style={{ borderRadius: designTokens.borderRadius.medium }}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    onClick={async () => {
                      await saveTooltipConfig();
                    }}
                    loading={savingTooltipConfig}
                    style={primaryButtonStyle}
                  >
                    保存
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Modal>
        
        {/* 设备详情tooltip - 放在容器外部确保不被遮挡 */}
        {deviceTooltip && (
          <div 
            className="device-tooltip"
            style={{
              position: 'fixed',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateY(-50%)',
              zIndex: 2147483646,
              pointerEvents: 'none',
              animation: 'tooltipFadeIn 0.3s ease-out'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc', fontSize: '12px' }}>
              设备详情
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
              {console.log('tooltipFields:', tooltipFields)}
              {Object.entries(tooltipFields).map(([key, field]) => {
                if (!field.enabled) return null;
                
                let value = deviceTooltip.device[field.field];
                let displayValue = '-';
                
                if (value !== undefined && value !== null && value !== '') {
                  // 特殊字段格式化
                  if (field.field === 'status') {
                    const statusMap = {
                      'running': '运行中',
                      'maintenance': '维护中',
                      'offline': '离线',
                      'fault': '故障',
                      'warning': '警告',
                      'error': '故障'
                    };
                    displayValue = statusMap[value] || value;
                  } else if (field.field === 'type') {
                    const typeMap = {
                      'server': '服务器',
                      'switch': '交换机',
                      'router': '路由器',
                      'storage': '存储设备',
                      'other': '其他设备'
                    };
                    displayValue = typeMap[value] || value;
                  } else if (field.field === 'position') {
                    displayValue = `U${value}`;
                  } else if (field.field === 'height') {
                    displayValue = `${value}U`;
                  } else if (field.field === 'powerConsumption' || field.field === 'power') {
                    displayValue = `${value}W`;
                  } else if (field.fieldType === 'date') {
                    try {
                      displayValue = new Date(value).toLocaleDateString('zh-CN');
                    } catch (e) {
                      displayValue = value;
                    }
                  } else if (field.field === 'rackId') {
                    displayValue = value;
                  } else {
                    displayValue = value;
                  }
                }
                
                // 获取字段标签（优先使用配置中的label，否则使用fieldName）
                const label = field.label || field.fieldName;
                
                // 状态字段使用特殊颜色
                let valueColor = '#e2e8f0';
                if (field.field === 'status') {
                  if (value === 'running') valueColor = '#4ade80';
                  else if (value === 'warning') valueColor = '#fbbf24';
                  else if (value === 'error' || value === 'fault') valueColor = '#f87171';
                }
                
                return (
                  <div key={key} style={{ color: '#94a3b8' }}>
                    {label}: <span style={{ color: valueColor }}>{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 设备详情抽屉 */}
        <DeviceDetailDrawer
          device={selectedDevice}
          visible={detailDrawerVisible}
          onClose={() => {
            setDetailDrawerVisible(false);
            setSelectedDevice(null);
          }}
          cables={cables}
          onRefreshCables={() => selectedRack?.rackId && fetchCablesForRack(selectedRack.rackId)}
        />
      </Card>
    </div>
  );
}

export default React.memo(RackVisualization);