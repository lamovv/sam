const net = require('net');
const detect = require('detect-port');

async function checkPort(port){
  const available = await new Promise((resolve, reject) => {
    const server = net.createServer();
    // 端口被占用
    server.once('error', ({code}) => {
      server.close();

      if (~['EADDRINUSE', 'EACCES'].indexOf(code)) {
        reject(false);
      }
    });

    // 端口可用
    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });

  return available;
}

// 获取可用port,TODO~优化系统port占用检测
async function genPort(port){
  if(port){
    genPort.__port = port;
  }else if(!genPort.__port){
    genPort.__port = 8000;
  }

  // const available = await checkPort(genPort.__port);
  const _port = await detect(genPort.__port);

  if(_port == genPort.__port){
    return genPort.__port++;
  }else{
    ++genPort.__port;
    return genPort();
  }
}
module.exports = genPort;
