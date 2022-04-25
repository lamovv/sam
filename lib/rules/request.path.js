const {
  parse
} = require('@js-util-fn/url');
const log = require('../logger');

const logger = log.getLogger('rules.request.path');

function getReqPathRule({
  hostname,
  port,
  path,
  hosts = [],
  protocol
}){
  if(!getReqPathRule.__ports){
    getReqPathRule.__ports = {
      [hostname]: port
    };
  }
  return {
    summary: 'Doc',
    // 只有返回true时，AnyProxy才会尝试替换证书、解析https。否则只做数据流转发，无法看到明文数据。
    *beforeDealHttpsRequest(requestDetail) {
      const urlObj = parse(requestDetail.host);

      if(~['http', 'ws'].indexOf(protocol) || !~hosts.indexOf(urlObj.hostname)){
        return yield Promise.resolve(false);
      }

      return yield Promise.resolve(true);
    },
    *beforeSendRequest(requestDetail) {
      const {
        url,
        protocol,
        requestOptions: _requestOptions
      } = requestDetail;

      const urlObj = parse(url);

      if (~hosts.indexOf(urlObj.hostname)) {
        const port = getReqPathRule.__ports[urlObj.hostname];

        // 将代理域名下资源转向本地
        const _headers = _requestOptions.headers;
        const requestOptions = {
          ..._requestOptions,
          hostname: 'localhost',
          port,
          headers: {
            ..._headers,
            // 当用户已访问过htst功能的网站 (支持hsts功能的站点会在响应头中插入：Strict-Transport-Security) 之后，浏览器(支持hsts)会自动将这个域名加入到HSTS列表，下次即使用户使用http访问这个网站，浏览器仍会自动发送https请求(未清空缓存)
            'Strict-Transport-Security': 'max-age=0',
          }
        }

        // logger.trace('headers：', newRequestOptions.headers);
        logger.trace(`"${requestDetail.url}" 被代理到 ${protocol || 'wws'}://localhost:${port}/${_requestOptions.path?.replace(/^\//, '')}`);

        return yield Promise.resolve({
          protocol,
          requestOptions,
        });
      }

      return yield Promise.resolve(null);
    },
    onError(requestDetail, error){
      const urlObj = parse(requestDetail.url);

      // 被代理域名异常
      if(~hosts.indexOf(urlObj.hostname)){
        logger.error(`请求 ${requestDetail.url} 对应的资源未找到，检查路径是否正确：`, error);
        // TODO ~ 定制
        // return {
        //   response: {
        //     statusCode: 200,
        //     header: { 'content-type': 'text/html' },
        //     body: `请求 ${requestDetail.url} 对应的资源未找到，检查路径是否正确：`
        //   }
        // }
      }

      return null;
    },
    onConnectError(requestDetail, error){
      const urlObj = parse(requestDetail.host);

      // 被代理域名异常
      if(~hosts.indexOf(urlObj.hostname)){
        logger.error(`与目标HTTPS服务器建立连接发生错误(${requestDetail.host})：`, error);
      }
    }
  }
}

function updateRule({hostname, port}){
  if(getReqPathRule.__ports){
    const ports = getReqPathRule.__ports;
    getReqPathRule.__ports = {
      ...ports,
      [hostname]: port
    };
  }
}

module.exports = {
  updateRule,
  getReqPathRule
}
