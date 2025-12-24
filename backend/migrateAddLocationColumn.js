const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'idc_management.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('无法打开数据库:', err);
    process.exit(1);
  }
});

console.log('开始修复数据库表结构...');

db.serialize(() => {
  db.run(`ALTER TABLE consumables ADD COLUMN location TEXT;`, function(err) {
    if (err) {
      if (err.message.includes('duplicate column name: location')) {
        console.log('location 列已存在，无需添加');
      } else {
        console.error('添加 location 列失败:', err.message);
      }
    } else {
      console.log('成功添加 location 列到 consumables 表');
    }

    db.close((closeErr) => {
      if (closeErr) {
        console.error('关闭数据库失败:', closeErr);
      } else {
        console.log('数据库修复完成');
      }
    });
  });
});
