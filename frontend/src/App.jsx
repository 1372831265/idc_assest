import React, { useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BarChartOutlined, DatabaseOutlined, CloudServerOutlined, MenuUnfoldOutlined, MenuFoldOutlined, EyeOutlined, BuildOutlined, HomeOutlined, ShoppingCartOutlined, InboxOutlined, ImportOutlined, FileTextOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import RackManagement from './pages/RackManagement';
import RoomManagement from './pages/RoomManagement';
import DeviceFieldManagement from './pages/DeviceFieldManagement';
import RackVisualization from './pages/RackVisualization';
import ConsumableManagement from './pages/ConsumableManagement';
import ConsumableStatistics from './pages/ConsumableStatistics';
import ConsumableLogs from './pages/ConsumableLogs';
import CategoryManagement from './pages/CategoryManagement';

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
          width={220} 
          collapsedWidth={80}
          collapsed={collapsed}
          style={{
            backgroundColor: colorBgContainer,
            boxShadow: '2px 0 8px rgba(0,0,0,0.08)'
          }}
        >
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
                transition: 'all 0.3s'
              }}
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{
              height: 'calc(100% - 80px)', 
              borderRight: 0,
              backgroundColor: 'transparent'
            }}
            items={[
              {
                key: 'dashboard',
                icon: <BarChartOutlined />,
                label: <Link to="/">仪表盘</Link>,
              },
              {
                key: 'room-management',
                icon: <HomeOutlined />,
                label: '机房管理',
                children: [
                  {
                    key: 'rooms',
                    icon: <HomeOutlined />,
                    label: <Link to="/rooms">机房管理</Link>,
                  },
                  {
                    key: 'racks',
                    icon: <DatabaseOutlined />,
                    label: <Link to="/racks">机柜管理</Link>,
                  },
                  {
                    key: 'visualization',
                    icon: <EyeOutlined />,
                    label: <Link to="/visualization">机柜可视化</Link>,
                  },
                ],
              },
              {
                key: 'asset-management',
                icon: <BuildOutlined />,
                label: '资产管理',
                children: [
                  {
                    key: 'devices',
                    icon: <CloudServerOutlined />,
                    label: <Link to="/devices">设备管理</Link>,
                  },
                  {
                    key: 'fields',
                    icon: <DatabaseOutlined />,
                    label: <Link to="/fields">字段管理</Link>,
                  },
                ],
              },
              {
                key: 'consumables-management',
                icon: <ShoppingCartOutlined />,
                label: '耗材管理',
                children: [
                  {
                    key: 'consumables-stats',
                    icon: <BarChartOutlined />,
                    label: <Link to="/consumables-stats">耗材统计</Link>,
                  },
                  {
                    key: 'consumables',
                    icon: <DatabaseOutlined />,
                    label: <Link to="/consumables">耗材列表</Link>,
                  },
                  {
                    key: 'consumables-categories',
                    icon: <ImportOutlined />,
                    label: <Link to="/consumables-categories">分类管理</Link>,
                  },
                  {
                    key: 'consumables-logs',
                    icon: <FileTextOutlined />,
                    label: <Link to="/consumables-logs">操作日志</Link>,
                  },
                ],
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
              <Route path="/consumables" element={<ConsumableManagement />} />
              <Route path="/consumables-categories" element={<CategoryManagement />} />
              <Route path="/consumables-stats" element={<ConsumableStatistics />} />
              <Route path="/consumables-logs" element={<ConsumableLogs />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;