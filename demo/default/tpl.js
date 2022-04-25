const fs = require('fs');
const {
  join,
} = require('path');

module.exports = function getHtml({hostname, https}) {
  const tplData = {
    protocol: https ? 'https':'http',
    hostname,
  };

  const tpl = fs.readFileSync(join(__dirname, './index.html'), 'utf8');
  const html = tpl.replace(/\$\{(.+?)\}/ig, (word, $) => {
    return tplData[$];
  });

  return html;
}
