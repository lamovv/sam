const log = require('log4js');
const getrc = require('./utils/getrc');

const {
  logLevel = 'DEBUG'
} = getrc();

log.configure({
  replaceConsole: true,
  appenders: {
    stdout: {
      // 控制台打印
      type: 'console',
      layout: {
        type: 'colored',
        // type: 'messagePassThrough',
      },
    },
    guide: {
      // 控制台打印
      type: 'console',
      layout: {
        type: 'messagePassThrough',
      },
    }
  },
  categories: {
    default: {
      appenders: ['stdout'],
      level: logLevel,
    },
    guide: {
      appenders: ['guide'],
      level: logLevel,
    },
  }
});

module.exports = log;