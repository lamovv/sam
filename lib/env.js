const {
  homedir,
} = require('os');
const ip = require('ip');

const IP = ip.address();
const USER_HOME = homedir();

module.exports = {
  IP,
  USER_HOME
};