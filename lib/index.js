const childProcess = require('child_process');
const { main, getHosts, getCertPath, getDomainCert, clearCerts } = require('./main');
const { starting, failed, stop, guide } = require('./utils/guide');
const genPort = require('./utils/genPort');
const getrc = require('./utils/getrc');
const checkServer = require('./utils/checkServer');
const log = require('./logger');
const dServer = require('./default');

const logger = log.getLogger('index');
const execArgv = process.execArgv;
const { https, path, silent = true, webRoot = process.cwd() } = getrc();

const hosts = getHosts();

function detect(fn, interval = 1050) {
  const iid = setInterval(() => {
    const over = fn();
    if (over) {
      clearInterval(iid);
    }
  }, interval);
}

async function entry(cli, cliPath, argv) {
  starting();

  const isDefault = cli == 'default';
  try {
    logger.trace('获取域名证书');
    const error = console.error;
    console.error = () => {};
    var cert = await getDomainCert(isDefault);
    console.error = error;
  } catch (e) {
    stop();
    return Promise.reject(false);
  }

  if (!isDefault) {
    try {
      logger.trace(`解析命令 ${cli} 绝对路径：`);
      cliPath = require.resolve(cliPath, {
        paths: [process.cwd()],
      });
      logger.trace(`解析命令 ${cli} 绝对路径成功：`, cliPath);
    } catch (e) {
      logger.error(`解析命令 ${cli} 绝对路径异常，请检查工具包是否已正确安装：`, e);
      return Promise.reject(false);
    }
  }

  logger.trace('检测可用端口号：');
  const port = await genPort();
  logger.trace(`获取可用端口号：${port}\n`);

  if (isDefault) {
    dServer({ https, cert, port, webRoot });
  } else {
    try {
      argv = argv.concat(['--port', port]);

      var subprocess = childProcess.fork(cliPath, argv, {
        env: {
          ...process.env,
          PORT: port,
        },
        execArgv,
        silent,
      });
      subprocess.unref();
    } catch (e) {
      logger.error('\n启动 dev 服务异常：', e);
      failed();
      process.exit(1);
    }

    subprocess.on('error', err => {
      logger.trace('dev 服务异常：\n', err);
      failed();
      process.exit(1);
    });

    subprocess.on('exit', e => {
      logger.trace('dev 服务退出：\n', e);
      stop();
      process.exit(0);
    });

    subprocess.on('message', e => {
      if (e?.type == 'DONE') {
        runProxy(hosts, port);
      }
    });

    process.on('exit', () => {
      subprocess?.kill(0);
      stop();
    });
  }

  // hack subprocess status
  if (!~['umi', 'dumi'].indexOf(cli)) {
    const uri = `http${https ? 's' : ''}://localhost:${port}${path ? `/${path}` : ''}`;

    detect(() => {
      const _isAlive = checkServer(uri, isDefault);

      if (_isAlive) {
        runProxy(hosts, port);
      }
      return _isAlive;
    });
  }
}

function runProxy(hosts, port) {
  if (runProxy.__runing) {
    return;
  }
  runProxy.__runing = true;

  hosts.map(hostname => {
    main({
      hostname,
      port,
    });
  });

  setTimeout(() => {
    guide({
      webPort: port,
    });
  }, 50);
}
exports = module.exports = entry;
exports.main = main;
exports.getCertPath = getCertPath;
exports.clearCerts = clearCerts;
