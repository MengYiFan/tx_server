const development_env = require('./development'),
      test_env = require('./test')

module.exports = {
    development: development_env,
    test: test_env
}[process.env.NODE_ENV || 'development']