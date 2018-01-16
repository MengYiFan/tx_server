module.exports = {
  env: 'test',
  port: 3001,
  mysql: {
    host: 'localhost',
    port: '3306',
    user: 'mish',
    password: '11',
    database: 'tx',
    charset: 'utf8_general_ci'
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
    password: 'REDIS'
  }
}