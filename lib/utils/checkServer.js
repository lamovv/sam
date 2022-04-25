const child_process = require('child_process');
const shell = require('shelljs');
const log = require('../logger');

const logger = log.getLogger('check.server');

const check = (url, isDefault) => {
  if (!url) {
    return false;
  }

  const curl = `curl -I -m 1 -k -s -w %{http_code} ${url}`;

  try{
    if(isDefault){
      shell.exec(curl, { async: false });
    }else{
      child_process.execSync(curl);
    }
    logger.trace('\n检测Web Server是否可用：', true, '\n');
    return true;
  }catch(e){
    logger.trace('\n检测Web Server是否可用：', false, '\n');
    return false;
  }
}

module.exports = check;
