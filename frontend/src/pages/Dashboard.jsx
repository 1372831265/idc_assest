import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Button, Tag } from 'antd';
import { 
  DatabaseOutlined, 
  CloudServerOutlined, 
  WarningOutlined, 
  PoweroffOutlined, 
  HomeOutlined, 
  MonitorOutlined, 
  SettingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DashboardOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
      totalDevices: 0,
      totalRacks: 0,
      totalRooms: 0,
      faultDevices: 0,
      deviceGrowth: 2.5,  // 示例增长数据
      faultTrend: -12.3   // 示例趋势数据
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取统计数据
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 获取所有设备
        const devicesRes = await axios.get('/api/devices');
        // 设备API返回的是包含total和devices数组的对象
        const totalDevices = devicesRes.data.total;
        // 获取所有设备以统计故障设备数量
        const allDevicesRes = await axios.get('/api/devices', { params: { pageSize: totalDevices } });
        const allDevices = allDevicesRes.data.devices || allDevicesRes.data;
        const faultDevices = allDevices.filter(device => device.status === 'fault').length;
        
        // 获取所有机柜
        const racksRes = await axios.get('/api/racks');
        // 机柜API返回的是包含total和racks数组的对象
        const totalRacks = racksRes.data.total;
        const racks = racksRes.data.racks || [];
        
        // 获取所有机房
        const roomsRes = await axios.get('/api/rooms');
        const rooms = roomsRes.data;
        const totalRooms = rooms.length;
        
        setStats({
          totalDevices,
          totalRacks,
          totalRooms,
          faultDevices,
          // 保留或更新趋势数据
          deviceGrowth: stats.deviceGrowth || 0,
          faultTrend: stats.faultTrend || 0
        });
      } catch (error) {
        message.error('获取统计数据失败');
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 科技感配色主题
  const theme = {
    primary: '#1890ff',      // 科技蓝
    primaryDark: '#096dd9',  // 深蓝
    secondary: '#722ed1',    // 紫色
    success: '#52c41a',      // 绿色
    warning: '#faad14',      // 橙色
    error: '#ff4d4f',        // 红色
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#262626',
    textSecondary: '#8c8c8c'
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
    padding: '24px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: theme.background,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px 0'
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: theme.textSecondary,
    margin: '0'
  };

  const statCardStyle = {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 16px rgba(24, 144, 255, 0.1)',
    background: theme.cardBg,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  };

  const statCardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(24, 144, 255, 0.2)'
  };

  const trendStyle = (trend) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: trend > 0 ? theme.success : theme.error,
    marginTop: '8px'
  });

  const systemOverviewStyle = {
    marginTop: '32px'
  };

  const overviewCardStyle = {
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 8px 32px rgba(24, 144, 255, 0.15)',
    background: theme.cardBg,
    backdropFilter: 'blur(10px)'
  };

  const welcomeSectionStyle = {
    background: theme.background,
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '24px'
  };

  const navigationGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  };

  const navButtonStyle = {
    height: 'auto',
    padding: '20px 16px',
    borderRadius: '12px',
    border: '2px solid rgba(24, 144, 255, 0.1)',
    background: 'rgba(24, 144, 255, 0.02)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  };

  const navButtonHoverStyle = {
    borderColor: theme.primary,
    background: 'rgba(24, 144, 255, 0.1)',
    transform: 'translateY(-2px)'
  };

  const navIconStyle = {
    fontSize: '2rem',
    color: theme.primary
  };

  const navTextStyle = {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: theme.textPrimary
  };

  const systemInfoStyle = {
    background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(24, 144, 255, 0.1)'
  };

  return (
    <div style={containerStyle}>
      {/* 页面头部 */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <DashboardOutlined style={{ marginRight: '12px' }} />
          IDC设备管理系统
        </h1>
        <p style={subtitleStyle}>实时监控 • 智能管理 • 高效运维</p>
      </div>

      {/* 数据概览卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                borderRadius: '50%',
                opacity: '0.1'
              }} />
              <Statistic
                title={
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.textSecondary }}>
                    总设备数
                  </span>
                }
                value={stats.totalDevices}
                prefix={<CloudServerOutlined style={{ color: theme.primary, fontSize: '1.2rem' }} />}
                valueStyle={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: theme.textPrimary,
                  marginBottom: '8px'
                }}
                loading={loading}
              />
              <div style={trendStyle(stats.deviceGrowth)}>
                {stats.deviceGrowth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span style={{ marginLeft: '4px' }}>{Math.abs(stats.deviceGrowth)}%</span>
                <Tag color="blue" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>本月</Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                borderRadius: '50%',
                opacity: '0.1'
              }} />
              <Statistic
                title={
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.textSecondary }}>
                    总机柜数
                  </span>
                }
                value={stats.totalRacks}
                prefix={<DatabaseOutlined style={{ color: theme.secondary, fontSize: '1.2rem' }} />}
                valueStyle={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: theme.textPrimary,
                  marginBottom: '8px'
                }}
                loading={loading}
              />
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: theme.success }}>
                <PoweroffOutlined style={{ marginRight: '4px' }} />
                <span>正常运行</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                borderRadius: '50%',
                opacity: '0.1'
              }} />
              <Statistic
                title={
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.textSecondary }}>
                    总机房数
                  </span>
                }
                value={stats.totalRooms}
                prefix={<HomeOutlined style={{ color: theme.success, fontSize: '1.2rem' }} />}
                valueStyle={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: theme.textPrimary,
                  marginBottom: '8px'
                }}
                loading={loading}
              />
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: theme.success }}>
                <span style={{ width: '8px', height: '8px', background: theme.success, borderRadius: '50%', marginRight: '8px' }} />
                <span>全部在线</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ ...statCardStyle, borderLeft: `4px solid ${theme.error}` }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #ff4d4f 0%, #d73027 100%)',
                borderRadius: '50%',
                opacity: '0.1'
              }} />
              <Statistic
                title={
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.textSecondary }}>
                    故障设备
                  </span>
                }
                value={stats.faultDevices}
                prefix={<WarningOutlined style={{ color: theme.error, fontSize: '1.2rem' }} />}
                valueStyle={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: theme.error,
                  marginBottom: '8px'
                }}
                loading={loading}
              />
              <div style={trendStyle(stats.faultTrend)}>
                {stats.faultTrend < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                <span style={{ marginLeft: '4px' }}>{Math.abs(stats.faultTrend)}%</span>
                <Tag color="red" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>本周</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统概览 */}
      <div style={systemOverviewStyle}>
        <Card style={overviewCardStyle}>
          <div style={{ padding: '24px' }}>
            {/* 欢迎区域 */}
            <div style={welcomeSectionStyle}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                margin: '0 0 8px 0',
                color: 'white'
              }}>
                欢迎使用IDC设备管理系统
              </h2>
              <p style={{ 
                fontSize: '1rem', 
                margin: '0',
                opacity: '0.9',
                color: 'white'
              }}>
                专业的机房设备管理解决方案
              </p>
            </div>

            {/* 导航功能网格 */}
            <div style={navigationGridStyle}>
              <Button 
                type="text" 
                style={navButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <CloudServerOutlined style={navIconStyle} />
                <span style={navTextStyle}>设备管理</span>
              </Button>

              <Button 
                type="text" 
                style={navButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <DatabaseOutlined style={navIconStyle} />
                <span style={navTextStyle}>资源规划</span>
              </Button>

              <Button 
                type="text" 
                style={navButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <WarningOutlined style={navIconStyle} />
                <span style={navTextStyle}>故障监控</span>
              </Button>

              <Button 
                type="text" 
                style={navButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <SettingOutlined style={navIconStyle} />
                <span style={navTextStyle}>系统配置</span>
              </Button>
            </div>

            {/* 系统信息 */}
            <div style={systemInfoStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0', fontSize: '0.95rem', color: theme.textPrimary, fontWeight: '500' }}>
                    <strong>系统版本：</strong> v1.0.0
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: theme.textSecondary }}>
                    最后更新：{new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  size="small"
                  style={{ background: theme.primary, borderColor: theme.primary }}
                >
                  刷新数据
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;