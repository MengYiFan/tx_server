const path = require('path'),
      baseLogPath = path.resolve(__dirname, '../logs'),
      errorPath = '/error',
      errorFileName = 'error',
      errorLogPath = path.resolve(__dirname, '../logs/error/error'),
      responsePath = '/response',
      responseFileName = 'response',
      responseLogPath = path.resolve(__dirname, '../logs/response/response')

module.exports = {
  'appenders': [{
    'category': 'errorLogger',
    'type': 'dateFile',
    'filename': errorLogPath,
    'alwaysIncludePattern': true,
    'pattern': '-yyyy-MM-dd.log',
    'path': errorPath
  }, {
    'category': 'resLogger',
    'type': 'dateFile',
    'filename': responseLogPath,
    'alwaysIncludePattern': true,
    'pattern': '-yyyy-MM-dd.log',
    'path': responsePath
  }],
  'levels':{
    'errorLogger': 'ERROR',
    'resLogger': 'ALL'
  },
  'baseLogPath': baseLogPath
}