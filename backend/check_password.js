const { sequelize } = require('./db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功！\n');

    const users = await User.findAll({
      attributes: ['userId', 'username', 'password', 'email', 'status', 'createdAt']
    });

    console.log('用户列表：');
    console.log('============');

    for (const user of users) {
      console.log('用户名:', user.username);
      console.log('密码(加密后):', user.password);
      console.log('状态:', user.status);
      console.log('创建时间:', user.createdAt);
      console.log('------------');
    }

    console.log('\n' + users.length + ' 个用户');

    await sequelize.close();
  } catch (error) {
    console.error('错误:', error.message);
  }
}

main();
