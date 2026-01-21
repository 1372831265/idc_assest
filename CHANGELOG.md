# CHANGELOG

所有版本变更记录按时间倒序排列。

## [1.0.0] - 2026-01-21

### 新增功能

#### 机房管理模块
- 机房列表查询与展示
- 机房创建、编辑、删除功能
- 机房位置、面积等详细信息管理

#### 机柜管理模块
- 机柜增删改查操作
- 按机房分类管理机柜
- 机柜容量统计与状态展示
- 3D机柜可视化展示

#### 设备管理模块
- 设备全生命周期管理
- 设备批量导入/导出功能
- 自定义设备字段配置
- 设备状态跟踪与筛选

#### 工单管理模块
- 工单创建与处理流程
- 工单分类管理
- 工单自定义字段
- 工单操作记录审计

#### 耗材管理模块
- 耗材分类管理
- 耗材库存管理
- 耗材领用记录
- 耗材使用统计报表

#### 用户权限模块
- 用户管理
- 角色管理
- 权限控制
- 认证授权

#### 系统配置模块
- 系统设置管理
- 背景配置管理
- 设备字段初始化
- 工单字段初始化

### 技术架构

#### 前端技术栈
- React 18.2.0
- Vite 4.4.9
- Ant Design 5.8.6
- Three.js 0.160.0
- React Router 6.15.0
- Axios 1.5.0

#### 后端技术栈
- Node.js ≥14.0.0
- Express 4.18.2
- Sequelize 6.32.1
- SQLite/MySQL 支持
- CORS 跨域配置

### 数据库模型

- Room（机房）
- Rack（机柜）
- Device（设备）
- DeviceField（设备字段）
- Ticket（工单）
- TicketField（工单字段）
- TicketCategory（工单分类）
- TicketOperationRecord（工单操作记录）
- Consumable（耗材）
- ConsumableCategory（耗材分类）
- ConsumableRecord（耗材领用记录）
- ConsumableLog（耗材日志）
- User（用户）
- Role（角色）
- Permission（权限）
- UserRole（用户角色关联）
- SystemSetting（系统设置）

### API接口

#### 基础接口
- 健康检查：`GET /health`

#### 认证接口
- 用户登录：`POST /api/auth/login`
- 用户注册：`POST /api/auth/register`

#### 机房接口
- 获取机房列表：`GET /api/rooms`
- 创建机房：`POST /api/rooms`
- 更新机房：`PUT /api/rooms/:roomId`
- 删除机房：`DELETE /api/rooms/:roomId`

#### 机柜接口
- 获取机柜列表：`GET /api/racks`
- 创建机柜：`POST /api/racks`
- 更新机柜：`PUT /api/racks/:rackId`
- 删除机柜：`DELETE /api/racks/:rackId`
- 获取机柜详情：`GET /api/racks/:rackId`

#### 设备接口
- 获取设备列表：`GET /api/devices`
- 创建设备：`POST /api/devices`
- 更新设备：`PUT /api/devices/:deviceId`
- 删除设备：`DELETE /api/devices/:deviceId`
- 批量导入设备：`POST /api/devices/batch-import`

#### 设备字段接口
- 获取设备字段：`GET /api/deviceFields`
- 创建设备字段：`POST /api/deviceFields`
- 更新设备字段：`PUT /api/deviceFields/:id`
- 删除设备字段：`DELETE /api/deviceFields/:id`

#### 工单接口
- 获取工单列表：`GET /api/tickets`
- 创建工单：`POST /api/tickets`
- 更新工单：`PUT /api/tickets/:ticketId`
- 删除工单：`DELETE /api/tickets/:ticketId`

#### 耗材接口
- 获取耗材列表：`GET /api/consumables`
- 创建耗材：`POST /api/consumables`
- 更新耗材：`PUT /api/consumables/:consumableId`
- 删除耗材：`DELETE /api/consumables/:consumableId`

#### 用户接口
- 获取用户列表：`GET /api/users`
- 创建用户：`POST /api/users`
- 更新用户：`PUT /api/users/:userId`
- 删除用户：`DELETE /api/users/:userId`

#### 角色接口
- 获取角色列表：`GET /api/roles`
- 创建角色：`POST /api/roles`
- 更新角色：`PUT /api/roles/:roleId`
- 删除角色：`DELETE /api/roles/:roleId`

---

## 格式说明

本CHANGELOG遵循 [Keep a Changelog](https://keepachangelog.com/) 规范：

- **新增**：新功能添加
- **优化**：功能改进和性能优化
- **修复**：bug修复
- **废弃**：即将移除的功能
- ** Breaking Change**：破坏性变更

## 版本号规范

使用语义化版本号（Semantic Versioning）：

- **主版本号 (MAJOR)**：不兼容的API变更
- **次版本号 (MINOR)**：向后兼容的新功能
- **修订号 (PATCH)**：向后兼容的bug修复
