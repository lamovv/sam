const child_process = require('child_process');
const shell = require('shelljs');
const log = require('../logger');

const logger = log.getLogger('check.server');

const check = (url, isDefault) => {
  if (!url) {
    return false;
  }

  const curl = `curl -I -m 1 -k -s -w %{http_code} ${url}`;

  try {
    if (isDefault) {
      shell.exec(curl, { async: false });
    } else {
      child_process.execSync(curl);
    }

    logger.trace('\nWeb Server ready\n');
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = check;
