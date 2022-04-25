const { join } = require('path');
const shell = require('shelljs');
const crtMgr = require('anyproxy').utils.certMgr;
const log = require('./logger');
const { HOSTNAME, ROOT_CA_DIR, COMMON_NAME } = require('./constant');

const rootDirPath = ROOT_CA_DIR;

const logger = log.getLogger('getCert');

const options = {
  rootDirPath,
  defaultCertAttrs: [
    { name: 'countryName', value: 'CN' },
    { name: 'organizationName', value: 'ufly' },
    { shortName: 'ST', value: 'BJ' },
    { shortName: 'OU', value: 'DEV' },
  ],
};

const rootOptions = {
  commonName: COMMON_NAME,
};

function getDomainCertPath() {
  return {
    key: join(ROOT_CA_DIR, `${HOSTNAME}.key`),
    cert: join(ROOT_CA_DIR, `${HOSTNAME}.crt`),
  };
}

// 获取域名证书
async function getDomainCert(isBuffer) {
  // 检查根证书状态
  const isTrusted = await checkRootCA();

  // 根证书已信任，重新获取域名证书
  if (isTrusted) {
    logger.trace('检查根证书已添加系统信任，获取域名证书');
    return await getCert(HOSTNAME, isBuffer);
  } else {
    // 已在guideTrustCA处理异常
  }
}

async function getCert(hostname, isBuffer) {
  return new Promise((resolve, reject) => {
    crtMgr.getCertificate(hostname, async (error, keyContent, crtContent) => {
      if (!error) {
        const cert = {
          key: isBuffer ? keyContent : keyContent.toString(),
          cert: isBuffer ? crtContent : crtContent.toString(),
        };
        logger.trace('成功获取域名证书：', cert);
        resolve(cert);
      } else {
        logger.error('获取域名证书异常：', error);
        reject(false);
      }
    });
  });
}

// 检查根证书是否安装并添加系统信任
async function checkRootCA() {
  logger.trace('检查根证书是否存在');
  const result = crtMgr.getCAStatus();
  if (result.exist) {
    logger.trace('本地根证书已存在，检查是否添加系统信任');
    if (!result.trusted) {
      const caTrusted = await hasRootCATrusted();
      return caTrusted;
    }
  }

  logger.trace('本地根证书不存在，自动安装并信任根证书');
  return new Promise((resolve, reject) => {
    crtMgr.generateRootCA(async (error, keyPath, crtPath) => {
      let caTrusted;
      // 若根证书已经存在 or 无异常，检查是否信任
      if (error === 'ROOT_CA_EXISTED' || !error) {
        logger.trace('根证书已安装，检查是否信任\n');
        caTrusted = await hasRootCATrusted();
        if (caTrusted) {
          resolve(true);
        } else {
          reject(false);
        }
        logger.trace(`根证书${caTrusted ? '添加' : '未'}信任`);

        // 其他异常
      } else {
        logger.error(error);
        reject(false);
      }
    });
  });
}
async function hasRootCATrusted() {
  return new Promise((resolve, reject) => {
    crtMgr.ifRootCATrusted((error, ifTrusted) => {
      if (error) {
        logger.error(`检查“根证书是否信任“异常：${error.message || ''}`);
        reject(false);

        // 引导信任根证书，需输入本机密码
      } else if (!ifTrusted) {
        const caTrusted = guideTrustCA();
        if (caTrusted) {
          resolve(true);
        } else {
          reject(false);
        }
      } else {
        resolve(true);
      }
    });
  });
}

function guideTrustCA() {
  // 证书需要被安装并信任，可以在此打开该目录并给出提示，也可以进行其他操作
  const isWin = /^win/.test(process.platform);
  const rootCAFilePath = crtMgr.getRootCAFilePath();
  if (isWin) {
    logger.warn('你需要手动安装信任本地根证书(root CA)');
    shell.exec(`certutil -addstore -f "ROOT" ${rootCAFilePath}`);
  } else {
    logger.info('要信任本地根证书(root CA)，需要输入本机密码：');
    const ret = shell.exec(`sudo security add-trusted-cert -d -k /Library/Keychains/System.keychain ${rootCAFilePath}`);
    if (ret.code != 0) {
      logger.warn('你需要手动安装信任本地根证书(root CA)');
      shell.exec(`open ${crtMgr.getRootDirPath()}`);
      process.exit(0);
    } else {
      logger.info('根证书添加成功');
      return true;
    }
  }
}

function clearCerts() {
  crtMgr.clearCerts();
  logger.info('要移除本地信任证书，需要输入本机密码：');
  const ret = shell.exec(`sudo security delete-identity -tc ${rootOptions.commonName}`);
  if (ret.code != 0) {
    logger.warn(`你需要手动移除本地信任证书 ${rootOptions.commonName}`);
    // shell.exec(`open /Library/Keychains/System.keychain`);
    return false;
  } else {
    logger.info('根证书已移除');
    return true;
  }
}

module.exports = {
  getDomainCertPath,
  getDomainCert,
  clearCerts,
};
