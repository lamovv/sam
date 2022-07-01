const net = require('net');
const detect = require('detect-port');
const getrc = require('./getrc');

const{
  port: webPort
} = getrc();

// 获取可用port,自动检测系统port占用
async function genPort(port){
  if(webPort){
    return webPort;
  }

  if(port){
    genPort.__port = port;
  }else if(!genPort.__port){
    genPort.__port = 8000;
  }

  const _port = await detect(genPort.__port);

  if(_port == genPort.__port){
    return genPort.__port++;
  }else{
    ++genPort.__port;
    return genPort();
  }
}
module.exports = genPort;
