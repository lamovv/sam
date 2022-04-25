const {
  cosmiconfigSync
} = require('cosmiconfig');

// 获取rc配置信息
function getrc(){
  const explorerSync = cosmiconfigSync('sam');
  const searchedFor = explorerSync.search();
  return searchedFor?.config || {};
}

module.exports = getrc;