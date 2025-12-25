const bcrypt = require('bcryptjs');
const { sequelize } = require('./db');
const User = require('./models/User');
const Role = require('./models/Role');
const UserRole = require('./models/UserRole');

async function fixAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功！\n');

    const adminUser = await User.findOne({
      where: { username: 'admin' }
    });

    if (!adminUser) {
      console.log('未找到 admin 用户');
      return;
    }

    console.log('当前 admin 用户信息：');
    console.log('用户名:', adminUser.username);
    console.log('邮箱:', adminUser.email);
    console.log('状态:', adminUser.status);
    console.log('');

    const userRoles = await UserRole.findAll({
      where: { UserId: adminUser.userId },
      include: [{ model: Role }]
    });

    console.log('当前用户角色：');
    if (userRoles.length === 0) {
      console.log('  - 无角色分配');
    } else {
      userRoles.forEach(ur => {
        console.log(`  - ${ur.Role.roleName} (${ur.Role.roleCode})`);
      });
    }
    console.log('');

    let adminRole = await Role.findOne({
      where: { roleCode: 'admin' }
    });

    if (!adminRole) {
      console.log('正在创建管理员角色...');
      adminRole = await Role.create({
        roleId: 'role_admin',
        roleName: '管理员',
        roleCode: 'admin',
        description: '系统管理员，拥有所有权限',
        status: 'active',
        permissions: []
      });
      console.log('管理员角色创建成功！');
    } else {
      console.log('管理员角色已存在');
    }

    const existingUserRole = await UserRole.findOne({
      where: {
        UserId: adminUser.userId,
        RoleId: adminRole.roleId
      }
    });

    if (!existingUserRole) {
      console.log('正在为 admin 用户分配管理员角色...');
      await UserRole.create({
        UserId: adminUser.userId,
        RoleId: adminRole.roleId
      });
      console.log('角色分配成功！');
    } else {
      console.log('管理员角色已分配给该用户');
    }
    console.log('');

    const newPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await adminUser.update({
      password: hashedPassword
    });

    console.log('密码已重置为: admin123');
    console.log('');

    const updatedUser = await User.findOne({
      where: { username: 'admin' },
      include: [{ model: Role }]
    });

    console.log('修复后的 admin 用户信息：');
    console.log('用户名:', updatedUser.username);
    console.log('邮箱:', updatedUser.email);
    console.log('状态:', updatedUser.status);
    console.log('角色:',
      updatedUser.Roles && updatedUser.Roles.length > 0
        ? updatedUser.Roles.map(r => r.roleName).join(', ')
        : '无角色'
    );
    console.log('');

    const testResult = bcrypt.compareSync(newPassword, updatedUser.password);
    console.log('密码验证测试:');
    console.log(`  输入密码: "${newPassword}"`);
    console.log(`  验证结果: ${testResult ? '✓ 成功' : '✗ 失败'}`);

    console.log('\n========================================');
    console.log('修复完成！现在可以使用以下信息登录：');
    console.log('  用户名: admin');
    console.log('  密码: admin123');
    console.log('========================================');

  } catch (error) {
    console.error('修复过程中发生错误:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAdminUser();
