# API接口文档

本文档描述IDC设备管理系统的后端API接口，遵循OpenAPI 3.0规范。

## 基础信息

| 项目 | 值 |
|------|-----|
| Base URL | `http://localhost:8000/api` |
| Content-Type | `application/json` |
| 认证方式 | Bearer Token (JWT) |

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细描述"
}
```

## 认证接口

### 用户登录

```http
POST /api/auth/login
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**：

```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "user001",
      "username": "admin",
      "role": "admin"
    }
  },
  "message": "登录成功"
}
```

### 用户注册

```http
POST /api/auth/register
```

## 机房管理接口

### 获取机房列表

```http
GET /api/rooms
```

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "roomId": "room001",
      "name": "A区机房",
      "location": "一楼东侧",
      "area": 500,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "操作成功"
}
```

### 创建机房

```http
POST /api/rooms
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| roomId | string | 是 | 机房ID |
| name | string | 是 | 机房名称 |
| location | string | 否 | 机房位置 |
| area | number | 否 | 面积(平方米) |

**请求示例**：

```json
{
  "roomId": "room002",
  "name": "B区机房",
  "location": "二楼西侧",
  "area": 600
}
```

### 更新机房

```http
PUT /api/rooms/:roomId
```

### 删除机房

```http
DELETE /api/rooms/:roomId
```

## 机柜管理接口

### 获取机柜列表

```http
GET /api/racks
```

**查询参数**：

| 参数名 | 类型 | 描述 |
|--------|------|------|
| roomId | string | 按机房ID筛选 |

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "rackId": "rack001",
      "name": "机柜A1",
      "height": 42,
      "powerRating": 5000,
      "RoomId": "room001",
      "Room": {
        "roomId": "room001",
        "name": "A区机房"
      },
      "Devices": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "操作成功"
}
```

### 创建机柜

```http
POST /api/racks
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| rackId | string | 是 | 机柜ID |
| name | string | 是 | 机柜名称 |
| height | number | 否 | 高度(U) |
| powerRating | number | 否 | 额定功率(W) |
| RoomId | string | 是 | 所属机房ID |

**请求示例**：

```json
{
  "rackId": "rack002",
  "name": "机柜A2",
  "height": 42,
  "powerRating": 5000,
  "RoomId": "room001"
}
```

### 更新机柜

```http
PUT /api/racks/:rackId
```

### 删除机柜

```http
DELETE /api/racks/:rackId
```

### 获取机柜详情

```http
GET /api/racks/:rackId
```

## 设备管理接口

### 获取设备列表

```http
GET /api/devices
```

**查询参数**：

| 参数名 | 类型 | 描述 |
|--------|------|------|
| rackId | string | 按机柜ID筛选 |
| deviceType | string | 按设备类型筛选 |
| page | number | 页码，默认1 |
| pageSize | number | 每页数量，默认10 |

**响应示例**：

```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "deviceId": "dev001",
        "name": "Web服务器01",
        "deviceType": "服务器",
        "manufacturer": "Dell",
        "model": "R740",
        "rackPosition": 1,
        "height": 2,
        "ipAddress": "192.168.1.100",
        "macAddress": "00:1B:44:11:3A:B7",
        "status": "运行中",
        "purchaseDate": "2023-01-01",
        "warrantyDate": "2026-01-01",
        "description": "主要Web应用服务器",
        "RackId": "rack001",
        "Rack": {
          "rackId": "rack001",
          "name": "机柜A1"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  },
  "message": "操作成功"
}
```

### 创建设备

```http
POST /api/devices
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| deviceId | string | 是 | 设备ID |
| name | string | 是 | 设备名称 |
| deviceType | string | 是 | 设备类型 |
| manufacturer | string | 否 | 厂商 |
| model | string | 否 | 型号 |
| RackId | string | 否 | 所属机柜ID |
| rackPosition | number | 否 | 机柜位置 |
| height | number | 否 | 占用高度(U) |
| ipAddress | string | 否 | IP地址 |
| macAddress | string | 否 | MAC地址 |
| status | string | 否 | 状态 |
| purchaseDate | string | 否 | 购买日期 |
| warrantyDate | string | 否 | 保修日期 |
| description | string | 否 | 描述 |

**请求示例**：

```json
{
  "deviceId": "dev002",
  "name": "数据库服务器",
  "deviceType": "服务器",
  "manufacturer": "HP",
  "model": "DL380",
  "RackId": "rack001",
  "rackPosition": 3,
  "height": 2,
  "ipAddress": "192.168.1.101",
  "status": "运行中"
}
```

### 更新设备

```http
PUT /api/devices/:deviceId
```

### 删除设备

```http
DELETE /api/devices/:deviceId
```

### 批量导入设备

```http
POST /api/devices/batch-import
```

**Content-Type**: `multipart/form-data`

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| file | File | 是 | CSV格式的设备数据文件 |

## 设备字段管理接口

### 获取设备字段列表

```http
GET /api/deviceFields
```

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fieldName": "cpuModel",
      "displayName": "CPU型号",
      "fieldType": "text",
      "isRequired": false,
      "defaultValue": "",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "操作成功"
}
```

### 创建设备字段

```http
POST /api/deviceFields
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| fieldName | string | 是 | 字段名(英文) |
| displayName | string | 是 | 显示名称(中文) |
| fieldType | string | 是 | 字段类型(text/number/date/select) |
| isRequired | boolean | 否 | 是否必填 |
| defaultValue | string | 否 | 默认值 |
| options | string | 否 | 选项(逗号分隔，select类型使用) |

**请求示例**：

```json
{
  "fieldName": "cpuModel",
  "displayName": "CPU型号",
  "fieldType": "text",
  "isRequired": false,
  "defaultValue": ""
}
```

### 更新设备字段

```http
PUT /api/deviceFields/:id
```

### 删除设备字段

```http
DELETE /api/deviceFields/:id
```

## 工单管理接口

### 获取工单列表

```http
GET /api/tickets
```

**查询参数**：

| 参数名 | 类型 | 描述 |
|--------|------|------|
| status | string | 按状态筛选 |
| priority | string | 按优先级筛选 |
| page | number | 页码 |
| pageSize | number | 每页数量 |

**响应示例**：

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "ticketId": "ticket001",
        "title": "服务器故障",
        "description": "Web服务器无法访问",
        "status": "处理中",
        "priority": "高",
        "categoryId": "cat001",
        "assigneeId": "user001",
        "requesterId": "user002",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  },
  "message": "操作成功"
}
```

### 创建工单

```http
POST /api/tickets
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| title | string | 是 | 工单标题 |
| description | string | 是 | 工单描述 |
| categoryId | string | 是 | 工单分类ID |
| priority | string | 是 | 优先级(高/中/低) |
| assigneeId | string | 否 | 指派用户ID |

### 更新工单

```http
PUT /api/tickets/:ticketId
```

### 删除工单

```http
DELETE /api/tickets/:ticketId
```

## 工单分类管理接口

### 获取工单分类列表

```http
GET /api/ticketCategories
```

### 创建工单分类

```http
POST /api/ticketCategories
```

### 更新工单分类

```http
PUT /api/ticketCategories/:categoryId
```

### 删除工单分类

```http
DELETE /api/ticketCategories/:categoryId
```

## 工单字段管理接口

### 获取工单字段列表

```http
GET /api/ticketFields
```

### 创建设单字段

```http
POST /api/ticketFields
```

### 更新工单字段

```http
PUT /api/ticketFields/:id
```

### 删除工单字段

```http
DELETE /api/ticketFields/:id
```

## 耗材管理接口

### 获取耗材列表

```http
GET /api/consumables
```

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "consumableId": "cons001",
      "name": "硬盘",
      "categoryId": "cat001",
      "specification": "1TB SSD",
      "unit": "个",
      "stock": 100,
      "unitPrice": 500,
      "description": "固态硬盘",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "操作成功"
}
```

### 创建耗材

```http
POST /api/consumables
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| consumableId | string | 是 | 耗材ID |
| name | string | 是 | 耗材名称 |
| categoryId | string | 是 | 分类ID |
| specification | string | 否 | 规格 |
| unit | string | 否 | 单位 |
| stock | number | 否 | 库存数量 |
| unitPrice | number | 否 | 单价 |
| description | string | 否 | 描述 |

### 更新耗材

```http
PUT /api/consumables/:consumableId
```

### 删除耗材

```http
DELETE /api/consumables/:consumableId
```

## 耗材分类管理接口

### 获取耗材分类列表

```http
GET /api/consumableCategories
```

### 创建耗材分类

```http
POST /api/consumableCategories
```

### 更新耗材分类

```http
PUT /api/consumableCategories/:categoryId
```

### 删除耗材分类

```http
DELETE /api/consumableCategories/:categoryId
```

## 耗材领用记录接口

### 获取耗材领用记录

```http
GET /api/consumableRecords
```

### 创建耗材领用记录

```http
POST /api/consumableRecords
```

## 耗材日志接口

### 获取耗材日志

```http
GET /api/consumableLogs
```

## 用户管理接口

### 获取用户列表

```http
GET /api/users
```

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "userId": "user001",
      "username": "admin",
      "email": "admin@example.com",
      "phone": "13800138000",
      "status": "active",
      "Roles": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "操作成功"
}
```

### 创建用户

```http
POST /api/users
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| userId | string | 是 | 用户ID |
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 电话 |

### 更新用户

```http
PUT /api/users/:userId
```

### 删除用户

```http
DELETE /api/users/:userId
```

## 角色管理接口

### 获取角色列表

```http
GET /api/roles
```

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "roleId": "role001",
      "roleName": "管理员",
      "description": "系统管理员",
      "Permissions": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "操作成功"
}
```

### 创建角色

```http
POST /api/roles
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| roleId | string | 是 | 角色ID |
| roleName | string | 是 | 角色名称 |
| description | string | 否 | 描述 |
| permissions | array | 否 | 权限列表 |

### 更新角色

```http
PUT /api/roles/:roleId
```

### 删除角色

```http
DELETE /api/roles/:roleId
```

## 系统设置接口

### 获取系统设置

```http
GET /api/systemSettings
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "system_config",
    "value": {
      "siteName": "IDC设备管理系统",
      "siteLogo": "/logo.png"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "操作成功"
}
```

### 更新系统设置

```http
PUT /api/systemSettings
```

## 背景配置接口

### 获取背景配置

```http
GET /api/background
```

### 更新背景配置

```http
PUT /api/background
```

## 健康检查接口

### 服务状态检查

```http
GET /health
```

**响应示例**：

```json
{
  "status": "ok",
  "message": "IDC设备管理系统后端服务正常运行",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
