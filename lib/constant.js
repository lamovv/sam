const {
  join,
} = require('path');
const { USER_HOME } = require('./env');

exports.ROOT_CA_DIR = join(USER_HOME, '.anyproxy/certificates');
exports.HOSTNAME = 'localhost';
exports.COMMON_NAME = 'AnyProxy';
exports.USER_DATA_PATH = join(USER_HOME, '.ufly/.chrome/');
exports.CLI_PATH_MAP = {
  umi: 'umi/bin/umi',
  
}
