const { sequelize } = require('./db');
const Role = require('./models/Role');
const User = require('./models/User');
const UserRole = require('./models/UserRole');

async function fixForeignKeys() {
  try {
    console.log('开始修复外键约束...');
    
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    await sequelize.query('DROP TABLE IF EXISTS user_roles');
    await sequelize.query('DROP TABLE IF EXISTS users');
    await sequelize.query('DROP TABLE IF EXISTS roles');
    
    console.log('已删除现有表，正在重新创建...');
    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS roles (
        roleId TEXT PRIMARY KEY,
        roleName TEXT NOT NULL,
        roleCode TEXT NOT NULL UNIQUE,
        description TEXT,
        permissions TEXT DEFAULT '[]',
        sort INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        createdAt DATETIME,
        updatedAt DATETIME
      )
    `);
    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        realName TEXT,
        avatar TEXT,
        status TEXT DEFAULT 'active',
        lastLoginTime DATETIME,
        lastLoginIp TEXT,
        loginCount INTEGER DEFAULT 0,
        remark TEXT,
        createdAt DATETIME,
        updatedAt DATETIME
      )
    `);
    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId TEXT NOT NULL,
        RoleId TEXT NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME,
        FOREIGN KEY (UserId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (RoleId) REFERENCES roles(roleId) ON DELETE CASCADE,
        UNIQUE(UserId, RoleId)
      )
    `);
    
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    console.log('外键约束修复完成！');
    console.log('正在重新初始化角色数据...');
    
    const bcrypt = require('bcryptjs');
    const SALT_ROUNDS = 10;
    
    await Role.bulkCreate([
      {
        roleId: 'role_admin',
        roleName: '管理员',
        roleCode: 'admin',
        description: '系统管理员，拥有所有权限',
        permissions: '[]',
        sort: 1,
        status: 'active'
      },
      {
        roleId: 'role_operator',
        roleName: '操作员',
        roleCode: 'operator',
        description: '设备操作员，可进行设备操作',
        permissions: '[]',
        sort: 2,
        status: 'active'
      },
      {
        roleId: 'role_viewer',
        roleName: '访客',
        roleCode: 'viewer',
        description: '只读权限，只能查看数据',
        permissions: '[]',
        sort: 3,
        status: 'active'
      }
    ]);
    
    console.log('角色数据初始化完成！');
    
    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    
    const adminUser = await User.create({
      userId: 'user_admin',
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      realName: '系统管理员',
      status: 'active'
    });
    
    await UserRole.create({
      UserId: adminUser.userId,
      RoleId: 'role_admin'
    });
    
    console.log('管理员账户创建完成！');
    console.log('用户名: admin');
    console.log('密码: admin123');
    
    console.log('\n修复完成！请重启后端服务。');
    
  } catch (error) {
    console.error('修复外键约束失败:', error);
  } finally {
    await sequelize.close();
  }
}

fixForeignKeys();
