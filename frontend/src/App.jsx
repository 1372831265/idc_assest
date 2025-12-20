import React, { useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BarChartOutlined, DatabaseOutlined, CloudServerOutlined, MenuUnfoldOutlined, MenuFoldOutlined, EyeOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import RackManagement from './pages/RackManagement';
import RoomManagement from './pages/RoomManagement';
import DeviceFieldManagement from './pages/DeviceFieldManagement';
import RackVisualization from './pages/RackVisualization';


const { Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { 
    token: { colorBgContainer, borderRadiusLG }, 
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider 
          width={200} 
          collapsedWidth={80}
          collapsed={collapsed}
          style={{
            backgroundColor: colorBgContainer,
            boxShadow: '2px 0 8px rgba(0,0,0,0.08)'
          }}
        >
          {/* 自定义收起/展开按钮 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 64,
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 16
          }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                padding: '8px',
                borderRadius: 4,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: '#e6f7ff'
                }
              }}
            />
          </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{
                height: 'calc(100% - 80px)', 
                borderRight: 0,
                backgroundColor: 'transparent'
              }}
              items={[
                {
                  key: '1',
                  icon: <BarChartOutlined />,
                  label: <Link to="/">仪表盘</Link>,
                },
                {
                  key: '2',
                  icon: <CloudServerOutlined />,
                  label: <Link to="/devices">设备管理</Link>,
                },
                {
                  key: '3',
                  icon: <DatabaseOutlined />,
                  label: <Link to="/racks">机柜管理</Link>,
                },
                {
                  key: '4',
                  icon: <DatabaseOutlined />,
                  label: <Link to="/rooms">机房管理</Link>,
                },
                {
                  key: '5',
                  icon: <BarChartOutlined />,
                  label: <Link to="/fields">字段管理</Link>,
                },
                {
                  key: '6',
                  icon: <EyeOutlined />,
                  label: <Link to="/visualization">机柜可视化</Link>,
                },
              ]}
            />
          </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceManagement />} />
              <Route path="/racks" element={<RackManagement />} />
              <Route path="/rooms" element={<RoomManagement />} />
              <Route path="/fields" element={<DeviceFieldManagement />} />
              <Route path="/visualization" element={<RackVisualization />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;